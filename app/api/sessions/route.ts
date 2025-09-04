import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { bookingsTable, sessionsTable } from "@/server/db/schema";
import { inArray, between, sql } from "drizzle-orm";

const WORKING_HOURS_START = "10:00";
const WORKING_HOURS_END = "18:00";
const SLOT_DURATION_MINUTES = 60;

function getUtcDayStart(dateStr: string) {
  const parts = dateStr.split("-").map(Number);
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
}


function addUtcDays(originalDate: Date, daysToAdd: number) {
  const copy = new Date(originalDate);
  copy.setUTCDate(copy.getUTCDate() + daysToAdd);
  return copy;
}

function generateTimeSlots(startTimeStr: string, endTimeStr: string, intervalMinutes: number) {
  const [startH, startM] = startTimeStr.split(":").map(Number);
  const [endH, endM] = endTimeStr.split(":").map(Number);
  const startTotalMins = startH * 60 + startM;
  const endTotalMins = endH * 60 + endM;

  const slots: string[] = [];
  let currentMin = startTotalMins;

  while (currentMin + intervalMinutes <= endTotalMins) {
    const h = Math.floor(currentMin / 60).toString().padStart(2, "0");
    const m = (currentMin % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    currentMin += intervalMinutes;
  }

  return slots;
}

async function createSessionsForDay(dayUtc: Date) {
  const existingSessions = await db
    .select({ id: sessionsTable.id })
    .from(sessionsTable)
    .where(between(sessionsTable.date, dayUtc, addUtcDays(dayUtc, 1)));

  if (existingSessions.length > 0) {
    return; 
  }

  const sessionRows = generateTimeSlots(WORKING_HOURS_START, WORKING_HOURS_END, SLOT_DURATION_MINUTES).map((slotTime) => ({
    date: dayUtc,
    startTime: slotTime,
    duration: SLOT_DURATION_MINUTES,
  }));

  if (sessionRows.length > 0) {
    await db
      .insert(sessionsTable)
      .values(sessionRows)
      .onConflictDoNothing({ target: [sessionsTable.date, sessionsTable.startTime] });
  }
}

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const dayStr = urlObj.searchParams.get("date");
   

    if (!dayStr) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const dayStart = getUtcDayStart(dayStr);
    const todayStart = getUtcDayStart(new Date().toISOString().split("T")[0]);

    if (dayStart < todayStart) {
      return NextResponse.json({ error: "Cannot get past dates" }, { status: 400 });
    }

    await createSessionsForDay(dayStart);

    const rawSessions = await db
      .select({
        id: sessionsTable.id,
        startTime: sessionsTable.startTime,
        duration: sessionsTable.duration,
      })
      .from(sessionsTable)
      .where(between(sessionsTable.date, dayStart, addUtcDays(dayStart, 1)))
      .orderBy(sql`${sessionsTable.startTime} asc`);

    const seenTimes = new Set<string>();
    const sessionList = rawSessions.reduce((acc, s) => {
      if (!seenTimes.has(s.startTime)) {
        seenTimes.add(s.startTime);
        acc.push({ id: s.id, time: s.startTime, duration: s.duration });
      }
      return acc;
    }, [] as { id: number; time: string; duration: number }[]);

    if (sessionList.length === 0) {
      return NextResponse.json({ date: dayStr, slots: [] });
    }

    const sessionIds = sessionList.map((s) => s.id);
    const bookedRows = await db
      .select({ sessionId: bookingsTable.sessionId })
      .from(bookingsTable)
      .where(inArray(bookingsTable.sessionId, sessionIds));

    const bookedSet = new Set(bookedRows.map((b) => b.sessionId));

    const availableSlots = sessionList.filter((s) => !bookedSet.has(s.id));

    return NextResponse.json({ date: dayStr, slots: availableSlots });
  } catch (err) {
    console.error("Something went wrong while fetching sessions:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

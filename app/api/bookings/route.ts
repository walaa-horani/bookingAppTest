import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { bookingsTable, sessionsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const sessionId = body?.sessionId;

  if (typeof sessionId !== "number") {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }

  const [session] = await db
    .select({
      id: sessionsTable.id,
      date: sessionsTable.date,
      startTime: sessionsTable.startTime,
    })
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId))
    .limit(1);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  try {
    const [booking] = await db
      .insert(bookingsTable)
      .values({ sessionId, userId })
      .returning({
        id: bookingsTable.id,
        bookedAt: bookingsTable.bookedAt,
      });

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          bookedAt: booking.bookedAt,
          session: {
            id: session.id,
            date: session.date,
            startTime: session.startTime,
          },
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    
    if (err?.code === "23505") {
      return NextResponse.json(
        { error: "Someone else just booked this slot. Try another one." },
        { status: 409 }
      );
    }

    console.error("Booking failed:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

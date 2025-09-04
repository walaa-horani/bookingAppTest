"use client";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

type Props = {
  value: string; 
  onChange: (date: string) => void;
};

const WEEKDAYS = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];

export default function BookingCalendar({ value, onChange }: Props) {
  const initial = useMemo(() => {
    const [y,m] = value.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [value]);

  const [cursor, setCursor] = useState<Date>(initial);

  const monthName = cursor.toLocaleDateString("ar", { month: "long", year: "numeric" });

  const todayStr = new Date().toISOString().slice(0, 10);
  const isPast = (d: Date) => d.toISOString().slice(0, 10) < todayStr;

  const daysGrid = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const startOffset = (first.getDay() + 7) % 7; 
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
   
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const selected = value;

  const goto = (delta: number) => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + delta);
    setCursor(d);
  };

  return (
    <div className="rounded-2xl  p-4 space-y-4 bg-gray-100">

      
      <div className="flex items-center justify-between">
        <button
          onClick={() => goto(-1)}
          className="rounded-lg cursor-pointer border px-3 py-1 text-sm hover:bg-gray-50"
        >
          ‹
        </button>
        <div className="font-semibold">{monthName}</div>
        <button
          onClick={() => goto(1)}
          className="rounded-lg cursor-pointer border px-3 py-1 text-sm hover:bg-gray-50"
        >
          ›
        </button>
      </div>

      

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysGrid.map((d, idx) => {
          if (!d) return <div key={idx} />;
          const dStr = d.toISOString().slice(0, 10);
          const disabled = isPast(d);
          const active = dStr === selected;

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onChange(dStr)}
              className={[
                "h-10 cursor-pointer rounded-lg  text-sm transition",
                disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-blue-600 hover:text-white",
                active ? "bg-blue-500 text-white" : ""
              ].join(" ")}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

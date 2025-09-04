// src/components/TimeSlots.tsx
"use client";
type Slot = { id: number; time: string; duration: number };

type Props = {
  slots: Slot[];
  selectedId?: number | null;
  onSelect: (slot: Slot) => void;
  loading?: boolean; // 👈 جديد
};

export default function TimeSlots({ slots, selectedId, onSelect, loading=false }: Props) {
  return (
    <div className="rounded-2xl  p-4 space-y-3 bg-gray-100">
      <div className="">
        <h3 className="font-semibold">الأوقات المتاحة</h3>
        <p className=" text-gray-500">سيتم الحجز بتوقيت بلدك الحالي</p>
      </div>

      {loading ? (

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-10  rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-sm text-gray-500 ">لا توجد أوقات متاحة لهذا اليوم.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 ">
          {slots.map((s) => {
            const active = selectedId === s.id;
            return (
            <button
  key={s.id}
  onClick={() => onSelect(s)}
  className={[
    "tnum rounded-xl cursor-pointer border px-4 py-2 text-sm transition-colors",
    "bg-white text-gray-900 hover:bg-gray-50",                 // الافتراضي
    active && "bg-blue-600 text-black border-blue-600 shadow"   // حالة الاختيار
  ].filter(Boolean).join(" ")}
>
  <span className="font-medium">{s.time}</span>
  <span className="ms-1 text-current/70">({s.duration}د)</span>
</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

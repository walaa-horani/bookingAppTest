"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import TimeSlots from "../_components/TimeSlots";
import BookingCalendar from "../_components/BookingCalendar";
import ConfirmModal from "../_components/ConfirmModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Slot = { id: number; time: string; duration: number };

export default function BookingPage() {
  const { isSignedIn } = useUser();

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    document.documentElement.dir = "rtl";
    return () => {
      document.documentElement.dir = "ltr";
    };
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    setSelected(null); 
    try {
      const res = await fetch(`/api/sessions?date=${date}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "فشل تحميل الأوقات");
      setSlots(data.slots);
    } catch (err) {
      console.error("خطأ في تحميل الجلسات:", err);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchSlots();
  }, [date]);

  const handleBook = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: selected.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "فشل الحجز");

      toast.success("تم الحجز بنجاح");
      setOpenConfirm(false);
      fetchSlots(); 
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء الحجز");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8 grid gap-6 grid-cols-1 md:grid-cols-2 items-start">

     
<section className="rounded-2xl w-full lg:w-[450px] order-2 bg-gray-100 p-6 space-y-5 lg:sticky lg:top-6 h-fit">

      
        <div className="p-4 space-y-3">
          <h3 className="font-semibold">المدّة</h3>
          <div className="text-sm text-gray-600">مدة الجلسة 60 دقيقة.</div>
          <BookingCalendar value={date} onChange={setDate} />
        </div>

      
        <TimeSlots
          slots={slots}
          loading={loading}
          selectedId={selected?.id ?? null}
          onSelect={(s) => setSelected(s)}
        />

      
        {!isSignedIn && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            يجب تسجيل الدخول لحجز موعد. الأوقات المتاحة ظاهرة لكن لا يمكن الحجز قبل تسجيل الدخول.
          </div>
        )}


        <Button
          onClick={() => setOpenConfirm(true)}
          disabled={!isSignedIn || !selected || busy}
          className="w-full rounded-2xl py-3 text-white disabled:opacity-40"
        >
          حجز جلسة
        </Button>

        {!isSignedIn && (
          <p className="text-xs text-gray-500">يرجى تسجيل الدخول لإتمام الحجز.</p>
        )}
      </section>

    
      <section className="rounded-2xl bg-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-4 border-b border-gray-200">
          <Image alt="profile" width={170} height={170} src="/profile.png" />
          <div>
            <h2 className="text-lg font-semibold">سارة أحمد</h2>
            <p className="text-sm text-gray-500">مؤسِّسة، مستثمرة، شريكة في شركات تقنية</p>
            <p className="text-xs text-gray-500">السعودية • خبرة 35 عاماً</p>
          </div>
        </div>

        <div className="text-sm text-gray-700 space-y-2 mt-5">
          <h3 className="font-semibold">نبذة تعريفية</h3>
          <p className="text-[16px]">
            متخصصة في تطوير وإدارة المنتجات الرقمية. عملت على عدة منتجات SaaS واستثمارات مبكرة، وأحب مساعدة رواد الأعمال الطموحين.
          </p>
        </div>

        <div className="text-gray-700 space-y-2">
          <h3 className="font-semibold mt-4">أشياء يمكنني أن أنصح بها</h3>
          <ul className="list-disc ps-5 space-y-1">
            <li>استراتيجيات نمو المنتج</li>
            <li>اشتراكات e-commerce</li>
            <li>اعتماد المنصات الرقمية</li>
            <li>بناء وتقييم SaaS</li>
            <li>الاستثمار المبكر</li>
            <li>استراتيجيات نمو تويتر</li>
            <li>بناء المجتمع</li>
          </ul>
          <div className="mt-6">
            <p className="mb-4">أحب مساعدة الآخرين وخاصة رواد الأعمال الجائعين</p>
            <p>أعمل حالياً على توسيع نطاق مجتمع المؤسسين</p>
          </div>
        </div>
      </section>

     
      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleBook}
        title="تأكيد الحجز"
      >
        {selected ? (
          <>
            <div>التاريخ: <b>{date}</b></div>
            <div>الوقت: <b>{selected.time}</b></div>
            <div>المدّة: <b>{selected.duration} دقيقة</b></div>
          </>
        ) : (
          <div>يرجى اختيار وقت.</div>
        )}
      </ConfirmModal>
    </main>
  );
}

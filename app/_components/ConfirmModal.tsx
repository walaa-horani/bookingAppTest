// src/components/ConfirmModal.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children?: ReactNode;
  confirmText?: string;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "تأكيد الحجز"
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{title}</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <div className="text-sm text-gray-700">{children}</div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className=" cursor-pointer rounded-lg border px-4 py-2 text-sm">
            إلغاء
          </button>
          <Button
            onClick={onConfirm}
           
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
   
      <Link href="/booking" className="text-lg font-bold">
        نظام الحجز
      </Link>

  
      <nav className="flex items-center gap-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button >
              تسجيل الدخول
            </Button>
          </SignInButton>
        </SignedOut>
      </nav>
    </header>
  );
}

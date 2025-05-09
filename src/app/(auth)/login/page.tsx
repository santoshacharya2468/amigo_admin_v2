"use client";
import { LoginForm } from "@/app/(auth)/components/loginForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <Suspense fallback={<div>{""}</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

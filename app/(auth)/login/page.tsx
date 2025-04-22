"use client";

import { Suspense } from "react";
import LoginComponent from "@/components/LoginComponent";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginComponent />
    </Suspense>
  );
}

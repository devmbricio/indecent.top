import React, { Suspense } from "react";
import SignupPage from "./Signup";

export default function SignupPageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignupPage />
    </Suspense>
  );
}

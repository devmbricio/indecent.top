import { Suspense } from "react";
import RedirectPage from "./mensagem";

export default function PageWrapper() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <RedirectPage />
    </Suspense>
  );
}

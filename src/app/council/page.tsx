import { Suspense } from "react";
import CouncilPageClient from "./CouncilPageClient";

export default function CouncilPage() {
  return (
    <Suspense fallback={null}>
      <CouncilPageClient />
    </Suspense>
  );
}
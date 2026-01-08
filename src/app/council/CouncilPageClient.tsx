"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CouncilView } from "@/components/CouncilView";
import { useLuminaStore } from "@/store/luminaStore";

export default function CouncilPageClient() {
  const sp = useSearchParams();
  const setDomain = useLuminaStore((s) => s.setDomain);

  useEffect(() => {
    const d = sp.get("domain");
    if (d === "career" || d === "love" || d === "money" || d === "self" || d === "random") {
      setDomain(d);
    } else {
      setDomain("random");
    }
  }, [sp, setDomain]);

  return <CouncilView />;
}
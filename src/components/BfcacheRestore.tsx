"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BfcacheRestore() {
  const router = useRouter();

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;

      // bfcache에서 복원됨 → stale 데이터 갱신
      router.refresh();

      // Analytics pageview 재전송
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: window.location.pathname,
        });
      }
      if ((window as any).wcs) {
        (window as any).wcs_do();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [router]);

  return null;
}

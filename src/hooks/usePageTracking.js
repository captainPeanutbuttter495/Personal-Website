import { useEffect, useRef } from "react";

export function usePageTracking() {
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    function trackPageView() {
      const path = window.location.pathname;
      if (path === lastTrackedPath.current) return;
      lastTrackedPath.current = path;

      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: path,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }

    trackPageView();

    window.addEventListener("app:navigate", trackPageView);
    window.addEventListener("popstate", trackPageView);

    return () => {
      window.removeEventListener("app:navigate", trackPageView);
      window.removeEventListener("popstate", trackPageView);
    };
  }, []);
}

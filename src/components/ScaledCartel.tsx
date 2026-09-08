"use client";

import { useEffect, useRef, useState } from "react";

export function ScaledCartel({ children, baseWidth = 740 }: { children: React.ReactNode; baseWidth?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const cw = container.clientWidth;
      const isMobile = window.innerWidth < 768;
      const s = isMobile ? Math.min(1, cw / baseWidth) : 1;
      setScale(s);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [baseWidth]);

  // desktop: sin escala, ocupa 100% natural
  if (scale === 1) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div style={{ width: `${baseWidth}px`, zoom: scale } as React.CSSProperties}>{children}</div>
    </div>
  );
}

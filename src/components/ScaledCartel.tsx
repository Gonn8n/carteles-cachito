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
      if (cw === 0) return;
      const s = Math.min(1, cw / baseWidth);
      // solo escalar hacia abajo, y solo si es necesario (mobile o viewport chico)
      setScale(s < 0.99 ? s : 1);
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

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {scale < 1 ? (
        <div style={{ width: `${baseWidth}px`, zoom: scale } as React.CSSProperties}>{children}</div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </div>
  );
}

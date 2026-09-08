"use client";

import { useEffect, useRef, useState } from "react";

export function ScaledCartel({ children, baseWidth = 740 }: { children: React.ReactNode; baseWidth?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const update = () => {
      const cw = container.clientWidth;
      // nunca escalar hacia arriba, solo hacia abajo
      const s = Math.min(1, cw / baseWidth);
      setScale(s);
      const ch = content.scrollHeight;
      setHeight(ch * s);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(content);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [baseWidth]);

  return (
    <div ref={containerRef} style={{ height: height ? `${height}px` : "auto" }} className="w-full overflow-hidden">
      <div ref={contentRef} style={{ width: `${baseWidth}px`, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

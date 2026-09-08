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
      // solo escalar hacia abajo en mobile (<640px o cuando no entra)
      const isMobile = window.innerWidth < 768;
      const s = isMobile ? Math.min(1, cw / baseWidth) : 1;
      setScale(s);
      if (s < 1) {
        const ch = content.scrollHeight;
        setHeight(ch * s);
      } else {
        setHeight(undefined);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    if (content) ro.observe(content);
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
    <div ref={containerRef} style={{ height: height ? `${height}px` : "auto" }} className="w-full overflow-hidden">
      <div ref={contentRef} style={{ width: `${baseWidth}px`, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

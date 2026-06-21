"use client";

import { useEffect, useRef, useState } from "react";

type VisibleBackgroundProps = {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
};

export default function VisibleBackground({
  children,
  className = "",
  rootMargin = "600px 0px",
}: VisibleBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { root: null, rootMargin, threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : null}
    </div>
  );
}
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress() {
  const progress = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#scroll-story",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => { progress.current = self.progress; setDisplayProgress(self.progress); },
    });
    return () => trigger.kill();
  }, []);
  return { progress, displayProgress };
}

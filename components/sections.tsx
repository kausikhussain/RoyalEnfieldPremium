"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RevealTitle({ eyebrow, children }: { eyebrow: string; children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const words = ref.current?.querySelectorAll("span");
    if (!words?.length) return;
    const ctx = gsap.context(() => gsap.from(words, { yPercent: 110, stagger: 0.05, ease: "power4.out", duration: 1.1, scrollTrigger: { trigger: ref.current, start: "top 78%" } }));
    return () => ctx.revert();
  }, []);
  return <><p className="eyebrow">{eyebrow}</p><h2 ref={ref} className="reveal-title">{children.split(" ").map((word, i) => <span key={`${word}-${i}`}>{word}&nbsp;</span>)}</h2></>;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;
}

export function Section({ className = "", children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return <section id={id} className={`story-section ${className}`}>{children}</section>;
}

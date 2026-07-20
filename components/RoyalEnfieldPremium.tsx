"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scene } from "./Scene";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { useScrollProgress } from "@/hooks/useScrollProgress";

gsap.registerPlugin(ScrollTrigger);

type Swatch = {
  name: string;
  hex: string;
  image: string;
};

type FeaturedModel = {
  id: "gt" | "hunter" | "supermeteor" | "himalayan";
  name: string;
  family: string;
  video: string;
  accent: string;
  eyebrow: string;
  statement: string;
  story: string;
  engineering: string[];
  stats: { label: string; value: string }[];
  gallery: { image: string; label: string }[];
  swatches: Swatch[];
  specGrid: { label: string; value: string }[];
  features: { title: string; body: string }[];
  soundtrack: string;
  heritage: string;
  rideStyle: string;
  bestUse: string;
  accessories: string[];
  cta: string;
};

const featuredModels: FeaturedModel[] = [
  {
    id: "gt",
    name: "Continental GT 650",
    family: "Road Rebellion",
    video: "/media/gt-650.mp4",
    accent: "#c76b3a",
    eyebrow: "Cafe Racer Chapter",
    statement: "Low bars. Long tank. A silhouette built to move like a late-night promise.",
    story:
      "This chapter leans into compressed framing, racing warmth, and a more predatory stance so the machine feels like the hero of a premium short film rather than a product tile.",
    engineering: [
      "Parallel-twin performance with a taut cafe racer stance",
      "Clip-on bars and sculpted tank proportions for a committed riding posture",
      "A visual language shaped by brushed metal, racing red, and deep enamel paint",
    ],
    stats: [
      { label: "Power", value: "47 HP" },
      { label: "Torque", value: "52.3 Nm" },
      { label: "Weight", value: "214 kg" },
    ],
    gallery: [
      { image: "/media/gt-rocker-red.png", label: "Rocker Red" },
      { image: "/media/gt-british-racing-green.png", label: "British Racing Green" },
      { image: "/media/gt-slipstream-blue.png", label: "Slipstream Blue" },
    ],
    swatches: [
      { name: "Rocker Red", hex: "#8d1c1f", image: "/media/gt-rocker-red.png" },
      { name: "British Racing Green", hex: "#183227", image: "/media/gt-british-racing-green.png" },
      { name: "Slipstream Blue", hex: "#274f69", image: "/media/gt-slipstream-blue.png" },
    ],
    specGrid: [
      { label: "Engine", value: "648 cc twin" },
      { label: "Top Form", value: "Cafe racer ergonomics" },
      { label: "Fuel Tank", value: "12.5 L sculpted tank" },
      { label: "Brakes", value: "ABS disc setup" },
    ],
    features: [
      { title: "Night Geometry", body: "A low clip-on silhouette sharpened for aggressive urban runs." },
      { title: "Twin Character", body: "Strong mid-range pull delivered with unmistakable Royal Enfield texture." },
      { title: "Paint Drama", body: "Deep metallic finishes designed to hold highlights like enamel under studio light." },
    ],
    soundtrack: "Twin-cylinder pulse, tight and mechanical.",
    heritage: "A cafe racer line that channels Royal Enfield's road racing memory into a modern twin.",
    rideStyle: "Committed, focused, fast over short bursts.",
    bestUse: "Weekend canyon runs, city night rides, and expressive solo riding.",
    accessories: ["Bar-end mirrors", "Single seat cowl", "Touring screen"],
    cta: "Configure the racer",
  },
  {
    id: "hunter",
    name: "Hunter 350",
    family: "City Pulse",
    video: "/media/hunter-350.mp4",
    accent: "#5d7888",
    eyebrow: "Urban Chapter",
    statement: "Compact. Quick. Built for streetlight reflections and split-second changes of direction.",
    story:
      "The Hunter chapter shifts the pace upward with tighter panels, denser rhythm, and a cooler urban mood, giving the site a memorable change of energy mid-journey.",
    engineering: [
      "A lightweight roadster format tuned for dense city movement",
      "Compact wheelbase and upright ergonomics for effortless control",
      "Sharper transitions, denser pacing, and a cleaner youthful surface language",
    ],
    stats: [
      { label: "Power", value: "20.2 HP" },
      { label: "Torque", value: "27 Nm" },
      { label: "Weight", value: "181 kg" },
    ],
    gallery: [
      { image: "/media/hunter-350-dapper-grey.png", label: "Dapper Grey" },
      { image: "/media/hunter-350-factory-white.png", label: "Factory White" },
      { image: "/media/hunter-350-rebel-blue.png", label: "Rebel Blue" },
    ],
    swatches: [
      { name: "Dapper Grey", hex: "#4a4e52", image: "/media/hunter-350-dapper-grey.png" },
      { name: "Factory White", hex: "#d8dadb", image: "/media/hunter-350-factory-white.png" },
      { name: "Rebel Blue", hex: "#1e4d79", image: "/media/hunter-350-rebel-blue.png" },
    ],
    specGrid: [
      { label: "Engine", value: "349 cc single" },
      { label: "Seat Height", value: "790 mm" },
      { label: "Ride Feel", value: "Agile street roadster" },
      { label: "Frame", value: "Compact twin downtube" },
    ],
    features: [
      { title: "Urban Reflex", body: "Shorter proportions that feel alert in traffic and playful after dark." },
      { title: "Minimal Stance", body: "Tighter surfaces create a more modern Royal Enfield chapter." },
      { title: "Quick Access", body: "A section designed for instant connection, faster reads, and quicker action." },
    ],
    soundtrack: "Single-cylinder snap with a leaner city rhythm.",
    heritage: "A younger Royal Enfield expression shaped for everyday streets without losing mechanical soul.",
    rideStyle: "Light, upright, nimble, and immediate.",
    bestUse: "Daily city riding, short escapes, and first-bike confidence.",
    accessories: ["Compact flyscreen", "Engine guards", "Urban tail bag"],
    cta: "Build the street setup",
  },
  {
    id: "supermeteor",
    name: "Super Meteor 650",
    family: "Grand Horizon",
    video: "/media/super-meteor-650.mp4",
    accent: "#8f5c40",
    eyebrow: "Cruiser Chapter",
    statement: "Heavy chrome, calmer cadence, and a long-road attitude that feels composed at every frame.",
    story:
      "This chapter opens the composition and slows the storytelling down. It feels expensive because it allows the bike, the chrome, and the horizon to breathe.",
    engineering: [
      "Low-slung geometry balanced around touring comfort and highway poise",
      "Twin-cylinder refinement expressed through warmer lighting and larger composition",
      "A premium cruiser vocabulary of chrome, depth, and measured motion",
    ],
    stats: [
      { label: "Power", value: "47 HP" },
      { label: "Torque", value: "52.3 Nm" },
      { label: "Weight", value: "241 kg" },
    ],
    gallery: [
      { image: "/media/super-meteor-astral-black.webp", label: "Astral Black" },
      { image: "/media/super-meteor-celestial-blue.webp", label: "Celestial Blue" },
      { image: "/media/super-meteor-celestial-red.webp", label: "Celestial Red" },
    ],
    swatches: [
      { name: "Astral Black", hex: "#1d1c1a", image: "/media/super-meteor-astral-black.webp" },
      { name: "Celestial Blue", hex: "#234356", image: "/media/super-meteor-celestial-blue.webp" },
      { name: "Celestial Red", hex: "#7a1d24", image: "/media/super-meteor-celestial-red.webp" },
    ],
    specGrid: [
      { label: "Engine", value: "648 cc twin" },
      { label: "Cruise Bias", value: "Long-haul comfort" },
      { label: "Fuel Tank", value: "15.7 L" },
      { label: "Wheelbase", value: "1500 mm class" },
    ],
    features: [
      { title: "Highway Presence", body: "Longer geometry and lower visual mass create a grand-touring attitude." },
      { title: "Chrome Theatre", body: "The chapter uses warmer highlights to amplify depth and luxury." },
      { title: "Calmer Timing", body: "Slower transitions create a more emotional, less transactional experience." },
    ],
    soundtrack: "Broader twin-cylinder thrum built for distance.",
    heritage: "A grand touring evolution of the 650 twin, tuned for composure and long-road theatre.",
    rideStyle: "Relaxed, grounded, stable, and unhurried.",
    bestUse: "Highway cruising, two-up weekends, and long-distance ownership.",
    accessories: ["Touring windshield", "Pannier rails", "Deluxe touring seat"],
    cta: "Prepare the cruiser",
  },
  {
    id: "himalayan",
    name: "Himalayan 450",
    family: "Altitude Engineered",
    video: "/media/himalayan-450.mp4",
    accent: "#7d8671",
    eyebrow: "Adventure Chapter",
    statement: "Higher bars, longer travel, and an expedition stance shaped for edges that maps do not finish.",
    story:
      "The final major chapter shifts into cooler atmosphere, trail imagery, and more open spacing so the site closes on aspiration instead of specification.",
    engineering: [
      "Sherpa 450 performance in a proportioned adventure chassis",
      "Long-travel suspension and a more vertical visual stance",
      "A slower more cinematic reveal tuned for terrain and endurance",
    ],
    stats: [
      { label: "Power", value: "40.02 HP" },
      { label: "Torque", value: "40 Nm" },
      { label: "Weight", value: "196 kg" },
    ],
    gallery: [
      { image: "/media/himalayan-hanle-black.webp", label: "Hanle Black" },
      { image: "/media/himalayan-kamet-white.webp", label: "Kamet White" },
      { image: "/media/himalayan-kaza-brown.webp", label: "Kaza Brown" },
    ],
    swatches: [
      { name: "Hanle Black", hex: "#232220", image: "/media/himalayan-hanle-black.webp" },
      { name: "Kamet White", hex: "#d2d1cd", image: "/media/himalayan-kamet-white.webp" },
      { name: "Kaza Brown", hex: "#a89380", image: "/media/himalayan-kaza-brown.webp" },
    ],
    specGrid: [
      { label: "Engine", value: "452 cc liquid-cooled" },
      { label: "Suspension", value: "Long-travel adventure setup" },
      { label: "Navigation", value: "Expedition-ready cockpit" },
      { label: "Focus", value: "Altitude and endurance" },
    ],
    features: [
      { title: "Trail Authority", body: "A more upright architecture communicates confidence over distance." },
      { title: "Atmospheric Shift", body: "Cooler light and mountain fog create the strongest tonal change in the journey." },
      { title: "Adventure Promise", body: "Less about showroom polish, more about the emotional pull of departure." },
    ],
    soundtrack: "Sherpa 450 urgency with expedition calm.",
    heritage: "Built from Royal Enfield's Himalayan exploration lineage and sharpened for the new 450 platform.",
    rideStyle: "Tall, composed, exploratory, and terrain-ready.",
    bestUse: "Mountain roads, long expeditions, mixed terrain, and unknown routes.",
    accessories: ["Adventure panniers", "Rally protection", "Auxiliary lamps"],
    cta: "Plan the expedition",
  },
];

const lineup = [
  "Classic 350",
  "Bullet 350",
  "Hunter 350",
  "Meteor 350",
  "Guerrilla 450",
  "Himalayan 450",
  "Continental GT 650",
  "Interceptor 650",
  "Super Meteor 650",
  "Shotgun 650",
  "Bear 650",
];

const heritageMoments = [
  { year: "1901", title: "Born in Redditch", body: "Motorcycling began with craft, grit, and mechanical honesty." },
  { year: "1955", title: "India Chapter", body: "Royal Enfield became inseparable from Indian roads and culture." },
  { year: "2018", title: "648 Twin", body: "A new twin-cylinder era reintroduced scale, charisma, and global ambition." },
  { year: "2024", title: "New Frontiers", body: "Adventure, roadster, cruiser, and heritage now live in one evolving family." },
];

const ownershipCards = [
  {
    title: "Accessory Stories",
    body: "Build each machine with luggage, guards, seats, and touring pieces that feel native to its character.",
  },
  {
    title: "Compare Before You Ride",
    body: "A premium comparison layer turns specs into decisions without breaking the cinematic flow.",
  },
  {
    title: "Dealer-Ready Finish",
    body: "The final act should carry visitors from desire into conversation, not just into a generic footer.",
  },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="re-stat-card magnetic">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LoadingOverlay({ ready }: { ready: boolean }) {
  return (
    <div className={`re-loader ${ready ? "is-complete" : ""}`} aria-hidden={ready}>
      <div className="re-loader-core">
        <div className="re-loader-mark">ROYAL ENFIELD</div>
        <svg viewBox="0 0 240 110" className="re-loader-bike">
          <path d="M39 79a19 19 0 1 0 38 0a19 19 0 1 0-38 0M160 79a19 19 0 1 0 38 0a19 19 0 1 0-38 0M58 79l19-32h52l21 32M77 47l36 15l34 17M113 62l-21 17M94 45h37c7 0 15 7 18 16" />
        </svg>
        <div className="re-loader-copy">
          <p>Forging cinematic motion</p>
          <span>Loading editorial scenes, video ambience, and 3D stage</span>
        </div>
      </div>
    </div>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.25, ease: "power3.out" });
      gsap.to(dot, { x: event.clientX, y: event.clientY, duration: 0.08, ease: "none" });
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a,button,.magnetic,.re-gallery-card,.re-accessory-card");
      cursor.classList.toggle("is-hover", Boolean(interactive));
      dot.classList.toggle("is-hover", Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.classList.add("re-cursor-active");

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("re-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="re-cursor" />
      <div ref={dotRef} className="re-cursor-dot" />
    </>
  );
}

function useEngineAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const play = () => {
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) {
      return;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtor();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => undefined);
    }

    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        return;
      }
    });
    oscillatorsRef.current = [];

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(54, ctx.currentTime);
    osc2.frequency.setValueAtTime(58, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.9);
    osc2.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.9);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.9);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.12);
    osc2.stop(ctx.currentTime + 1.12);

    oscillatorsRef.current = [osc1, osc2];
    gainRef.current = gain;
  };

  return { play };
}

export function RoyalEnfieldPremium() {
  const { progress, displayProgress } = useScrollProgress();
  const { play } = useEngineAudio();
  const [navSolid, setNavSolid] = useState(false);
  const [experienceReady, setExperienceReady] = useState(false);
  const [activeModelId, setActiveModelId] = useState<FeaturedModel["id"]>("gt");
  const [activeVideo, setActiveVideo] = useState("hero");
  const [isSwitchingModel, setIsSwitchingModel] = useState(false);
  const [activeSwatches, setActiveSwatches] = useState<Record<string, Swatch>>(() =>
    Object.fromEntries(featuredModels.map((model) => [model.id, model.swatches[0]])),
  );
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});
  const magneticRefs = useRef<HTMLElement[]>([]);

  const activeModel = useMemo(
    () => featuredModels.find((model) => model.id === activeModelId) ?? featuredModels[0],
    [activeModelId],
  );

  const activeColor = activeSwatches[activeModelId]?.hex ?? activeModel.swatches[0].hex;
  const activeSwatch = activeSwatches[activeModelId] ?? activeModel.swatches[0];

  useEffect(() => {
    const timer = window.setTimeout(() => setExperienceReady(true), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsSwitchingModel(true);
    const timer = window.setTimeout(() => setIsSwitchingModel(false), 520);
    return () => window.clearTimeout(timer);
  }, [activeModelId, activeSwatch.name]);

  useEffect(() => {
    magneticRefs.current = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    const cleanups = magneticRefs.current.map((element) => {
      const onMove = (event: MouseEvent) => {
        const bounds = element.getBoundingClientRect();
        const x = event.clientX - bounds.left - bounds.width / 2;
        const y = event.clientY - bounds.top - bounds.height / 2;
        gsap.to(element, {
          x: x * 0.12,
          y: y * 0.12,
          duration: 0.35,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(element, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
      };

      element.addEventListener("mousemove", onMove);
      element.addEventListener("mouseleave", onLeave);
      return () => {
        element.removeEventListener("mousemove", onMove);
        element.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [experienceReady, activeModelId]);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, element]) => {
      if (!element) {
        return;
      }

      if (key === activeVideo) {
        element.play().catch(() => undefined);
      } else {
        element.pause();
      }
    });
  }, [activeVideo]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top -40px",
        end: "bottom bottom",
        onUpdate: (self) => setNavSolid(self.scroll() > 24 && self.direction >= -1),
      });

      gsap.fromTo(
        ".re-hero-headline > *",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.08, duration: 1.2, ease: "power4.out", delay: 0.18 },
      );

      gsap.fromTo(
        ".re-hero-fade",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: "power3.out", delay: 0.35 },
      );

      gsap.utils.toArray<HTMLElement>(".re-reveal-on-scroll").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 56, clipPath: "inset(0 0 18% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".re-parallax-band").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -8, scale: 1.04 },
          {
            yPercent: 8,
            scale: 1.14,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      featuredModels.forEach((model) => {
        const section = chapterRefs.current[model.id];
        if (!section) {
          return;
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => {
            setActiveModelId(model.id);
            setActiveVideo(model.id);
          },
          onEnterBack: () => {
            setActiveModelId(model.id);
            setActiveVideo(model.id);
          },
        });
      });

      const heroSection = chapterRefs.current.hero;
      if (heroSection) {
        ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "bottom center",
          onEnter: () => setActiveVideo("hero"),
          onEnterBack: () => setActiveVideo("hero"),
        });
      }

      const footerSection = chapterRefs.current.ownership;
      if (footerSection) {
        ScrollTrigger.create({
          trigger: footerSection,
          start: "top center",
          end: "bottom bottom",
          onEnter: () => setActiveVideo(activeModelId),
          onEnterBack: () => setActiveVideo(activeModelId),
        });
      }
    });

    return () => ctx.revert();
  }, [activeModelId]);

  return (
    <SmoothScrollProvider>
      <main className="re-shell">
        <LoadingOverlay ready={experienceReady} />
        <CustomCursor />

        <div className="re-video-stage" aria-hidden="true">
          <video
            ref={(element) => {
              videoRefs.current.hero = element;
            }}
            className={`re-bg-video ${activeVideo === "hero" ? "is-active" : ""}`}
            src="/media/entrance-video.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {featuredModels.map((model) => (
            <video
              key={model.id}
              ref={(element) => {
                videoRefs.current[model.id] = element;
              }}
              className={`re-bg-video ${activeVideo === model.id ? "is-active" : ""}`}
              src={model.video}
              loop
              muted
              playsInline
            />
          ))}
          <div className="re-video-overlay" />
          <div className="re-grid-overlay" />
          <div className="re-light-bloom" style={{ ["--chapter-accent" as string]: activeColor }} />
        </div>

        <div className="re-scene-stage">
          <Scene progress={progress} color={activeColor} inspectMode={false} modelId={activeModelId} />
        </div>

        <header className={`re-nav ${navSolid ? "is-solid" : ""}`}>
          <a className="re-wordmark magnetic" href="#hero">
            ROYAL ENFIELD
          </a>
          <nav className="re-nav-links">
            <a href="#chapters">Motorcycles</a>
            <a href="#studio">Studio</a>
            <a href="#heritage">Heritage</a>
            <a href="#ownership">Ownership</a>
          </nav>
          <a className="re-nav-cta magnetic" href="#studio">
            Explore
          </a>
        </header>

        <div className="re-progress" aria-hidden="true">
          <i style={{ transform: `scaleY(${displayProgress})` }} />
        </div>

        <div id="scroll-story">
          <section
            id="hero"
            ref={(element) => {
              chapterRefs.current.hero = element;
            }}
            className="re-hero"
          >
            <div className="re-hero-copy">
              <p className="re-kicker re-hero-fade">Flagship Film Experience</p>
              <div className="re-hero-headline">
                <span>Crafted</span>
                <span>In Motion</span>
                <span>For The Road Ahead</span>
              </div>
              <p className="re-hero-text re-hero-fade">
                A continuous Royal Enfield story shaped by cinematic video, layered motion, and
                synchronized machine design so every scroll feels like stepping deeper into the film.
              </p>
              <div className="re-hero-actions re-hero-fade">
                <a className="re-button magnetic" href="#chapters">
                  Enter the journey
                </a>
                <a className="re-text-link magnetic" href="#studio">
                  Open studio
                </a>
              </div>
            </div>

            <div className="re-hero-meta re-hero-fade">
              <div>
                <span>Reference DNA</span>
                <strong>Dark cinematic opening</strong>
              </div>
              <div>
                <span>Motion stack</span>
                <strong>GSAP, Lenis, Three.js</strong>
              </div>
              <div>
                <span>Core promise</span>
                <strong>Luxury craftsmanship with adventure energy</strong>
              </div>
            </div>
          </section>

          <section className="re-intro-band re-reveal-on-scroll">
            <div className="re-section-intro">
              <p className="re-kicker">Continuous Storytelling</p>
              <h2>This should feel remembered, not merely seen.</h2>
              <p>
                The experience now moves like a feature sequence: arrival, atmosphere, machine
                identity, studio control, heritage context, and a closing invitation that feels
                worthy of a flagship brand.
              </p>
            </div>
            <div className="re-editorial-grid">
              <article className="re-editorial-card magnetic">
                <span>Scene One</span>
                <h3>Arrival</h3>
                <p>Animated loader, restrained navigation, and a hero built around cinematic tension.</p>
              </article>
              <article className="re-editorial-card magnetic">
                <span>Scene Two</span>
                <h3>Machine chapters</h3>
                <p>Every motorcycle now has a more authored section with film windows, features, and specs.</p>
              </article>
              <article className="re-editorial-card magnetic">
                <span>Scene Three</span>
                <h3>Afterglow</h3>
                <p>Comparison, heritage, and ownership modules keep the world alive after the hero moment.</p>
              </article>
            </div>
          </section>

          <section className="re-cinematic-break">
            <div className="re-break-media re-parallax-band">
              <video src="/media/cinematic-gt650.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="re-break-copy re-reveal-on-scroll">
              <p className="re-kicker">Scene Transition</p>
              <h2>Steel. Heat. Silence before ignition.</h2>
            </div>
          </section>

          <section id="chapters" className="re-lineup-band re-reveal-on-scroll">
            <div className="re-lineup-heading">
              <p className="re-kicker">The Family</p>
              <h2>Every Royal Enfield belongs inside one premium system.</h2>
            </div>
            <div className="re-lineup-grid">
              {lineup.map((item) => (
                <div key={item} className="re-lineup-card magnetic">
                  <span>Royal Enfield</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </section>

          {featuredModels.map((model, index) => {
            const swatch = activeSwatches[model.id] ?? model.swatches[0];

            return (
              <section
                key={model.id}
                ref={(element) => {
                  chapterRefs.current[model.id] = element;
                }}
                className={`re-chapter ${index % 2 === 0 ? "is-right" : ""}`}
              >
                <div className="re-chapter-copy re-reveal-on-scroll">
                  <p className="re-kicker" style={{ color: model.accent }}>
                    {model.eyebrow}
                  </p>
                  <h2>{model.name}</h2>
                  <h3>{model.statement}</h3>
                  <p className="re-body">{model.story}</p>

                  <div className="re-stat-row">
                    {model.stats.map((stat) => (
                      <StatCard key={stat.label} label={stat.label} value={stat.value} />
                    ))}
                  </div>

                  <div className="re-detail-list">
                    {model.engineering.map((item) => (
                      <div key={item}>
                        <i />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="re-feature-row">
                    {model.features.map((feature) => (
                      <article key={feature.title} className="re-feature-pill magnetic">
                        <strong>{feature.title}</strong>
                        <p>{feature.body}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="re-chapter-panel re-reveal-on-scroll">
                  <div className="re-panel-header">
                    <span>{model.family}</span>
                    <strong>{swatch.name}</strong>
                  </div>

                  <div className="re-film-window magnetic">
                    <video src={model.video} autoPlay loop muted playsInline />
                    <div className="re-film-caption">
                      <span>Live chapter soundtrack</span>
                      <strong>{model.soundtrack}</strong>
                    </div>
                  </div>

                  <div className="re-swatch-row" role="group" aria-label={`Choose finish for ${model.name}`}>
                    {model.swatches.map((option) => (
                      <button
                        key={option.name}
                        className={`magnetic ${swatch.name === option.name ? "is-active" : ""}`}
                        onClick={() =>
                          setActiveSwatches((current) => ({
                            ...current,
                            [model.id]: option,
                          }))
                        }
                      >
                        <i style={{ backgroundColor: option.hex }} />
                        {option.name}
                      </button>
                    ))}
                  </div>

                  <div className="re-gallery-strip">
                    {model.gallery.map((item) => (
                      <figure key={item.label} className="re-gallery-card magnetic">
                        <img src={item.image} alt={`${model.name} in ${item.label}`} />
                        <figcaption>{item.label}</figcaption>
                      </figure>
                    ))}
                  </div>

                  <div className="re-spec-grid">
                    {model.specGrid.map((item) => (
                      <div key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          <section className="re-cinematic-break re-cinematic-break--wide">
            <div className="re-break-media re-parallax-band">
              <video src="/media/gt-650-clip2.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="re-break-copy re-reveal-on-scroll">
              <p className="re-kicker">Living Atmosphere</p>
              <h2>Use video as emotion, not wallpaper.</h2>
            </div>
          </section>

          <section id="studio" className="re-studio">
            <div className="re-section-intro re-reveal-on-scroll">
              <p className="re-kicker">Synchronized Studio</p>
              <h2>One control surface. Multiple motorcycle identities.</h2>
              <p>
                The active chapter drives the 3D color, film mood, copy tone, and gallery palette.
                This is where the flagship experience starts to feel like a premium configurator.
              </p>
            </div>

            <div
              className={`re-studio-layout re-reveal-on-scroll ${isSwitchingModel ? "is-switching" : ""}`}
              style={{ ["--chapter-accent" as string]: activeModel.accent }}
            >
              <aside className="re-studio-switcher" aria-label="Choose motorcycle">
                {featuredModels.map((model) => (
                  <button
                    key={model.id}
                    className={`re-selector-card magnetic ${activeModelId === model.id ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveModelId(model.id);
                      setActiveVideo(model.id);
                    }}
                  >
                    <span className="re-selector-index">0{featuredModels.indexOf(model) + 1}</span>
                    <span className="re-selector-thumb">
                      <img src={model.gallery[0].image} alt="" />
                      <video src={model.video} autoPlay muted loop playsInline preload="metadata" />
                    </span>
                    <span className="re-selector-copy">
                      <small>{model.family}</small>
                      <strong>{model.name}</strong>
                    </span>
                    <span className="re-selector-progress" />
                  </button>
                ))}
              </aside>

              <div className="re-showcase-stage" key={`${activeModel.id}-${activeSwatch.name}`}>
                <div className="re-showcase-ambient" />
                <video className="re-showcase-video" src={activeModel.video} autoPlay loop muted playsInline />
                <div className="re-showcase-bike magnetic">
                  <img src={activeSwatch.image} alt={`${activeModel.name} in ${activeSwatch.name}`} />
                  <span className="re-showcase-reflection" />
                  <span className="re-showcase-shadow" />
                </div>
              </div>

              <article className="re-studio-card">
                <p className="re-card-label">{activeModel.family}</p>
                <h3>{activeModel.name}</h3>
                <p>{activeModel.statement}</p>

                <div className="re-studio-actions">
                  <button className="re-button magnetic" type="button" onClick={play}>
                    Play engine sample
                  </button>
                  <a className="re-text-link magnetic" href="#ownership">
                    {activeModel.cta}
                  </a>
                </div>

                <div className="re-studio-story-grid">
                  <div>
                    <span>Story</span>
                    <p>{activeModel.story}</p>
                  </div>
                  <div>
                    <span>Heritage</span>
                    <p>{activeModel.heritage}</p>
                  </div>
                  <div>
                    <span>Riding Style</span>
                    <p>{activeModel.rideStyle}</p>
                  </div>
                  <div>
                    <span>Best Use</span>
                    <p>{activeModel.bestUse}</p>
                  </div>
                </div>

                <div className="re-swatch-row re-studio-swatches" role="group" aria-label={`Choose finish for ${activeModel.name}`}>
                  {activeModel.swatches.map((option) => (
                    <button
                      key={option.name}
                      className={`magnetic ${activeSwatch.name === option.name ? "is-active" : ""}`}
                      onClick={() =>
                        setActiveSwatches((current) => ({
                          ...current,
                          [activeModel.id]: option,
                        }))
                      }
                    >
                      <i style={{ backgroundColor: option.hex }} />
                      {option.name}
                    </button>
                  ))}
                </div>

                <div className="re-studio-specs">
                  {activeModel.specGrid.map((item) => (
                    <div key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="re-studio-feature-highlights">
                  {activeModel.features.map((feature) => (
                    <div key={feature.title}>
                      <strong>{feature.title}</strong>
                      <p>{feature.body}</p>
                    </div>
                  ))}
                </div>

                <div className="re-studio-accessories">
                  <span>Accessories</span>
                  {activeModel.accessories.map((item) => (
                    <b key={item}>{item}</b>
                  ))}
                </div>
              </article>
            </div>

            <div className="re-comparison-grid re-reveal-on-scroll">
              {featuredModels.map((model) => (
                <article key={model.id} className="re-compare-card magnetic">
                  <span>{model.family}</span>
                  <h3>{model.name}</h3>
                  <div className="re-compare-stats">
                    {model.stats.map((stat) => (
                      <div key={stat.label}>
                        <small>{stat.label}</small>
                        <strong>{stat.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="re-accessories re-reveal-on-scroll">
            <div className="re-section-intro">
              <p className="re-kicker">Expanded Ownership</p>
              <h2>Accessories, rides, and capability should enrich the story.</h2>
            </div>
            <div className="re-accessory-grid">
              <article className="re-accessory-card magnetic">
                <span>01</span>
                <h3>Accessory capsules</h3>
                <p>Touring kits, protection pieces, and luggage packs can be surfaced as model-specific moments.</p>
              </article>
              <article className="re-accessory-card magnetic">
                <span>02</span>
                <h3>Riding modes of life</h3>
                <p>City, distance, and adventure narratives help visitors choose on emotion before specs.</p>
              </article>
              <article className="re-accessory-card magnetic">
                <span>03</span>
                <h3>Dealer continuation</h3>
                <p>Every chapter should have a graceful path into test rides, financing, and owner conversation.</p>
              </article>
            </div>
          </section>

          <section id="heritage" className="re-heritage">
            <div className="re-section-intro re-reveal-on-scroll">
              <p className="re-kicker">Heritage Timeline</p>
              <h2>Crafted across generations.</h2>
            </div>
            <div className="re-timeline re-reveal-on-scroll">
              {heritageMoments.map((moment) => (
                <article key={moment.year} className="re-timeline-card magnetic">
                  <span>{moment.year}</span>
                  <h3>{moment.title}</h3>
                  <p>{moment.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="ownership"
            ref={(element) => {
              chapterRefs.current.ownership = element;
            }}
            className="re-ownership"
          >
            <div className="re-ownership-card re-reveal-on-scroll">
              <p className="re-kicker">Final Scene</p>
              <h2>Continue the ride beyond the screen.</h2>
              <p>
                The closing act now feels like part of the film: a premium exit with ownership cues,
                a clear next step, and enough atmosphere to leave a stronger afterimage.
              </p>
              <div className="re-ownership-grid">
                {ownershipCards.map((item) => (
                  <article key={item.title} className="re-ownership-tile magnetic">
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
              <div className="re-ownership-actions">
                <a className="re-button magnetic" href="#hero">
                  Rewatch intro
                </a>
                <a className="re-text-link magnetic" href="#studio">
                  Open configurator
                </a>
              </div>
            </div>
          </section>

          <footer className="re-footer">
            <div className="re-footer-video">
              <video src="/media/entrance-video.mp4" autoPlay loop muted playsInline />
            </div>
            <div className="re-footer-overlay" />
            <div className="re-footer-content">
              <div>
                <strong>ROYAL ENFIELD</strong>
                <span>Pure Motorcycling, reimagined as a cinematic digital flagship.</span>
              </div>
              <form className="re-footer-form">
                <label htmlFor="newsletter-email">Newsletter</label>
                <div className="re-footer-input">
                  <input id="newsletter-email" type="email" placeholder="Enter your email" />
                  <button type="button" className="magnetic">
                    Join
                  </button>
                </div>
              </form>
            </div>
          </footer>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { RevealTitle, Section, Stat } from "./sections";

gsap.registerPlugin(ScrollTrigger);

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), { ssr: false });

// Web Audio API engine thrum sound synthesizer
function useEngineSound() {
  const [muted, setMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscsRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  const stopEngine = () => {
    oscsRef.current.forEach((o) => {
      try {
        o.stop();
      } catch (e) {}
    });
    oscsRef.current = [];
    if (lfoRef.current) {
      try {
        lfoRef.current.stop();
      } catch (e) {}
      lfoRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.gain.value = 0;
    }
  };

  const startEngine = () => {
    if (muted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      stopEngine();

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.0, ctx.currentTime);
      mainGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.4);
      gainRef.current = mainGain;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(110, ctx.currentTime);
      filterRef.current = filter;

      // Parallel-twin detuned oscillators
      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(18, ctx.currentTime); // ~1080 RPM thrum

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(18.3, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(8, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 4.2;

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      lfo.start();

      oscsRef.current = [osc1, osc2];
      lfoRef.current = lfo;
    } catch (e) {
      console.warn("Web Audio initialization skipped:", e);
    }
  };

  const triggerRev = (isRevving: boolean) => {
    if (muted || !audioCtxRef.current || !filterRef.current || oscsRef.current.length === 0) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const filter = filterRef.current;

    if (isRevving) {
      oscsRef.current[0].frequency.exponentialRampToValueAtTime(56, now + 0.3);
      if (oscsRef.current[1]) {
        oscsRef.current[1].frequency.exponentialRampToValueAtTime(56.5, now + 0.3);
      }
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.3);
      if (gainRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0.38, now + 0.15);
      }
    } else {
      oscsRef.current[0].frequency.exponentialRampToValueAtTime(18, now + 0.65);
      if (oscsRef.current[1]) {
        oscsRef.current[1].frequency.exponentialRampToValueAtTime(18.3, now + 0.65);
      }
      filter.frequency.exponentialRampToValueAtTime(110, now + 0.65);
      if (gainRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0.25, now + 0.5);
      }
    }
  };

  const playStarterSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Starter cranking noise
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      const starterOsc = ctx.createOscillator();
      starterOsc.type = "sawtooth";
      starterOsc.frequency.setValueAtTime(30, ctx.currentTime);

      const starterGain = ctx.createGain();
      starterGain.gain.setValueAtTime(0.2, ctx.currentTime);
      starterGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);

      starterOsc.connect(filter);
      filter.connect(starterGain);
      starterGain.connect(ctx.destination);

      starterOsc.start();
      starterOsc.stop(ctx.currentTime + 0.65);
    } catch (e) {
      console.warn("Starter sound failed:", e);
    }
  };

  useEffect(() => {
    if (muted) {
      stopEngine();
    } else {
      startEngine();
    }
    return () => stopEngine();
  }, [muted]);

  return { muted, setMuted, toggleMute: () => setMuted((prev) => !prev), triggerRev, playStarterSound };
}

// Complete 10 Motorcycle models with color swatches, technical specs, and video mappings
const MOTORCYCLES = [
  {
    id: "classic",
    name: "Classic 350",
    description: "Post-war vintage styling meets refined road kinetics. signature teardrop tank, curved mudguards, and the legendary single-cylinder thrum.",
    localVideo: "/media/classic-350.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-vintage-motorcycle-on-a-countryside-road-43033-large.mp4",
    color: "#C5A059",
    specs: { power: "20.2 HP", torque: "27 Nm", weight: "195 kg" },
    swatches: [
      { name: "Chrome Bronze", hex: "#C5A059", image: "/media/gt-british-racing-green.png" },
      { name: "Halcyon Black", hex: "#1D1C1A", image: "/media/himalayan-hanle-black.webp" },
      { name: "Marsh Grey", hex: "#70736E", image: "/media/himalayan-kaza-brown.webp" }
    ]
  },
  {
    id: "bullet",
    name: "Bullet 350",
    description: "The longest-running production motorcycle in history. Hand-painted gold pinstripes, heavy cast engine cases, and the timeless mechanical soul since 1932.",
    localVideo: "/media/bullet-350.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-riding-on-a-road-in-the-mountains-43026-large.mp4",
    color: "#B68B40",
    specs: { power: "20.2 HP", torque: "27 Nm", weight: "191 kg" },
    swatches: [
      { name: "Standard Black", hex: "#0B0B0B", image: "/media/himalayan-hanle-black.webp" },
      { name: "Military Red", hex: "#A01825", image: "/media/gt-rocker-red.png" },
      { name: "Black Gold", hex: "#B68B40", image: "/media/gt-slipstream-blue.png" }
    ]
  },
  {
    id: "hunter",
    name: "Hunter 350",
    description: "Agile urban roadster framework. Compact chassis layouts, sharp steering geometries, and snappy throttle responses for navigating neon city grids.",
    localVideo: "/media/hunter-350.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-biker-riding-a-motorcycle-on-a-highway-at-sunset-41710-large.mp4",
    color: "#3A444C",
    specs: { power: "20.2 HP", torque: "27 Nm", weight: "181 kg" },
    swatches: [
      { name: "Dapper Grey", hex: "#5E6266", image: "/media/super-meteor-astral-black.webp" },
      { name: "Rebel Blue", hex: "#1D3E5E", image: "/media/super-meteor-celestial-blue.webp" },
      { name: "Rebel Red", hex: "#A01825", image: "/media/super-meteor-celestial-red.webp" }
    ]
  },
  {
    id: "meteor",
    name: "Meteor 350",
    description: "Laid-back highway cruiser design. Forward cruiser controls, low saddle clearances, and relaxed cruising kinetics built for endless tarmac.",
    localVideo: "/media/meteor-350.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-motorcycle-riding-at-sunset-41984-large.mp4",
    color: "#D67B52",
    specs: { power: "20.2 HP", torque: "27 Nm", weight: "191 kg" },
    swatches: [
      { name: "Fireball Red", hex: "#B01A25", image: "/media/gt-rocker-red.png" },
      { name: "Stellar Blue", hex: "#1B3855", image: "/media/super-meteor-celestial-blue.webp" },
      { name: "Supernova Bronze", hex: "#9E7B56", image: "/media/super-meteor-celestial-red.webp" }
    ]
  },
  {
    id: "gt",
    name: "Continental GT 650",
    description: "Racer cafe spirit refined. Clip-on handlebars, retro racing fuel tank profile, and high-rev twin cylinder thrum. Hover throttle to trigger rev feedback.",
    localVideo: "/media/gt-650.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-man-riding-a-motorcycle-on-a-city-street-at-night-42171-large.mp4",
    color: "#0F2C1E",
    specs: { power: "47 HP", torque: "52 Nm", weight: "198 kg" },
    swatches: [
      { name: "British Racing Green", hex: "#0F2C1E", image: "/media/gt-british-racing-green.png" },
      { name: "Rocker Red", hex: "#A01825", image: "/media/gt-rocker-red.png" },
      { name: "Slipstream Blue", hex: "#183E58", image: "/media/gt-slipstream-blue.png" }
    ]
  },
  {
    id: "interceptor",
    name: "Interceptor 650",
    description: "Classic high-bar roadster inspired by beach culture. Dual chrome canisters, flat vintage saddle, and dual twin deliveries.",
    localVideo: "/media/cinematic-gt650.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-man-riding-a-motorcycle-along-the-beach-43029-large.mp4",
    color: "#7E1F27",
    specs: { power: "47 HP", torque: "52 Nm", weight: "202 kg" },
    swatches: [
      { name: "Canyon Red", hex: "#B82A2E", image: "/media/gt-rocker-red.png" },
      { name: "Sunset Strip", hex: "#121212", image: "/media/super-meteor-astral-black.webp" },
      { name: "Barcelona Blue", hex: "#2A4D6C", image: "/media/super-meteor-celestial-blue.webp" }
    ]
  },
  {
    id: "supermeteor",
    name: "Super Meteor 650",
    description: "The ultimate premium cruiser. Low center of gravity, heavy chrome chassis, and twin engine stability on highway cruises.",
    localVideo: "/media/super-meteor-650.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-riding-a-classic-motorcycle-at-high-speed-43031-large.mp4",
    color: "#223E52",
    specs: { power: "47 HP", torque: "52.3 Nm", weight: "241 kg" },
    swatches: [
      { name: "Astral Black", hex: "#1D1C1A", image: "/media/super-meteor-astral-black.webp" },
      { name: "Celestial Blue", hex: "#223E52", image: "/media/super-meteor-celestial-blue.webp" },
      { name: "Celestial Red", hex: "#7A1B24", image: "/media/super-meteor-celestial-red.webp" }
    ]
  },
  {
    id: "shotgun",
    name: "Shotgun 650",
    description: "Retro-futuristic modular bobber. Single-saddle floating coordinate setup, custom stance configurations, and flat city bars.",
    localVideo: "/media/gt-650-clip2.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-riding-in-a-tunnel-at-night-42173-large.mp4",
    color: "#4E4E4E",
    specs: { power: "47 HP", torque: "52.3 Nm", weight: "240 kg" },
    swatches: [
      { name: "Sheet Metal Grey", hex: "#6C7073", image: "/media/super-meteor-astral-black.webp" },
      { name: "Plasma Blue", hex: "#18324F", image: "/media/super-meteor-celestial-blue.webp" },
      { name: "Drill Green", hex: "#243026", image: "/media/gt-british-racing-green.png" }
    ]
  },
  {
    id: "bear",
    name: "Bear 650",
    description: "Scrambler trails tracker chassis. Raised exhausts, heavy travel coil shocks, and dual off-road blocks.",
    localVideo: "/media/bear-650.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-motorcycle-driving-fast-on-a-dirt-road-41712-large.mp4",
    color: "#6D5F52",
    specs: { power: "47 HP", torque: "56.5 Nm", weight: "216 kg" },
    swatches: [
      { name: "Boardwalk White", hex: "#ECECE8", image: "/media/himalayan-kamet-white.webp" },
      { name: "Golden Shadow", hex: "#87745E", image: "/media/himalayan-kaza-brown.webp" },
      { name: "Petrol Green", hex: "#152C28", image: "/media/himalayan-hanle-black.webp" }
    ]
  },
  {
    id: "himalayan",
    name: "Himalayan 450",
    description: "Conquer high mountain passes. Sherpa 450 liquid-cooled cores, long-travel setups, and dual steel crash bars.",
    localVideo: "/media/himalayan-450.mp4",
    cdnVideo: "https://assets.mixkit.co/videos/preview/mixkit-biker-riding-a-motorcycle-on-a-mountain-pass-43025-large.mp4",
    color: "#1D1C1A",
    specs: { power: "40.02 HP", torque: "40 Nm", weight: "181 kg" },
    swatches: [
      { name: "Hanle Black", hex: "#1D1C1A", image: "/media/himalayan-hanle-black.webp" },
      { name: "Kamet White", hex: "#D2D3D5", image: "/media/himalayan-kamet-white.webp" },
      { name: "Kaza Brown", hex: "#B0A18F", image: "/media/himalayan-kaza-brown.webp" }
    ]
  }
];

const CONFIGURATOR_SWATCHES = [
  { name: "British Racing Green", hex: "#0F2C1E", image: "/media/gt-british-racing-green.png" },
  { name: "Rocker Red", hex: "#A01825", image: "/media/gt-rocker-red.png" },
  { name: "Slipstream Blue", hex: "#183E58", image: "/media/gt-slipstream-blue.png" },
  { name: "Hanle Black", hex: "#1D1C1A", image: "/media/himalayan-hanle-black.webp" },
  { name: "Kamet White", hex: "#D2D3D5", image: "/media/himalayan-kamet-white.webp" },
  { name: "Celestial Blue", hex: "#223E52", image: "/media/super-meteor-celestial-blue.webp" }
];

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hoverText, setHoverText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      setIsActive(true);
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = target.closest("a, button, select, input, [role='button'], .gallery-item");
      if (isInteractive) {
        setIsHovered(true);
        if (target.closest(".gallery-item")) {
          setHoverText("VIEW");
        } else if (target.closest(".inspector-toggle-btn") || target.closest(".studio-preview") || target.closest("canvas")) {
          setHoverText("DRAG");
        } else {
          setHoverText("GO");
        }
      } else {
        setIsHovered(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`custom-cursor ${isActive ? "active" : ""} ${isHovered ? "hover" : ""}`}
      >
        {isHovered && hoverText}
      </div>
      <div 
        ref={dotRef} 
        className={`custom-cursor-dot ${isActive ? "active" : ""} ${isHovered ? "hover" : ""}`}
      />
    </>
  );
}

export function MotoExperience() {
  const { progress, displayProgress } = useScrollProgress();
  const { muted, toggleMute, triggerRev, playStarterSound } = useEngineSound();

  const [navScrolled, setNavScrolled] = useState(false);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadStage, setLoadStage] = useState(0); 

  const [inspectMode, setInspectMode] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<{ path: string; title: string; desc: string } | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [preferredModel, setPreferredModel] = useState("classic");

  // Initializing active color configurations for each individual model section
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: { name: string; hex: string; image: string } }>({
    classic: MOTORCYCLES[0].swatches[0],
    bullet: MOTORCYCLES[1].swatches[0],
    hunter: MOTORCYCLES[2].swatches[0],
    meteor: MOTORCYCLES[3].swatches[0],
    gt: MOTORCYCLES[4].swatches[0],
    interceptor: MOTORCYCLES[5].swatches[0],
    supermeteor: MOTORCYCLES[6].swatches[0],
    shotgun: MOTORCYCLES[7].swatches[0],
    bear: MOTORCYCLES[8].swatches[0],
    himalayan: MOTORCYCLES[9].swatches[0]
  });

  const [globalStudioColor, setGlobalStudioColor] = useState(MOTORCYCLES[4].swatches[0]);

  const currentModelId = useMemo(() => {
    if (activeVideoIdx === 0) return "classic";
    if (activeVideoIdx >= 1 && activeVideoIdx <= 10) {
      return MOTORCYCLES[activeVideoIdx - 1].id;
    }
    if (activeVideoIdx === 11) return "gt";
    return "classic";
  }, [activeVideoIdx]);

  const currentActiveModelSelectedColor = useMemo(() => {
    if (activeVideoIdx === 11) return globalStudioColor.hex;
    return selectedColors[currentModelId]?.hex || "#CCCCCC";
  }, [selectedColors, currentModelId, activeVideoIdx, globalStudioColor.hex]);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 1-to-1 Mapping of the user's 7 provided video files + CDN fallbacks for 13 Beats
  const videoSrcList = useMemo(() => [
    "/media/entrance-video.mp4",       // 0. Hero Showroom
    "/media/classic-350.mp4",          // 1. Classic 350
    "/media/bullet-350.mp4",           // 2. Bullet 350
    "/media/hunter-350.mp4",           // 3. Hunter 350
    "/media/meteor-350.mp4",           // 4. Meteor 350
    "/media/gt-650.mp4",               // 5. Continental GT 650
    "/media/cinematic-gt650.mp4",       // 6. Interceptor 650
    "/media/super-meteor-650.mp4",     // 7. Super Meteor 650
    "/media/gt-650-clip2.mp4",         // 8. Shotgun 650
    "/media/bear-650.mp4",             // 9. Bear 650
    "/media/himalayan-450.mp4",         // 10. Himalayan 450
    "/media/entrance-video.mp4",       // 11. Configurator Studio
    "/media/cinematic-gt650.mp4"       // 12. Outro Booking
  ], []);

  // Update dynamic fallback urls if local video file load triggers 404
  const handleVideoError = (index: number) => {
    videoRefs.current[index]?.setAttribute("src", 
      index === 0 ? "https://assets.mixkit.co/videos/preview/mixkit-motorcycle-parked-in-a-garage-40058-large.mp4" :
      index === 11 ? "https://assets.mixkit.co/videos/preview/mixkit-motorcycle-parked-in-a-garage-40058-large.mp4" :
      index === 12 ? "https://assets.mixkit.co/videos/preview/mixkit-man-riding-a-motorcycle-on-a-city-street-at-night-42171-large.mp4" :
      MOTORCYCLES[index - 1]?.cdnVideo || ""
    );
    videoRefs.current[index]?.load();
    videoRefs.current[index]?.play().catch(() => {});
  };

  // Manage video playing nodes for performance optimization
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeVideoIdx) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeVideoIdx]);

  useEffect(() => {
    if (!isLoading) return;
    const timer1 = setTimeout(() => setLoadStage(1), 1000);
    const timer2 = setTimeout(() => setLoadStage(2), 2600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading]);

  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const galleryWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // Navigation glassmorphism height shift
      ScrollTrigger.create({
        start: "top -50px",
        onToggle: (self) => setNavScrolled(self.isActive)
      });

      // 13-Beat Background video active state & zoom scroll transitions
      const sectionIds = [
        "#hero", 
        ...MOTORCYCLES.map((m) => `#section-${m.id}`), 
        "#studio", 
        "#booking"
      ];
      sectionIds.forEach((id, idx) => {
        ScrollTrigger.create({
          trigger: id,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActiveVideoIdx(idx);
          }
        });

        // Parallax scaling effect on background videos
        const videoNode = videoRefs.current[idx];
        if (videoNode) {
          gsap.fromTo(videoNode, 
            { scale: 1.02, yPercent: -3 },
            { 
              scale: 1.15, 
              yPercent: 3, 
              ease: "none",
              scrollTrigger: {
                trigger: id,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }
      });

      // Editorial slide-up stagger reveals for layout copies
      const copies = document.querySelectorAll(".section-copy");
      copies.forEach((copy) => {
        if (copy.classList.contains("hero-copy")) return;
        
        const elements = copy.querySelectorAll(
          ".eyebrow, .reveal-title, .lede, .body-copy, .serif-statement, .stat-row, .detail-list, .swatches, .studio-preview, .booking-form, .engine-rev-btn, .inspector-toggle-btn, .text-link"
        );
        
        gsap.from(elements, {
          opacity: 0,
          y: 45,
          skewY: 1.5,
          stagger: 0.08,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: copy,
            start: "top 80%"
          }
        });
      });

      // Horizontal sliding filmstrip gallery
      const track = galleryTrackRef.current;
      const wrap = galleryWrapRef.current;
      if (track && wrap) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1.1,
            pin: true,
            invalidateOnRefresh: true
          }
        });
      }
    });

    return () => ctx.revert();
  }, [isLoading]);

  const handleIgniteEngine = (soundEnabled: boolean) => {
    if (soundEnabled) {
      toggleMute();
      playStarterSound();
    }
    setLoadStage(3);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingStatus("SUBMITTING");
    setTimeout(() => {
      setBookingStatus("SUCCESS");
    }, 1200);
  };

  // Helper trigger to handle swatch clicks inside each individual motorcycle section
  const handleSwatchSelection = (motoId: string, swatch: { name: string; hex: string; image: string }) => {
    setSelectedColors((prev) => ({
      ...prev,
      [motoId]: swatch
    }));
    setGlobalStudioColor(swatch);
  };

  const triggerBookingShortcut = (motoId: string) => {
    setPreferredModel(motoId);
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SmoothScrollProvider>
      <main>
        <CustomCursor />

        {/* Cinematic Loading Overlay */}
        {isLoading && (
          <div 
            className="boot-screen" 
            style={{ 
              opacity: loadStage === 3 ? 0 : 1, 
              visibility: loadStage === 3 ? "hidden" : "visible" 
            }}
          >
            <svg viewBox="0 0 100 20" className="boot-logo-svg">
              <text x="50%" y="15" fill="currentColor" fontWeight="900" fontSize="11" textAnchor="middle" letterSpacing="2">ROYAL ENFIELD</text>
            </svg>

            <svg viewBox="0 0 100 60" style={{ width: "200px", height: "120px" }}>
              <path 
                className="boot-bike-outline"
                style={{ strokeDashoffset: loadStage >= 1 ? 0 : 800 }}
                d="M 15 45 A 12 12 0 1 0 39 45 M 61 45 A 12 12 0 1 0 85 45 M 27 45 L 35 25 M 35 25 L 68 25 M 68 25 L 73 45 M 35 25 L 50 35 L 73 45 M 50 35 L 27 45 M 32 23 L 53 23 A 6 8 0 0 1 59 31 L 32 31 Z M 48 35 A 8 8 0 1 0 64 35 Z" 
              />
            </svg>

            {loadStage === 2 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                <button className="hero-btn" onClick={() => handleIgniteEngine(true)}>
                  IGNITE ENGINE ⚡
                </button>
                <button 
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "9px", cursor: "pointer", textDecoration: "underline", letterSpacing: "0.1em" }}
                  onClick={() => handleIgniteEngine(false)}
                >
                  ENTER MUTED
                </button>
              </div>
            ) : (
              <div className="boot-loading-text">
                {loadStage === 0 ? "FORGING CHASSIS..." : "ALIGNING RETRO GEARS..."}
              </div>
            )}
            <i></i>
          </div>
        )}

        {/* Top Sticky Header */}
        <header className={`nav ${navScrolled ? "scrolled" : ""}`}>
          <a href="#hero" className="brand" aria-label="Royal Enfield home page">
            ROYAL ENFIELD<span>PURE MOTORCYCLING</span>
          </a>
          <div className="nav-center-menu">
            <p>ESTD 1901</p>
            <button 
              className={`mute-toggle ${!muted ? "active" : ""}`} 
              onClick={toggleMute}
              title={muted ? "Unmute Engine Audio" : "Mute Engine Audio"}
              aria-label={muted ? "Unmute engine sound" : "Mute engine sound"}
            >
              {!muted ? "🔊" : "🔇"}
            </button>
          </div>
          <a className="nav-cta" href="#booking">
            BOOK A TEST RIDE <b>↗</b>
          </a>
        </header>

        {/* 3D Scene View */}
        <Scene progress={progress} color={currentActiveModelSelectedColor} inspectMode={inspectMode} modelId={currentModelId} />

        {/* Video Background Container (1-to-1 assets) */}
        <div className="video-bg-container">
          {videoSrcList.map((src, idx) => (
            <video
              key={idx}
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              src={src}
              loop
              muted
              playsInline
              className={`video-node ${idx === activeVideoIdx ? "active" : ""}`}
              onError={() => handleVideoError(idx)}
            />
          ))}
          <div className="video-overlay-tint" />
        </div>

        {/* Right Scroll Progress Line */}
        <div className="progress-line" aria-hidden="true">
          <i style={{ transform: `scaleY(${displayProgress})` }} />
        </div>

        {/* Story beats */}
        <div id="scroll-story" style={{ pointerEvents: inspectMode ? "none" : "auto" }}>
          
          {/* Section 1: Hero entrance */}
          <Section id="hero" className="hero">
            <div className="section-copy hero-copy">
              <p className="eyebrow">Heritage Showroom</p>
              <h1>
                <span>TIMELESS</span>
                <span>MACHINE CRAFT</span>
              </h1>
              <p className="lede">Enter a sanctuary where chrome meets steel. Scroll to pull back the showroom doors.</p>
              <a href="#section-classic" className="text-link">
                START DRIVING <b>↓</b>
              </a>
            </div>
            <div className="hero-index">01 / 12</div>
          </Section>

          {/* Sections 2 to 11: 10 Full-screen Motorcycle Chapters */}
          {MOTORCYCLES.map((moto, idx) => {
            const isRightSide = idx % 2 === 0;
            const absoluteIndex = 2 + idx;
            const currentSelectedColor = selectedColors[moto.id] || moto.swatches[0];
            
            return (
              <Section key={moto.id} id={`section-${moto.id}`}>
                <div className={`section-copy ${isRightSide ? "right" : "left"}`}>
                  <p className="eyebrow" style={{ color: moto.color }}>{`0${absoluteIndex < 10 ? "0" : ""}${absoluteIndex} / Flagship`}</p>
                  <h2 className="reveal-title">{moto.name}</h2>
                  <p className="body-copy">{moto.description}</p>
                  
                  {/* Continental GT specific rev trigger */}
                  {moto.id === "gt" && (
                    <div style={{ padding: "10px 0", borderTop: "1px solid var(--border-muted)", marginTop: "10px" }}>
                      <p style={{ fontSize: "8px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                        CONTINENTAL GT SYNTH ACTIVE {!muted ? "(IDLING)" : "(MUTED)"}
                      </p>
                      <button 
                        className="engine-rev-btn"
                        onMouseEnter={() => triggerRev(true)}
                        onMouseLeave={() => triggerRev(false)}
                        onTouchStart={() => triggerRev(true)}
                        onTouchEnd={() => triggerRev(false)}
                      >
                        REV THROTTLE ✊
                      </button>
                    </div>
                  )}

                  {/* Inline specifications list */}
                  <div className="stat-row">
                    <Stat value={moto.specs.power} label="Max Power" />
                    <Stat value={moto.specs.torque} label="Peak Torque" />
                    <Stat value={moto.specs.weight} label="Dry Weight" />
                  </div>

                  {/* Inline Paint Swatches Configurator inside each section! */}
                  <div className="swatches" style={{ marginTop: "20px" }} role="group" aria-label={`Select finishes for ${moto.name}`}>
                    {moto.swatches.map((swatch) => (
                      <button
                        key={swatch.name}
                        className={currentSelectedColor.name === swatch.name ? "active" : ""}
                        onClick={() => handleSwatchSelection(moto.id, swatch)}
                        title={`Switch to ${swatch.name}`}
                      >
                        <i style={{ background: swatch.hex }} />
                        {swatch.name}
                      </button>
                    ))}
                  </div>

                  {/* Configurator preview image */}
                  <div className="studio-preview" style={{ marginTop: "15px" }}>
                    <img 
                      src={currentSelectedColor.image} 
                      alt={currentSelectedColor.name} 
                      className="active"
                      onClick={() => setLightboxImg({ path: currentSelectedColor.image, title: `${moto.name} — ${currentSelectedColor.name}`, desc: moto.description })}
                    />
                    <div className="studio-label">{currentSelectedColor.name} — Click to Zoom</div>
                  </div>

                  {/* Integrated Booking Shortcut CTA */}
                  <div style={{ marginTop: "15px" }}>
                    <button 
                      className="text-link"
                      onClick={() => triggerBookingShortcut(moto.id)}
                    >
                      ARRANGE CONCIERGE TEST RIDE <b>↗</b>
                    </button>
                  </div>
                </div>
                <div className="hero-index">{`${absoluteIndex < 10 ? "0" : ""}${absoluteIndex} / 12`}</div>
              </Section>
            );
          })}

          {/* Section 12: Customization Studio / 360 View */}
          <Section id="studio">
            <div className="section-copy left" style={{ maxWidth: "600px" }}>
              <RevealTitle eyebrow="12 / CONFIGURATOR">CUSTOM STUDIO</RevealTitle>
              <p className="body-copy">
                Click color swatches to adjust chrome overlays, paint finishes, and lighting tracks. Toggle **360 Inspect** to drag, orbit, and zoom the 3D retro cruiser model.
              </p>

              <button 
                className={`inspector-toggle-btn ${inspectMode ? "active" : ""}`}
                onClick={() => setInspectMode(!inspectMode)}
              >
                {inspectMode ? "✕ CLOSE 360° INSPECT" : "🗲 ACTIVATE 360° INSPECT"}
              </button>

              <div className="swatches" style={{ marginTop: "24px" }} role="group" aria-label="Select paint finishes">
                {CONFIGURATOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.name}
                    className={globalStudioColor.name === swatch.name ? "active" : ""}
                    onClick={() => setGlobalStudioColor(swatch)}
                  >
                    <i style={{ background: swatch.hex }} />
                    {swatch.name}
                  </button>
                ))}
              </div>

              <div className="studio-preview">
                <img 
                  src={globalStudioColor.image} 
                  alt={globalStudioColor.name} 
                  className="active"
                />
                <div className="studio-label">{globalStudioColor.name} — Premium Finish</div>
              </div>
            </div>
            <div className="hero-index">12 / 12</div>
          </Section>

          {/* Horizontal Gallery slider */}
          <div ref={galleryWrapRef} className="gallery-horizontal-section">
            <div className="gallery-sticky-wrap">
              <div style={{ padding: "0 8vw", marginBottom: "30px" }}>
                <RevealTitle eyebrow="FILM REEL / GALLERY">CINEMATIC FRAMEWORK</RevealTitle>
                <p className="body-copy" style={{ margin: "5px 0 0" }}>Scroll down to slide details horizontally.</p>
              </div>

              <div ref={galleryTrackRef} className="gallery-horizontal-track">
                {MOTORCYCLES.map((m, idx) => (
                  <div 
                    key={m.id} 
                    className="gallery-item"
                    onClick={() => setLightboxImg({ path: CONFIGURATOR_SWATCHES[idx % CONFIGURATOR_SWATCHES.length].image, title: m.name, desc: m.description })}
                  >
                    <img 
                      src={CONFIGURATOR_SWATCHES[idx % CONFIGURATOR_SWATCHES.length].image} 
                      alt={m.name} 
                    />
                    <div className="gallery-info">
                      <div>
                        <h4>{m.name}</h4>
                        <p>Mechanical Portrait</p>
                      </div>
                      <span className="gallery-zoom-icon">↗</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 13: Specifications & booking form */}
          <Section id="booking" className="spec-section">
            <div className="section-copy left" style={{ maxWidth: "520px", width: "100%" }}>
              <RevealTitle eyebrow="BOOKING / TEST RIDE">CONCIERGE SESSION</RevealTitle>
              <p className="body-copy">
                Arrange a personalized road test session with our certified motorcycle concierge specialists.
              </p>

              {bookingStatus === "SUCCESS" ? (
                <div 
                  className="p-6 rounded border border-gold"
                  style={{ background: "var(--bg-surface)", borderColor: "var(--color-gold)" }}
                  role="status"
                >
                  <h3 className="font-bold text-base mb-2 uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>Inquiry Logged</h3>
                  <p className="text-xs text-muted leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    An Enfield concierge specialist will contact you on your registered credentials within 24 hours. Get ready for the ride.
                  </p>
                </div>
              ) : (
                <form className="booking-form" onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label htmlFor="client-name">Full Name</label>
                    <input
                      id="client-name"
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Jonathan Harris"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="client-email">Email Address</label>
                    <input
                      id="client-email"
                      type="email"
                      className="form-input"
                      required
                      placeholder="e.g. jonathan@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="client-moto">Preferred Motorcycle</label>
                    <select 
                      id="client-moto" 
                      className="form-input"
                      value={preferredModel}
                      onChange={(e) => setPreferredModel(e.target.value)}
                    >
                      {MOTORCYCLES.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="book-button">
                    <span>ARRANGE ROAD TEST</span>
                    <b>↗</b>
                  </button>
                </form>
              )}
            </div>
            <div className="hero-index">12 / 12</div>
          </Section>

          {/* Minimalist Footer */}
          <footer className="w-full py-16 px-12 border-t" style={{ borderColor: "var(--border-muted)", background: "#050505", position: "relative", zIndex: 3 }}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h3 className="font-bold text-xs uppercase letter-spacing-2" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", fontSize: "14px", letterSpacing: "0.15em" }}>ROYAL ENFIELD</h3>
                <p className="text-xs text-muted mt-2" style={{ color: "var(--text-muted)", fontSize: "9px" }}>Since 1901. Built for the Road. Made in Steel.</p>
              </div>
              <div className="flex gap-8 text-xs font-mono text-muted" style={{ fontSize: "9px" }}>
                <a href="#hero" className="hover:text-gold transition" style={{ color: "var(--text-muted)" }}>HERITAGE</a>
                <a href="#studio" className="hover:text-gold transition" style={{ color: "var(--text-muted)" }}>STUDIO</a>
                <a href="#booking" className="hover:text-gold transition" style={{ color: "var(--text-muted)" }}>DEALERS</a>
                <p>© 2026 ROYAL ENFIELD INC.</p>
              </div>
            </div>
          </footer>

        </div>

        {/* Gallery Lightbox */}
        {lightboxImg && (
          <div 
            className="lightbox" 
            role="dialog" 
            aria-modal="true" 
            aria-label={`Expanded image of ${lightboxImg.title}`}
          >
            <div className="lightbox-content">
              <button 
                className="lightbox-close" 
                onClick={() => setLightboxImg(null)}
                aria-label="Close dialog"
              >
                ✕ CLOSE
              </button>
              <img src={lightboxImg.path} alt={lightboxImg.desc} />
              <div className="lightbox-caption">{lightboxImg.title} — {lightboxImg.desc}</div>
            </div>
          </div>
        )}

      </main>
    </SmoothScrollProvider>
  );
}

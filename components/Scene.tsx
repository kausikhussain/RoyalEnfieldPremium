"use client";

import { Environment, Float, Html, PerspectiveCamera, useProgress, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";
import { BikeModel } from "./BikeModel";

// Cinematic camera keyframes mapped across the 10 motorcycle chapters + Hero + Outro
const KEYFRAMES = [
  { p: 0.0,   pos: new THREE.Vector3(0.0, 0.4, 4.0),   lookAt: new THREE.Vector3(0.0, -0.05, 0) },   // 1. Hero Reveal
  { p: 0.08,  pos: new THREE.Vector3(-2.0, 0.22, 2.1), lookAt: new THREE.Vector3(-0.6, 0.1, 0) },    // 2. Classic 350 (Rear angle)
  { p: 0.16,  pos: new THREE.Vector3(0.85, 0.14, 1.3), lookAt: new THREE.Vector3(-0.04, 0.22, 0) },  // 3. Bullet 350 (Engine close)
  { p: 0.25,  pos: new THREE.Vector3(2.2, 0.42, 1.95), lookAt: new THREE.Vector3(0.3, 0.4, 0) },     // 4. Hunter 350 (Agile profile)
  { p: 0.34,  pos: new THREE.Vector3(-2.3, -0.04, 1.8),lookAt: new THREE.Vector3(-0.8, -0.1, 0) },   // 5. Meteor 350 (Cruising chassis)
  { p: 0.43,  pos: new THREE.Vector3(0.0, 0.35, 3.4),  lookAt: new THREE.Vector3(0.0, -0.05, 0) },   // 6. Continental GT 650 (Studio scale)
  { p: 0.52,  pos: new THREE.Vector3(0.65, 0.92, 1.15),lookAt: new THREE.Vector3(0.55, 0.62, 0) },   // 7. Interceptor 650 (Handlebar profile)
  { p: 0.61,  pos: new THREE.Vector3(-2.1, 0.42, 2.45),lookAt: new THREE.Vector3(-0.3, 0.15, 0) },   // 8. Super Meteor 650 (Cruiser wide)
  { p: 0.70,  pos: new THREE.Vector3(2.2, 0.08, 1.7),  lookAt: new THREE.Vector3(0.0, -0.1, 0) },    // 9. Shotgun 650
  { p: 0.78,  pos: new THREE.Vector3(-1.5, 0.35, 2.0), lookAt: new THREE.Vector3(0, 0.08, 0) },     // 10. Bear 650 (Trail scrambler)
  { p: 0.86,  pos: new THREE.Vector3(-1.8, 0.75, 2.7), lookAt: new THREE.Vector3(0.0, 0.0, 0) },     // 11. Himalayan 450 (High pass view)
  { p: 0.93,  pos: new THREE.Vector3(0.0, 0.45, 3.6),  lookAt: new THREE.Vector3(0.0, -0.05, 0) },   // 12. Studio Configurator / Gallery
  { p: 1.0,   pos: new THREE.Vector3(0.0, 0.55, 4.1),  lookAt: new THREE.Vector3(0.0, 0.05, 0) }     // 13. Booking Outro
];

function interpolateCamera(p: number, outPos: THREE.Vector3, outLookAt: THREE.Vector3) {
  const progress = Math.max(0, Math.min(1, p));
  let lower = KEYFRAMES[0];
  let upper = KEYFRAMES[KEYFRAMES.length - 1];

  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (progress >= KEYFRAMES[i].p && progress <= KEYFRAMES[i + 1].p) {
      lower = KEYFRAMES[i];
      upper = KEYFRAMES[i + 1];
      break;
    }
  }

  const range = upper.p - lower.p;
  const factor = range > 0 ? (progress - lower.p) / range : 0;

  outPos.lerpVectors(lower.pos, upper.pos, factor);
  outLookAt.lerpVectors(lower.lookAt, upper.lookAt, factor);
}

function CameraRig({ progress, inspectMode }: { progress: React.MutableRefObject<number>; inspectMode: boolean }) {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const currentPos = useMemo(() => new THREE.Vector3(0, 0.4, 4), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(0, -0.05, 0), []);
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    // If interactive 360 viewer is active, don't override camera updates
    if (inspectMode) return;
    if (!camera.current) return;
    
    const p = progress.current;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 700;
    
    interpolateCamera(p, targetPos, targetLookAt);
    
    if (isMobile) {
      targetPos.multiplyScalar(1.25);
    }

    // Dynamic pointer parallax drift
    const driftX = state.pointer.x * 0.16;
    const driftY = state.pointer.y * 0.12;
    targetPos.x += driftX;
    targetPos.y += driftY;

    const lerpFactor = 1 - Math.exp(-delta * 2.8);
    currentPos.lerp(targetPos, lerpFactor);
    currentLookAt.lerp(targetLookAt, lerpFactor);

    camera.current.position.copy(currentPos);
    camera.current.lookAt(currentLookAt);
  });

  return <PerspectiveCamera ref={camera} makeDefault fov={41} position={[0, 0.4, 4]} />;
}

function AssetLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="scene-loader">
        <span>IGNITING CORE</span>
        <i>
          <b style={{ width: `${progress}%` }} />
        </i>
      </div>
    </Html>
  );
}

function DustParticles({ count = 80 }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 6;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 3;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return temp;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= delta * 0.04;
      positions[i * 3 + 2] += delta * 0.02;
      
      if (positions[i * 3 + 1] < -1.5) {
        positions[i * 3 + 1] = 1.5;
        positions[i * 3] = (Math.random() - 0.5) * 6;
      }
      if (positions[i * 3 + 2] > 2.5) {
        positions[i * 3 + 2] = -2.5;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        color="#FFEBB0"
        transparent={true}
        opacity={0.32}
        depthWrite={false}
      />
    </points>
  );
}

function EnvironmentalTransitions({ progress, spotColor }: { progress: React.MutableRefObject<number>; spotColor: string }) {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const bgRef = useRef<THREE.Color>(null);
  const fogRef = useRef<THREE.Fog>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((_, delta) => {
    const p = progress.current;
    
    const targetFogColor = new THREE.Color("#0B0B0B");
    const targetLightColor = new THREE.Color("#FFFFFF");
    let targetIntensity = 3.5;
    
    // Golden hour warm light during Cruiser segments (around p=0.34 to 0.61)
    if (p > 0.30 && p < 0.65) {
      const factor = Math.sin(((p - 0.30) / 0.35) * Math.PI);
      targetFogColor.lerp(new THREE.Color("#1B140E"), factor * 0.95);
      targetLightColor.lerp(new THREE.Color("#FFAE5E"), factor);
      targetIntensity = THREE.MathUtils.lerp(3.5, 5.8, factor);
    }
    
    // Mountain fog mist atmosphere during Himalayan section (around p=0.86)
    if (p > 0.78 && p < 0.92) {
      const factor = Math.sin(((p - 0.78) / 0.14) * Math.PI);
      targetFogColor.lerp(new THREE.Color("#2E3338"), factor * 0.95);
      targetLightColor.lerp(new THREE.Color("#A8B5C0"), factor);
      targetIntensity = THREE.MathUtils.lerp(3.5, 1.8, factor);
    }

    const ease = 1 - Math.exp(-delta * 3.5);
    
    if (bgRef.current) {
      bgRef.current.lerp(targetFogColor, ease);
    }
    if (fogRef.current) {
      fogRef.current.color.lerp(targetFogColor, ease);
    }
    if (directionalLightRef.current) {
      directionalLightRef.current.color.lerp(targetLightColor, ease);
      directionalLightRef.current.intensity = THREE.MathUtils.lerp(
        directionalLightRef.current.intensity,
        targetIntensity,
        ease
      );
    }
    if (spotLightRef.current) {
      spotLightRef.current.color.lerp(new THREE.Color(spotColor), ease);
    }
  });

  return (
    <>
      <color ref={bgRef} attach="background" args={["#0B0B0B"]} />
      <fog ref={fogRef} attach="fog" args={["#0B0B0B", 4.2, 10.5]} />
      
      <ambientLight intensity={0.8} color="#F3EFE6" />
      <directionalLight 
        ref={directionalLightRef}
        position={[3, 4, 3]} 
        intensity={3.5} 
        color="#FFFFFF" 
      />
      <spotLight 
        ref={spotLightRef}
        position={[-3, 4, 1.5]} 
        intensity={600} 
        angle={0.65} 
        penumbra={0.9} 
        color={spotColor} 
      />
    </>
  );
}

export function Scene({ 
  progress, 
  color,
  inspectMode = false 
}: { 
  progress: React.MutableRefObject<number>; 
  color: string;
  inspectMode?: boolean;
}) {
  return (
    <div 
      className="scene-wrap" 
      style={{ 
        opacity: inspectMode ? 1 : 0.85,
        pointerEvents: inspectMode ? "auto" : "none" 
      }} 
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, typeof window !== "undefined" && window.innerWidth < 700 ? 1.3 : 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <EnvironmentalTransitions progress={progress} spotColor={color} />

        <CameraRig progress={progress} inspectMode={inspectMode} />
        
        <DustParticles count={90} />

        <Float speed={inspectMode ? 0 : 0.8} rotationIntensity={inspectMode ? 0 : 0.03} floatIntensity={inspectMode ? 0 : 0.08}>
          <Suspense fallback={<AssetLoader />}>
            <BikeModel progress={progress} color={color} />
          </Suspense>
        </Float>
        
        {inspectMode && (
          <OrbitControls 
            enableZoom={true} 
            minDistance={1.8} 
            maxDistance={5.2} 
            enablePan={false} 
            target={[0, 0.08, 0]} 
          />
        )}
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

"use client";

import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";

type BikeProps = { 
  progress: React.MutableRefObject<number>; 
  color: string; 
  modelId: string; 
};

// High-fidelity PBR Disc Brake with ventilated rotor details and red Brembo brake caliper
function DiscBrake({ isFront }: { isFront: boolean }) {
  return (
    <group position={[0, 0, 0.08]}>
      {/* Ventilated Rotor Plate */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[isFront ? 0.28 : 0.22, isFront ? 0.28 : 0.22, 0.012, 32]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.98} roughness={0.08} />
      </mesh>
      {/* Inner Hub Carrier */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[isFront ? 0.16 : 0.12, isFront ? 0.16 : 0.12, 0.015, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Brake Caliper (Brembo Red style) */}
      <mesh position={[0.2, 0.15, 0.02]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.08, 0.15, 0.04]} />
        <meshStandardMaterial color="#B0121A" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Caliper Mount Bracket */}
      <mesh position={[0.16, 0.1, 0.015]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.04, 0.08, 0.01]} />
        <meshStandardMaterial color="#1E1E1E" metalness={0.8} />
      </mesh>
    </group>
  );
}

// Detailed Wheel (Supports Cast Alloys or Chrome Wire-Spokes with PBR materials)
function Wheel({ 
  isFront, 
  isAlloy, 
  spinRef 
}: { 
  isFront: boolean; 
  isAlloy: boolean; 
  spinRef: React.RefObject<THREE.Group> 
}) {
  const spokes = useMemo(() => {
    const arr = [];
    const count = isAlloy ? 10 : 36; // 36-spoke high detail classic wheels
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const zOffset = isAlloy ? 0 : (i % 2 === 0 ? 0.055 : -0.055);
      arr.push({ angle, zOffset });
    }
    return arr;
  }, [isAlloy]);

  const spokesElements = useMemo(() => {
    return spokes.map((spoke, idx) => {
      const x2 = Math.cos(spoke.angle) * 0.65;
      const y2 = Math.sin(spoke.angle) * 0.65;
      if (isAlloy) {
        // Detailed split-spoke cast alloy wheels
        return (
          <group key={idx} rotation={[0, 0, spoke.angle]}>
            <mesh position={[0, 0.32, 0]}>
              <boxGeometry args={[0.035, 0.58, 0.025]} />
              <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.25} />
            </mesh>
            <mesh position={[0.02, 0.32, 0]}>
              <boxGeometry args={[0.01, 0.58, 0.01]} />
              <meshStandardMaterial color="#EAEAEA" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        );
      } else {
        // Double-crossed classic wire spokes
        const length = Math.sqrt(x2 * x2 + y2 * y2 + spoke.zOffset * spoke.zOffset);
        const dir = new THREE.Vector3(x2, y2, -spoke.zOffset).normalize();
        const alignRotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const euler = new THREE.Euler().setFromQuaternion(alignRotation);
        return (
          <mesh 
            key={idx} 
            position={[x2 / 2, y2 / 2, spoke.zOffset / 2]} 
            rotation={[euler.x, euler.y, euler.z]}
          >
            <cylinderGeometry args={[0.005, 0.005, length, 4]} />
            <meshStandardMaterial color="#F0F0F0" metalness={1.0} roughness={0.02} />
          </mesh>
        );
      }
    });
  }, [spokes, isAlloy]);

  return (
    <group ref={spinRef}>
      {/* Tire (Deep rubber black with sidewall rings) */}
      <mesh>
        <torusGeometry args={[0.7, 0.16, 16, 50]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.95} metalness={0.01} />
      </mesh>
      {/* Chrome Rim Profile */}
      <mesh>
        <torusGeometry args={[0.67, 0.03, 10, 50]} />
        <meshStandardMaterial color={isAlloy ? "#1E1E1E" : "#FFFFFF"} metalness={1.0} roughness={0.04} />
      </mesh>
      {/* Heavy central Wheel Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.2, 16]} />
        <meshStandardMaterial color={isAlloy ? "#151515" : "#E5E5E5"} metalness={0.95} roughness={0.12} />
      </mesh>
      
      {/* Brake setup */}
      <DiscBrake isFront={isFront} />
      
      {spokesElements}
    </group>
  );
}

// Coiled springs helper for dual shock absorbers
function ShockSpring({ 
  length = 0.5, 
  turns = 8, 
  radius = 0.045 
}: { 
  length?: number; 
  turns?: number; 
  radius?: number; 
}) {
  const segments = useMemo(() => {
    const arr = [];
    const step = length / (turns * 12);
    for (let i = 0; i <= turns * 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const y = (i * step) - (length / 2);
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      arr.push(new THREE.Vector3(x, y, z));
    }
    return arr;
  }, [length, turns, radius]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(segments), [segments]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 60, 0.012, 6, false]} />
      <meshStandardMaterial color="#FFFFFF" metalness={1.0} roughness={0.04} />
    </mesh>
  );
}

export function ProceduralBike({ progress, color, modelId }: BikeProps) {
  const group = useRef<THREE.Group>(null);
  const rearWheelSpin = useRef<THREE.Group>(null);
  const frontWheelSpin = useRef<THREE.Group>(null);
  const engineBlock = useRef<THREE.Group>(null);
  const exhaustSystem = useRef<THREE.Group>(null);

  // Configure styling layouts matching specific Royal Enfield variants
  const isCruiser = modelId === "supermeteor" || modelId === "meteor";
  const isCafeRacer = modelId === "gt";
  const isAdventure = modelId === "himalayan" || modelId === "bear";
  const isRoadster = modelId === "hunter";
  const isAlloyWheels = modelId === "hunter" || modelId === "shotgun";
  const isInterceptor = modelId === "interceptor";

  // Detailed Stance configurations
  const wheelBase = isCruiser ? 1.46 : (isRoadster ? 1.18 : 1.30);
  const rakeAngle = isCruiser ? -0.52 : (isCafeRacer ? -0.34 : -0.42);
  const suspensionHeight = isAdventure ? 0.16 : (isCruiser ? -0.06 : 0);
  const forkScaleY = isAdventure ? 1.25 : 1.0;

  const bikePosition = useMemo(() => [0, -0.9 + suspensionHeight, 0] as [number, number, number], [suspensionHeight]);

  useFrame((state, delta) => {
    const p = progress.current;
    
    // Slow auto-turntable spin when idle, accelerated by scroll progress
    if (group.current) {
      const autoSpin = state.clock.getElapsedTime() * 0.08;
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y, 
        autoSpin - 0.35 + p * Math.PI * 2.35, 
        3.5, 
        delta
      );
    }
    
    // Spin wheels on active scroll triggers
    const spinSpeed = p > 0.02 ? 0.28 : 0.02;
    if (rearWheelSpin.current) rearWheelSpin.current.rotation.z -= spinSpeed;
    if (frontWheelSpin.current) frontWheelSpin.current.rotation.z -= spinSpeed;

    // Simulate engine idle thrum using tiny high frequency vibrations
    if (engineBlock.current) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 14) * 0.004;
      engineBlock.current.position.y = pulse;
    }
  });

  // High-fidelity PBR paint finish with clear coat layers
  const paintMaterial = useMemo(() => (
    <meshPhysicalMaterial 
      color={color} 
      metalness={0.78} 
      roughness={0.1} 
      clearcoat={1.0} 
      clearcoatRoughness={0.08} 
    />
  ), [color]);

  // High-fidelity polished chrome material
  const chromeMaterial = useMemo(() => (
    <meshStandardMaterial 
      color="#FFFFFF" 
      metalness={1.0} 
      roughness={0.04} 
    />
  ), []);

  const exhaustCans = useMemo(() => {
    // 650 Twins (GT, Interceptor, Super Meteor) render dual sweeping chrome exhaust pipes
    if (isCafeRacer || isInterceptor || modelId === "supermeteor") {
      return (
        <>
          {/* Left Exhaust System */}
          <group>
            <mesh position={[0.2, 0.08, -0.16]} rotation={[0.3, 0, -0.3]}>
              <cylinderGeometry args={[0.03, 0.03, 0.55, 12]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
            <mesh position={[-wheelBase * 0.45, -0.06, -0.28]} rotation={[0.06, 0, 0.05 + Math.PI / 2]} scale={[1.3, 0.06, 0.06]}>
              <cylinderGeometry args={[1, 0.75, 0.8, 12]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
          </group>
          {/* Right Exhaust System */}
          <group>
            <mesh position={[0.2, 0.08, 0.16]} rotation={[-0.3, 0, -0.3]}>
              <cylinderGeometry args={[0.03, 0.03, 0.55, 12]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
            <mesh position={[-wheelBase * 0.45, -0.06, 0.28]} rotation={[-0.06, 0, 0.05 + Math.PI / 2]} scale={[1.3, 0.06, 0.06]}>
              <cylinderGeometry args={[1, 0.75, 0.8, 12]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
          </group>
        </>
      );
    }
    // Roadster (Hunter 350) renders a short sporty black upswept muffler
    if (isRoadster) {
      return (
        <group>
          <mesh position={[0.2, 0.08, 0.15]} rotation={[-0.2, 0, -0.3]}>
            <cylinderGeometry args={[0.032, 0.032, 0.5, 12]} />
            <meshStandardMaterial color="#252525" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-wheelBase * 0.2, -0.08, 0.22]} rotation={[-0.04, 0, 0.08 + Math.PI / 2]} scale={[0.85, 0.065, 0.065]}>
            <cylinderGeometry args={[1, 0.85, 0.7, 12]} />
            <meshStandardMaterial color="#1E1E1E" metalness={0.82} roughness={0.25} />
          </mesh>
        </group>
      );
    }
    // Adventure (Himalayan 450) renders high slung single pipe angled upward to traverse water crossings
    if (isAdventure) {
      return (
        <group>
          <mesh position={[0.2, 0.12, 0.14]} rotation={[-0.25, 0, -0.35]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
          <mesh position={[-wheelBase * 0.4, 0.28, 0.24]} rotation={[-0.1, 0, 0.25 + Math.PI / 2]} scale={[1.0, 0.075, 0.075]}>
            <cylinderGeometry args={[1, 0.82, 0.85, 12]} />
            <meshStandardMaterial color="#2A2A2A" metalness={0.9} roughness={0.18} />
          </mesh>
        </group>
      );
    }
    // Classic single exhaust low pipe layout (Classic & Bullet & Meteor)
    return (
      <group>
        <mesh position={[0.2, 0.08, 0.15]} rotation={[-0.3, 0, -0.3]}>
          <cylinderGeometry args={[0.03, 0.03, 0.55, 12]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>
        <mesh position={[-wheelBase * 0.45, -0.11, 0.26]} rotation={[0, 0, 0.03 + Math.PI / 2]} scale={[1.4, 0.055, 0.055]}>
          <cylinderGeometry args={[1, 0.72, 0.8, 12]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>
      </group>
    );
  }, [isCafeRacer, isInterceptor, modelId, isRoadster, isAdventure, wheelBase, chromeMaterial]);

  const seatMesh = useMemo(() => {
    // Café Racer hump seat
    if (isCafeRacer) {
      return (
        <>
          <mesh scale={[1.0, 0.13, 0.42]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#2E1B10" roughness={0.85} />
          </mesh>
          <mesh position={[-0.35, 0.08, 0]} scale={[0.42, 0.26, 0.38]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <primitive object={paintMaterial} attach="material" />
          </mesh>
        </>
      );
    }
    // Cruiser deep scoop saddle (Super Meteor & Meteor)
    if (isCruiser) {
      return (
        <>
          <mesh position={[-0.08, -0.06, 0]} scale={[1.1, 0.12, 0.45]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#1E1E1E" roughness={0.88} />
          </mesh>
          <mesh position={[-0.45, 0.05, 0]} scale={[0.55, 0.16, 0.36]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#1E1E1E" roughness={0.88} />
          </mesh>
        </>
      );
    }
    // Split Adventure seat (Himalayan)
    if (isAdventure) {
      return (
        <>
          <mesh position={[0.1, 0.02, 0]} scale={[0.7, 0.12, 0.42]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#111111" roughness={0.92} />
          </mesh>
          <mesh position={[-0.42, 0.14, 0]} scale={[0.55, 0.12, 0.35]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#111111" roughness={0.92} />
          </mesh>
        </>
      );
    }
    // Classic single seat with coil springs (Classic & Bullet & Interceptor)
    return (
      <group>
        <mesh scale={[1.1, 0.14, 0.44]}>
          <boxGeometry args={[0.82, 0.8, 0.9]} />
          <meshStandardMaterial color="#3A1C12" roughness={0.76} metalness={0.06} />
        </mesh>
        <mesh position={[-0.32, -0.15, 0.12]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color="#FFFFFF" metalness={1.0} />
        </mesh>
        <mesh position={[-0.32, -0.15, -0.12]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color="#FFFFFF" metalness={1.0} />
        </mesh>
      </group>
    );
  }, [isCafeRacer, isCruiser, isAdventure, paintMaterial]);

  return (
    <group ref={group} scale={1.22} position={bikePosition}>
      
      {/* Front Wheel */}
      <group position={[wheelBase, -0.15, 0]}>
        <Wheel isFront={true} isAlloy={isAlloyWheels} spinRef={frontWheelSpin} />
      </group>

      {/* Rear Wheel */}
      <group position={[-wheelBase, -0.15, 0]}>
        <Wheel isFront={false} isAlloy={isAlloyWheels} spinRef={rearWheelSpin} />
      </group>

      {/* Chassis - Steel Down Tubes */}
      <group>
        <mesh position={[-0.2, 0.22, 0.1]} rotation={[0, 0, -0.28]}>
          <cylinderGeometry args={[0.03, 0.03, 1.35, 8]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[-0.2, 0.22, -0.1]} rotation={[0, 0, -0.28]}>
          <cylinderGeometry args={[0.03, 0.03, 1.35, 8]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.35} />
        </mesh>
        {/* Swingarm */}
        <mesh position={[-wheelBase * 0.55, -0.1, 0.12]} rotation={[0, 0, 0.06]} scale={[1, 1, 0.2]}>
          <boxGeometry args={[wheelBase * 0.9, 0.06, 0.1]} />
          <meshStandardMaterial color="#111111" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[-wheelBase * 0.55, -0.1, -0.12]} rotation={[0, 0, 0.06]} scale={[1, 1, 0.2]}>
          <boxGeometry args={[wheelBase * 0.9, 0.06, 0.1]} />
          <meshStandardMaterial color="#111111" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* Front Forks & Steering Setup */}
      <group position={[wheelBase, -0.15, 0]} rotation={[0, 0, rakeAngle]}>
        <group position={[0, 0.75 * forkScaleY, 0]}>
          {/* Fork Tubes */}
          <mesh position={[0, 0, 0.13]}>
            <cylinderGeometry args={[0.03, 0.03, 1.35 * forkScaleY, 12]} />
            <meshStandardMaterial color={isAdventure ? "#202020" : "#F0F0F0"} metalness={0.96} roughness={0.05} />
          </mesh>
          <mesh position={[0, 0, -0.13]}>
            <cylinderGeometry args={[0.03, 0.03, 1.35 * forkScaleY, 12]} />
            <meshStandardMaterial color={isAdventure ? "#202020" : "#F0F0F0"} metalness={0.96} roughness={0.05} />
          </mesh>
          
          {/* Handlebars */}
          <group position={[0, 0.65 * forkScaleY, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, isCruiser || isInterceptor ? 0.88 : 0.72, 10]} />
              <primitive object={chromeMaterial} attach="material" />
            </mesh>
            {/* Grips */}
            <mesh position={[0, 0, isCruiser || isInterceptor ? 0.42 : 0.34]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.12, 10]} />
              <meshStandardMaterial color="#111111" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0, isCruiser || isInterceptor ? -0.42 : -0.34]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.12, 10]} />
              <meshStandardMaterial color="#111111" roughness={0.85} />
            </mesh>
            
            {/* Bar-End Round Mirrors for Café Racer */}
            {isCafeRacer && (
              <>
                <mesh position={[0, 0, 0.36]} rotation={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
                  <primitive object={chromeMaterial} attach="material" />
                </mesh>
                <mesh position={[0, -0.06, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.065, 0.065, 0.01, 16]} />
                  <meshStandardMaterial color="#202020" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0, -0.36]} rotation={[0, -0.3, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
                  <primitive object={chromeMaterial} attach="material" />
                </mesh>
                <mesh position={[0, -0.06, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.065, 0.065, 0.01, 16]} />
                  <meshStandardMaterial color="#202020" metalness={0.8} />
                </mesh>
              </>
            )}
            
            {/* Speedometer Cluster */}
            <mesh position={[0.05, 0.06, 0]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>

          {/* Retro Round Headlight */}
          <group position={[0.13, 0.42 * forkScaleY, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.16, 20]} />
              <meshStandardMaterial color="#1C1C1C" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.081, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.01, 20]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#FFECD1" emissiveIntensity={1.8} roughness={0.01} />
            </mesh>
            <spotLight position={[0.1, 0, 0]} angle={0.4} intensity={700} color="#FFECD1" />
          </group>

          {/* Himalayan High Beak Fender */}
          {isAdventure && (
            <mesh position={[0.26, 0.28, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[0.42, 0.04, 0.18]} />
              <primitive object={paintMaterial} attach="material" />
            </mesh>
          )}
        </group>
      </group>

      {/* Fuel Tank (Adapts shape to Cafe Racer / Roadster / Cruiser) */}
      <group position={[isCruiser ? -0.1 : 0.12, 0.72, 0]}>
        <mesh scale={isCafeRacer ? [1.58, 0.78, 0.7] : (isCruiser ? [1.38, 0.88, 0.85] : [1.4, 0.82, 0.75])}>
          <sphereGeometry args={[0.36, 32, 24]} />
          <primitive object={paintMaterial} attach="material" />
        </mesh>
        
        {/* Chrome fuel filler cap */}
        <mesh position={[0.1, 0.3, 0]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <primitive object={chromeMaterial} attach="material" />
        </mesh>

        {/* Tank Crash Guard frames for Adventure */}
        {isAdventure && (
          <group position={[0.05, -0.1, 0]}>
            <mesh rotation={[0, 0.2, 0.5]} position={[0, 0, 0.38]}>
              <torusGeometry args={[0.28, 0.018, 8, 20, Math.PI * 1.2]} />
              <meshStandardMaterial color="#1C1C1C" metalness={0.8} />
            </mesh>
            <mesh rotation={[0, -0.2, 0.5]} position={[0, 0, -0.38]}>
              <torusGeometry args={[0.28, 0.018, 8, 20, Math.PI * 1.2]} />
              <meshStandardMaterial color="#1C1C1C" metalness={0.8} />
            </mesh>
          </group>
        )}
      </group>

      {/* Heavy Parallel-Twin Engine block */}
      <group ref={engineBlock} position={[-0.05, 0.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.44, 16]} />
          <meshStandardMaterial color="#353535" metalness={0.88} roughness={0.18} />
        </mesh>
        
        {/* Royal Enfield gold emblem badge */}
        <mesh position={[0, 0.02, 0.225]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.015, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.12} />
        </mesh>

        {/* Detailed Cylinder Cooling Fins */}
        <group position={[0.06, 0.22, 0]}>
          {Array.from({ length: 9 }).map((_, idx) => (
            <mesh key={`fin-${idx}`} position={[0, idx * 0.038 - 0.1, 0]}>
              <boxGeometry args={[0.25, 0.014, 0.36]} />
              <meshStandardMaterial color="#222222" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.27, 0.05, 0.38]} />
            <meshStandardMaterial color="#A5A5A5" metalness={0.95} roughness={0.12} />
          </mesh>
        </group>
      </group>

      {/* Exhaust Pipes */}
      <group ref={exhaustSystem}>
        {exhaustCans}
      </group>

      {/* Seat Setup */}
      <group position={[-wheelBase * 0.38, 0.65, 0]}>
        {seatMesh}
      </group>

      {/* Fenders (Color-Matched Paint Mudguards) */}
      <group>
        <mesh position={[-wheelBase * 0.76, 0.32, 0]} rotation={[0, 0, 0.48]}>
          <torusGeometry args={[0.66, isAdventure ? 0.045 : 0.065, 8, 20, Math.PI / 1.7]} />
          <primitive object={paintMaterial} attach="material" />
        </mesh>
        <mesh position={[wheelBase * 0.93, 0.3, 0]} rotation={[0, 0, -0.78]}>
          <torusGeometry args={[0.66, isAdventure ? 0.042 : 0.056, 8, 16, Math.PI / 2.2]} />
          <primitive object={paintMaterial} attach="material" />
        </mesh>
      </group>

      {/* Dual Shock Absorbers with Springs */}
      <group>
        <group position={[-wheelBase * 0.7, 0.22, 0.16]} rotation={[0, 0, -0.4]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.4, 10]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
          <group position={[0, -0.1, 0]}>
            <ShockSpring length={0.32} turns={7} radius={0.038} />
          </group>
        </group>
        <group position={[-wheelBase * 0.7, 0.22, -0.16]} rotation={[0, 0, -0.4]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.4, 10]} />
            <primitive object={chromeMaterial} attach="material" />
          </mesh>
          <group position={[0, -0.1, 0]}>
            <ShockSpring length={0.32} turns={7} radius={0.038} />
          </group>
        </group>
      </group>

      {/* Ambient Floor Shadow */}
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[wheelBase * 2.3, 1.2]} />
        <meshBasicMaterial color="#010101" opacity={0.65} transparent={true} />
      </mesh>

    </group>
  );
}

export function BikeModel({ progress, color, modelId }: BikeProps) {
  return <ProceduralBike progress={progress} color={color} modelId={modelId} />;
}

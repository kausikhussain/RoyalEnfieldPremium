"use client";

import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";

type BikeProps = { 
  progress: React.MutableRefObject<number>; 
  color: string; 
  modelId: string; 
};

// Helper component for wheel rendering (supports wire-spoked or cast alloy designs)
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
    const count = isAlloy ? 8 : 28;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const zOffset = isAlloy ? 0 : (i % 2 === 0 ? 0.05 : -0.05);
      arr.push({ angle, zOffset });
    }
    return arr;
  }, [isAlloy]);

  const spokesElements = useMemo(() => {
    return spokes.map((spoke, idx) => {
      const x2 = Math.cos(spoke.angle) * 0.65;
      const y2 = Math.sin(spoke.angle) * 0.65;
      if (isAlloy) {
        return (
          <mesh 
            key={idx} 
            position={[x2 / 2, y2 / 2, 0]} 
            rotation={[0, 0, spoke.angle]}
          >
            <boxGeometry args={[0.04, 0.65, 0.03]} />
            <meshStandardMaterial color="#1E1E1E" metalness={0.8} roughness={0.3} />
          </mesh>
        );
      } else {
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
            <cylinderGeometry args={[0.006, 0.006, length, 4]} />
            <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.02} />
          </mesh>
        );
      }
    });
  }, [spokes, isAlloy]);

  return (
    <group ref={spinRef}>
      {/* Tire */}
      <mesh>
        <torusGeometry args={[0.7, 0.16, 16, 40]} />
        <meshStandardMaterial color="#0B0B0B" roughness={0.92} metalness={0.02} />
      </mesh>
      {/* Rim */}
      <mesh>
        <torusGeometry args={[0.67, 0.03, 8, 40]} />
        <meshStandardMaterial color={isAlloy ? "#151515" : "#E0E0E0"} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Wheel Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.18, 16]} />
        <meshStandardMaterial color={isAlloy ? "#1A1A1A" : "#B5B5B5"} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Brake Disc */}
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[isFront ? 0.28 : 0.22, isFront ? 0.28 : 0.22, 0.012, 24]} />
        <meshStandardMaterial color="#A5A5A5" metalness={0.95} roughness={0.15} />
      </mesh>
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
      <meshStandardMaterial color="#D5D5D5" metalness={0.95} roughness={0.1} />
    </mesh>
  );
}

export function ProceduralBike({ progress, color, modelId }: BikeProps) {
  const group = useRef<THREE.Group>(null);
  const rearWheelSpin = useRef<THREE.Group>(null);
  const frontWheelSpin = useRef<THREE.Group>(null);
  const engineBlock = useRef<THREE.Group>(null);
  const exhaustSystem = useRef<THREE.Group>(null);

  // Determine structural configurations based on active model layout styling
  const isCruiser = modelId === "supermeteor" || modelId === "meteor";
  const isCafeRacer = modelId === "gt";
  const isAdventure = modelId === "himalayan" || modelId === "bear";
  const isRoadster = modelId === "hunter";
  const isAlloyWheels = modelId === "hunter" || modelId === "shotgun";

  // Stance metrics
  const wheelBase = isCruiser ? 1.48 : (isRoadster ? 1.16 : 1.28);
  const rakeAngle = isCruiser ? -0.52 : (isCafeRacer ? -0.35 : -0.42);
  const suspensionHeight = isAdventure ? 0.15 : (isCruiser ? -0.08 : 0);
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

    // Pulse engine components dynamically to simulate running mechanics
    if (engineBlock.current) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 12) * 0.005;
      engineBlock.current.position.y = pulse;
    }
  });

  const exhaustCans = useMemo(() => {
    if (isCafeRacer || isCruiser) {
      return (
        <>
          <group>
            <mesh position={[0.2, 0.08, -0.16]} rotation={[0.3, 0, -0.3]}>
              <cylinderGeometry args={[0.03, 0.03, 0.55, 12]} />
              <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.04} />
            </mesh>
            <mesh position={[-wheelBase * 0.45, -0.06, -0.28]} rotation={[0.06, 0, 0.05 + Math.PI / 2]} scale={[1.3, 0.06, 0.06]}>
              <cylinderGeometry args={[1, 0.7, 0.8, 12]} />
              <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.04} />
            </mesh>
          </group>
          <group>
            <mesh position={[0.2, 0.08, 0.16]} rotation={[-0.3, 0, -0.3]}>
              <cylinderGeometry args={[0.03, 0.03, 0.55, 12]} />
              <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.04} />
            </mesh>
            <mesh position={[-wheelBase * 0.45, -0.06, 0.28]} rotation={[-0.06, 0, 0.05 + Math.PI / 2]} scale={[1.3, 0.06, 0.06]}>
              <cylinderGeometry args={[1, 0.7, 0.8, 12]} />
              <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.04} />
            </mesh>
          </group>
        </>
      );
    }
    if (isRoadster) {
      return (
        <group>
          <mesh position={[0.2, 0.08, 0.15]} rotation={[-0.2, 0, -0.3]}>
            <cylinderGeometry args={[0.032, 0.032, 0.5, 12]} />
            <meshStandardMaterial color="#2E2E2E" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-wheelBase * 0.2, -0.08, 0.22]} rotation={[-0.04, 0, 0.08 + Math.PI / 2]} scale={[0.85, 0.065, 0.065]}>
            <cylinderGeometry args={[1, 0.85, 0.7, 12]} />
            <meshStandardMaterial color="#252525" metalness={0.82} roughness={0.35} />
          </mesh>
        </group>
      );
    }
    if (isAdventure) {
      return (
        <group>
          <mesh position={[0.2, 0.12, 0.14]} rotation={[-0.25, 0, -0.35]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
            <meshStandardMaterial color="#D0D0D0" metalness={0.95} />
          </mesh>
          <mesh position={[-wheelBase * 0.4, 0.28, 0.24]} rotation={[-0.1, 0, 0.25 + Math.PI / 2]} scale={[1.0, 0.07, 0.07]}>
            <cylinderGeometry args={[1, 0.8, 0.85, 12]} />
            <meshStandardMaterial color="#2D2D2D" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      );
    }
    return (
      <group>
        <mesh position={[0.2, 0.08, 0.15]} rotation={[-0.3, 0, -0.3]}>
          <cylinderGeometry args={[0.03, 0.03, 0.55, 12]} />
          <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.04} />
        </mesh>
        <mesh position={[-wheelBase * 0.45, -0.11, 0.26]} rotation={[0, 0, 0.03 + Math.PI / 2]} scale={[1.4, 0.055, 0.055]}>
          <cylinderGeometry args={[1, 0.72, 0.8, 12]} />
          <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.04} />
        </mesh>
      </group>
    );
  }, [isCafeRacer, isCruiser, isRoadster, isAdventure, wheelBase]);

  const seatMesh = useMemo(() => {
    if (isCafeRacer) {
      return (
        <>
          <mesh scale={[1.0, 0.13, 0.42]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#2A1B14" roughness={0.8} />
          </mesh>
          <mesh position={[-0.35, 0.08, 0]} scale={[0.42, 0.26, 0.38]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.1} />
          </mesh>
        </>
      );
    }
    if (isCruiser) {
      return (
        <>
          <mesh position={[-0.1, -0.06, 0]} scale={[1.1, 0.12, 0.45]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#1E1E1E" roughness={0.85} />
          </mesh>
          <mesh position={[-0.45, 0.05, 0]} scale={[0.55, 0.16, 0.36]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#1E1E1E" roughness={0.85} />
          </mesh>
        </>
      );
    }
    if (isAdventure) {
      return (
        <>
          <mesh position={[0.1, 0.02, 0]} scale={[0.7, 0.12, 0.42]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#151515" roughness={0.9} />
          </mesh>
          <mesh position={[-0.42, 0.14, 0]} scale={[0.55, 0.12, 0.35]}>
            <boxGeometry args={[0.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#151515" roughness={0.9} />
          </mesh>
        </>
      );
    }
    return (
      <mesh scale={[1.1, 0.14, 0.44]}>
        <boxGeometry args={[0.82, 0.8, 0.9]} />
        <meshStandardMaterial color="#422214" roughness={0.76} metalness={0.06} />
      </mesh>
    );
  }, [isCafeRacer, isCruiser, isAdventure, color]);

  return (
    <group ref={group} scale={1.22} position={bikePosition}>
      
      {/* Front Wheel Assembly */}
      <group position={[wheelBase, -0.15, 0]}>
        <Wheel isFront={true} isAlloy={isAlloyWheels} spinRef={frontWheelSpin} />
      </group>

      {/* Rear Wheel Assembly */}
      <group position={[-wheelBase, -0.15, 0]}>
        <Wheel isFront={false} isAlloy={isAlloyWheels} spinRef={rearWheelSpin} />
      </group>

      {/* Steel Cradle Frame */}
      <group>
        <mesh position={[-0.2, 0.22, 0.1]} rotation={[0, 0, -0.28]}>
          <cylinderGeometry args={[0.03, 0.03, 1.35, 8]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[-0.2, 0.22, -0.1]} rotation={[0, 0, -0.28]}>
          <cylinderGeometry args={[0.03, 0.03, 1.35, 8]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.35} />
        </mesh>
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
          <mesh position={[0, 0, 0.13]}>
            <cylinderGeometry args={[0.03, 0.03, 1.35 * forkScaleY, 12]} />
            <meshStandardMaterial color={isAdventure ? "#252525" : "#E5E5E5"} metalness={0.96} roughness={0.06} />
          </mesh>
          <mesh position={[0, 0, -0.13]}>
            <cylinderGeometry args={[0.03, 0.03, 1.35 * forkScaleY, 12]} />
            <meshStandardMaterial color={isAdventure ? "#252525" : "#E5E5E5"} metalness={0.96} roughness={0.06} />
          </mesh>
          
          {/* Handlebars */}
          <group position={[0, 0.65 * forkScaleY, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, isCruiser ? 0.88 : 0.72, 10]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.98} roughness={0.04} />
            </mesh>
            <mesh position={[0, 0, isCruiser ? 0.42 : 0.34]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.12, 10]} />
              <meshStandardMaterial color="#1B1B1B" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, isCruiser ? -0.42 : -0.34]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.12, 10]} />
              <meshStandardMaterial color="#1B1B1B" roughness={0.8} />
            </mesh>
            {isCafeRacer && (
              <>
                <mesh position={[0, 0, 0.36]} rotation={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
                  <meshStandardMaterial color="#CCCCCC" metalness={0.95} />
                </mesh>
                <mesh position={[0, -0.06, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
                  <meshStandardMaterial color="#2E2E2E" metalness={0.9} />
                </mesh>
                <mesh position={[0, 0, -0.36]} rotation={[0, -0.3, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
                  <meshStandardMaterial color="#CCCCCC" metalness={0.95} />
                </mesh>
                <mesh position={[0, -0.06, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
                  <meshStandardMaterial color="#2E2E2E" metalness={0.9} />
                </mesh>
              </>
            )}
            <mesh position={[0.05, 0.06, 0]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshStandardMaterial color="#1C1C1C" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>

          {/* Round Retro Headlamp */}
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

          {/* Himalayan Beak Fender */}
          {isAdventure && (
            <mesh position={[0.26, 0.28, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[0.42, 0.04, 0.18]} />
              <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
            </mesh>
          )}
        </group>
      </group>

      {/* Fuel Tank Configuration */}
      <group position={[isCruiser ? -0.1 : 0.12, 0.72, 0]}>
        <mesh scale={isCafeRacer ? [1.58, 0.78, 0.7] : (isCruiser ? [1.38, 0.88, 0.85] : [1.4, 0.82, 0.75])}>
          <sphereGeometry args={[0.36, 32, 24]} />
          <meshStandardMaterial color={color} metalness={0.82} roughness={0.08} />
        </mesh>
        <mesh position={[0.1, 0.3, 0]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.96} roughness={0.04} />
        </mesh>
        {isAdventure && (
          <group position={[0.05, -0.1, 0]}>
            <mesh rotation={[0, 0.2, 0.5]} position={[0, 0, 0.38]}>
              <torusGeometry args={[0.28, 0.018, 8, 20, Math.PI * 1.2]} />
              <meshStandardMaterial color="#1E1E1E" metalness={0.8} />
            </mesh>
            <mesh rotation={[0, -0.2, 0.5]} position={[0, 0, -0.38]}>
              <torusGeometry args={[0.28, 0.018, 8, 20, Math.PI * 1.2]} />
              <meshStandardMaterial color="#1E1E1E" metalness={0.8} />
            </mesh>
          </group>
        )}
      </group>

      {/* Retro Parallel-Twin Engine Core */}
      <group ref={engineBlock} position={[-0.05, 0.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.44, 16]} />
          <meshStandardMaterial color="#3A3A3A" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.02, 0.225]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.01, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.9} roughness={0.12} />
        </mesh>
        <group position={[0.06, 0.22, 0]}>
          {Array.from({ length: 9 }).map((_, idx) => (
            <mesh key={`fin-${idx}`} position={[0, idx * 0.038 - 0.1, 0]}>
              <boxGeometry args={[0.25, 0.014, 0.36]} />
              <meshStandardMaterial color="#262626" metalness={0.82} roughness={0.25} />
            </mesh>
          ))}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.27, 0.05, 0.38]} />
            <meshStandardMaterial color="#A0A0A0" metalness={0.95} roughness={0.12} />
          </mesh>
        </group>
      </group>

      {/* Exhaust System */}
      <group ref={exhaustSystem}>
        {exhaustCans}
      </group>

      {/* Tailored Seat Configuration */}
      <group position={[-wheelBase * 0.38, 0.65, 0]}>
        {seatMesh}
      </group>

      {/* Classic / Sporty Mudguards */}
      <group>
        <mesh position={[-wheelBase * 0.76, 0.32, 0]} rotation={[0, 0, 0.48]}>
          <torusGeometry args={[0.66, isAdventure ? 0.045 : 0.065, 8, 20, Math.PI / 1.7]} />
          <meshStandardMaterial color={color} metalness={0.82} roughness={0.12} />
        </mesh>
        <mesh position={[wheelBase * 0.93, 0.3, 0]} rotation={[0, 0, -0.78]}>
          <torusGeometry args={[0.66, isAdventure ? 0.042 : 0.056, 8, 16, Math.PI / 2.2]} />
          <meshStandardMaterial color={color} metalness={0.82} roughness={0.12} />
        </mesh>
      </group>

      {/* Rear Shock Springs Setup */}
      <group>
        <group position={[-wheelBase * 0.7, 0.22, 0.16]} rotation={[0, 0, -0.4]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.4, 10]} />
            <meshStandardMaterial color="#D0D0D0" metalness={0.9} />
          </mesh>
          <group position={[0, -0.1, 0]}>
            <ShockSpring length={0.32} turns={7} radius={0.038} />
          </group>
        </group>
        <group position={[-wheelBase * 0.7, 0.22, -0.16]} rotation={[0, 0, -0.4]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.4, 10]} />
            <meshStandardMaterial color="#D0D0D0" metalness={0.9} />
          </mesh>
          <group position={[0, -0.1, 0]}>
            <ShockSpring length={0.32} turns={7} radius={0.038} />
          </group>
        </group>
      </group>

      {/* Floor Shadows */}
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

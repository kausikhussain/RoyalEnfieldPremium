"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

type BikeProps = { progress: React.MutableRefObject<number>; color: string };

// Helper component for retro wire-spoked wheels
function SpokedWheel({ isFront, spinRef }: { isFront: boolean; spinRef: React.RefObject<THREE.Group> }) {
  // Generate spoke angles and geometries
  const spokes = useMemo(() => {
    const arr = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      // Alternate spoke directions for realistic look
      const zOffset = i % 2 === 0 ? 0.06 : -0.06;
      arr.push({ angle, zOffset });
    }
    return arr;
  }, []);

  return (
    <group ref={spinRef}>
      {/* Tire */}
      <mesh>
        <torusGeometry args={[0.7, 0.16, 16, 40]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.88} metalness={0.05} />
      </mesh>
      {/* Rim */}
      <mesh>
        <torusGeometry args={[0.67, 0.03, 8, 40]} />
        <meshStandardMaterial color="#D0D0D0" metalness={0.95} roughness={0.08} />
      </mesh>
      {/* Wheel Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.18, 16]} />
        <meshStandardMaterial color="#B0B0B0" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Brake Disc (larger on front wheel) */}
      <mesh position={[0, 0, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[isFront ? 0.28 : 0.22, isFront ? 0.28 : 0.22, 0.015, 24]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Wire Spokes */}
      {spokes.map((spoke, idx) => {
        const x2 = Math.cos(spoke.angle) * 0.66;
        const y2 = Math.sin(spoke.angle) * 0.66;
        const length = Math.sqrt(x2 * x2 + y2 * y2 + spoke.zOffset * spoke.zOffset);
        
        // Calculate rotation to point from hub (0,0,zOffset) to rim (x2,y2,0)
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
            <meshStandardMaterial color="#E0E0E0" metalness={0.98} roughness={0.05} />
          </mesh>
        );
      })}
    </group>
  );
}

// Coiled springs helper for dual shock absorbers
function ShockSpring({ length = 0.5, turns = 8, radius = 0.045 }) {
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
      <meshStandardMaterial color="#CCCCCC" metalness={0.95} roughness={0.1} />
    </mesh>
  );
}

export function ProceduralBike({ progress, color }: BikeProps) {
  const group = useRef<THREE.Group>(null);
  const rearWheelSpin = useRef<THREE.Group>(null);
  const frontWheelSpin = useRef<THREE.Group>(null);
  
  // Ref for engine component explosion effect
  const leftEngineBlock = useRef<THREE.Group>(null);
  const rightEngineBlock = useRef<THREE.Group>(null);
  const exhaustSystem = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const p = progress.current;
    
    // Smooth turntable rotation based on scroll progress
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -.35 + p * Math.PI * 2.35, 3.6, delta);
    }
    
    // Rotate wheels while riding or scrolling
    const spinSpeed = p > 0.45 && p < 0.65 ? 0.35 : 0.04;
    if (rearWheelSpin.current) rearWheelSpin.current.rotation.z -= spinSpeed;
    if (frontWheelSpin.current) frontWheelSpin.current.rotation.z -= spinSpeed;

    // Explode components in Engine (around p=0.2 to 0.35) and customization (around p=0.5)
    // We animate displacement along X-axis
    const engineExplode = p > 0.18 && p < 0.42 ? Math.sin(((p - 0.18) / 0.24) * Math.PI) * 0.48 : 0;
    
    if (leftEngineBlock.current) {
      leftEngineBlock.current.position.z = THREE.MathUtils.damp(leftEngineBlock.current.position.z, -engineExplode, 5, delta);
    }
    if (rightEngineBlock.current) {
      rightEngineBlock.current.position.z = THREE.MathUtils.damp(rightEngineBlock.current.position.z, engineExplode, 5, delta);
    }
    if (exhaustSystem.current) {
      exhaustSystem.current.position.y = THREE.MathUtils.damp(exhaustSystem.current.position.y, -engineExplode * 0.2, 5, delta);
    }
  });

  return (
    <group ref={group} scale={1.22} position={[0, -0.9, 0]} rotation={[0, -0.35, 0]}>
      {/* Front Wheel */}
      <group position={[1.25, -0.15, 0]}>
        <SpokedWheel isFront={true} spinRef={frontWheelSpin} />
      </group>

      {/* Rear Wheel */}
      <group position={[-1.25, -0.15, 0]}>
        <SpokedWheel isFront={false} spinRef={rearWheelSpin} />
      </group>

      {/* Retro Dual Cradle Frame (Steel Tubing) */}
      <group>
        {/* Main Down Tubes */}
        <mesh position={[-0.2, 0.2, 0.12]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
          <meshStandardMaterial color="#1E1E1E" metalness={0.75} roughness={0.35} />
        </mesh>
        <mesh position={[-0.2, 0.2, -0.12]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
          <meshStandardMaterial color="#1E1E1E" metalness={0.75} roughness={0.35} />
        </mesh>
        {/* Back Swingarm Pivot tubes */}
        <mesh position={[-0.8, 0.1, 0.15]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
          <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[-0.8, 0.1, -0.15]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
          <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Rear Swingarm */}
        <mesh position={[-0.7, -0.1, 0.12]} rotation={[0, 0, 0.08]} scale={[1, 1, 0.2]}>
          <boxGeometry args={[1.0, 0.06, 0.1]} />
          <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.7, -0.1, -0.12]} rotation={[0, 0, 0.08]} scale={[1, 1, 0.2]}>
          <boxGeometry args={[1.0, 0.06, 0.1]} />
          <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Front Telescopic Forks & Triple Tree */}
      <group position={[1.25, -0.15, 0]}>
        {/* Fork Stanchions */}
        <group position={[-0.45, 0.72, 0]} rotation={[0, 0, -0.42]}>
          {/* Left fork */}
          <mesh position={[0, 0, 0.14]}>
            <cylinderGeometry args={[0.032, 0.032, 1.35, 12]} />
            <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.06} />
          </mesh>
          {/* Right fork */}
          <mesh position={[0, 0, -0.14]}>
            <cylinderGeometry args={[0.032, 0.032, 1.35, 12]} />
            <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.06} />
          </mesh>
          {/* Handlebars */}
          <group position={[0, 0.68, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.75, 10]} />
              <meshStandardMaterial color="#D8D8D8" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Grips */}
            <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.13, 10]} />
              <meshStandardMaterial color="#2B1911" roughness={0.75} />
            </mesh>
            <mesh position={[0, 0, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.13, 10]} />
              <meshStandardMaterial color="#2B1911" roughness={0.75} />
            </mesh>
            {/* Round Analog Speedo Console */}
            <mesh position={[0.06, 0.05, 0.0]} rotation={[0.4 + Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.07, 16]} />
              <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0.06, 0.086, 0.0]} rotation={[0.4 + Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.005, 16]} />
              <meshStandardMaterial color="#D0D0D0" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
          {/* Vintage Round Headlight */}
          <group position={[0.14, 0.45, 0]}>
            {/* Chrome Bucket */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.18, 20]} />
              <meshStandardMaterial color="#CCCCCC" metalness={0.98} roughness={0.05} />
            </mesh>
            {/* Glowing Lens */}
            <mesh position={[0.091, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.015, 20]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#FFE8AC" emissiveIntensity={2.5} roughness={0.02} />
            </mesh>
            {/* Directional light radiating from headlight */}
            <spotLight position={[0.12, 0, 0]} angle={0.42} penumbra={0.65} intensity={800} distance={15} color="#FFE8AC" />
          </group>
        </group>
      </group>

      {/* Classic Teardrop Fuel Tank */}
      <group position={[0.14, 0.78, 0]}>
        <mesh scale={[1.45, 0.85, 0.78]}>
          <sphereGeometry args={[0.36, 32, 24]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.12} />
        </mesh>
        {/* Chrome center pinstripe strip */}
        <mesh position={[0, 0.3, 0]} scale={[1.3, 0.02, 0.05]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.95} roughness={0.08} />
        </mesh>
        {/* Emblem Badge plate */}
        <mesh position={[0, 0.05, 0.38]} scale={[0.12, 0.08, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#C5A059" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.05, -0.38]} scale={[0.12, 0.08, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#C5A059" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* Retro Parallel-Twin Engine block */}
      <group position={[-0.04, 0.22, 0]}>
        {/* Crankcase Bottom */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.48, 16]} />
          <meshStandardMaterial color="#4A4A4A" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh position={[-0.05, -0.05, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.08, 12]} />
          <meshStandardMaterial color="#A5A5A5" metalness={0.95} roughness={0.12} />
        </mesh>

        {/* Cylinder block with cooling fins */}
        {/* Left cylinder stack */}
        <group ref={leftEngineBlock} position={[0.08, 0.25, -0.1]}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <mesh key={`l-fin-${idx}`} position={[0, idx * 0.04 - 0.1, 0]}>
              <boxGeometry args={[0.24, 0.015, 0.2]} />
              <meshStandardMaterial color="#2E2E2E" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
          {/* Cylinder head caps */}
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.26, 0.06, 0.22]} />
            <meshStandardMaterial color="#A5A5A5" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>

        {/* Right cylinder stack */}
        <group ref={rightEngineBlock} position={[0.08, 0.25, 0.1]}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <mesh key={`r-fin-${idx}`} position={[0, idx * 0.04 - 0.1, 0]}>
              <boxGeometry args={[0.24, 0.015, 0.2]} />
              <meshStandardMaterial color="#2E2E2E" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
          {/* Cylinder head caps */}
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.26, 0.06, 0.22]} />
            <meshStandardMaterial color="#A5A5A5" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      </group>

      {/* Sweeping Chrome Exhaust Pipes */}
      <group ref={exhaustSystem}>
        {/* Left side exhaust */}
        <group>
          {/* Headers */}
          <mesh position={[0.25, 0.08, -0.15]} rotation={[0.4, 0, -0.4]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
            <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.05} />
          </mesh>
          {/* Silencer pipe stretching backwards */}
          <mesh position={[-0.55, -0.12, -0.28]} rotation={[0, 0, 0.04 + Math.PI / 2]} scale={[1.4, 0.06, 0.06]}>
            <cylinderGeometry args={[1, 0.7, 0.8, 12]} />
            <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Right side exhaust */}
        <group>
          {/* Headers */}
          <mesh position={[0.25, 0.08, 0.15]} rotation={[-0.4, 0, -0.4]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
            <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.05} />
          </mesh>
          {/* Silencer pipe stretching backwards */}
          <mesh position={[-0.55, -0.12, 0.28]} rotation={[0, 0, 0.04 + Math.PI / 2]} scale={[1.4, 0.06, 0.06]}>
            <cylinderGeometry args={[1, 0.7, 0.8, 12]} />
            <meshStandardMaterial color="#EAEAEA" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
      </group>

      {/* Stitched Classic Leather seat (Brown leather style) */}
      <group position={[-0.45, 0.7, 0]}>
        <mesh scale={[1.2, 0.15, 0.44]}>
          <boxGeometry args={[0.85, 0.8, 0.9]} />
          <meshStandardMaterial color="#3E2519" roughness={0.78} metalness={0.05} />
        </mesh>
        {/* Seat ridge lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={`ridge-${i}`} position={[i * 0.12 - 0.3, 0.07, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.38]} />
            <meshStandardMaterial color="#25160E" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Retro Chrome Shock Absorbers & Springs */}
      <group>
        {/* Left Shock */}
        <group position={[-0.88, 0.22, 0.17]} rotation={[0.0, 0.0, -0.42]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.4, 10]} />
            <meshStandardMaterial color="#CCCCCC" metalness={0.95} roughness={0.1} />
          </mesh>
          <group position={[0, -0.12, 0]}>
            <ShockSpring length={0.34} turns={7} radius={0.04} />
          </group>
        </group>
        {/* Right Shock */}
        <group position={[-0.88, 0.22, -0.17]} rotation={[0.0, 0.0, -0.42]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.4, 10]} />
            <meshStandardMaterial color="#CCCCCC" metalness={0.95} roughness={0.1} />
          </mesh>
          <group position={[0, -0.12, 0]}>
            <ShockSpring length={0.34} turns={7} radius={0.04} />
          </group>
        </group>
      </group>

      {/* Classic Fenders (Metal Mudguards) */}
      <group>
        {/* Rear mudguard */}
        <mesh position={[-0.95, 0.32, 0]} rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.66, 0.06, 8, 20, Math.PI / 1.8]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.12} />
        </mesh>
        {/* Front mudguard */}
        <mesh position={[1.16, 0.31, 0]} rotation={[0, 0, -0.8]}>
          <torusGeometry args={[0.66, 0.05, 8, 16, Math.PI / 2.3]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.12} />
        </mesh>
      </group>

      {/* Ambient Floor Shadow under bike */}
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.2]} />
        <meshBasicMaterial color="#020202" opacity={0.62} transparent={true} />
      </mesh>
    </group>
  );
}

// Stub out original BikeModel loader since we bypass GLB loading for performance & visual completeness
export function BikeModel({ progress, color }: BikeProps) {
  return <ProceduralBike progress={progress} color={color} />;
}


import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Extend the JSX namespace to include Three.js elements for React Three Fiber
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

const AdvocateCharacter: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);

  const [state, setState] = useState<'walking' | 'idle'>('walking');
  const [targetX] = useState(0);
  const startX = -5; // Start position to the left

  useFrame((stateObj) => {
    const t = stateObj.clock.getElapsedTime();
    
    if (group.current) {
      if (state === 'walking') {
        // Smooth walk towards center
        group.current.position.x += 0.04;
        
        // Leg walk cycle
        if (leftLeg.current && rightLeg.current) {
          leftLeg.current.rotation.x = Math.sin(t * 10) * 0.4;
          rightLeg.current.rotation.x = Math.sin(t * 10 + Math.PI) * 0.4;
        }
        
        // Arm swing cycle
        if (leftArm.current && rightArm.current) {
          leftArm.current.rotation.x = Math.sin(t * 10 + Math.PI) * 0.3;
          rightArm.current.rotation.x = Math.sin(t * 10) * 0.3;
        }

        if (group.current.position.x >= targetX) {
          group.current.position.x = targetX;
          setState('idle');
        }
      } else {
        // Idle breathing effect
        if (body.current) {
          body.current.scale.y = 1 + Math.sin(t * 2) * 0.012;
        }
        
        // Head tracking/turn towards camera
        if (head.current) {
          head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, 0.3, 0.05);
          head.current.rotation.x = Math.sin(t) * 0.05;
        }

        // Suble smile expression change
        if (mouth.current) {
          mouth.current.scale.x = THREE.MathUtils.lerp(mouth.current.scale.x, 2.5, 0.03);
        }

        // Idle arm posture
        if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0.1, 0.1);
        if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, -0.1, 0.1);
      }
    }
  });

  return (
    <group ref={group} position={[startX, -2.5, 0]} rotation={[0, 0.6, 0]}>
      {/* Body / Coat */}
      <mesh ref={body} position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[1, 1.8, 0.6]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* White Neckband (Jabot) */}
      <group position={[0, 2.4, 0.31]}>
        <mesh position={[-0.1, 0, 0]}>
          <planeGeometry args={[0.15, 0.4]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.1, 0, 0]}>
          <planeGeometry args={[0.15, 0.4]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Head Group */}
      <group ref={head} position={[0, 3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color="#ffdbac" roughness={0.4} />
        </mesh>
        {/* Stylized Eyes */}
        <mesh position={[-0.15, 0.1, 0.38]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.38]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        {/* Procedural Smile */}
        <mesh ref={mouth} position={[0, -0.15, 0.41]} scale={[1, 1, 1]}>
          <boxGeometry args={[0.06, 0.015, 0.01]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      </group>

      {/* Left Arm with Law Book */}
      <group ref={leftArm} position={[-0.7, 2.4, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.8]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Law Book */}
        <group position={[0, -0.8, 0.25]} rotation={[0, -0.2, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.6, 0.4]} />
            <meshStandardMaterial color="#4b2c20" />
          </mesh>
          <mesh position={[0.07, 0, 0]}>
            <boxGeometry args={[0.02, 0.58, 0.38]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightArm} position={[0.7, 2.4, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.8]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Formal Trousers and Shoes */}
      <group ref={leftLeg} position={[-0.25, 0.8, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0, -0.9, 0.1]}>
          <boxGeometry args={[0.22, 0.15, 0.4]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      <group ref={rightLeg} position={[0.25, 0.8, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0, -0.9, 0.1]}>
          <boxGeometry args={[0.22, 0.15, 0.4]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    </group>
  );
};

const FloatingParticles: React.FC = () => {
  const count = 350;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0008;
      pointsRef.current.rotation.x += 0.0004;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#48f520"
        size={0.065}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  );
};

const Mascot3D: React.FC = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.5, 9]} fov={38} />
      
      {/* High-Quality Studio Lighting */}
      <ambientLight intensity={0.6} />
      
      {/* Main Front Light */}
      <spotLight 
        position={[5, 10, 10]} 
        angle={0.25} 
        penumbra={1} 
        intensity={3} 
        castShadow 
        color="#ffffff" 
      />
      
      {/* Rim Emerald Glow */}
      <pointLight position={[-8, 5, -5]} intensity={6} color="#48f520" />
      <pointLight position={[8, -5, -5]} intensity={3} color="#48f520" />
      
      {/* Backlight for depth */}
      <pointLight position={[0, 5, -8]} intensity={2} color="#ffffff" />

      <AdvocateCharacter />
      <FloatingParticles />
      
      {/* Contact Shadows for grounding */}
      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.5} 
        scale={12} 
        blur={2.8} 
        far={4.5} 
        color="#000000"
      />
    </>
  );
};

export default Mascot3D;

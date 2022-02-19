import React, { Suspense, VFC } from 'react';
import * as THREE from 'three';
import { OrbitControls, Plane, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GlassSphere } from './GlassSphere';
import { Lights } from './Lights';
import { Effects } from './postprocessing/Effects';
import { FocusPass } from './postprocessing/FocusPass';
import { FXAAPass } from './postprocessing/FXAAPass';
import { StarFragments } from './StarFragments';
import { WheelAnimation } from './WheelAnimation';

export const TCanvas: VFC = () => {
	return (
		<Canvas
			camera={{
				position: [0, 0, 8],
				fov: 50,
				aspect: window.innerWidth / window.innerHeight,
				near: 0.1,
				far: 2000
			}}
			dpr={window.devicePixelRatio}
			shadows>
			{/* scene */}
			<color attach="background" args={[sRGBCorrectionColor('#000609')]} />
			<fog attach="fog" args={[sRGBCorrectionColor('#000609'), 10, 30]} />
			{/* camera controller */}
			<OrbitControls attach="orbitControls" enableZoom={false} enablePan={false} />
			{/* lights */}
			<Lights />
			{/* objects */}
			<Suspense fallback={null}>
				<StarFragments />
				<GlassSphere scale={3.3} />
				<Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.3, 0]} receiveShadow>
					<meshStandardMaterial color="#007acc" />
				</Plane>
			</Suspense>
			{/* effects */}
			<Effects sRGBCorrection>
				<FXAAPass />
				<FocusPass />
			</Effects>
			{/* helper */}
			<Stats />
			{/* events */}
			<WheelAnimation />
		</Canvas>
	)
}

const sRGBCorrectionColor = (color: THREE.ColorRepresentation) => {
	const c = new THREE.Color(color)
	c.convertSRGBToLinear()
	return c
}

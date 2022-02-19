import { useRef, VFC } from 'react';
import * as THREE from 'three';
import { Icosahedron, Sphere, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { getPublicPath } from '../../modules/utils';

type GlassSphereProps = {
	position?: [number, number, number]
	scale?: number
}

export const GlassSphere: VFC<GlassSphereProps> = props => {
	const { position = [0, 0, 0], scale = 1 } = props

	const backgroundRef = useRef<THREE.Mesh>(null)

	const spaceTexture = useTexture(getPublicPath('/assets/textures/space.jpg'))
	spaceTexture.encoding = THREE.sRGBEncoding

	const envTexture = useTexture(getPublicPath('/assets/textures/empty_warehouse.jpg'))
	envTexture.mapping = THREE.EquirectangularReflectionMapping
	envTexture.encoding = THREE.sRGBEncoding

	const normalMapTexture = useTexture(getPublicPath('/assets/textures/normal.jpg'))
	normalMapTexture.wrapS = THREE.RepeatWrapping
	normalMapTexture.wrapT = THREE.RepeatWrapping

	useFrame(({ camera }) => {
		backgroundRef.current!.lookAt(camera.position)
	})

	return (
		<group position={position} scale={scale}>
			<Sphere ref={backgroundRef} args={[1, 32, 32, Math.PI, Math.PI]}>
				<meshBasicMaterial map={spaceTexture} side={THREE.BackSide} />
			</Sphere>
			<Icosahedron args={[1, 10]} castShadow receiveShadow>
				<meshPhysicalMaterial
					roughness={0.05}
					metalness={0}
					transmission={1}
					thickness={0.7}
					clearcoat={0.3}
					clearcoatRoughness={0.6}
					ior={1.517}
					reflectivity={0.5}
					envMap={envTexture}
					envMapIntensity={0.15}
					normalMap={normalMapTexture}
					normalScale={new THREE.Vector2(1, 1).multiplyScalar(0.1)}
				/>
			</Icosahedron>
		</group>
	)
}

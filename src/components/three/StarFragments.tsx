import gsap from 'gsap';
import React, { useEffect, useRef, VFC } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { smoothstep } from 'three/src/math/MathUtils';
import { useGLTF, useMatcapTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GUIController } from '../../modules/gui';
import { starActionState } from '../../modules/store';
import { getPublicPath } from '../../modules/utils';

type GLTFResult = GLTF & {
	nodes: {
		[key in string]: THREE.Mesh
	}
	materials: {
		Outer: THREE.MeshStandardMaterial
		Inner: THREE.MeshStandardMaterial
	}
}

const ModelPath = getPublicPath('/assets/models/Fragments2Tetrahedron.glb')
useGLTF.preload(ModelPath)

export const StarFragments: VFC = () => {
	const groupRef = useRef<THREE.Group>(null)
	const meshRef = useRef<THREE.Mesh>(null)
	const fragmentsRef = useRef<THREE.Group>(null)

	// load
	const { nodes } = useGLTF(ModelPath) as GLTFResult
	const [mc_black] = useMatcapTexture('090909_9C9C9C_555555_7C7C7C', 512)
	const [mc_gold] = useMatcapTexture('36220C_C6C391_8C844A_8B7B4C', 512)

	// initialize fragments
	useEffect(() => {
		const divergenceDirection = new THREE.Vector3(-0.8, 1, 0.5).normalize()
		const maxLength = 3
		const outerMaterial = new THREE.MeshMatcapMaterial({ matcap: mc_black })
		const innerMaterial = new THREE.MeshMatcapMaterial({ matcap: mc_gold })

		fragmentsRef.current!.children.forEach(obj => {
			// set positions
			obj.userData.position = { 0: new THREE.Vector3(), 1: new THREE.Vector3(), 2: new THREE.Vector3() }
			// 0：default
			obj.userData.position[0].copy(obj.position)
			// 1：directional divergence
			const dot = obj.position.clone().normalize().dot(divergenceDirection)
			let ratio = smoothstep(dot, 0.5, 1)
			ratio = Math.pow(1.01 + ratio, 1.5)
			obj.userData.position[1].copy(obj.position.clone().multiplyScalar(ratio))
			// 2：divergence
			ratio = Math.pow(2 + obj.position.length(), 1.5)
			const pos = obj.position.clone().multiplyScalar(ratio)
			ratio = pos.length() > maxLength ? maxLength / pos.length() : 1
			obj.userData.position[2].copy(pos.multiplyScalar(ratio))

			// set material
			if (obj instanceof THREE.Group) {
				;(obj.children[0] as THREE.Mesh).material = outerMaterial
				;(obj.children[1] as THREE.Mesh).material = innerMaterial
			} else if (obj instanceof THREE.Mesh) {
				obj.material = innerMaterial
			}
		})

		// set material
		meshRef.current!.material = outerMaterial
	}, [mc_black, mc_gold])

	// add controller
	const gui = GUIController.instance
	gui.addButton(starActionState, 'set0', 'default')
	gui.addButton(starActionState, 'set1', 'directional')
	gui.addButton(starActionState, 'set2', 'divergence')

	const animation = () => {
		meshRef.current!.visible = false
		fragmentsRef.current!.visible = true
		const tl = gsap.timeline({
			onComplete: () => {
				if (starActionState.posIndex === 0) {
					meshRef.current!.visible = true
					fragmentsRef.current!.visible = false
				}
			}
		})
		fragmentsRef.current!.children.forEach(fragment => {
			const pos = fragment.userData.position[starActionState.posIndex] as THREE.Vector3
			tl.to(fragment.position, { x: pos.x, y: pos.y, z: pos.z, duration: 1, ease: 'power4.inOut' }, 0)
		})
	}

	useFrame(() => {
		if (starActionState.posIndex !== starActionState.prevPosIndex) {
			animation()
			starActionState.prevPosIndex = starActionState.posIndex
		}
	})

	return (
		<group ref={groupRef} rotation={[0, Math.PI / 6, 0]} dispose={null}>
			<mesh
				ref={meshRef}
				geometry={nodes.Solid001.geometry}
				material={nodes.Solid001.material}
				rotation={[0, 0, Math.PI]}
			/>
			<group ref={fragmentsRef} visible={false}>
				<group position={[-0.28, 0.02, 0.43]}>
					<mesh geometry={nodes.Solid001_cell292.geometry} material={nodes.Solid001_cell292.material} />
					<mesh geometry={nodes.Solid001_cell292_1.geometry} material={nodes.Solid001_cell292_1.material} />
				</group>
				<group position={[-0.03, -0.35, -0.17]}>
					<mesh geometry={nodes.Solid001_cell293.geometry} material={nodes.Solid001_cell293.material} />
					<mesh geometry={nodes.Solid001_cell293_1.geometry} material={nodes.Solid001_cell293_1.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell002.geometry}
					material={nodes.Solid001_cell002.material}
					position={[-0.08, -0.05, -0.15]}
				/>
				<group position={[-0.24, -0.34, 0.1]}>
					<mesh geometry={nodes.Solid001_cell093_1.geometry} material={nodes.Solid001_cell093_1.material} />
					<mesh geometry={nodes.Solid001_cell093_2.geometry} material={nodes.Solid001_cell093_2.material} />
				</group>
				<group position={[-0.3, -0.25, -0.18]}>
					<mesh geometry={nodes.Solid001_cell094_1.geometry} material={nodes.Solid001_cell094_1.material} />
					<mesh geometry={nodes.Solid001_cell094_2.geometry} material={nodes.Solid001_cell094_2.material} />
				</group>
				<group position={[0.33, 0.24, 0.29]}>
					<mesh geometry={nodes.Solid001_cell095.geometry} material={nodes.Solid001_cell095.material} />
					<mesh geometry={nodes.Solid001_cell095_1.geometry} material={nodes.Solid001_cell095_1.material} />
				</group>
				<group position={[0.2, 0.42, -0.09]}>
					<mesh geometry={nodes.Solid001_cell096.geometry} material={nodes.Solid001_cell096.material} />
					<mesh geometry={nodes.Solid001_cell096_1.geometry} material={nodes.Solid001_cell096_1.material} />
				</group>
				<group position={[0.5, -0.3, 0.21]}>
					<mesh geometry={nodes.Solid001_cell097_1.geometry} material={nodes.Solid001_cell097_1.material} />
					<mesh geometry={nodes.Solid001_cell097_2.geometry} material={nodes.Solid001_cell097_2.material} />
				</group>
				<group position={[-0.32, -0.24, 0.37]}>
					<mesh geometry={nodes.Solid001_cell098_1.geometry} material={nodes.Solid001_cell098_1.material} />
					<mesh geometry={nodes.Solid001_cell098_2.geometry} material={nodes.Solid001_cell098_2.material} />
				</group>
				<group position={[-0.06, -0.32, 0.3]}>
					<mesh geometry={nodes.Solid001_cell099_1.geometry} material={nodes.Solid001_cell099_1.material} />
					<mesh geometry={nodes.Solid001_cell099_2.geometry} material={nodes.Solid001_cell099_2.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell011.geometry}
					material={nodes.Solid001_cell011.material}
					position={[0.01, 0.17, 0.19]}
				/>
				<mesh
					geometry={nodes.Solid001_cell012.geometry}
					material={nodes.Solid001_cell012.material}
					position={[0.06, 0.05, 0.27]}
				/>
				<group position={[-0.14, 0.53, -0.12]}>
					<mesh geometry={nodes.Solid001_cell102_1.geometry} material={nodes.Solid001_cell102_1.material} />
					<mesh geometry={nodes.Solid001_cell102_2.geometry} material={nodes.Solid001_cell102_2.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell015.geometry}
					material={nodes.Solid001_cell015.material}
					position={[0.22, 0.12, 0.17]}
				/>
				<group position={[-0.13, 0.25, -0.41]}>
					<mesh geometry={nodes.Solid001_cell104_1.geometry} material={nodes.Solid001_cell104_1.material} />
					<mesh geometry={nodes.Solid001_cell104_2.geometry} material={nodes.Solid001_cell104_2.material} />
				</group>
				<group position={[-0.34, -0.13, -0.6]}>
					<mesh geometry={nodes.Solid001_cell105_1.geometry} material={nodes.Solid001_cell105_1.material} />
					<mesh geometry={nodes.Solid001_cell105_2.geometry} material={nodes.Solid001_cell105_2.material} />
				</group>
				<group position={[0.68, -0.29, 0.04]}>
					<mesh geometry={nodes.Solid001_cell106_1.geometry} material={nodes.Solid001_cell106_1.material} />
					<mesh geometry={nodes.Solid001_cell106_2.geometry} material={nodes.Solid001_cell106_2.material} />
				</group>
				<group position={[0.5, 0.03, 0.09]}>
					<mesh geometry={nodes.Solid001_cell107_1.geometry} material={nodes.Solid001_cell107_1.material} />
					<mesh geometry={nodes.Solid001_cell107_2.geometry} material={nodes.Solid001_cell107_2.material} />
				</group>
				<group position={[0.6, -0.27, 0.13]}>
					<mesh geometry={nodes.Solid001_cell108_1.geometry} material={nodes.Solid001_cell108_1.material} />
					<mesh geometry={nodes.Solid001_cell108_2.geometry} material={nodes.Solid001_cell108_2.material} />
				</group>
				<group position={[0.38, 0.32, -0.6]}>
					<mesh geometry={nodes.Solid001_cell109.geometry} material={nodes.Solid001_cell109.material} />
					<mesh geometry={nodes.Solid001_cell109_1.geometry} material={nodes.Solid001_cell109_1.material} />
				</group>
				<group position={[-0.27, 0.05, -0.4]}>
					<mesh geometry={nodes.Solid001_cell111_1.geometry} material={nodes.Solid001_cell111_1.material} />
					<mesh geometry={nodes.Solid001_cell111_2.geometry} material={nodes.Solid001_cell111_2.material} />
				</group>
				<group position={[-0.26, -0.31, 0.51]}>
					<mesh geometry={nodes.Solid001_cell112.geometry} material={nodes.Solid001_cell112.material} />
					<mesh geometry={nodes.Solid001_cell112_1.geometry} material={nodes.Solid001_cell112_1.material} />
				</group>
				<group position={[0.14, -0.23, -0.24]}>
					<mesh geometry={nodes.Solid001_cell113_1.geometry} material={nodes.Solid001_cell113_1.material} />
					<mesh geometry={nodes.Solid001_cell113_2.geometry} material={nodes.Solid001_cell113_2.material} />
				</group>
				<group position={[0.08, -0.48, 0.22]}>
					<mesh geometry={nodes.Solid001_cell114_1.geometry} material={nodes.Solid001_cell114_1.material} />
					<mesh geometry={nodes.Solid001_cell114_2.geometry} material={nodes.Solid001_cell114_2.material} />
				</group>
				<group position={[0.36, 0.13, -0.55]}>
					<mesh geometry={nodes.Solid001_cell115_1.geometry} material={nodes.Solid001_cell115_1.material} />
					<mesh geometry={nodes.Solid001_cell115_2.geometry} material={nodes.Solid001_cell115_2.material} />
				</group>
				<group position={[-0.29, 0.2, -0.25]}>
					<mesh geometry={nodes.Solid001_cell116_1.geometry} material={nodes.Solid001_cell116_1.material} />
					<mesh geometry={nodes.Solid001_cell116_2.geometry} material={nodes.Solid001_cell116_2.material} />
				</group>
				<group position={[-0.08, -0.41, 0.15]}>
					<mesh geometry={nodes.Solid001_cell117_1.geometry} material={nodes.Solid001_cell117_1.material} />
					<mesh geometry={nodes.Solid001_cell117_2.geometry} material={nodes.Solid001_cell117_2.material} />
				</group>
				<group position={[0.01, 0.38, 0.27]}>
					<mesh geometry={nodes.Solid001_cell118_1.geometry} material={nodes.Solid001_cell118_1.material} />
					<mesh geometry={nodes.Solid001_cell118_2.geometry} material={nodes.Solid001_cell118_2.material} />
				</group>
				<group position={[-0.06, 0.71, -0.12]}>
					<mesh geometry={nodes.Solid001_cell119_1.geometry} material={nodes.Solid001_cell119_1.material} />
					<mesh geometry={nodes.Solid001_cell119_2.geometry} material={nodes.Solid001_cell119_2.material} />
				</group>
				<group position={[0.35, 0.01, -0.22]}>
					<mesh geometry={nodes.Solid001_cell120_1.geometry} material={nodes.Solid001_cell120_1.material} />
					<mesh geometry={nodes.Solid001_cell120_2.geometry} material={nodes.Solid001_cell120_2.material} />
				</group>
				<group position={[-0.31, -0.3, -0.42]}>
					<mesh geometry={nodes.Solid001_cell121_1.geometry} material={nodes.Solid001_cell121_1.material} />
					<mesh geometry={nodes.Solid001_cell121_2.geometry} material={nodes.Solid001_cell121_2.material} />
				</group>
				<group position={[-0.04, 0.81, -0.09]}>
					<mesh geometry={nodes.Solid001_cell122.geometry} material={nodes.Solid001_cell122.material} />
					<mesh geometry={nodes.Solid001_cell122_1.geometry} material={nodes.Solid001_cell122_1.material} />
				</group>
				<group position={[-0.31, -0.28, 0.67]}>
					<mesh geometry={nodes.Solid001_cell123.geometry} material={nodes.Solid001_cell123.material} />
					<mesh geometry={nodes.Solid001_cell123_1.geometry} material={nodes.Solid001_cell123_1.material} />
				</group>
				<group position={[-0.04, -0.53, -0.07]}>
					<mesh geometry={nodes.Solid001_cell124_1.geometry} material={nodes.Solid001_cell124_1.material} />
					<mesh geometry={nodes.Solid001_cell124_2.geometry} material={nodes.Solid001_cell124_2.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell041.geometry}
					material={nodes.Solid001_cell041.material}
					position={[0.17, -0.1, 0.05]}
				/>
				<group position={[0.59, -0.21, -0.1]}>
					<mesh geometry={nodes.Solid001_cell126_1.geometry} material={nodes.Solid001_cell126_1.material} />
					<mesh geometry={nodes.Solid001_cell126_2.geometry} material={nodes.Solid001_cell126_2.material} />
				</group>
				<group position={[0.42, 0.39, 0]}>
					<mesh geometry={nodes.Solid001_cell127_1.geometry} material={nodes.Solid001_cell127_1.material} />
					<mesh geometry={nodes.Solid001_cell127_2.geometry} material={nodes.Solid001_cell127_2.material} />
				</group>
				<group position={[0.03, 0.65, -0.09]}>
					<mesh geometry={nodes.Solid001_cell128_1.geometry} material={nodes.Solid001_cell128_1.material} />
					<mesh geometry={nodes.Solid001_cell128_2.geometry} material={nodes.Solid001_cell128_2.material} />
				</group>
				<group position={[0.09, 0.25, 0.56]}>
					<mesh geometry={nodes.Solid001_cell129_1.geometry} material={nodes.Solid001_cell129_1.material} />
					<mesh geometry={nodes.Solid001_cell129_2.geometry} material={nodes.Solid001_cell129_2.material} />
				</group>
				<group position={[0.3, -0.12, -0.41]}>
					<mesh geometry={nodes.Solid001_cell130_1.geometry} material={nodes.Solid001_cell130_1.material} />
					<mesh geometry={nodes.Solid001_cell130_2.geometry} material={nodes.Solid001_cell130_2.material} />
				</group>
				<group position={[0.57, -0.33, 0.21]}>
					<mesh geometry={nodes.Solid001_cell131_1.geometry} material={nodes.Solid001_cell131_1.material} />
					<mesh geometry={nodes.Solid001_cell131_2.geometry} material={nodes.Solid001_cell131_2.material} />
				</group>
				<group position={[0.55, -0.3, -0.1]}>
					<mesh geometry={nodes.Solid001_cell132_1.geometry} material={nodes.Solid001_cell132_1.material} />
					<mesh geometry={nodes.Solid001_cell132_2.geometry} material={nodes.Solid001_cell132_2.material} />
				</group>
				<group position={[0.43, 0.29, 0.76]}>
					<mesh geometry={nodes.Solid001_cell133_1.geometry} material={nodes.Solid001_cell133_1.material} />
					<mesh geometry={nodes.Solid001_cell133_2.geometry} material={nodes.Solid001_cell133_2.material} />
				</group>
				<group position={[0.65, -0.13, 0.02]}>
					<mesh geometry={nodes.Solid001_cell134_1.geometry} material={nodes.Solid001_cell134_1.material} />
					<mesh geometry={nodes.Solid001_cell134_2.geometry} material={nodes.Solid001_cell134_2.material} />
				</group>
				<group position={[-0.22, -0.31, 0.33]}>
					<mesh geometry={nodes.Solid001_cell135_1.geometry} material={nodes.Solid001_cell135_1.material} />
					<mesh geometry={nodes.Solid001_cell135_2.geometry} material={nodes.Solid001_cell135_2.material} />
				</group>
				<group position={[0.03, 0.8, 0.03]}>
					<mesh geometry={nodes.Solid001_cell136_1.geometry} material={nodes.Solid001_cell136_1.material} />
					<mesh geometry={nodes.Solid001_cell136_2.geometry} material={nodes.Solid001_cell136_2.material} />
				</group>
				<group position={[-0.15, 0.51, 0.1]}>
					<mesh geometry={nodes.Solid001_cell137_1.geometry} material={nodes.Solid001_cell137_1.material} />
					<mesh geometry={nodes.Solid001_cell137_2.geometry} material={nodes.Solid001_cell137_2.material} />
				</group>
				<group position={[0.06, 0.35, 0.13]}>
					<mesh geometry={nodes.Solid001_cell138.geometry} material={nodes.Solid001_cell138.material} />
					<mesh geometry={nodes.Solid001_cell138_1.geometry} material={nodes.Solid001_cell138_1.material} />
				</group>
				<group position={[-0.08, 0.6, 0.11]}>
					<mesh geometry={nodes.Solid001_cell139_1.geometry} material={nodes.Solid001_cell139_1.material} />
					<mesh geometry={nodes.Solid001_cell139_2.geometry} material={nodes.Solid001_cell139_2.material} />
				</group>
				<group position={[-0.36, 0.22, -0.08]}>
					<mesh geometry={nodes.Solid001_cell140_1.geometry} material={nodes.Solid001_cell140_1.material} />
					<mesh geometry={nodes.Solid001_cell140_2.geometry} material={nodes.Solid001_cell140_2.material} />
				</group>
				<group position={[-0.27, 0.27, 0.06]}>
					<mesh geometry={nodes.Solid001_cell141_1.geometry} material={nodes.Solid001_cell141_1.material} />
					<mesh geometry={nodes.Solid001_cell141_2.geometry} material={nodes.Solid001_cell141_2.material} />
				</group>
				<group position={[0.46, 0.32, -0.41]}>
					<mesh geometry={nodes.Solid001_cell142_1.geometry} material={nodes.Solid001_cell142_1.material} />
					<mesh geometry={nodes.Solid001_cell142_2.geometry} material={nodes.Solid001_cell142_2.material} />
				</group>
				<group position={[0.28, 0.29, 0.52]}>
					<mesh geometry={nodes.Solid001_cell143_1.geometry} material={nodes.Solid001_cell143_1.material} />
					<mesh geometry={nodes.Solid001_cell143_2.geometry} material={nodes.Solid001_cell143_2.material} />
				</group>
				<group position={[-0.28, 0.13, 0.2]}>
					<mesh geometry={nodes.Solid001_cell144_1.geometry} material={nodes.Solid001_cell144_1.material} />
					<mesh geometry={nodes.Solid001_cell144_2.geometry} material={nodes.Solid001_cell144_2.material} />
				</group>
				<group position={[0.57, -0.09, 0.11]}>
					<mesh geometry={nodes.Solid001_cell145_1.geometry} material={nodes.Solid001_cell145_1.material} />
					<mesh geometry={nodes.Solid001_cell145_2.geometry} material={nodes.Solid001_cell145_2.material} />
				</group>
				<group position={[0.14, 0.37, 0.22]}>
					<mesh geometry={nodes.Solid001_cell146.geometry} material={nodes.Solid001_cell146.material} />
					<mesh geometry={nodes.Solid001_cell146_1.geometry} material={nodes.Solid001_cell146_1.material} />
				</group>
				<group position={[-0.02, 0.07, -0.39]}>
					<mesh geometry={nodes.Solid001_cell147_1.geometry} material={nodes.Solid001_cell147_1.material} />
					<mesh geometry={nodes.Solid001_cell147_2.geometry} material={nodes.Solid001_cell147_2.material} />
				</group>
				<group position={[0.09, -0.05, 0.38]}>
					<mesh geometry={nodes.Solid001_cell148.geometry} material={nodes.Solid001_cell148.material} />
					<mesh geometry={nodes.Solid001_cell148_1.geometry} material={nodes.Solid001_cell148_1.material} />
				</group>
				<group position={[0.39, 0.27, -0.08]}>
					<mesh geometry={nodes.Solid001_cell149_1.geometry} material={nodes.Solid001_cell149_1.material} />
					<mesh geometry={nodes.Solid001_cell149_2.geometry} material={nodes.Solid001_cell149_2.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell073.geometry}
					material={nodes.Solid001_cell073.material}
					position={[0.16, 0.05, -0.32]}
				/>
				<group position={[-0.22, -0.12, 0.55]}>
					<mesh geometry={nodes.Solid001_cell151_1.geometry} material={nodes.Solid001_cell151_1.material} />
					<mesh geometry={nodes.Solid001_cell151_2.geometry} material={nodes.Solid001_cell151_2.material} />
				</group>
				<group position={[-0.04, -0.19, 0.4]}>
					<mesh geometry={nodes.Solid001_cell152_1.geometry} material={nodes.Solid001_cell152_1.material} />
					<mesh geometry={nodes.Solid001_cell152_2.geometry} material={nodes.Solid001_cell152_2.material} />
				</group>
				<group position={[0.24, 0.06, -0.55]}>
					<mesh geometry={nodes.Solid001_cell153_1.geometry} material={nodes.Solid001_cell153_1.material} />
					<mesh geometry={nodes.Solid001_cell153_2.geometry} material={nodes.Solid001_cell153_2.material} />
				</group>
				<group position={[-0.01, 0.05, 0.45]}>
					<mesh geometry={nodes.Solid001_cell154_1.geometry} material={nodes.Solid001_cell154_1.material} />
					<mesh geometry={nodes.Solid001_cell154_2.geometry} material={nodes.Solid001_cell154_2.material} />
				</group>
				<group position={[0.04, -0.67, -0.07]}>
					<mesh geometry={nodes.Solid001_cell155_1.geometry} material={nodes.Solid001_cell155_1.material} />
					<mesh geometry={nodes.Solid001_cell155_2.geometry} material={nodes.Solid001_cell155_2.material} />
				</group>
				<group position={[-0.45, 0.04, -0.04]}>
					<mesh geometry={nodes.Solid001_cell156_1.geometry} material={nodes.Solid001_cell156_1.material} />
					<mesh geometry={nodes.Solid001_cell156_2.geometry} material={nodes.Solid001_cell156_2.material} />
				</group>
				<group position={[0.14, -0.45, -0.25]}>
					<mesh geometry={nodes.Solid001_cell157_1.geometry} material={nodes.Solid001_cell157_1.material} />
					<mesh geometry={nodes.Solid001_cell157_2.geometry} material={nodes.Solid001_cell157_2.material} />
				</group>
				<group position={[-0.2, 0.35, -0.36]}>
					<mesh geometry={nodes.Solid001_cell158_1.geometry} material={nodes.Solid001_cell158_1.material} />
					<mesh geometry={nodes.Solid001_cell158_2.geometry} material={nodes.Solid001_cell158_2.material} />
				</group>
				<group position={[-0.37, 0.05, -0.21]}>
					<mesh geometry={nodes.Solid001_cell159_1.geometry} material={nodes.Solid001_cell159_1.material} />
					<mesh geometry={nodes.Solid001_cell159_2.geometry} material={nodes.Solid001_cell159_2.material} />
				</group>
				<group position={[-0.32, 0.02, 0.56]}>
					<mesh geometry={nodes.Solid001_cell160_1.geometry} material={nodes.Solid001_cell160_1.material} />
					<mesh geometry={nodes.Solid001_cell160_2.geometry} material={nodes.Solid001_cell160_2.material} />
				</group>
				<group position={[-0.14, 0.33, 0.29]}>
					<mesh geometry={nodes.Solid001_cell161_1.geometry} material={nodes.Solid001_cell161_1.material} />
					<mesh geometry={nodes.Solid001_cell161_2.geometry} material={nodes.Solid001_cell161_2.material} />
				</group>
				<group position={[0.07, 0.57, 0.06]}>
					<mesh geometry={nodes.Solid001_cell162_1.geometry} material={nodes.Solid001_cell162_1.material} />
					<mesh geometry={nodes.Solid001_cell162_2.geometry} material={nodes.Solid001_cell162_2.material} />
				</group>
				<group position={[-0.36, -0.08, 0.2]}>
					<mesh geometry={nodes.Solid001_cell163_1.geometry} material={nodes.Solid001_cell163_1.material} />
					<mesh geometry={nodes.Solid001_cell163_2.geometry} material={nodes.Solid001_cell163_2.material} />
				</group>
				<group position={[0, 0.95, 0]}>
					<mesh geometry={nodes.Solid001_cell164.geometry} material={nodes.Solid001_cell164.material} />
					<mesh geometry={nodes.Solid001_cell164_1.geometry} material={nodes.Solid001_cell164_1.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell091.geometry}
					material={nodes.Solid001_cell091.material}
					position={[0.14, 0.16, -0.07]}
				/>
				<group position={[0.39, 0.32, 0.11]}>
					<mesh geometry={nodes.Solid001_cell166_1.geometry} material={nodes.Solid001_cell166_1.material} />
					<mesh geometry={nodes.Solid001_cell166_2.geometry} material={nodes.Solid001_cell166_2.material} />
				</group>
				<group position={[0.43, -0.31, 0.07]}>
					<mesh geometry={nodes.Solid001_cell167_1.geometry} material={nodes.Solid001_cell167_1.material} />
					<mesh geometry={nodes.Solid001_cell167_2.geometry} material={nodes.Solid001_cell167_2.material} />
				</group>
				<group position={[0.16, -0.38, 0.3]}>
					<mesh geometry={nodes.Solid001_cell168_1.geometry} material={nodes.Solid001_cell168_1.material} />
					<mesh geometry={nodes.Solid001_cell168_2.geometry} material={nodes.Solid001_cell168_2.material} />
				</group>
				<group position={[0.22, -0.29, -0.38]}>
					<mesh geometry={nodes.Solid001_cell169.geometry} material={nodes.Solid001_cell169.material} />
					<mesh geometry={nodes.Solid001_cell169_1.geometry} material={nodes.Solid001_cell169_1.material} />
				</group>
				<group position={[-0.04, 0.77, -0.02]}>
					<mesh geometry={nodes.Solid001_cell170_1.geometry} material={nodes.Solid001_cell170_1.material} />
					<mesh geometry={nodes.Solid001_cell170_2.geometry} material={nodes.Solid001_cell170_2.material} />
				</group>
				<group position={[-0.13, -0.64, 0.03]}>
					<mesh geometry={nodes.Solid001_cell171_1.geometry} material={nodes.Solid001_cell171_1.material} />
					<mesh geometry={nodes.Solid001_cell171_2.geometry} material={nodes.Solid001_cell171_2.material} />
				</group>
				<group position={[0.38, 0, 0.24]}>
					<mesh geometry={nodes.Solid001_cell172_1.geometry} material={nodes.Solid001_cell172_1.material} />
					<mesh geometry={nodes.Solid001_cell172_2.geometry} material={nodes.Solid001_cell172_2.material} />
				</group>
				<group position={[0.13, 0.25, -0.5]}>
					<mesh geometry={nodes.Solid001_cell173_1.geometry} material={nodes.Solid001_cell173_1.material} />
					<mesh geometry={nodes.Solid001_cell173_2.geometry} material={nodes.Solid001_cell173_2.material} />
				</group>
				<group position={[-0.2, 0.31, -0.17]}>
					<mesh geometry={nodes.Solid001_cell174.geometry} material={nodes.Solid001_cell174.material} />
					<mesh geometry={nodes.Solid001_cell174_1.geometry} material={nodes.Solid001_cell174_1.material} />
				</group>
				<group position={[0.06, 0.83, -0.03]}>
					<mesh geometry={nodes.Solid001_cell175.geometry} material={nodes.Solid001_cell175.material} />
					<mesh geometry={nodes.Solid001_cell175_1.geometry} material={nodes.Solid001_cell175_1.material} />
				</group>
				<group position={[-0.64, 0.23, -0.01]}>
					<mesh geometry={nodes.Solid001_cell176_1.geometry} material={nodes.Solid001_cell176_1.material} />
					<mesh geometry={nodes.Solid001_cell176_2.geometry} material={nodes.Solid001_cell176_2.material} />
				</group>
				<group position={[-0.26, 0.23, 0.34]}>
					<mesh geometry={nodes.Solid001_cell177_1.geometry} material={nodes.Solid001_cell177_1.material} />
					<mesh geometry={nodes.Solid001_cell177_2.geometry} material={nodes.Solid001_cell177_2.material} />
				</group>
				<group position={[0.32, 0.22, -0.34]}>
					<mesh geometry={nodes.Solid001_cell178.geometry} material={nodes.Solid001_cell178.material} />
					<mesh geometry={nodes.Solid001_cell178_1.geometry} material={nodes.Solid001_cell178_1.material} />
				</group>
				<group position={[-0.22, -0.29, -0.63]}>
					<mesh geometry={nodes.Solid001_cell179_1.geometry} material={nodes.Solid001_cell179_1.material} />
					<mesh geometry={nodes.Solid001_cell179_2.geometry} material={nodes.Solid001_cell179_2.material} />
				</group>
				<group position={[0.28, 0.37, 0.05]}>
					<mesh geometry={nodes.Solid001_cell180_1.geometry} material={nodes.Solid001_cell180_1.material} />
					<mesh geometry={nodes.Solid001_cell180_2.geometry} material={nodes.Solid001_cell180_2.material} />
				</group>
				<group position={[-0.29, -0.33, -0.61]}>
					<mesh geometry={nodes.Solid001_cell181.geometry} material={nodes.Solid001_cell181.material} />
					<mesh geometry={nodes.Solid001_cell181_1.geometry} material={nodes.Solid001_cell181_1.material} />
				</group>
				<group position={[-0.02, -0.53, 0.16]}>
					<mesh geometry={nodes.Solid001_cell182.geometry} material={nodes.Solid001_cell182.material} />
					<mesh geometry={nodes.Solid001_cell182_1.geometry} material={nodes.Solid001_cell182_1.material} />
				</group>
				<group position={[0.19, -0.2, 0.34]}>
					<mesh geometry={nodes.Solid001_cell183_1.geometry} material={nodes.Solid001_cell183_1.material} />
					<mesh geometry={nodes.Solid001_cell183_2.geometry} material={nodes.Solid001_cell183_2.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell115.geometry}
					material={nodes.Solid001_cell115.material}
					position={[0.36, 0, 0]}
				/>
				<group position={[-0.23, 0, -0.5]}>
					<mesh geometry={nodes.Solid001_cell185_1.geometry} material={nodes.Solid001_cell185_1.material} />
					<mesh geometry={nodes.Solid001_cell185_2.geometry} material={nodes.Solid001_cell185_2.material} />
				</group>
				<group position={[0.33, 0.08, 0.1]}>
					<mesh geometry={nodes.Solid001_cell186.geometry} material={nodes.Solid001_cell186.material} />
					<mesh geometry={nodes.Solid001_cell186_1.geometry} material={nodes.Solid001_cell186_1.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell118.geometry}
					material={nodes.Solid001_cell118.material}
					position={[-0.13, -0.02, 0.3]}
				/>
				<group position={[-0.43, -0.31, -0.49]}>
					<mesh geometry={nodes.Solid001_cell188_1.geometry} material={nodes.Solid001_cell188_1.material} />
					<mesh geometry={nodes.Solid001_cell188_2.geometry} material={nodes.Solid001_cell188_2.material} />
				</group>
				<group position={[-0.04, 0.47, -0.12]}>
					<mesh geometry={nodes.Solid001_cell189_1.geometry} material={nodes.Solid001_cell189_1.material} />
					<mesh geometry={nodes.Solid001_cell189_2.geometry} material={nodes.Solid001_cell189_2.material} />
				</group>
				<group position={[0.12, -0.19, -0.41]}>
					<mesh geometry={nodes.Solid001_cell190.geometry} material={nodes.Solid001_cell190.material} />
					<mesh geometry={nodes.Solid001_cell190_1.geometry} material={nodes.Solid001_cell190_1.material} />
				</group>
				<group position={[-0.52, 0.22, -0.18]}>
					<mesh geometry={nodes.Solid001_cell191.geometry} material={nodes.Solid001_cell191.material} />
					<mesh geometry={nodes.Solid001_cell191_1.geometry} material={nodes.Solid001_cell191_1.material} />
				</group>
				<group position={[-0.51, 0.19, 0.1]}>
					<mesh geometry={nodes.Solid001_cell192_1.geometry} material={nodes.Solid001_cell192_1.material} />
					<mesh geometry={nodes.Solid001_cell192_2.geometry} material={nodes.Solid001_cell192_2.material} />
				</group>
				<group position={[0.11, 0.27, 0.45]}>
					<mesh geometry={nodes.Solid001_cell193_1.geometry} material={nodes.Solid001_cell193_1.material} />
					<mesh geometry={nodes.Solid001_cell193_2.geometry} material={nodes.Solid001_cell193_2.material} />
				</group>
				<group position={[-0.36, -0.1, -0.27]}>
					<mesh geometry={nodes.Solid001_cell194_1.geometry} material={nodes.Solid001_cell194_1.material} />
					<mesh geometry={nodes.Solid001_cell194_2.geometry} material={nodes.Solid001_cell194_2.material} />
				</group>
				<group position={[-0.08, 0.75, -0.14]}>
					<mesh geometry={nodes.Solid001_cell195_1.geometry} material={nodes.Solid001_cell195_1.material} />
					<mesh geometry={nodes.Solid001_cell195_2.geometry} material={nodes.Solid001_cell195_2.material} />
				</group>
				<group position={[0.3, 0.22, 0.62]}>
					<mesh geometry={nodes.Solid001_cell196_1.geometry} material={nodes.Solid001_cell196_1.material} />
					<mesh geometry={nodes.Solid001_cell196_2.geometry} material={nodes.Solid001_cell196_2.material} />
				</group>
				<group position={[-0.18, 0.17, 0.44]}>
					<mesh geometry={nodes.Solid001_cell197_1.geometry} material={nodes.Solid001_cell197_1.material} />
					<mesh geometry={nodes.Solid001_cell197_2.geometry} material={nodes.Solid001_cell197_2.material} />
				</group>
				<group position={[0.39, 0.15, 0.51]}>
					<mesh geometry={nodes.Solid001_cell198_1.geometry} material={nodes.Solid001_cell198_1.material} />
					<mesh geometry={nodes.Solid001_cell198_2.geometry} material={nodes.Solid001_cell198_2.material} />
				</group>
				<group position={[0.55, -0.07, -0.11]}>
					<mesh geometry={nodes.Solid001_cell199.geometry} material={nodes.Solid001_cell199.material} />
					<mesh geometry={nodes.Solid001_cell199_1.geometry} material={nodes.Solid001_cell199_1.material} />
				</group>
				<group position={[-0.44, -0.31, -0.39]}>
					<mesh geometry={nodes.Solid001_cell200.geometry} material={nodes.Solid001_cell200.material} />
					<mesh geometry={nodes.Solid001_cell200_1.geometry} material={nodes.Solid001_cell200_1.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell134.geometry}
					material={nodes.Solid001_cell134.material}
					position={[-0.01, 0.01, 0.1]}
				/>
				<group position={[-0.01, -0.82, 0.01]}>
					<mesh geometry={nodes.Solid001_cell202.geometry} material={nodes.Solid001_cell202.material} />
					<mesh geometry={nodes.Solid001_cell202_1.geometry} material={nodes.Solid001_cell202_1.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell136.geometry}
					material={nodes.Solid001_cell136.material}
					position={[-0.2, 0.05, 0]}
				/>
				<group position={[0.77, -0.29, -0.05]}>
					<mesh geometry={nodes.Solid001_cell204.geometry} material={nodes.Solid001_cell204.material} />
					<mesh geometry={nodes.Solid001_cell204_1.geometry} material={nodes.Solid001_cell204_1.material} />
				</group>
				<group position={[0.85, -0.27, 0.01]}>
					<mesh geometry={nodes.Solid001_cell205.geometry} material={nodes.Solid001_cell205.material} />
					<mesh geometry={nodes.Solid001_cell205_1.geometry} material={nodes.Solid001_cell205_1.material} />
				</group>
				<group position={[-0.36, -0.16, -0.43]}>
					<mesh geometry={nodes.Solid001_cell206.geometry} material={nodes.Solid001_cell206.material} />
					<mesh geometry={nodes.Solid001_cell206_1.geometry} material={nodes.Solid001_cell206_1.material} />
				</group>
				<group position={[0.31, -0.08, -0.53]}>
					<mesh geometry={nodes.Solid001_cell207.geometry} material={nodes.Solid001_cell207.material} />
					<mesh geometry={nodes.Solid001_cell207_1.geometry} material={nodes.Solid001_cell207_1.material} />
				</group>
				<group position={[-0.3, -0.33, -0.3]}>
					<mesh geometry={nodes.Solid001_cell208.geometry} material={nodes.Solid001_cell208.material} />
					<mesh geometry={nodes.Solid001_cell208_1.geometry} material={nodes.Solid001_cell208_1.material} />
				</group>
				<group position={[-0.09, -0.8, 0]}>
					<mesh geometry={nodes.Solid001_cell209.geometry} material={nodes.Solid001_cell209.material} />
					<mesh geometry={nodes.Solid001_cell209_1.geometry} material={nodes.Solid001_cell209_1.material} />
				</group>
				<group position={[0.29, -0.27, -0.16]}>
					<mesh geometry={nodes.Solid001_cell210.geometry} material={nodes.Solid001_cell210.material} />
					<mesh geometry={nodes.Solid001_cell210_1.geometry} material={nodes.Solid001_cell210_1.material} />
				</group>
				<group position={[-0.37, -0.2, 0.61]}>
					<mesh geometry={nodes.Solid001_cell211.geometry} material={nodes.Solid001_cell211.material} />
					<mesh geometry={nodes.Solid001_cell211_1.geometry} material={nodes.Solid001_cell211_1.material} />
				</group>
				<mesh
					geometry={nodes.Solid001_cell147.geometry}
					material={nodes.Solid001_cell147.material}
					position={[-0.11, -0.19, 0.11]}
				/>
				<group position={[-0.37, -0.27, -0.63]}>
					<mesh geometry={nodes.Solid001_cell213.geometry} material={nodes.Solid001_cell213.material} />
					<mesh geometry={nodes.Solid001_cell213_1.geometry} material={nodes.Solid001_cell213_1.material} />
				</group>
				<group position={[0.2, 0.07, 0.46]}>
					<mesh geometry={nodes.Solid001_cell214.geometry} material={nodes.Solid001_cell214.material} />
					<mesh geometry={nodes.Solid001_cell214_1.geometry} material={nodes.Solid001_cell214_1.material} />
				</group>
				<group position={[-0.04, -0.27, -0.47]}>
					<mesh geometry={nodes.Solid001_cell215.geometry} material={nodes.Solid001_cell215.material} />
					<mesh geometry={nodes.Solid001_cell215_1.geometry} material={nodes.Solid001_cell215_1.material} />
				</group>
				<group position={[-0.34, 0.32, 0.19]}>
					<mesh geometry={nodes.Solid001_cell216.geometry} material={nodes.Solid001_cell216.material} />
					<mesh geometry={nodes.Solid001_cell216_1.geometry} material={nodes.Solid001_cell216_1.material} />
				</group>
				<group position={[-0.13, 0.34, 0.06]}>
					<mesh geometry={nodes.Solid001_cell217.geometry} material={nodes.Solid001_cell217.material} />
					<mesh geometry={nodes.Solid001_cell217_1.geometry} material={nodes.Solid001_cell217_1.material} />
				</group>
				<group position={[-0.76, 0.2, 0.01]}>
					<mesh geometry={nodes.Solid001_cell218.geometry} material={nodes.Solid001_cell218.material} />
					<mesh geometry={nodes.Solid001_cell218_1.geometry} material={nodes.Solid001_cell218_1.material} />
				</group>
				<group position={[-0.01, -0.92, 0.01]}>
					<mesh geometry={nodes.Solid001_cell219.geometry} material={nodes.Solid001_cell219.material} />
					<mesh geometry={nodes.Solid001_cell219_1.geometry} material={nodes.Solid001_cell219_1.material} />
				</group>
				<group position={[-0.17, -0.33, -0.22]}>
					<mesh geometry={nodes.Solid001_cell220.geometry} material={nodes.Solid001_cell220.material} />
					<mesh geometry={nodes.Solid001_cell220_1.geometry} material={nodes.Solid001_cell220_1.material} />
				</group>
				<group position={[0.5, 0.01, -0.06]}>
					<mesh geometry={nodes.Solid001_cell221.geometry} material={nodes.Solid001_cell221.material} />
					<mesh geometry={nodes.Solid001_cell221_1.geometry} material={nodes.Solid001_cell221_1.material} />
				</group>
				<group position={[-0.41, -0.28, 0.19]}>
					<mesh geometry={nodes.Solid001_cell222.geometry} material={nodes.Solid001_cell222.material} />
					<mesh geometry={nodes.Solid001_cell222_1.geometry} material={nodes.Solid001_cell222_1.material} />
				</group>
				<group position={[-0.44, 0.27, 0.24]}>
					<mesh geometry={nodes.Solid001_cell223.geometry} material={nodes.Solid001_cell223.material} />
					<mesh geometry={nodes.Solid001_cell223_1.geometry} material={nodes.Solid001_cell223_1.material} />
				</group>
				<group position={[0.39, 0.17, 0.09]}>
					<mesh geometry={nodes.Solid001_cell224.geometry} material={nodes.Solid001_cell224.material} />
					<mesh geometry={nodes.Solid001_cell224_1.geometry} material={nodes.Solid001_cell224_1.material} />
				</group>
				<group position={[0.13, -0.38, 0.17]}>
					<mesh geometry={nodes.Solid001_cell225.geometry} material={nodes.Solid001_cell225.material} />
					<mesh geometry={nodes.Solid001_cell225_1.geometry} material={nodes.Solid001_cell225_1.material} />
				</group>
				<group position={[0.05, -0.61, 0.07]}>
					<mesh geometry={nodes.Solid001_cell226.geometry} material={nodes.Solid001_cell226.material} />
					<mesh geometry={nodes.Solid001_cell226_1.geometry} material={nodes.Solid001_cell226_1.material} />
				</group>
				<group position={[0.14, -0.33, 0]}>
					<mesh geometry={nodes.Solid001_cell227.geometry} material={nodes.Solid001_cell227.material} />
					<mesh geometry={nodes.Solid001_cell227_1.geometry} material={nodes.Solid001_cell227_1.material} />
				</group>
				<group position={[-0.1, -0.18, -0.41]}>
					<mesh geometry={nodes.Solid001_cell228.geometry} material={nodes.Solid001_cell228.material} />
					<mesh geometry={nodes.Solid001_cell228_1.geometry} material={nodes.Solid001_cell228_1.material} />
				</group>
				<group position={[-0.13, -0.28, 0.54]}>
					<mesh geometry={nodes.Solid001_cell229.geometry} material={nodes.Solid001_cell229.material} />
					<mesh geometry={nodes.Solid001_cell229_1.geometry} material={nodes.Solid001_cell229_1.material} />
				</group>
				<group position={[-0.59, 0.01, 0.03]}>
					<mesh geometry={nodes.Solid001_cell230.geometry} material={nodes.Solid001_cell230.material} />
					<mesh geometry={nodes.Solid001_cell230_1.geometry} material={nodes.Solid001_cell230_1.material} />
				</group>
				<group position={[-0.04, -0.2, -0.33]}>
					<mesh geometry={nodes.Solid001_cell231.geometry} material={nodes.Solid001_cell231.material} />
					<mesh geometry={nodes.Solid001_cell231_1.geometry} material={nodes.Solid001_cell231_1.material} />
				</group>
				<group position={[-0.15, 0.43, -0.28]}>
					<mesh geometry={nodes.Solid001_cell232.geometry} material={nodes.Solid001_cell232.material} />
					<mesh geometry={nodes.Solid001_cell232_1.geometry} material={nodes.Solid001_cell232_1.material} />
				</group>
				<group position={[0.41, -0.21, -0.17]}>
					<mesh geometry={nodes.Solid001_cell233.geometry} material={nodes.Solid001_cell233.material} />
					<mesh geometry={nodes.Solid001_cell233_1.geometry} material={nodes.Solid001_cell233_1.material} />
				</group>
				<group position={[-0.11, 0.07, 0.4]}>
					<mesh geometry={nodes.Solid001_cell234.geometry} material={nodes.Solid001_cell234.material} />
					<mesh geometry={nodes.Solid001_cell234_1.geometry} material={nodes.Solid001_cell234_1.material} />
				</group>
				<group position={[0.03, 0.24, 0.38]}>
					<mesh geometry={nodes.Solid001_cell235.geometry} material={nodes.Solid001_cell235.material} />
					<mesh geometry={nodes.Solid001_cell235_1.geometry} material={nodes.Solid001_cell235_1.material} />
				</group>
				<group position={[0.05, 0.29, -0.23]}>
					<mesh geometry={nodes.Solid001_cell236.geometry} material={nodes.Solid001_cell236.material} />
					<mesh geometry={nodes.Solid001_cell236_1.geometry} material={nodes.Solid001_cell236_1.material} />
				</group>
				<group position={[0.44, -0.18, 0.11]}>
					<mesh geometry={nodes.Solid001_cell237.geometry} material={nodes.Solid001_cell237.material} />
					<mesh geometry={nodes.Solid001_cell237_1.geometry} material={nodes.Solid001_cell237_1.material} />
				</group>
				<group position={[-0.41, -0.21, -0.03]}>
					<mesh geometry={nodes.Solid001_cell238.geometry} material={nodes.Solid001_cell238.material} />
					<mesh geometry={nodes.Solid001_cell238_1.geometry} material={nodes.Solid001_cell238_1.material} />
				</group>
				<group position={[-0.42, -0.29, -0.3]}>
					<mesh geometry={nodes.Solid001_cell239.geometry} material={nodes.Solid001_cell239.material} />
					<mesh geometry={nodes.Solid001_cell239_1.geometry} material={nodes.Solid001_cell239_1.material} />
				</group>
				<group position={[0.33, 0.29, -0.51]}>
					<mesh geometry={nodes.Solid001_cell240.geometry} material={nodes.Solid001_cell240.material} />
					<mesh geometry={nodes.Solid001_cell240_1.geometry} material={nodes.Solid001_cell240_1.material} />
				</group>
				<group position={[-0.33, -0.4, 0.02]}>
					<mesh geometry={nodes.Solid001_cell241.geometry} material={nodes.Solid001_cell241.material} />
					<mesh geometry={nodes.Solid001_cell241_1.geometry} material={nodes.Solid001_cell241_1.material} />
				</group>
				<group position={[-0.46, 0.29, -0.1]}>
					<mesh geometry={nodes.Solid001_cell242.geometry} material={nodes.Solid001_cell242.material} />
					<mesh geometry={nodes.Solid001_cell242_1.geometry} material={nodes.Solid001_cell242_1.material} />
				</group>
				<group position={[0.32, -0.27, 0.28]}>
					<mesh geometry={nodes.Solid001_cell243.geometry} material={nodes.Solid001_cell243.material} />
					<mesh geometry={nodes.Solid001_cell243_1.geometry} material={nodes.Solid001_cell243_1.material} />
				</group>
				<group position={[-0.22, -0.23, -0.56]}>
					<mesh geometry={nodes.Solid001_cell244.geometry} material={nodes.Solid001_cell244.material} />
					<mesh geometry={nodes.Solid001_cell244_1.geometry} material={nodes.Solid001_cell244_1.material} />
				</group>
				<group position={[0.32, 0.25, -0.65]}>
					<mesh geometry={nodes.Solid001_cell245.geometry} material={nodes.Solid001_cell245.material} />
					<mesh geometry={nodes.Solid001_cell245_1.geometry} material={nodes.Solid001_cell245_1.material} />
				</group>
				<group position={[0.18, -0.43, -0.09]}>
					<mesh geometry={nodes.Solid001_cell246.geometry} material={nodes.Solid001_cell246.material} />
					<mesh geometry={nodes.Solid001_cell246_1.geometry} material={nodes.Solid001_cell246_1.material} />
				</group>
				<group position={[-0.28, 0.29, -0.37]}>
					<mesh geometry={nodes.Solid001_cell247.geometry} material={nodes.Solid001_cell247.material} />
					<mesh geometry={nodes.Solid001_cell247_1.geometry} material={nodes.Solid001_cell247_1.material} />
				</group>
				<group position={[-0.38, 0.13, 0.19]}>
					<mesh geometry={nodes.Solid001_cell248.geometry} material={nodes.Solid001_cell248.material} />
					<mesh geometry={nodes.Solid001_cell248_1.geometry} material={nodes.Solid001_cell248_1.material} />
				</group>
				<group position={[-0.33, -0.12, 0.45]}>
					<mesh geometry={nodes.Solid001_cell249.geometry} material={nodes.Solid001_cell249.material} />
					<mesh geometry={nodes.Solid001_cell249_1.geometry} material={nodes.Solid001_cell249_1.material} />
				</group>
				<group position={[0.18, 0.66, 0]}>
					<mesh geometry={nodes.Solid001_cell250.geometry} material={nodes.Solid001_cell250.material} />
					<mesh geometry={nodes.Solid001_cell250_1.geometry} material={nodes.Solid001_cell250_1.material} />
				</group>
				<group position={[-0.24, 0.07, 0.26]}>
					<mesh geometry={nodes.Solid001_cell251.geometry} material={nodes.Solid001_cell251.material} />
					<mesh geometry={nodes.Solid001_cell251_1.geometry} material={nodes.Solid001_cell251_1.material} />
				</group>
				<group position={[0.45, -0.07, -0.17]}>
					<mesh geometry={nodes.Solid001_cell252.geometry} material={nodes.Solid001_cell252.material} />
					<mesh geometry={nodes.Solid001_cell252_1.geometry} material={nodes.Solid001_cell252_1.material} />
				</group>
			</group>
		</group>
	)
}

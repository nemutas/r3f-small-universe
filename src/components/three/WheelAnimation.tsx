import gsap from 'gsap';
import { VFC } from 'react';
import { useFrame } from '@react-three/fiber';
import { cameraState } from '../../modules/store';

export const WheelAnimation: VFC = () => {
	useFrame(({ camera }) => {
		if (cameraState.animationEnabled) {
			cameraState.animationEnabled = false

			if (cameraState.zoom === 'up' && cameraState.wheelAmount < -2) {
				const tl = gsap.timeline({
					onComplete: () => {
						cameraState.wheelAmount = 0
						cameraState.zoom = 'out'
						cameraState.animationEnabled = true
					}
				})
				tl.to(camera.position, { x: 0, y: 0, z: 8, duration: 1, ease: 'power4.inOut' })
			} else if (cameraState.zoom === 'out' && 2 < cameraState.wheelAmount) {
				const tl = gsap.timeline({
					onComplete: () => {
						cameraState.wheelAmount = 0
						cameraState.zoom = 'up'
						cameraState.animationEnabled = true
					}
				})
				tl.to(camera.position, { x: 0, y: 0, z: 3.2, duration: 1, ease: 'power4.inOut' })
			} else {
				cameraState.animationEnabled = true
			}
		}
	})

	return null
}

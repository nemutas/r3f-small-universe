import { CameraState, StarActionState } from './types';

export const starActionState: StarActionState = {
	prevPosIndex: 0,
	posIndex: 0,
	set0: () => (starActionState.posIndex = 0),
	set1: () => (starActionState.posIndex = 1),
	set2: () => (starActionState.posIndex = 2)
}

export const focusPassState = {
	enabled: true,
	focus: 0,
	blur: 0.5,
	samples: 20
}

export const cameraState: CameraState = {
	wheelAmount: 0,
	animationEnabled: true,
	zoom: 'up'
}

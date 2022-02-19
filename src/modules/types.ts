export type StarActionState = {
	prevPosIndex: 0 | 1 | 2
	posIndex: 0 | 1 | 2
	set0: () => void
	set1: () => void
	set2: () => void
}

export type CameraState = {
	wheelAmount: number
	animationEnabled: boolean
	zoom: 'up' | 'out'
}

import { VFC } from 'react';

export const Lights: VFC = () => {
	return (
		<>
			<ambientLight intensity={0.1} />
			<directionalLight
				position={[10, 10, 10]}
				intensity={0.5}
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
			/>
			<directionalLight
				position={[-3, 10, 3]}
				intensity={0.1}
				color="#aaa"
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
			/>
		</>
	)
}

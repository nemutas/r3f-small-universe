import React, { VFC } from 'react';
import { css } from '@emotion/css';
import { cameraState } from '../modules/store';
import { Balloon } from './Balloon';
import { LinkIconButton } from './LinkIconButton';
import { TCanvas } from './three/TCanvas';

export const App: VFC = () => {
	const wheelHandle = (e: React.WheelEvent<HTMLDivElement>) => {
		// console.log(e.deltaY)
		if (cameraState.animationEnabled) {
			if (cameraState.zoom === 'up' && 1 < e.deltaY) {
				cameraState.wheelAmount -= 1
			} else if (cameraState.zoom === 'out' && e.deltaY < -1) {
				cameraState.wheelAmount += 1
			}
		}
	}

	return (
		<div className={styles.container} onWheel={wheelHandle}>
			<TCanvas />
			<Balloon />
			<LinkIconButton imagePath="/assets/icons/github.svg" linkPath="https://github.com/nemutas/r3f-small-universe" />
		</div>
	)
}

const styles = {
	container: css`
		position: relative;
		width: 100vw;
		height: 100vh;
	`
}

import React, { VFC } from 'react';
import { css } from '@emotion/css';

export const Balloon: VFC = () => {
	return (
		<div className={styles.container}>
			<div className={styles.text}>Mouse Wheel Up：In Sphere</div>
			<div className={styles.text}>Mouse Wheel Down：Out Sphere</div>
		</div>
	)
}

const styles = {
	container: css`
		position: absolute;
		bottom: 20px;
		left: 20px;
		padding: 10px 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		grid-gap: 2px;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(10px);
		border-radius: 5px;
	`,
	text: css`
		color: #fff;
		font-size: 1.3rem;
	`
}

import { useEffect, useState } from 'react';

function useCompass() {
	const [direction, setDirection] = useState(0);

	useEffect(() => {
		const handleOrientation = (event: DeviceOrientationEvent) => {
			const { alpha } = event; // alpha == 돌아가야 하는 각도
			setDirection(alpha || 0);
		};

		window.addEventListener('deviceorientation', handleOrientation, true);

		return () =>
			window.removeEventListener('deviceorientation', handleOrientation);
	}, []);

	return { direction };
}

export default useCompass;

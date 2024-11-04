/* eslint-disable no-undef */
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface GlobeViewProps {
	mapContainerRef: React.RefObject<HTMLDivElement>;
	setMap: (map: mapboxgl.Map) => void;
}

const GlobeView: React.FC<GlobeViewProps> = ({ mapContainerRef, setMap }) => {
	const rotationFrameRef = useRef<number>();

	useEffect(() => {
		const mapInstance = new mapboxgl.Map({
			container: mapContainerRef.current!,
			style: 'mapbox://styles/mapbox/satellite-v9',
			center: [0, 20],
			zoom: 1.5,
			projection: 'globe',
			attributionControl: false,
		});

		mapInstance.on('style.load', () => {
			mapInstance.setFog({
				color: 'rgb(186, 210, 235)',
				'high-color': 'rgb(36, 92, 223)',
				'horizon-blend': 0.02,
				'space-color': 'rgb(11, 11, 25)',
				'star-intensity': 0.6,
			});

			const rotateGlobe = () => {
				mapInstance.rotateTo((mapInstance.getBearing() + 0.1) % 360, {
					duration: 0,
				});
				rotationFrameRef.current = requestAnimationFrame(rotateGlobe);
			};
			rotateGlobe();
		});

		setMap(mapInstance);

		return () => {
			if (rotationFrameRef.current) {
				cancelAnimationFrame(rotationFrameRef.current);
			}
			mapInstance.remove();
		};
	}, [mapContainerRef, setMap]);

	return null;
};

export default GlobeView;

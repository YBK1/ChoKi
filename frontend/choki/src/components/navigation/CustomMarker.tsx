import mapboxgl from 'mapbox-gl';

const CustomMarker = (
	map: mapboxgl.Map,
	latitude: number,
	longitude: number,
) => {
	const customMarker = document.createElement('div');
	customMarker.style.position = 'relative';
	customMarker.style.width = '30px';
	customMarker.style.height = '30px';

	const locationIcon = document.createElement('div');
	locationIcon.style.backgroundImage = 'url(/choki192x192.png)';
	locationIcon.style.width = '100%';
	locationIcon.style.height = '100%';
	locationIcon.style.backgroundSize = '100%';

	const arrow = document.createElement('div');
	arrow.style.position = 'absolute';
	arrow.style.bottom = '-5px';
	arrow.style.left = '50%';
	arrow.style.transform = 'translateX(-50%)';
	arrow.style.width = '10px';
	arrow.style.height = '10px';
	arrow.style.borderTop = '10px solid red';
	arrow.style.borderLeft = '5px solid transparent';
	arrow.style.borderRight = '5px solid transparent';

	customMarker.appendChild(locationIcon);
	customMarker.appendChild(arrow);

	new mapboxgl.Marker(customMarker).setLngLat([longitude, latitude]).addTo(map);

	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', event => {
			const heading = event.alpha;
			if (heading !== null) {
				arrow.style.transform = `translateX(-50%) rotate(${heading}deg)`;
			}
		});
	}
};

export default CustomMarker;

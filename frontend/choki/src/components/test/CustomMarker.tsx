import mapboxgl from 'mapbox-gl';

const CustomMarker = (
	map: mapboxgl.Map,
	latitude: number,
	longitude: number,
) => {
	// Create the main marker element
	const customMarker = document.createElement('div');
	customMarker.style.position = 'relative';
	customMarker.style.width = '30px';
	customMarker.style.height = '30px';

	// Create the icon for the current location
	const locationIcon = document.createElement('div');
	locationIcon.style.backgroundImage = 'url(/choki192x192.png)';
	locationIcon.style.width = '100%';
	locationIcon.style.height = '100%';
	locationIcon.style.backgroundSize = '100%';

	// Create the arrow element for the direction
	const arrow = document.createElement('div');
	arrow.style.position = 'absolute';
	arrow.style.bottom = '-5px'; // Adjust position to show the arrow below the icon
	arrow.style.left = '50%';
	arrow.style.transform = 'translateX(-50%)';
	arrow.style.width = '10px';
	arrow.style.height = '10px';
	arrow.style.borderTop = '10px solid red'; // Arrowhead color
	arrow.style.borderLeft = '5px solid transparent';
	arrow.style.borderRight = '5px solid transparent';

	// Append the icon and arrow to the main marker element
	customMarker.appendChild(locationIcon);
	customMarker.appendChild(arrow);

	// Add the custom marker to the map
	new mapboxgl.Marker(customMarker).setLngLat([longitude, latitude]).addTo(map);

	// Handle device orientation to update the arrow's rotation in real-time
	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', event => {
			const heading = event.alpha; // Get the compass heading
			if (heading !== null) {
				// Rotate the arrow based on the device's heading
				arrow.style.transform = `translateX(-50%) rotate(${heading}deg)`;
			}
		});
	}
};

export default CustomMarker;

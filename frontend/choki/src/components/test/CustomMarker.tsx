import mapboxgl from 'mapbox-gl';

const CustomMarker = (
	map: mapboxgl.Map,
	latitude: number,
	longitude: number,
) => {
	const customMarker = document.createElement('div');
	customMarker.style.backgroundImage = 'url(/choki192x192.png)';
	customMarker.style.width = '30px';
	customMarker.style.height = '30px';
	customMarker.style.backgroundSize = '100%';

	new mapboxgl.Marker(customMarker).setLngLat([longitude, latitude]).addTo(map);
};

export default CustomMarker;

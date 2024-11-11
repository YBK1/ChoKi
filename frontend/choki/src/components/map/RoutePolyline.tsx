import { useEffect } from 'react';

const RoutePolyline: React.FC<RoutePolylineProps> = ({
	map,
	route,
	polyline,
	setPolyline,
}) => {
	useEffect(() => {
		if (!map || !route || route.length === 0) return;

		// Clear any existing polyline
		if (polyline) {
			polyline.setMap(null);
		}

		// Convert route to Kakao Map LatLng points
		const linePath = route.map(
			point => new kakao.maps.LatLng(point.latitude, point.longitude),
		);

		// Draw the polyline on the map
		const newPolyline = new kakao.maps.Polyline({
			path: linePath,
			strokeWeight: 5,
			strokeColor: '#FF0000',
			strokeOpacity: 0.7,
			strokeStyle: 'solid',
		});
		newPolyline.setMap(map);
		setPolyline(newPolyline);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map, route]); // Include route in dependencies

	return null;
};

export default RoutePolyline;

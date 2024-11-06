import { useEffect } from 'react';

const RoutePolyline = ({
	map,
	finalRoute,
	polyline,
	setPolyline,
}: RoutePolylineProps) => {
	useEffect(() => {
		if (map && finalRoute.length > 0) {
			const kakao = (window as any).kakao;

			const path = finalRoute.map(
				point => new kakao.maps.LatLng(point.latitude, point.longitude),
			);

			if (polyline) {
				polyline.setMap(null);
			}

			const newPolyline = new kakao.maps.Polyline({
				path: path,
				strokeWeight: 5,
				strokeColor: '#FF0000',
				strokeOpacity: 0.7,
				strokeStyle: 'solid',
			});

			newPolyline.setMap(map);
			setPolyline(newPolyline);

			if (path.length > 0) {
				map.panTo(path[path.length - 1]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finalRoute, map]); // Removed `polyline` and `setPolyline` from the dependency array

	return null;
};

export default RoutePolyline;

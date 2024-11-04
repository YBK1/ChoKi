import { useEffect } from 'react';

type RoutePolylineProps = {
	map: any;
	finalRoute: { lat: number; lng: number }[];
	setPolyline: (polyline: any) => void;
	polyline: any;
};

const RoutePolyline = ({
	map,
	finalRoute,
	polyline,
	setPolyline,
}: RoutePolylineProps) => {
	useEffect(() => {
		if (map && finalRoute.length > 0) {
			const kakao = (window as any).kakao;

			// Convert finalRoute to Kakao LatLng objects
			const path = finalRoute.map(
				point => new kakao.maps.LatLng(point.lat, point.lng),
			);

			// Remove the previous polyline if it exists
			if (polyline) {
				polyline.setMap(null);
			}

			// Create a new polyline
			const newPolyline = new kakao.maps.Polyline({
				path: path,
				strokeWeight: 5,
				strokeColor: '#FF0000',
				strokeOpacity: 0.7,
				strokeStyle: 'solid',
			});

			newPolyline.setMap(map);
			setPolyline(newPolyline); // This will set the new polyline

			// Pan to the latest position
			if (path.length > 0) {
				map.panTo(path[path.length - 1]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finalRoute, map]); // Removed `polyline` and `setPolyline` from the dependency array

	return null;
};

export default RoutePolyline;

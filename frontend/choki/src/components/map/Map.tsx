import { useEffect, useRef } from 'react';

const Map = () => {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const initMap = async () => {
			if (window && (window as any).kakao) {
				const kakao = (window as any).kakao;

				kakao.maps.load(() => {
					if (mapRef.current) {
						// 서울
						let center = new kakao.maps.LatLng(37.5665, 126.978);

						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(
								position => {
									const { latitude, longitude } = position.coords;
									center = new kakao.maps.LatLng(latitude, longitude);

									// 현재 위치 중앙으로
									const map = new kakao.maps.Map(mapRef.current, {
										center: center,
										level: 3,
									});

									new kakao.maps.Marker({
										position: center,
										map: map,
									});
								},
								error => {
									console.error('Error getting geolocation:', error);

									// 현재위치 추적 실패하면 서울 기준
									const map = new kakao.maps.Map(mapRef.current, {
										center: center,
										level: 3,
									});
								},
							);
						} else {
							console.error('현재위치 인식 실패');

							const map = new kakao.maps.Map(mapRef.current, {
								center: center,
								level: 3,
							});
						}
					}
				});
			}
		};

		initMap();
	}, []);

	return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;

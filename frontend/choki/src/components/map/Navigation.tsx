const Navigation = () => {
	const startNavigation = () => {
		if (window && (window as any).Kakao) {
			const Kakao = (window as any).Kakao;
			Kakao.init('20b43e8fdaab65a54210734664cc541e');

			Kakao.Navi.start({
				name: '목적지',
				x: 126.978,
				y: 37.5665,
				coordType: 'wgs84',
			});
		}
	};

	return <button onClick={startNavigation}>Start Navigation</button>;
};

export default Navigation;

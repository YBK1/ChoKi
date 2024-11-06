import React from 'react';

const UnityViewer: React.FC = () => {
	return (
		<div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
			<iframe
				src="/unity/index.html" // 유니티 빌드 파일 위치
				style={{ width: '100%', height: '100%', border: 'none' }}
				allowFullScreen
				title="Unity WebGL Game"
			/>
		</div>
	);
};

export default UnityViewer;

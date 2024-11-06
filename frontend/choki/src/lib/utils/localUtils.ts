// Access Token 설정
export const setAccessToken = (token: string) => {
	localStorage.setItem('Access', token);
};

// Access Token 가져오기
export const getAccessToken = () => {
	return localStorage.getItem('Access');
};

// Access Token 삭제
export const removeAccessToken = () => {
	localStorage.removeItem('Access');
};

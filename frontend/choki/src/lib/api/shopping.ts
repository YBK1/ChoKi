import axiosInstance from '@/lib/api/axiosInstance';
// const baseURL = process.env.NEXT_PUBLIC_API_URL;
const baseURL = 'https://choki.co.kr';

// 상품 검색 API
export const searchItem = async (
	itemName: string,
	page: number,
	size: number,
): Promise<ItemSearchResponse[]> => {
	try {
		const response = await axiosInstance.post(
			`${baseURL}/api/shopping/item/search`,
			{
				itemName,
				page,
				size,
			},
		);
		return response.data;
	} catch (error) {
		console.error('Error in searchItem:', error);
		throw error;
	}
};

// 장보기 최종 부여 모달
export const createShopping = async (
	requestBody: ShoppingRequest,
): Promise<any> => {
	try {
		const response = await axiosInstance.post(
			`/api/shopping/create`,
			requestBody,
		);
		return response.data;
	} catch (error) {
		console.error('장보기 미션 생성 실패:', error);
		throw error;
	}
};

// 장보기 비교
export const compareShopping = async ({
	originBarcode,
	inputBarcode,
}: conmpareRequest): Promise<matchStatusReponse> => {
	try {
		console.log('장보기 비교 요청2:', originBarcode, inputBarcode);
		const response = await axiosInstance.post(`/api/shopping/item/compare`, {
			originBarcode,
			inputBarcode,
		});
		console.log('장보기 비교 응답:', response);
		return response.data;
	} catch (error) {
		console.error('장보기 비교 실패:', error);
		throw error;
	}
};

// 미션 완료 이미지 전송(장보기 제외)
export const uploadMissionImage = async (missionId: string, image: File) => {
	const formData = new FormData();

	formData.append('image', image);

	const dataObject = { missionId: missionId };
	formData.append(
		'data',
		new Blob([JSON.stringify(dataObject)], { type: 'application/json' }),
	);

	try {
		const response = await axiosInstance.post(`/api/mission/image`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error) {
		console.error('이미지 업로드 실패:', error);
		throw error;
	}
};

// 장보기 완료 이미지 전송
// export const uploadShoppingImage = async (shoppingId: string, image: File) => {
// 	const formData = new FormData();

// 	formData.append('image', image);

// 	const dataObject = { shoppingId: shoppingId };
// 	formData.append(
// 		'data',
// 		new Blob([JSON.stringify(dataObject)], { type: 'application/json' }),
// 	);

// 	try {
// 		const response = await axiosInstance.post(`/api/shopping/image`, formData, {
// 			headers: {
// 				'Content-Type': 'multipart/form-data',
// 			},
// 		});
// 		return response.data;
// 	} catch (error) {
// 		console.error('이미지 업로드 실패:', error);
// 		throw error;
// 	}
// };
export const uploadShoppingImage = async (shoppingId: string, image: File) => {
	// 이미지 리사이즈 함수
	const resizeImage = (file: File): Promise<Blob> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = e => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					if (ctx) {
						// 이미지 크기 조정
						const scaleFactor = 0.3; // 축소 비율
						canvas.width = img.width * scaleFactor;
						canvas.height = img.height * scaleFactor;

						// canvas에 이미지를 그리기
						ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

						// canvas를 Blob으로 변환
						canvas.toBlob(
							blob => {
								if (blob) {
									resolve(blob);
								} else {
									reject(new Error('Blob 변환 실패'));
								}
							},
							file.type, // 원본 파일의 포맷 유지
							0.7, // 이미지 품질 (0.1 ~ 1.0)
						);
					} else {
						reject(new Error('Canvas context를 가져올 수 없음'));
					}
				};
				img.src = e.target?.result as string; // FileReader의 결과를 이미지 소스로 설정
			};

			reader.onerror = error => reject(error);
			reader.readAsDataURL(file); // File을 Data URL로 읽기
		});
	};

	try {
		// 이미지 크기 조정
		const resizedBlob = await resizeImage(image);
		const resizedFile = new File([resizedBlob], image.name, {
			type: image.type,
		});

		// FormData 생성 (기존 규격 유지)
		const formData = new FormData();
		formData.append('image', resizedFile);

		const dataObject = { shoppingId: shoppingId };
		formData.append(
			'data',
			new Blob([JSON.stringify(dataObject)], { type: 'application/json' }),
		);

		// 서버로 전송
		const response = await axiosInstance.post(`/api/shopping/image`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error) {
		console.error('이미지 업로드 실패:', error);
		throw error;
	}
};

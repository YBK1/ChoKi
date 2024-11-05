import { useEffect, useRef } from 'react';

interface AddressData {
	address: string;
	zonecode: string;
}

interface PostcodeResult {
	address: string;
	zonecode: string;
	addressType: string;
	bname: string;
	buildingName: string;
	roadAddress: string;
	jibunAddress: string;
}

interface PostcodeOptions {
	oncomplete: (data: PostcodeResult) => void;
	onclose?: () => void;
	width: string;
	height: string;
}

interface AddressSearchProps {
	onComplete: (data: AddressData) => void;
	onClose: () => void;
}

declare global {
	interface Window {
		daum: {
			Postcode: new (options: PostcodeOptions) => {
				embed: (element?: HTMLElement) => void;
				open: () => void;
			};
		};
	}
}

const AddressSearch = ({ onComplete, onClose }: AddressSearchProps) => {
	const postcodeRef = useRef<any>(null);

	useEffect(() => {
		const initPostcode = () => {
			const container = document.getElementById('address-search-container');
			if (!container) return;

			// 이전 인스턴스가 있다면 제거
			if (postcodeRef.current) {
				postcodeRef.current = null;
			}

			postcodeRef.current = new window.daum.Postcode({
				oncomplete: (data: PostcodeResult) => {
					onComplete({
						address: data.address,
						zonecode: data.zonecode,
					});
					onClose();
				},
				onclose: onClose,
				width: '100%',
				height: '100%',
			});

			setTimeout(() => {
				if (postcodeRef.current) {
					postcodeRef.current.embed(container);
				}
			}, 100);
		};

		// window와 daum 객체가 있는지 확인 후 초기화
		if (typeof window !== 'undefined' && window.daum) {
			initPostcode();
		}

		// cleanup 함수
		return () => {
			if (postcodeRef.current) {
				postcodeRef.current = null;
			}
		};
	}, [onComplete, onClose]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-lg w-[300px] max-w-md">
				<div className="flex justify-between items-center p-4 border-b">
					<h3 className="text-lg font-medium">주소 검색</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
						type="button"
					>
						닫기
					</button>
				</div>
				<div id="address-search-container" className="h-[400px]" />
			</div>
		</div>
	);
};

export default AddressSearch;

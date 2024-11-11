import { useState, CSSProperties } from 'react';
import NonCloseModalLarge from '../Common/Modal/nonCloseModalLarge';
import Image from 'next/image';
import SuccessImage from '@/assets/icons/success_icon.svg';
import WarningImage from '@/assets/icons/warning_icon.svg';
import FailImage from '@/assets/icons/fail_icon.svg';
import Button from '@/components/Common/Button';

export default function CompareModal({
	conpareResult,
	ProductName,
}: ProductCardProps) {
	// 버튼 스타일
	const buttonStyle = {
		backgroundColor: '#f0f0f0',
		border: 'none',
		borderRadius: '5px',
		width: '30px',
		height: '30px',
		fontSize: '16px',
		cursor: 'pointer',
	};

	// 수량 표시 스타일
	const quantityStyle: CSSProperties = {
		padding: '5px 10px',
		borderRadius: '10px',
		backgroundColor: '#fff',
		fontSize: '16px',
		fontWeight: 'bold',
		textAlign: 'center',
	};
	const [quantity, setQuantity] = useState(1); // 수량 상태 관리

	// 수량 증가 함수
	const increaseQuantity = () => {
		setQuantity(prevQuantity => prevQuantity + 1);
	};

	// 수량 감소 함수 (0 이하로 내려가지 않도록 제한)
	const decreaseQuantity = () => {
		setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
	};

	return (
		<div>
			<NonCloseModalLarge>
				<div>
					{conpareResult === 'MATCH' && (
						<div>
							<Image src={SuccessImage} alt="Success" />
							<p>
								<strong>{ProductName}</strong>을(를) 몇 개 담으실건가요?
							</p>
							<div
								style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
							>
								<button onClick={decreaseQuantity} style={buttonStyle}>
									-
								</button>
								<div style={quantityStyle}>{quantity}</div>
								<button onClick={increaseQuantity} style={buttonStyle}>
									+
								</button>
							</div>
							<Button size="small" color="orange" text="담기"></Button>
						</div>
					)}
					{conpareResult === 'NOT_MATCH' && (
						<div>
							<Image src={FailImage} alt="Fail" />
							<p>
								<strong>{ProductName}</strong>이(가) 맞나요? 다른 상품을
								담아보세요.
							</p>
							<Button size="small" color="orange" text="확인"></Button>
						</div>
					)}
					{conpareResult === 'SIMILAR' && (
						<div>
							<Image src={WarningImage} alt="Warning" />
							<p>
								<strong>{ProductName}</strong>을(를) 몇 개 담으실건가요?
							</p>
							<div
								style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
							>
								<button onClick={decreaseQuantity} style={buttonStyle}>
									-
								</button>
								<div style={quantityStyle}>{quantity}</div>
								<button onClick={increaseQuantity} style={buttonStyle}>
									+
								</button>
							</div>
							<Button size="small_mid" color="gray" text="품절"></Button>
							<Button size="small_mid" color="gray" text="이유없음"></Button>
						</div>
					)}
				</div>
			</NonCloseModalLarge>
		</div>
	);
}

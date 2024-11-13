import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import React, { useRef, useState, useEffect } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
import * as StompJs from '@stomp/stompjs';
import { useAtom } from 'jotai';
import { shoppingListAtom } from '@/atoms/shoppingAtom';
import ParentProductCard from '@/components/shop/ParentProductCard';

const ShoppingListPage = () => {
	const [inputValue, setInputValue] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);

	useEffect(() => {
		const handleWebSocketMessage = (message: StompJs.Message) => {
			try {
				const response = JSON.parse(message.body) as WSShoppingResponse;
				console.log('WebSocket message:', message.body);

				switch (response.type) {
					case 'SHOPPING':
						setShoppingList(response.shoppingList);
						break;

					case 'ADD_PRODUCT_TO_CART':
						if (!response.listBarcode) return;
						setShoppingList(prev => {
							return prev.map(item => {
								if (item.barcode === response.listBarcode) {
									return {
										...item,
										cartItem: {
											barcode: response.barcode || '',
											category: item.category || '',
											productName: response.productName || '',
											image: response.image || '',
											quantity: response.quantity || 0,
											reason: response.reason || 'BLANK',
											status: response.status || 'NOT_MATCH',
										},
									};
								}
								return item;
							});
						});
						break;
					case 'DELETE_PRODUCT_FROM_CART':
						if (!response.listBarcode) return;
						setShoppingList(prev => {
							return prev.map(item => {
								if (item.barcode === response.listBarcode) {
									return {
										...item,
										cartItem: undefined,
									};
								}
								return item;
							});
						});
						break;
				}
			} catch (error) {
				console.error('Error processing WebSocket message:', error);
			}
		};

		childWebSocketClient.subscribe(
			'/user/sub/shopping/672df1def4c5cb7ca5d36532',
			handleWebSocketMessage,
		);

		return () => {
			childWebSocketClient.disconnect();
		};
	}, [setShoppingList]);

	const handleSuggestionClick = (message: string) => {
		if (message === '직접 입력') {
			inputRef.current?.focus();
			setInputValue('');
		} else {
			setInputValue(message);
		}
		setShowSuggestions(false);
	};

	const handleSendMessage = () => {
		if (!inputValue.trim()) return;

		const requestBody = {
			shoppingId: '6705102076ff19781935ca88', // 동적 Id로 변경 필요
			message: inputValue,
		};

		try {
			childWebSocketClient.sendMessage('/pub/shopping/message', requestBody);
			setInputValue('');
			setShowSuggestions(false);
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const renderShoppingItem = (item: ShoppingItem) => {
		// Case 4: 아이가 추가로 담은 상품
		if (item.cartItem && !item.productName) {
			return (
				<ParentProductCard
					key={item.cartItem.barcode}
					ParentsShoppingItem={{
						productName: '',
						quantity: 0,
						image: '',
					}}
					ChildrenShoppingItem={{
						productName: item.cartItem.productName,
						quantity: item.cartItem.quantity,
						image: item.cartItem.image,
					}}
					emptyMessage="아이가 추가로 담은 상품이에요"
				/>
			);
		}

		// Case 3: 부모 상품만 있는 경우
		if (!item.cartItem) {
			return (
				<ParentProductCard
					key={item.barcode}
					ParentsShoppingItem={{
						productName: item.productName,
						quantity: item.quantity,
						image: item.image,
					}}
					emptyMessage="아이가 아직 상품을 담지 않았어요"
				/>
			);
		}

		// Case 1 & 2: 매칭/유사 상품
		return (
			<ParentProductCard
				key={item.barcode}
				ParentsShoppingItem={{
					productName: item.productName,
					quantity: item.quantity,
					image: item.image,
				}}
				ChildrenShoppingItem={{
					productName: item.cartItem.productName,
					quantity: item.cartItem.quantity,
					image: item.cartItem.image,
				}}
				showWarning={item.cartItem.status === 'SIMILAR'}
			/>
		);
	};

	return (
		<div className="min-h-screen bg-light_yellow px-4 pt-4 pb-24">
			{/* 제목 */}
			<div className="flex items-center gap-2 mb-8 ml-4 mt-8">
				<button className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-md ">
					<span className="text-lg">&lt;</span>
				</button>
				<h1 className="text-xl font-bold ml-20">장보기 현황</h1>
			</div>

			<div className="mt-12">
				<div>
					<h2 className="text-lg font-semibold mb-4 ml-4">
						도움의 손길 보내기
					</h2>

					{/* 부모 메시지 전송 */}
					<div className="relative">
						<div className="flex w-[350px] rounded-3xl mb-4 p-3 gap-2 p-2 bg-light_yellow_btn">
							<input
								ref={inputRef}
								type="text"
								value={inputValue}
								onChange={e => setInputValue(e.target.value)}
								onFocus={() => setShowSuggestions(true)}
								onKeyPress={e => {
									if (e.key === 'Enter') {
										handleSendMessage();
									}
								}}
								className="w-[260px] h-10 px-4 rounded-full bg-white shadow-ml ml-2 focus:outline-none focus:ring-2 focus:ring-light_yellow_dark"
								placeholder="메시지를 입력하세요"
							/>
							<button onClick={handleSendMessage}>
								<span className="text-2xl bg-orange_main rounded-[50%] px-2 py-1 text-white">
									↑
								</span>
							</button>
						</div>

						{showSuggestions && (
							<div className="absolute top-16 left-3 w-[260px] bg-white rounded-xl shadow-sm z-10">
								<button
									onClick={() => handleSuggestionClick('수량이 잘못됐어요.')}
									className="w-full text-left py-2 px-4 border-b border-gray-100 hover:text-orange_main transition-colors"
								>
									수량이 잘못됐어요.
								</button>
								<button
									onClick={() => handleSuggestionClick('품목이 잘못됐어요.')}
									className="w-full text-left py-2 px-4 border-b border-gray-100 hover:text-orange_main transition-colors"
								>
									품목이 잘못됐어요.
								</button>
								<button
									onClick={() => handleSuggestionClick('직접 입력')}
									className="w-full text-left py-2 px-4 hover:text-orange_main transition-colors"
								>
									직접 입력
								</button>
							</div>
						)}
					</div>

					{/* 장바구니 컴포넌트 */}
					<h2 className="text-lg font-semibold mb-4 ml-4">아이의 장바구니</h2>
					<div className="space-y-4">
						{shoppingList.map(item => renderShoppingItem(item))}
					</div>
				</div>
			</div>
			<BottomNavbar />
		</div>
	);
};

export default ShoppingListPage;

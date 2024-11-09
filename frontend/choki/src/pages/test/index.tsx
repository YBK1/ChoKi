import React, { useEffect, useState } from 'react';
import {
	parentWebSocketClient,
	childWebSocketClient,
} from '@/lib/ws/socketUtils';
import * as StompJs from '@stomp/stompjs';

const WebSocketTestPage: React.FC = () => {
	const [parentMessages, setParentMessages] = useState<string[]>([]);
	const [childMessages, setChildMessages] = useState<string[]>([]);
	const [message, setMessage] = useState('');

	// 부모 역할로 연결, 구독, 메시지 수신 테스트
	useEffect(() => {
		// 부모 역할 WebSocket 연결 및 구독 설정
		parentWebSocketClient.connect();

		parentWebSocketClient.subscribe('/topic/parent', (msg: StompJs.Message) => {
			setParentMessages(prevMessages => [...prevMessages, msg.body]);
		});

		return () => {
			parentWebSocketClient.disconnect();
		};
	}, []);

	// 자식 역할로 연결, 구독, 메시지 수신 테스트
	useEffect(() => {
		// 자식 역할 WebSocket 연결 및 구독 설정
		childWebSocketClient.connect();

		childWebSocketClient.subscribe('/topic/child', (msg: StompJs.Message) => {
			setChildMessages(prevMessages => [...prevMessages, msg.body]);
		});

		return () => {
			childWebSocketClient.disconnect();
		};
	}, []);

	// 부모에게 메시지 전송
	const sendParentMessage = () => {
		parentWebSocketClient.sendMessage('/app/parent', {
			message,
			role: 'parent',
		});
		setMessage('');
	};

	// 자식에게 메시지 전송
	const sendChildMessage = () => {
		childWebSocketClient.sendMessage('/app/child', { message, role: 'child' });
		setMessage('');
	};

	return (
		<div>
			<h2>WebSocket Test Page</h2>
			<div>
				<h3>Send Message</h3>
				<input
					type="text"
					value={message}
					onChange={e => setMessage(e.target.value)}
					placeholder="Enter message"
				/>
				<button onClick={sendParentMessage}>Send to Parent</button>
				<button onClick={sendChildMessage}>Send to Child</button>
			</div>

			<div>
				<h3>Parent Messages</h3>
				<ul>
					{parentMessages.map((msg, index) => (
						<li key={index}>{msg}</li>
					))}
				</ul>
			</div>

			<div>
				<h3>Child Messages</h3>
				<ul>
					{childMessages.map((msg, index) => (
						<li key={index}>{msg}</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default WebSocketTestPage;

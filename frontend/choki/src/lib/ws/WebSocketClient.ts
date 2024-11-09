import * as StompJs from '@stomp/stompjs';
import { useSetAtom } from 'jotai';
import { shoppingListAtom } from '@/atoms/shoppingAtom';

class WebSocketClient {
	private client: StompJs.Client;
	private role: 'parent' | 'child';

	constructor(role: 'parent' | 'child') {
		this.role = role;
		this.client = new StompJs.Client({
			brokerURL: 'wss://choki.co.kr/ws/shopping',
			reconnectDelay: 20000,
			debug: str => {
				console.log(str);
			},
			onConnect: () => {
				console.log(`${this.role} connected to WebSocket`);
				this.sendMessage('/app/check-connection', {
					message: 'Connected successfully',
					role: this.role,
				});
			},
			onWebSocketError: error => {
				console.error(`${this.role} WebSocket Error:`, error);
			},
			onStompError: frame => {
				console.error(
					`${this.role} STOMP Error:`,
					frame.headers['message'],
					frame.body,
				);
			},
		});
	}

	private getAccessToken() {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('access');
		}
		return null;
	}

	connect() {
		const token = this.getAccessToken() || '';
		if (token) {
			this.client.connectHeaders = { access: token };
			this.client.activate();
			console.log(`Activating ${this.role} WebSocket Client...`);
		} else {
			console.error('Access token not found');
		}
	}

	disconnect() {
		this.client.deactivate();
		console.log(`${this.role} disconnected from WebSocket`);
	}

	subscribe(topic: string, callback: (message: StompJs.Message) => void) {
		this.client.onConnect = () => {
			const token = this.getAccessToken() || '';
			console.log(`${this.role} connected to topic: ${topic}`);

			this.client.subscribe(
				topic,
				message => {
					console.log(
						`${this.role} received message on topic ${topic}:`,
						message.body,
					);
					// 메시지 body에서 shoppingList 데이터를 추출하여 전역 Atom에 업데이트
					const data = JSON.parse(message.body);
					if (data && data.shoppingList) {
						useSetAtom(shoppingListAtom)(data.shoppingList); // Atom 업데이트
					}
					callback(message);
				},
				{ access: token },
			);
		};

		if (!this.client.active) {
			this.connect();
		}
	}

	sendMessage(destination: string, message: object) {
		if (this.client.connected) {
			this.client.publish({
				destination,
				body: JSON.stringify(message),
				headers: { access: this.getAccessToken() || '' },
			});
			console.log(`${this.role} sent message to ${destination}:`, message);
		} else {
			console.error(`${this.role} client not connected`);
		}
	}
}

const parentWebSocketClient = new WebSocketClient('parent');
const childWebSocketClient = new WebSocketClient('child');

export { parentWebSocketClient, childWebSocketClient };

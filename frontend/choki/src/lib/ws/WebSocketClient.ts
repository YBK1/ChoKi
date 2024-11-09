import * as StompJs from '@stomp/stompjs';

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

	// Fetches token from localStorage each time for updated access
	private getAccessToken() {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('access');
		}
		return null;
	}

	connect() {
		const token = this.getAccessToken() || '';
		if (token) {
			this.client.connectHeaders = { access: token }; // Add token to connect headers
			this.client.activate();
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

			this.client.subscribe(
				topic,
				message => {
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
				headers: { access: this.getAccessToken() || '' }, // Send token with message
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

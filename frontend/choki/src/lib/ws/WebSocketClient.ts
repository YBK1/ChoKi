import * as StompJs from '@stomp/stompjs';

class WebSocketClient {
	private client: StompJs.Client;
	private accessToken: string | null;
	private role: 'parent' | 'child';

	constructor(role: 'parent' | 'child') {
		this.role = role;

		if (typeof window !== 'undefined') {
			// Only access `localStorage` in the client
			this.accessToken = localStorage.getItem('access');
		} else {
			this.accessToken = null;
		}

		this.client = new StompJs.Client({
			brokerURL: 'wss://choki.co.kr/ws/shopping',
			connectHeaders: {
				access: `${this.accessToken || ''}`,
			},
			reconnectDelay: 20000,
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

	connect() {
		if (this.accessToken) {
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
			this.client.subscribe(topic, message => {
				console.log(
					`${this.role} received message on topic ${topic}:`,
					message.body,
				);
				callback(message);
			});
			console.log(`${this.role} subscribed to topic: ${topic}`);
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
			});
			console.log(`${this.role} sent message to ${destination}:`, message);
		} else {
			console.error(`${this.role} client not connected`);
		}
	}
}

const parentWebSocketClient = new WebSocketClient('parent');
const childWebSocketClient = new WebSocketClient('child');

// Export instances based on the role
export { parentWebSocketClient, childWebSocketClient };

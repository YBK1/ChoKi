import * as StompJs from '@stomp/stompjs';

class WebSocketClient {
	private client: StompJs.Client;
	private accessToken: string | null;

	constructor() {
		this.accessToken = localStorage.getItem('accessToken');
		this.client = new StompJs.Client({
			brokerURL: 'ws://your_websocket_server_url/ws',
			connectHeaders: {
				Authorization: `Bearer ${this.accessToken || ''}`,
			},
			reconnectDelay: 200,
			onConnect: () => {
				console.log('Connected to WebSocket');
			},
			onWebSocketError: error => {
				console.error('WebSocket Error:', error);
			},
			onStompError: frame => {
				console.error('STOMP Error:', frame.headers['message'], frame.body);
			},
		});
	}

	connect() {
		if (this.accessToken) {
			this.client.activate();
			console.log('Activating WebSocket Client...');
		} else {
			console.error('Access token not found');
		}
	}

	disconnect() {
		this.client.deactivate();
		console.log('Disconnected from WebSocket');
	}

	subscribe(topic: string, callback: (message: StompJs.Message) => void) {
		if (this.client.connected) {
			this.client.subscribe(topic, message => {
				callback(message);
			});
			console.log(`Subscribed to topic: ${topic}`);
		} else {
			console.error('Client not connected');
		}
	}

	sendMessage(destination: string, message: object) {
		if (this.client.connected) {
			this.client.publish({
				destination,
				body: JSON.stringify(message),
			});
			console.log('Message sent:', message);
		} else {
			console.error('Client not connected');
		}
	}
}

const webSocketClient = new WebSocketClient();

// Export the instance
export default webSocketClient;

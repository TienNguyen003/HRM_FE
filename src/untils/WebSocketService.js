import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export function WebSocketService({ urlWs, callback }) {
    const socket = new SockJS('http://localhost:8083/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/${urlWs}`, (message) => {
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    });

    return () => {
        if (stompClient) {
            stompClient.disconnect();
        }
    };
}

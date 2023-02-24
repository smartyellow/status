const socketUrl = window.location.href.replace('http', 'ws') + '/socket';
let reconnectAttempts = 0;
let ws;

export async function connect({ onData }) {
  ws = new WebSocket(socketUrl);

  ws.onmessage = async evt => {
    const data = JSON.parse(evt.data || '{}');
    onData(data);
  };

  ws.onopen = () => {
    if (reconnectAttempts) {
      window.location.reload();
    }
  };

  ws.onclose = async () => {
    console.error(`Websocket closed, trying to reconnect... (#${reconnectAttempts++})`);
    await new Promise(res => setTimeout(res, reconnectAttempts * 500));
    await connect({ onData });
  };

  ws.onerror = err => console.error('Connection error:', err);
}

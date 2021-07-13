import constants from "./constants";

class WebSocketClient {
  constructor(options) {
    this.ws = options.ws;
    this.serverUrl = options.serverUrl;
    this.eventHandlers = this._defaultEventhandlers();
    if (this.ws && !options.noMessageEventHandler) {
      this.setMessageEventHandler();
    }
  }

  connect() {
    if (this.ws) {
      return;
    }
    const that = this;
    return new Promise((resolve, reject) => {
      that.ws = new WebSocket(that.serverUrl);
      that.ws.onopen = () => {
        console.log(`WebSocketClient connected`);
        resolve();
      };
      that.ws.onerror = (err) => {
        reject(err);
      };
      that.ws.onclose = () => {
        console.log(`WebSocketClient disconnected: [${that.ws.id}]`);
      };
      that.setMessageEventHandler();
    });
  }

  disconnect() {
    this.ws.close();
  }

  send(message) {
    message.internal = true;
    message = JSON.stringify(message);
    this.ws.send(message);
  }

  setMessageEventHandler() {
    let that = this;
    that.ws.onmessage = (message) => {
      const { data } = message;
      that.handleEvent(JSON.parse(data));
    };
  }

  setCustomEventHandlers(handlers) {
    this.eventHandlers = {
      ...this.eventHandlers,
      ...handlers,
    };
  }

  handleEvent(message) {
    if (!message.internal) {
      return;
    }
    const { event } = message;
    if (event in this.eventHandlers) {
      this.eventHandlers[event](message.data);
    } else {
      console.warn(
        `No valid event handler set for event "${event}"\n${message}`
      );
    }
  }

  _defaultEventhandlers() {
    let that = this;
    return {
      [constants.ESTABLISH_WS_ID]: (data) => {
        that.ws.id = data.id;
        console.log(`WebSocketClient established ID: [${that.ws.id}]`);
      },
    };
  }
}

export default WebSocketClient;

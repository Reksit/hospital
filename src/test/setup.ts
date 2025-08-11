import '@testing-library/jest-dom';

// Mock WebSocket for tests
global.WebSocket = class WebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = WebSocket.CONNECTING;
  
  constructor() {
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
    }, 0);
  }

  send() {}
  close() {
    this.readyState = WebSocket.CLOSED;
  }
  addEventListener() {}
  removeEventListener() {}
};

// Mock geolocation
Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(() => 1),
    clearWatch: jest.fn(),
  },
  writable: true,
});

// Mock Google Maps
global.google = {
  maps: {
    Map: class {
      constructor() {}
    },
    Marker: class {
      constructor() {}
      setMap() {}
    },
    InfoWindow: class {
      constructor() {}
      open() {}
      close() {}
    }
  }
} as any;
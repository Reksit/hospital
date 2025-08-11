import { io, Socket } from 'socket.io-client';
import type { LocationUpdate } from '../types/ambulance';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    // Mock WebSocket connection for demonstration
    console.log('Connecting to WebSocket with token:', token);
    
    // In production, replace with actual WebSocket server
    this.socket = io('ws://localhost:3001', {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Ambulance location tracking
  subscribeToLocationUpdates(callback: (update: LocationUpdate) => void) {
    if (!this.socket) {
      console.warn('WebSocket not connected');
      return;
    }

    this.socket.on('location_update', callback);
    this.socket.emit('subscribe_location_updates');
  }

  unsubscribeFromLocationUpdates() {
    if (!this.socket) return;
    
    this.socket.off('location_update');
    this.socket.emit('unsubscribe_location_updates');
  }

  sendLocationUpdate(update: LocationUpdate) {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected, cannot send location update');
      return;
    }

    this.socket.emit('location_update', update);
  }

  // Emergency calls
  subscribeToEmergencyCalls(callback: (call: any) => void) {
    if (!this.socket) return;
    
    this.socket.on('new_emergency_call', callback);
    this.socket.emit('subscribe_emergency_calls');
  }

  // Staff assignments
  subscribeToAssignments(staffId: string, callback: (assignment: any) => void) {
    if (!this.socket) return;
    
    this.socket.on('new_assignment', callback);
    this.socket.emit('subscribe_staff_assignments', { staffId });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        if (!this.socket?.connected) {
          this.socket?.connect();
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
}

export const websocketService = new WebSocketService();
import { io, Socket } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../utils/network';

class SocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor(url: string = SOCKET_BASE_URL) {
    this.url = url;
  }

  connect(token: string) {
    this.socket = io(this.url, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Pool events
  onPoolUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('pool:update', callback);
    }
  }

  offPoolUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('pool:update', callback);
    }
  }

  // Reward events
  onRewardAccrued(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('reward:accrued', callback);
    }
  }

  offRewardAccrued(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('reward:accrued', callback);
    }
  }

  // Transaction events
  onTransactionConfirmed(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('transaction:confirmed', callback);
    }
  }

  offTransactionConfirmed(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('transaction:confirmed', callback);
    }
  }

  // Generic event listeners
  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

export const socketService = new SocketService(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
);

import { inject, Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { APP_SETTINGS } from '../config/app-settings';
import { TrainerRealtimePort } from './trainer-realtime.port';

@Injectable()
export class SockJsTrainerRealtimeGateway implements TrainerRealtimePort {
  private readonly settings = inject(APP_SETTINGS);
  private socket: WebSocket | null = null;
  private readonly events = new Subject<string>();
  readonly events$ = this.events.asObservable();

  connect(): void {
    if (!this.settings.realtimeEnabled || this.socket) return;
    if (!this.settings.realtimeUrl.startsWith('https://')) throw new Error('SockJS requires HTTPS');
    const socket = new SockJS(this.settings.realtimeUrl);
    socket.onmessage = event => this.events.next(event.data);
    socket.onclose = () => { this.socket = null; };
    this.socket = socket;
  }
  disconnect(): void { this.socket?.close(); this.socket = null; }
}

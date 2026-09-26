import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { APP_SETTINGS } from '../config/app-settings';
import { TrainerRealtimePort } from './trainer-realtime.port';

type SockJsSocket = {
  onmessage: ((event: MessageEvent<string>) => void) | null;
  onclose: (() => void) | null;
  close(): void;
};

type SockJsWindow = Window & { SockJS?: new (url: string) => SockJsSocket };

@Injectable()
export class SockJsTrainerRealtimeGateway implements TrainerRealtimePort {
  private readonly settings = inject(APP_SETTINGS);
  private socket: SockJsSocket | null = null;
  private loading: Promise<void> | null = null;
  private readonly events = new Subject<string>();
  readonly events$ = this.events.asObservable();

  async connect(): Promise<void> {
    if (!this.settings.realtimeEnabled || this.socket) return;
    if (!this.settings.realtimeUrl.startsWith('https://')) throw new Error('SockJS requires HTTPS');
    await this.loadClient();
    if (this.socket) return;
    const SockJS = (window as SockJsWindow).SockJS;
    if (!SockJS) throw new Error('SockJS client did not initialize');
    const socket = new SockJS(this.settings.realtimeUrl);
    socket.onmessage = event => this.events.next(event.data);
    socket.onclose = () => { this.socket = null; };
    this.socket = socket;
  }

  disconnect(): void { this.socket?.close(); this.socket = null; }

  private loadClient(): Promise<void> {
    if ((window as SockJsWindow).SockJS) return Promise.resolve();
    if (this.loading) return this.loading;
    this.loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/vendor/sockjs.min.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => { script.remove(); reject(new Error('Unable to load SockJS client')); };
      document.head.append(script);
    }).finally(() => { this.loading = null; });
    return this.loading;
  }
}

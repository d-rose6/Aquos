import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit, OnDestroy {
  @Input() deviceName = 'Cozinha';
  @Input() deviceId = '1';
  @Input() status: 'Online' | 'Offline' = 'Online';
  @Input() valveControlEnabled = false;   // controle desativado por enquanto
  @Input() liveFlow = true;

  open = false;
  flow = 0;
  total = 29.24;
  today = 29.24;
  month = 0.85;
  lastRead = '17:37';
  confirming = false;

  private timer?: number;

  get online(): boolean { return this.status === 'Online'; }
  get statusDot(): string { return this.online ? '#3ecf7a' : '#ec3013'; }
  get valveState(): string { return this.open ? 'Aberta' : 'Fechada'; }
  get valveChipBg(): string { return this.open ? '#3d97ff' : '#ec3013'; }

  /** 0..1 — usado para densidade das gotas e altura da poça */
  get intensity(): number { return Math.min(1, this.flow / 10); }
  /** quantizado para as animações não reiniciarem a cada tick */
  private get step(): number { return Math.round(this.intensity * 5) / 5; }
  get dropCount(): number { return this.open ? Math.max(2, Math.round(this.step * 12)) : 0; }
  get drops(): number[] { return Array.from({ length: this.dropCount }, (_, i) => i); }
  get dropSpeed(): number { return this.open ? +(1.5 - this.step * 0.95).toFixed(2) : 1.5; }
  get poolHeight(): string { return this.open ? `${(6 + this.intensity * 26).toFixed(0)}px` : '0px'; }

  dropStyle(i: number): Record<string, string> {
    return {
      left: `${(i % 3 - 1) * 1.5 - 5}px`,
      animationDuration: `${this.dropSpeed}s`,
      animationDelay: `${(i * this.dropSpeed / Math.max(1, this.dropCount)).toFixed(2)}s`
    };
  }

  ngOnInit(): void {
    this.timer = window.setInterval(() => {
      if (!this.open || !this.liveFlow) { return; }
      this.flow = Math.max(0, 6.4 + (Math.random() - 0.5) * 1.6);
      const add = this.flow / 60;
      this.total += add;
      this.today += add;
      this.month += add;
    }, 1000);
  }

  ngOnDestroy(): void { if (this.timer) { clearInterval(this.timer); } }

  setValve(open: boolean): void {
    if (!this.valveControlEnabled) { return; }
    this.open = open;
    this.flow = open ? 6.4 : 0;
  }

  toggleValve(): void { this.setValve(!this.open); }
  goBack(): void { history.back(); }
}

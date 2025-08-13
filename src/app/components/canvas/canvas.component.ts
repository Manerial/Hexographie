import {Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, HostListener} from '@angular/core';
import {HexographieService} from '../../services/hexographie.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  imports: [
    FormsModule
  ],
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent implements OnChanges, AfterViewInit {
  ctx: CanvasRenderingContext2D | undefined;
  @Input() text = '';
  @ViewChild('myCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  percentWidth = 100;
  percentHeight = 100;
  canvasWidth = 0;
  canvasHeight = 0;

  constructor(private hexographieService: HexographieService) {
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.updateCanvasSize();
  }

  // Redessine après un resize fenêtre
  @HostListener('window:resize')
  onResize() {
    this.updateCanvasSize();
  }

  // Recalcule si on change le pourcentage
  updateCanvasSize() {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.canvasWidth = Math.floor((window.innerWidth - rect.x * 2 - 20) * (this.percentWidth / 100));
    this.canvasHeight = Math.floor((window.innerHeight - rect.y) * (this.percentHeight / 100));
    this.draw();
  }

  ngOnChanges() {
    this.draw();
  }

  draw() {
    setTimeout(() => {
      if (this.canvas && this.ctx) {
        this.hexographieService.drawText(this.ctx, this.text);
      }
    });
  }
}

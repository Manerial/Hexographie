import {Component, ElementRef, ViewChild} from '@angular/core';
import {CanvasComponent} from '../canvas/canvas.component';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-renderer',
  imports: [
    CanvasComponent,
    FormsModule,
    NgForOf
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  message = '';
  specialChars = ['ã', 'ɛ', 'ŋ', 'χ', 'ʁ', 'ʃ', 'ʒ'];
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;

  insertChar(char: string) {
    const inputEl = this.textInput.nativeElement;
    // Position du curseur
    const start = inputEl.selectionStart ?? 0;
    const end = inputEl.selectionEnd ?? 0;

    // Insertion du caractère à la position actuelle
    this.message =
      this.message.substring(0, start) +
      char +
      this.message.substring(end);

    // Remet le curseur après le caractère inséré
    const newPos = start + char.length;
    setTimeout(() => {
      inputEl.selectionStart = inputEl.selectionEnd = newPos;
      inputEl.focus();
    });
  }
}

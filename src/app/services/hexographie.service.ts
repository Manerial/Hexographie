import {Injectable} from '@angular/core';
import data from '../assets/phonemesTranscription.json';

type PhonemeMap = Record<string, string[]>;

const consonants: PhonemeMap = data.consonants;
const vowels: PhonemeMap = data.vowels;
const offset = 10;
const radius = 30;
const sideH = 20 * (radius / 20);

@Injectable({providedIn: 'root'})
export class HexographieService {
  index = 0;
  line = 0;

  drawText(ctx: CanvasRenderingContext2D, text: string) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.index = 0;
    this.line = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (this.isConsonant(char) && this.isConsonant(text[i - 1])) {
        this.increaseIndex(ctx);
      }
      this.drawCharacter(ctx, char);
      if (i === text.length - 1) {
        this.drawCharacter(ctx, ' ');
      }
      if (this.isVowel(char) || char === ' ' || char === '.') {
        this.increaseIndex(ctx);
      }
    }
  }

  private increaseIndex(ctx: CanvasRenderingContext2D) {
    const currentX = this.getCenterX();
    if (this.line % 2 === 0 && currentX + this.getCharSize() + radius > ctx.canvas.width) {
      this.line++;
      this.index -= 0.5;
    } else if (this.line % 2 === 1 && currentX - this.getCharSize() - radius < 0) {
      this.line++;
      this.index -= 0.5;
    } else {
      if (this.line % 2 === 0) {
        this.index++;
      } else {
        this.index--;
      }
    }
  }

  private isVowel(char: string): boolean {
    return vowels[char] !== undefined;
  }

  private isConsonant(char: string): boolean {
    return consonants[char] !== undefined;
  }

  private moveTo(ctx: CanvasRenderingContext2D, point: { x: number, y: number }) {
    ctx.moveTo(point.x, point.y);
  }


  private lineTo(ctx: CanvasRenderingContext2D, point: { x: number, y: number }) {
    ctx.lineTo(point.x, point.y);
  }

  private getCenterX() {
    const start = offset + radius;
    return start + this.index * this.getCharSize();
  }

  private getCenterY() {
    const start = offset + radius + sideH / 2;
    const characterHeight = this.getCharSize();
    return start + this.line * characterHeight;
  }

  private getCharSize() {
    return radius * 2;
  }

  private drawCharacter(ctx: CanvasRenderingContext2D, char: string) {
    const centerX = this.getCenterX();
    const centerY = this.getCenterY();

    const center = {x: centerX, y: centerY};
    const top = {x: centerX, y: centerY - (sideH / 2 + radius)};
    const topRight = {x: centerX + radius, y: centerY - sideH / 2};
    const bottomRight = {x: centerX + radius, y: centerY + sideH / 2};
    const bottom = {x: centerX, y: centerY + (sideH / 2 + radius)};
    const bottomLeft = {x: centerX - radius, y: centerY + sideH / 2};
    const topLeft = {x: centerX - radius, y: centerY - sideH / 2};

    const startEOW = {x: centerX, y: centerY - sideH / 2};
    const endEOW = (this.line % 2 == 0)
      ? {x: centerX + radius / 2, y: centerY - sideH / 2 - radius / 2}
      : {x: centerX - radius / 2, y: centerY - sideH / 2 - radius / 2};
    const startEOP = {x: centerX, y: centerY + sideH / 2};
    const endEOP = (this.line % 2 == 0)
      ? {x: centerX + radius / 2, y: centerY + sideH / 2 + radius / 2}
      : {x: centerX - radius / 2, y: centerY + sideH / 2 + radius / 2};

    const consonant = (consonants[char] || []).join(' ');
    const vowel = (vowels[char] || []).join(' ');

    ctx.beginPath();
    // Build the consonant
    if (consonant.includes('labial')) {
      this.moveTo(ctx, bottomLeft);
      this.lineTo(ctx, bottom);
    }
    if (consonant.includes('dental')) {
      this.moveTo(ctx, topLeft);
      this.lineTo(ctx, bottomLeft);
    }
    if (consonant.includes('alveolar')) {
      this.moveTo(ctx, topLeft);
      this.lineTo(ctx, top);
    }
    if (consonant.includes('occlusive')) {
      this.moveTo(ctx, bottomLeft);
      this.lineTo(ctx, bottom);
      this.moveTo(ctx, topLeft);
      this.lineTo(ctx, top);
    }
    if (consonant.includes('fricative')) {
      this.moveTo(ctx, top);
      this.lineTo(ctx, bottom);
    }
    if (consonant.includes('voiced')) {
      this.moveTo(ctx, topLeft);
      this.lineTo(ctx, topRight);
    }
    if (consonant.includes('nasal')) {
      this.moveTo(ctx, bottomLeft);
      this.lineTo(ctx, bottomRight);
    }

    // Build the vowel
    if (vowel.includes('top-left')) {
      this.moveTo(ctx, center);
      this.lineTo(ctx, topLeft);
    }
    if (vowel.includes('top-right')) {
      this.moveTo(ctx, center);
      this.lineTo(ctx, topRight);
    }
    if (vowel.includes('bottom-right')) {
      this.moveTo(ctx, center);
      this.lineTo(ctx, bottomRight);
    }
    if (vowel.includes('bottom-left')) {
      this.moveTo(ctx, center);
      this.lineTo(ctx, bottomLeft);
    }

    // Build the end of a word
    if (char === ' ') {
      this.moveTo(ctx, startEOW);
      this.lineTo(ctx, endEOW);
    }
    // Build the end of a phrase
    if (char === '.') {
      this.moveTo(ctx, startEOP);
      this.lineTo(ctx, endEOP);
    }

    // Draw the character
    ctx.stroke();
  }
}

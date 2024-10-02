import { Component, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ball',
  standalone: true,
  imports: [],
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.css']
})
export class BallComponent {
  @Output() transitionEnd = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  triggerImageChange() {
    console.log('triggerImageChange called for BallComponent'); // Debug log
    this.resetGifs();
  }

  resetGifs() {
    const mandalaGif = this.elementRef.nativeElement.querySelector('#mandala-gif');
    const fireballGif = this.elementRef.nativeElement.querySelector('#fireball-gif');
    if (mandalaGif && fireballGif) {
      // Masquer les images avant de les réinitialiser
      mandalaGif.style.display = 'none';
      fireballGif.style.display = 'none';

      const mandalaGifSrc = mandalaGif.src;
      const fireballGifSrc = fireballGif.src;
      mandalaGif.src = '';
      fireballGif.src = '';
      setTimeout(() => {
        mandalaGif.src = mandalaGifSrc;
        fireballGif.src = fireballGifSrc;

        // Afficher les images après les avoir rechargées
        mandalaGif.style.display = 'block';
        fireballGif.style.display = 'block';

        // Déclencher la transition d'opacité après un court délai
        setTimeout(() => {
          fireballGif.style.opacity = '1';
          mandalaGif.classList.add('fade-out');

          // Écouter la fin de la transition
          fireballGif.addEventListener('transitionend', () => {
            this.transitionEnd.emit();
          }, { once: true });
        }, 2000); // Delay to ensure the GIFs are reloaded and start transition after 2 seconds
      }, 50); // Small delay to ensure the GIFs are reloaded
    }
  }
}

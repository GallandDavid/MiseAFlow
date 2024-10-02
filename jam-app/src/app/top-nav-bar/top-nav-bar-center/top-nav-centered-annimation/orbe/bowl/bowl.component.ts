import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-bowl',
  standalone: true,
  imports: [],
  templateUrl: './bowl.component.html',
  styleUrls: ['./bowl.component.css']
})
export class BowlComponent {
  constructor(private elementRef: ElementRef) {}

  triggerImageChange() {
    console.log('triggerImageChange called'); // Debug log
    this.resetGifs();
  }

  resetGifs() {
    const topGif = this.elementRef.nativeElement.querySelector('#top-gif');
    const newGif = this.elementRef.nativeElement.querySelector('#new-gif');
    if (topGif && newGif) {
      // Masquer les images avant de les réinitialiser
      topGif.style.display = 'none';
      newGif.style.display = 'none';

      const topGifSrc = topGif.src;
      const newGifSrc = newGif.src;
      topGif.src = '';
      newGif.src = '';
      setTimeout(() => {
        topGif.src = topGifSrc;
        newGif.src = newGifSrc;

        // Afficher les images après les avoir rechargées
        topGif.style.display = 'block';
        newGif.style.display = 'block';

        // Déclencher la transition d'opacité après un court délai
        setTimeout(() => {
          newGif.style.opacity = '1';
          topGif.classList.add('fade-out');
        }, 50); // Small delay to ensure the GIFs are reloaded
      }, 50); // Small delay to ensure the GIFs are reloaded
    }
  }
}

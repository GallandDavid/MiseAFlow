import { AfterViewInit, Component, ElementRef, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent  implements AfterViewInit, OnInit {

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
      this.initAnimations()
  }


  private initAnimations() {
    this.initBatonAnimation()
  }

  private initBatonAnimation(){
      const batton = this.elementRef.nativeElement.querySelector('.container');
      if (!batton) return;
      const battonImg = this.elementRef.nativeElement.querySelector('.batton-img');
      const topGIF = this.elementRef.nativeElement.querySelector('.batton-top-gif img');
      const bottomGIF = this.elementRef.nativeElement.querySelector('.batton-bottom-gif img');

      const baseSpeed = 2000; // Durée de rotation en ms (2 secondes)
      let currentSpeed = baseSpeed;
      let targetSpeed = baseSpeed;
      let speedChangeRate = 50; // Augmenté pour une transition plus lente
      let lastTime = performance.now(); // Temps initial
      let angle = 0; // Angle actuel de rotation
      let lastAngleBeforeLeave = 0;

      function updateAnimationSpeed(timestamp: number) {
        const elapsedTime = timestamp - lastTime;
        lastTime = timestamp;

        if (currentSpeed !== targetSpeed) {
          const diff = targetSpeed - currentSpeed;
          const step = Math.abs(diff) > speedChangeRate ? speedChangeRate : diff;
          currentSpeed += step;
          currentSpeed = Math.max(baseSpeed, Math.min(currentSpeed, Infinity)); // Limite la vitesse entre baseSpeed et Infinity
        }
        // Met à jour l'angle de rotation
        angle += (elapsedTime / currentSpeed) * 360;
        batton.style.transform = `rotate(${angle}deg)`;
        requestAnimationFrame(updateAnimationSpeed);
      }

      batton.addEventListener('mouseenter', () => {
        lastAngleBeforeLeave = angle; // Enregistre l'angle actuel
        targetSpeed = Infinity; // Ralentit progressivement jusqu'à s'arrêter
        // Réinitialisez les positions des GIFs
        topGIF.style.top = '0%';
        bottomGIF.style.bottom = '0%';
      });

      batton.addEventListener('mouseleave', () => {
        targetSpeed = baseSpeed; // Définis la nouvelle cible pour la vitesse
        currentSpeed = Math.min(currentSpeed, baseSpeed); // Assure que la vitesse actuelle est inférieure ou égale à la vitesse cible
        // Réinitialisez les positions des GIFs
        topGIF.style.top = '0%';
        bottomGIF.style.bottom = '0%';
      });

      // Ajoutez un écouteur d'événements pour détecter la rotation de l'image
      battonImg.addEventListener('animationiteration', () => {
        // Réinitialisez les positions des GIFs à chaque rotation complète
        topGIF.style.top = '0%';
        bottomGIF.style.bottom = '0%';
      });
      
      updateAnimationSpeed(performance.now());
  }
}

import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { AnimationService } from '../animation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements AfterViewInit, OnInit {
  private animationSubscription!: Subscription;

  @Output() transitionEnd = new EventEmitter<void>();
  @Output() rotationEnd = new EventEmitter<void>(); // New EventEmitter

  constructor(private elementRef: ElementRef, private ngZone: NgZone, private animationService: AnimationService) {}

  ngOnInit() {
    this.animationSubscription = this.animationService.startAnimation$.subscribe(() => {
      this.startRotation();
    });
  }

  ngAfterViewInit() {
    // Any additional initialization
  }

  ngOnDestroy() {
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
  }

  private startRotation() {
    const batton = this.elementRef.nativeElement.querySelector('.container');
    if (!batton) return;
  
    let angle = 0;
    const initialSpeed = 0; // Initial speed in degrees per second
    const targetSpeed = 90; // Target speed in degrees per second
    const duration = 4000; // Duration to reach the target speed in milliseconds
    const startTime = performance.now();
  
    const rotate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentSpeed = initialSpeed + (targetSpeed - initialSpeed) * progress;
      const deltaTime = (timestamp - startTime) / 1000; // Time in seconds
      angle += currentSpeed * (1 / 180); // Assuming 60 FPS for smoother animation
      batton.style.transform = `rotate(${angle}deg)`;
      if (progress < 1) {
        requestAnimationFrame(rotate);
      } else {
        this.continueRotation(angle, targetSpeed);
        this.rotationEnd.emit(); // Emit event when the first rotation ends
      }
    };
  
    requestAnimationFrame(rotate);
  }

  private continueRotation(startAngle: number, speed: number) {
    const batton = this.elementRef.nativeElement.querySelector('.container');
    if (!batton) return;

    let angle = startAngle;
    let lastTimestamp = performance.now();

    const rotate = (timestamp: number) => {
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      const deltaAngle = speed * (elapsed / 1000);
      angle += deltaAngle;
      batton.style.transform = `rotate(${angle}deg)`;
      requestAnimationFrame(rotate);
    };

    requestAnimationFrame(rotate);

    // Appeler triggerImageChange après avoir commencé la rotation continue
    this.triggerImageChange();
  }

  triggerImageChange() {
    console.log('triggerImageChange called for StaffComponent'); // Debug log
    setTimeout(() => {
      this.resetGifs();
    }, 3000); // Delay of 1 second (1000 milliseconds)
  }

  resetGifs() {
    console.log('resetGifs called for StaffComponent'); // Debug log
    const gifOverlays = this.elementRef.nativeElement.querySelectorAll('.gif-overlay-batton');
    if (gifOverlays.length) {
      console.log('GIF overlays found:', gifOverlays.length); // Debug log
      // Masquer les images avant de les réinitialiser
      gifOverlays.forEach((gif:any) => gif.style.display = 'none');

      setTimeout(() => {
        // Afficher les images après les avoir rechargées
        gifOverlays.forEach((gif:any) => gif.style.display = 'block');

        // Déclencher la transition d'opacité après un court délai
        setTimeout(() => {
          gifOverlays.forEach((gif:any) => gif.style.opacity = '1');

          // Écouter la fin de la transition
          gifOverlays[0].addEventListener('transitionend', () => {
            this.transitionEnd.emit();
          }, { once: true });
        }, 50); // Small delay to ensure the GIFs are reloaded
      }, 50); // Small delay to ensure the GIFs are reloaded
    } else {
      console.log('No GIF overlays found'); // Debug log
    }
  }
}

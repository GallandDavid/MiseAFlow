import { AfterViewInit, Component, ElementRef, NgZone, OnInit } from '@angular/core';
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
    const targetSpeed = 180; // Target speed in degrees per second
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
  }
}

import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { BallComponent } from "./ball/ball.component";
import { BowlComponent } from "./bowl/bowl.component";
import { OrbeService } from "../orbe.service";
import { gsap } from 'gsap';

@Component({
  selector: 'app-orbe',
  standalone: true,
  imports: [BallComponent, BowlComponent],
  templateUrl: './orbe.component.html',
  styleUrls: ['./orbe.component.css']
})
export class OrbeComponent implements OnInit, AfterViewInit {
  private firstOrbeElement!: HTMLElement;
  private secondOrbeElement!: HTMLElement | null;
  private timeline: gsap.core.Timeline | null = null;

  constructor(private elementRef: ElementRef, public orbeService: OrbeService) {}

  ngOnInit() {
    console.log('OnInit called');
    this.firstOrbeElement = this.elementRef.nativeElement.querySelector('.ball').closest('.first-orbe');
    if(this.firstOrbeElement != null) {
      this.orbeService.setBallElements({first:this.firstOrbeElement,second:this.orbeService.getBallElements().second});
    } else {
      this.secondOrbeElement = this.elementRef.nativeElement.querySelector('.ball').closest('.second-orbe');
      if(this.secondOrbeElement != null){
        this.orbeService.setBallElements({first:this.orbeService.getBallElements().first, second:this.secondOrbeElement!});
      }
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');

    if(this.firstOrbeElement != null) {
      this.firstOrbeElement = this.orbeService.getBallElements().first as HTMLElement;
      this.secondOrbeElement = this.orbeService.getBallElements().second as HTMLElement;
    } else {
      this.secondOrbeElement = this.orbeService.getBallElements().first as HTMLElement;
      this.firstOrbeElement = this.orbeService.getBallElements().second as HTMLElement;
    }

    this.firstOrbeElement = this.firstOrbeElement.querySelector('.ball')as HTMLElement;
    this.secondOrbeElement = this.secondOrbeElement.querySelector('.ball');

    console.log('First ball element:', this.firstOrbeElement);
    console.log('Second ball element:', this.secondOrbeElement);

    this.animateBallPosition();
  }

  async animateBallPosition() {
    if (!this.firstOrbeElement || !this.secondOrbeElement) {
      console.error('Ball elements not found');
      return;
    }

    const containerPos = await getAccuratePosition(this.elementRef.nativeElement.closest('.container'));
    const firstBallPos = await getAccuratePosition(this.firstOrbeElement);
    const secondBallPos = await getAccuratePosition(this.secondOrbeElement);

    const finalFirstX = secondBallPos.x - containerPos.x;
    const finalFirstY = secondBallPos.y - containerPos.y;
    const finalSecondX = firstBallPos.x - containerPos.x;
    const finalSecondY = firstBallPos.y - containerPos.y;

    if (this.timeline) {
      this.timeline.kill(); // Arrête toute animation précédente
    }

    this.timeline = gsap.timeline({ repeat: -1 }); // Crée une nouvelle timeline qui se répète indéfiniment

    this.timeline
      .addLabel("start")
      .to(this.firstOrbeElement, {
        duration: 1.0,
        ease: 'power2.inOut',
        x: finalFirstX,
        y: finalFirstY
      })
      .to(this.secondOrbeElement, {
        duration: 1.0,
        ease: 'power2.inOut',
        x: finalSecondX,
        y: finalSecondY
      }, 0)
      .addLabel("end");

    console.log(`Début : Premier élément (${firstBallPos.x}px, ${firstBallPos.y}px), Second élément (${secondBallPos.x}px, ${secondBallPos.y}px)`);

    this.timeline.eventCallback("onRepeat", () => {
      console.log(`Animation répétée`);
    });

    this.timeline.eventCallback("onComplete", () => {
      console.log(`Animation terminée`);
    });

    gsap.delayedCall(1, () => {
      const newFirstBallPos = getElementPosition(this.firstOrbeElement);
      const newSecondBallPos = getElementPosition(this.secondOrbeElement!);

      console.log(`Fin : Premier élément (${newFirstBallPos.x}px, ${newFirstBallPos.y}px), Second élément (${newSecondBallPos.x}px, ${newSecondBallPos.y}px)`);
    });
  }

  ngOnDestroy() {
    if (this.timeline) {
      this.timeline.kill(); // Assurez-vous d'arrêter l'animation lors de la destruction du composant
    }
  }
}

function getElementPosition(element: HTMLElement): { x: number, y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.pageXOffset,
    y: rect.top + window.pageYOffset
  };
}

function getAccuratePosition(element: HTMLElement): Promise<{ x: number, y: number }> {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      resolve({
        x: rect.left + window.pageXOffset,
        y: rect.top + window.pageYOffset
      });
    });
  });
}
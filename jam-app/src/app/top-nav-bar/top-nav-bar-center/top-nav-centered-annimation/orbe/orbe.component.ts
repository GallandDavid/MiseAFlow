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
  private firstOrbePosition!: { x: number, y: number } | null;
  private secondOrbePosition!: { x: number, y: number } | null;
  private timeline: gsap.core.Timeline | null = null;

  constructor(private elementRef: ElementRef, public orbeService: OrbeService) {}

  ngOnInit() {
    console.log('OnInit called');
    this.firstOrbeElement = this.elementRef.nativeElement.querySelector('.ball').closest('.first-orbe');
    if(this.firstOrbeElement != null) {
      this.firstOrbeElement = this.firstOrbeElement.querySelector('.ball')as HTMLElement;
      if(this.orbeService.getBallPositions().first == null){
        const rect = this.firstOrbeElement!.getBoundingClientRect();
        const firstBallPos = {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY
        };
        this.orbeService.setBallPositions({first:firstBallPos,second:this.orbeService.getBallPositions().second});
      } 
    } else {
      this.secondOrbeElement = this.elementRef.nativeElement.querySelector('.ball').closest('.second-orbe');
      if(this.secondOrbeElement != null){
        this.secondOrbeElement = this.secondOrbeElement!.querySelector('.ball');
        if(this.orbeService.getBallPositions().second == null){
          const rect = this.secondOrbeElement!.getBoundingClientRect();
          const secondBallPos = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY
          };
          this.orbeService.setBallPositions({first:this.orbeService.getBallPositions().first,second:secondBallPos});
        } 
      }
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');

    if(this.firstOrbePosition != null) {
      this.firstOrbePosition = this.orbeService.getBallPositions().first;
      this.secondOrbePosition = this.orbeService.getBallPositions().second;
    } else {
      this.secondOrbePosition = this.orbeService.getBallPositions().first;
      this.firstOrbePosition = this.orbeService.getBallPositions().second;
    }


    console.log('First ball position:', this.firstOrbePosition);
    console.log('Second ball position:', this.secondOrbePosition);

    this.animateBallPosition();
  }

  async animateBallPosition() {
    if (!this.firstOrbePosition || !this.secondOrbePosition) {
      console.error('Ball position not found');
      return;
    }
  
    const containerPos = await getAccuratePosition(this.elementRef.nativeElement.closest('.container'));
    console.log("containerPos : ", containerPos);
    const containerOrbePos = await getAccuratePosition(this.elementRef.nativeElement.closest('.container-orbe'));
    console.log("containerOrbePos : ", containerOrbePos);
    const containerBallPos = await getAccuratePosition(this.elementRef.nativeElement.querySelector('.ball'));
    console.log("containerBallPos : ", containerBallPos);
    const firstBallPos = this.firstOrbePosition;
    const secondBallPos = this.secondOrbePosition;
  
    // Calculons les positions finales en utilisant les coordonnées de l'autre élément
    const finalFirstX = firstBallPos.x - containerPos.x - ((containerOrbePos.width / 2) - containerBallPos.width / 2);
    const finalFirstY = firstBallPos.y - containerPos.y;// + (containerOrbePos.height / 2);
    const finalSecondX = firstBallPos.x - containerPos.x - ((containerOrbePos.width / 2) - containerBallPos.width / 2);
    const finalSecondY = firstBallPos.y - containerPos.y;// - (containerOrbePos.height / 2);
  
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
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  };
}

function getAccuratePosition(element: HTMLElement): Promise<{ x: number, y: number, width: number, height: number }> {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      resolve({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width:rect.width,
        height:rect.height
      });
    });
  });
}
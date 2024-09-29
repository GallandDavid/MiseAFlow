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
  private element!: boolean;
  private firstOrbeElement!: HTMLElement;
  private secondOrbeElement!: HTMLElement | null;
  private firstOrbePosition!: { x: number, y: number } | null;
  private secondOrbePosition!: { x: number, y: number } | null;
  private firstTimeline: gsap.core.Timeline | null = null;
  private secondTimeline: gsap.core.Timeline | null = null;

  constructor(private elementRef: ElementRef, public orbeService: OrbeService) {}

  ngOnInit() {
    console.log('OnInit called');
    this.firstOrbeElement = this.elementRef.nativeElement.querySelector('.ball').closest('.first-orbe');
    if(this.firstOrbeElement != null) {
      this.firstOrbeElement = this.firstOrbeElement.querySelector('.ball')as HTMLElement;
      this.secondOrbeElement = this.elementRef.nativeElement.querySelector('.ball').closest('.first-orbe').closest('.container').querySelector('.second-orbe').querySelector('.ball') as HTMLElement;
      if(this.orbeService.getBallPositions().first == null){
        this.element = true;
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
        this.firstOrbeElement = this.elementRef.nativeElement.querySelector('.ball').closest('.second-orbe').closest('.container').querySelector('.first-orbe').querySelector('.ball') as HTMLElement;
        if(this.orbeService.getBallPositions().second == null){
          this.element = false;
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

  logBallPositions() {
    if(this.element) {
      this.firstOrbePosition = this.orbeService.getBallPositions().first;
      this.secondOrbePosition = this.orbeService.getBallPositions().second;
    } else {
      this.secondOrbePosition = this.orbeService.getBallPositions().first;
      this.firstOrbePosition = this.orbeService.getBallPositions().second;
    }
    if (this.firstOrbePosition && this.secondOrbePosition) {
      console.log("For the " + this.elementOrder() + " orbe :");
      console.log('First ball position:', this.firstOrbePosition);
      console.log('Second ball position:', this.secondOrbePosition);
    } else {
        console.error('One or both ball positions are undefined');
    }
  }
  
  getElementPosition(elementId: string): { x: number, y: number } | null {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(this.elementOrder() + ` element with ID ${elementId} not found`);
        return null;
    }
    const rect = element.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  }

  elementOrder(): string {
    if(this.element) {
      return "first";
    } else {
      return "second";
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');
    this.logBallPositions();

    if(this.element) {
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

    const finalFirstX = this.secondOrbePosition.x - containerPos.x - ((containerOrbePos.width / 2) - containerBallPos.width / 2);
    const finalFirstY = this.secondOrbePosition.y - containerPos.y;
    const finalSecondX = this.firstOrbePosition.x - containerPos.x - ((containerOrbePos.width / 2) - containerBallPos.width / 2);
    const finalSecondY = this.firstOrbePosition.y - containerPos.y;

    if (this.firstTimeline) {
      this.firstTimeline.kill();
    }

    if (this.secondTimeline) {
      this.secondTimeline.kill();
    }

    this.firstTimeline = gsap.timeline({ repeat: -1 });
    this.secondTimeline = gsap.timeline({ repeat: -1 });

    if (this.element) {
      this.firstTimeline
        .addLabel("start")
        .to(this.firstOrbeElement, {
          duration: 1.0,
          ease: 'power2.inOut',
          x: finalFirstX,
          y: finalFirstY
        })
        .addLabel("end");
    } else {
      this.secondTimeline
        .addLabel("start")
        .to(this.secondOrbeElement, {
          duration: 1.0,
          ease: 'power2.inOut',
          x: finalSecondX,
          y: finalSecondY
        })
        .addLabel("end");
    }
  
    console.log(`(For the ${this.elementOrder()} orbe)	Début : Premier élément (${firstBallPos.x}px, ${firstBallPos.y}px), Second élément (${secondBallPos.x}px, ${secondBallPos.y}px)`);
  
    this.firstTimeline.eventCallback("onRepeat", () => {
      console.log(`Animation répétée pour le premier élément`);
    });

    this.secondTimeline.eventCallback("onRepeat", () => {
      console.log(`Animation répétée pour le second élément`);
    });

    this.firstTimeline.eventCallback("onComplete", () => {
      console.log(`Animation terminée pour le premier élément`);
    });

    this.secondTimeline.eventCallback("onComplete", () => {
      console.log(`Animation terminée pour le second élément`);
    });
  
    gsap.delayedCall(1, () => {
      const newFirstBallPos = getElementPosition(this.firstOrbeElement);
      const newSecondBallPos = getElementPosition(this.secondOrbeElement!);
  
      console.log(`(For the ${this.elementOrder()} orbe) Fin : Premier élément (${newFirstBallPos.x}px, ${newFirstBallPos.y}px), Second élément (${newSecondBallPos.x}px, ${newSecondBallPos.y}px)`);
    });
  }

  ngOnDestroy() {
    if (this.firstTimeline) {
      this.firstTimeline.kill();
    }
    if (this.secondTimeline) {
      this.secondTimeline.kill();
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
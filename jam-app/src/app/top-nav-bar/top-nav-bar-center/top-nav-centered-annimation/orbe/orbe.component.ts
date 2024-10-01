import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { BallComponent } from "./ball/ball.component";
import { BowlComponent } from "./bowl/bowl.component";
import { OrbeService } from "../orbe.service";
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

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
    if (!this.firstOrbePosition || !this.secondOrbePosition) {
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
    if(this.element) {
      this.firstOrbePosition = this.orbeService.getBallPositions().first;
      this.secondOrbePosition = this.orbeService.getBallPositions().second;
    } else {
      this.secondOrbePosition = this.orbeService.getBallPositions().first;
      this.firstOrbePosition = this.orbeService.getBallPositions().second;
    }

    if(this.orbeService.getAnimated()) {
      this.animateBallPosition();
    }
  }

  async animateBallPosition() {
    
    if (!this.firstOrbePosition || !this.secondOrbePosition) {
      console.error('Ball position not found');
      return;
    }
  
    const containerPos = await getAccuratePosition(this.elementRef.nativeElement.closest('.container'));
    const containerOrbePos = await getAccuratePosition(this.elementRef.nativeElement.closest('.container-orbe'));
    const containerBallPos = await getAccuratePosition(this.elementRef.nativeElement.querySelector('.ball'));

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

    this.firstTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    this.secondTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    const firstPath = [
      { x: 0, y: 0 },
      { x: finalFirstX / 2, y: finalFirstY / 2 - 30 },
      { x: finalFirstX, y: finalFirstY }
    ];

    const secondPath = [
      { x: 0, y: 0 },
      { x: finalSecondX / 2, y: finalSecondY / 2 - 30 },
      { x: finalSecondX, y: finalSecondY }
    ]; 
    if (this.element) {
      this.firstTimeline
        .addLabel("start")
        .to(this.firstOrbeElement, {
          duration: 1.0,
          ease: 'power2.inOut',
          motionPath: {
            path: firstPath,
            autoRotate: false
          }
        })
        .addLabel("end");
    } else {
      this.secondTimeline
        .addLabel("start")
        .to(this.secondOrbeElement, {
          duration: 1.0,
          ease: 'power2.inOut',
          motionPath: {
            path: secondPath,
            autoRotate: false
          }
        })
        .addLabel("end");
    }
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
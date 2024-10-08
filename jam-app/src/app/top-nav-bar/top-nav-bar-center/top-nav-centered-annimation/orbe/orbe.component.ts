import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { BallComponent } from "./ball/ball.component";
import { BowlComponent } from "./bowl/bowl.component";
import { StaffComponent } from "../staff/staff.component";
import { OrbeService } from "../orbe.service";
import { AnimationService } from '../animation.service';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-orbe',
  standalone: true,
  imports: [BallComponent, BowlComponent, StaffComponent],
  templateUrl: './orbe.component.html',
  styleUrls: ['./orbe.component.css']
})
export class OrbeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(BowlComponent) bowlComponent!: BowlComponent;
  @ViewChild(BallComponent) ballComponent!: BallComponent;
  @ViewChild(StaffComponent) staffComponent!: StaffComponent;

  private element!: boolean;
  private firstOrbeElement!: HTMLElement;
  private secondOrbeElement!: HTMLElement | null;
  private firstOrbePosition!: { x: number, y: number } | null;
  private secondOrbePosition!: { x: number, y: number } | null;
  private firstTimeline: gsap.core.Timeline | null = null;
  private secondTimeline: gsap.core.Timeline | null = null;
  private animationSubscription!: Subscription;

  constructor(private elementRef: ElementRef, public orbeService: OrbeService, private animationService: AnimationService) {}

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

    this.animationSubscription = this.animationService.triggerBowlImageChange$.subscribe(() => {
      console.log('triggerBowlImageChange$ event received'); // Debug log
      this.triggerBowlImageChange();
    });
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

    // Écouter l'événement de fin de transition de BallComponent
    this.ballComponent.transitionEnd.subscribe(() => {
        setTimeout(() => {
          this.animateBallPosition();
        }, 150); // Delay of 1 second (1000 milliseconds)
      });
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
    const finalFirstY = this.secondOrbePosition.y - containerPos.y + (containerBallPos.height / 4);
    const finalSecondX = this.firstOrbePosition.x - containerPos.x - ((containerOrbePos.width / 2) - containerBallPos.width / 2);
    const finalSecondY = (this.firstOrbePosition.y + (containerBallPos.height / 4))-  containerPos.y ;

    if (this.firstTimeline) {
      this.firstTimeline.kill();
    }

    if (this.secondTimeline) {
      this.secondTimeline.kill();
    }

    this.firstTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    this.secondTimeline = gsap.timeline({ repeat: -1, repeatDelay: 1});

    const firstPath = [
      { x: 0, y: 0 },
      { x: finalFirstX / 2, y: finalFirstY / 2 - 37.5 },
      { x: finalFirstX, y: finalFirstY }
    ];

    const secondPath = [
      { x: 0, y: 0 },
      { x: finalSecondX / 2, y: finalSecondY / 2 - 37.5 },
      { x: finalSecondX, y: finalSecondY }
    ]; 
    if (this.element) {
      this.firstTimeline
        .addLabel("start")
        .to(this.firstOrbeElement, {
          duration: 3,
          ease: 'power2.in',
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
          duration: 3,
          ease: 'power2.in',
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
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
  }

  triggerBowlImageChange() {
    console.log('triggerBowlImageChange called in OrbeComponent'); // Debug log
    if (this.bowlComponent) {
      console.log('Bowl component found, calling triggerImageChange'); // Debug log
      this.bowlComponent.triggerImageChange();
    } else {
      console.log('Bowl component not found'); // Debug log
    }

    if (this.ballComponent) {
      console.log('Ball component found, calling triggerImageChange'); // Debug log
      this.ballComponent.triggerImageChange();
    } else {
      console.log('Ball component not found'); // Debug log
    }

    if (this.staffComponent) {
      console.log('Staff component found, calling triggerImageChange'); // Debug log
      this.staffComponent.triggerImageChange();
    } else {
      console.log('Staff component not found'); // Debug log
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
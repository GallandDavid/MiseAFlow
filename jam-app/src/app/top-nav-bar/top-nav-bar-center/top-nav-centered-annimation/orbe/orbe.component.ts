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
  private ballElement!: HTMLElement;
  private secondOrbeElement!: HTMLElement | null;

  constructor(private elementRef: ElementRef, public orbeService: OrbeService) {}

  ngOnInit() {
    this.ballElement = this.elementRef.nativeElement.querySelector('.gif-overlay-ball');
    console.log('Ball element:', this.ballElement);
    
    const secondOrbeElement = this.orbeService.getSecondOrbeElement();
    if (!secondOrbeElement) {
      const parentContainer = this.elementRef.nativeElement.closest('.container');
      if (parentContainer) {
        const secondOrbeElement = parentContainer.querySelectorAll('.container-orbe')[1];
        if (secondOrbeElement) {
          this.secondOrbeElement = secondOrbeElement;
          console.log('Second orbe element found');
          this.orbeService.setSecondOrbeElement(secondOrbeElement);
        } else {
          console.error('Second orbe element not found');
        }
      }
    } else {
      this.secondOrbeElement = secondOrbeElement;
      console.log('Second orbe element received');
    }
  }

  ngAfterViewInit() {
      const secondOrbeElement = this.orbeService.getSecondOrbeElement();
      if (!this.secondOrbeElement && secondOrbeElement) {
        this.secondOrbeElement = secondOrbeElement;
        console.log('Second orbe element received');
        this.animateBallPosition();
      } else if (!this.secondOrbeElement) {
        console.error('Second orbe element still not found');
      }
      this.animateBallPosition();
  }

  animateBallPosition() {
    if (this.secondOrbeElement && this.ballElement) {
      gsap.to(this.ballElement, {
        duration: 0.5,
        x: this.secondOrbeElement.offsetLeft,
        y: this.secondOrbeElement.offsetTop,
        onComplete: () => {
          gsap.to(this.ballElement, {
            duration: 0.5,
            x: '-50%',
            y: '-50%'
          });
        }
      });
    } else {
      console.error('Ball element or second orbe element not found');
    }
  }
}
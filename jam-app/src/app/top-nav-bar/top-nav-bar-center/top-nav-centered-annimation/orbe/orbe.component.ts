// orbe.component.ts

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

  constructor(private elementRef: ElementRef, public orbeService: OrbeService) {}

  ngOnInit() {
    console.log('OnInit called');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');
    
    this.firstOrbeElement = this.elementRef.nativeElement.querySelector('.first-orbe .ball');
    console.log('First ball element:', this.firstOrbeElement);

    const secondOrbeElement = this.orbeService.getSecondOrbeElement();
    if (!secondOrbeElement) {
      const parentContainer = this.elementRef.nativeElement.closest('.container');
      if (parentContainer) {
        const secondOrbeElement = parentContainer.querySelectorAll('.container-orbe')[1];
        if (secondOrbeElement) {
          this.secondOrbeElement = secondOrbeElement.querySelector('.ball');
          console.log('Second ball element found');
          this.orbeService.setSecondOrbeElement(this.secondOrbeElement!);
        } else {
          console.error('Second ball element not found');
        }
      }
    } else {
      this.secondOrbeElement = secondOrbeElement.querySelector('.ball');
      console.log('Second ball element received');
    }

    setTimeout(() => {
      this.animateBallPosition();
    }, 100); // Ajout d'un délai pour s'assurer que tous les éléments sont chargés
  }

  animateBallPosition() {
    console.log('animateBallPosition called');
    console.log('First element:', this.firstOrbeElement);
    console.log('Second element:', this.secondOrbeElement);

    if (this.secondOrbeElement && this.firstOrbeElement) {
      // Calculer les positions absolues des éléments
      const containerRect = this.elementRef.nativeElement.closest('.container').getBoundingClientRect();
      const firstBallRect = this.firstOrbeElement.getBoundingClientRect();
      const secondBallRect = this.secondOrbeElement.getBoundingClientRect();

      // Déplacer le premier élément vers la position du deuxième élément
      gsap.to(this.firstOrbeElement, {
        duration: 1.0,
        x: secondBallRect.left - containerRect.left + 'px',
        y: secondBallRect.top - containerRect.top + 'px',
        onComplete: () => {
          this.adjustFinalPosition(this.firstOrbeElement);
        }
      });

      // Déplacer le deuxième élément vers la position du premier élément
      gsap.to(this.secondOrbeElement, {
        duration: 4.0,
        x: firstBallRect.left - containerRect.left + 'px',
        y: firstBallRect.top - containerRect.top + 'px',
        onComplete: () => {
          this.adjustFinalPosition(this.secondOrbeElement!);
        }
      });
    } else {
      console.error('Ball elements not found');
    }
  }

  adjustFinalPosition(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const containerRect = this.elementRef.nativeElement.closest('.container').getBoundingClientRect();
    
    const dx = rect.left - containerRect.left;
    const dy = rect.top - containerRect.top;

    gsap.to(element, {
      duration: 2.0,
      x: dx + '%',
      y: dy + '%'
    });
  }
}
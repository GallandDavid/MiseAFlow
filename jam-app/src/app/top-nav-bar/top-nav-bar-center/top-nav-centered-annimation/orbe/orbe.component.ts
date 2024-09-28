import { Component, HostBinding, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { BallComponent } from './ball/ball.component';
import { BowlComponent } from './bowl/bowl.component';
import { PositionService } from './position.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orbe',
  standalone: true,
  imports: [BallComponent, BowlComponent],
  templateUrl: './orbe.component.html',
  styleUrls: ['./orbe.component.css'],
  animations: [
    trigger('moveBall', [
      state('start', style({ transform: 'translate(0, 0)' })),
      state('end', style({ transform: 'translate(0, 0)' })),
      transition('start => end', [
        animate('2s', keyframes([
          style({ transform: 'translate(0, 0)', offset: 0 }),
          style({ transform: 'translate({{x}}px, {{y}}px)', offset: 0.5 }),
          style({ transform: 'translate(0, 0)', offset: 1.0 })
        ]))
      ]),
      transition('end => start', [
        animate('2s', keyframes([
          style({ transform: 'translate(0, 0)', offset: 0 }),
          style({ transform: 'translate({{x}}px, {{y}}px)', offset: 0.5 }),
          style({ transform: 'translate(0, 0)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class OrbeComponent implements AfterViewInit, OnDestroy {
  ballState: string = 'start';
  @HostBinding('@moveBall') get moveBallParams() {
    return { value: this.ballState, params: { x: this.x || 0, y: this.y || 0 } };
  }
  @Input() key!: string; // Unique key for each OrbeComponent instance
  @Input() otherKey!: string; // Key of the other OrbeComponent instance
  x: number = 0; // Define x property
  y: number = 0; // Define y property
  private ball!: HTMLElement;
  private subscription: Subscription;

  constructor(private el: ElementRef, private positionService: PositionService) {
    this.subscription = this.positionService.positions$.subscribe(positions => {
      if (positions[this.otherKey]) {
        this.x = positions[this.otherKey].x - positions[this.key].x;
        this.y = positions[this.otherKey].y - positions[this.key].y;
        console.log(`OrbeComponent (${this.key}): Updated x to ${this.x}, y to ${this.y}`);
      }
    });
  }

  ngAfterViewInit() {
    this.ball = this.el.nativeElement.querySelector('.ball');
    console.log(`OrbeComponent (${this.key}): Ball element initialized`);
    this.toggleMove();
  }

  toggleMove() {
    setInterval(() => {
      const rect = this.ball.getBoundingClientRect();
      console.log(`OrbeComponent (${this.key}): Ball position - left: ${rect.left}, top: ${rect.top}`);
      this.positionService.updatePosition(this.key, rect.left, rect.top);
      this.ballState = this.ballState === 'start' ? 'end' : 'start';
      console.log(`OrbeComponent (${this.key}): Ball state changed to ${this.ballState}`);
    }, 4000); // Adjust the interval to match the animation duration
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
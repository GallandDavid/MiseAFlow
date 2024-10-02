import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { OrbeComponent } from "./orbe/orbe.component";
import { OrbeService } from "./orbe.service";
import { StaffComponent } from './staff/staff.component';
import { AnimationService } from './animation.service';

@Component({
  selector: 'app-top-nav-centered-annimation',
  standalone: true,
  imports: [OrbeComponent, StaffComponent],
  templateUrl: './top-nav-centered-annimation.component.html',
  styleUrls: ['./top-nav-centered-annimation.component.css'],
  providers: [OrbeService]
})
export class TopNavCenteredAnnimationComponent implements AfterViewInit {
  @ViewChild('firstOrbe') firstOrbeComponent!: OrbeComponent;
  @ViewChild('secondOrbe') secondOrbeComponent!: OrbeComponent;
  @ViewChild(StaffComponent) staffComponent!: StaffComponent;

  private animationsTriggered = false; // New boolean to track if animations have been triggered

  constructor(private elementRef: ElementRef, public orbeService: OrbeService, private animationService: AnimationService) {}

  ngAfterViewInit() {
    this.staffComponent.rotationEnd.subscribe(() => {
      this.staffComponent.triggerImageChange();
    });
  }

  onMouseEnter() {
    if (!this.animationsTriggered) {
      this.animationsTriggered = true; // Set the boolean to true to prevent further triggers
      this.animationService.triggerStartAnimation();
      this.animationService.triggerBowlImageChange();
      this.triggerImageChange();
    }
  }

  triggerImageChange() {
    if (this.firstOrbeComponent) {
      console.log('First Orbe component found, calling triggerBowlImageChange'); // Debug log
      this.firstOrbeComponent.triggerBowlImageChange();
    } else {
      console.log('First Orbe component not found'); // Debug log
    }

    if (this.secondOrbeComponent) {
      console.log('Second Orbe component found, calling triggerBowlImageChange'); // Debug log
      this.secondOrbeComponent.triggerBowlImageChange();
    } else {
      console.log('Second Orbe component not found'); // Debug log
    }

    if (this.staffComponent) {
      console.log('Staff component found, calling triggerImageChange'); // Debug log
      // this.staffComponent.triggerImageChange(); // Remove this line
    } else {
      console.log('Staff component not found'); // Debug log
    }
  }
}
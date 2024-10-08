import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { OrbeComponent } from "./orbe/orbe.component";
import { OrbeService } from "./orbe.service";
import { StaffComponent } from './staff/staff.component';
import { AnimationService } from './animation.service';
import { LoadingService } from '../loading.service'; // Import the LoadingService

@Component({
  selector: 'app-top-nav-centered-annimation',
  standalone: true,
  imports: [CommonModule, OrbeComponent, StaffComponent], // Add CommonModule to imports
  templateUrl: './top-nav-centered-annimation.component.html',
  styleUrls: ['./top-nav-centered-annimation.component.css'],
  providers: [OrbeService]
})
export class TopNavCenteredAnnimationComponent implements AfterViewInit, OnInit {
  @ViewChild('firstOrbe') firstOrbeComponent!: OrbeComponent;
  @ViewChild('secondOrbe') secondOrbeComponent!: OrbeComponent;
  @ViewChild(StaffComponent) staffComponent!: StaffComponent;

  private animationsTriggered = false;

  constructor(
    private elementRef: ElementRef,
    public orbeService: OrbeService,
    private animationService: AnimationService,
    private loadingService: LoadingService // Inject the LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.componentLoaded(); // Notify that this component is loaded
  }

  ngAfterViewInit() {
    this.staffComponent.rotationEnd.subscribe(() => {
      this.staffComponent.triggerImageChange();
    });
  }

  onMouseEnter() {
    if (!this.animationsTriggered) {
      this.animationsTriggered = true;
      this.animationService.triggerStartAnimation();
      this.animationService.triggerBowlImageChange();
      this.triggerImageChange();
    }
  }

  triggerImageChange() {
    if (this.firstOrbeComponent) {
      console.log('First Orbe component found, calling triggerBowlImageChange');
      this.firstOrbeComponent.triggerBowlImageChange();
    } else {
      console.log('First Orbe component not found');
    }

    if (this.secondOrbeComponent) {
      console.log('Second Orbe component found, calling triggerBowlImageChange');
      this.secondOrbeComponent.triggerBowlImageChange();
    } else {
      console.log('Second Orbe component not found');
    }

    if (this.staffComponent) {
      console.log('Staff component found, calling triggerImageChange');
    } else {
      console.log('Staff component not found');
    }
  }
}
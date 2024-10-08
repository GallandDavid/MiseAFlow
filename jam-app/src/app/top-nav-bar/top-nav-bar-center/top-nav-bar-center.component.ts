import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { TopNavCenteredAnnimationComponent } from "./top-nav-centered-annimation/top-nav-centered-annimation.component";
import { MiseComponent } from "./mise/mise.component";
import { FlowComponent } from "./flow/flow.component";
import { LoadingService } from './loading.service'; // Import the LoadingService

@Component({
  selector: 'app-top-nav-bar-center',
  standalone: true,
  imports: [CommonModule, TopNavCenteredAnnimationComponent, MiseComponent, FlowComponent], // Add CommonModule to imports
  templateUrl: './top-nav-bar-center.component.html',
  styleUrls: ['./top-nav-bar-center.component.css']
})
export class TopNavBarCenterComponent implements OnInit {
  componentsLoaded = false;

  constructor(private loadingService: LoadingService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadingService.componentsLoaded$.subscribe(loaded => {
      console.log(`Components loaded state: ${loaded}`);
      this.componentsLoaded = loaded;
      this.cdr.detectChanges(); // Mark the view for check
    });
  }
}

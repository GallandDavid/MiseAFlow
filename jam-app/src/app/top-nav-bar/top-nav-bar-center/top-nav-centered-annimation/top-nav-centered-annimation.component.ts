import { Component } from '@angular/core';
import { OrbeComponent } from "./orbe/orbe.component";
import { OrbeService } from "./orbe.service";
import { StaffComponent } from './staff/staff.component';

@Component({
  selector: 'app-top-nav-centered-annimation',
  standalone: true,
  imports: [OrbeComponent, StaffComponent],
  templateUrl: './top-nav-centered-annimation.component.html',
  styleUrls: ['./top-nav-centered-annimation.component.css'],
  providers: [OrbeService]
})
export class TopNavCenteredAnnimationComponent {
  constructor(public orbeService: OrbeService) {}
}
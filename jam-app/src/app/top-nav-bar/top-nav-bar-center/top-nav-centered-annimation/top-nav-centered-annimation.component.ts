
import { Component} from '@angular/core';
import { StaffComponent } from "./staff/staff.component";
import { OrbeComponent } from "./orbe/orbe.component";

@Component({
  selector: 'app-top-nav-centered-annimation',
  templateUrl: './top-nav-centered-annimation.component.html',
  styleUrls: ['./top-nav-centered-annimation.component.css'],
  standalone: true,
  imports: [StaffComponent, OrbeComponent]
})
export class TopNavCenteredAnnimationComponent {}
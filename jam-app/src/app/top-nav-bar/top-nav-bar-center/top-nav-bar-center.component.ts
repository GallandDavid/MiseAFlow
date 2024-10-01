import { Component } from '@angular/core';
import { TopNavCenteredAnnimationComponent } from "./top-nav-centered-annimation/top-nav-centered-annimation.component";
import { MiseComponent } from "./mise/mise.component";
import { FlowComponent } from "./flow/flow.component";

@Component({
  selector: 'app-top-nav-bar-center',
  standalone: true,
  imports: [TopNavCenteredAnnimationComponent, MiseComponent, FlowComponent],
  templateUrl: './top-nav-bar-center.component.html',
  styleUrl: './top-nav-bar-center.component.css'
})
export class TopNavBarCenterComponent {

}

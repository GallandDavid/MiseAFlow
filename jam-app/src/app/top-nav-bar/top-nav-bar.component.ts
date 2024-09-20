import { Component } from '@angular/core';
import { TopNavBarLeftComponent } from "./top-nav-bar-left/top-nav-bar-left.component";
import { TopNavBarCenterComponent } from "./top-nav-bar-center/top-nav-bar-center.component";
import { TopNavBarRightComponent } from "./top-nav-bar-right/top-nav-bar-right.component";


@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [TopNavBarLeftComponent, TopNavBarCenterComponent, TopNavBarRightComponent],
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent {

}

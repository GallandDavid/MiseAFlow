import { Component } from '@angular/core';
import { BallComponent } from "./ball/ball.component";
import { BowlComponent } from "./bowl/bowl.component";

@Component({
  selector: 'app-orbe',
  standalone: true,
  imports: [BallComponent,
            BowlComponent,
  ],
  templateUrl: './orbe.component.html',
  styleUrl: './orbe.component.css'
})
export class OrbeComponent {

}

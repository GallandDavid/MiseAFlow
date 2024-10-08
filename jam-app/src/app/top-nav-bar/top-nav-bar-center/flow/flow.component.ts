import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../loading.service'; // Import the LoadingService

@Component({
  selector: 'app-flow',
  standalone: true,
  imports: [],
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css']
})
export class FlowComponent implements OnInit {

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    console.log('FlowComponent loaded');
    this.loadingService.componentLoaded(); // Notify that this component is loaded
  }
}

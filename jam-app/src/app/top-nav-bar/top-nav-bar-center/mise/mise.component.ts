import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../loading.service'; // Import the LoadingService

@Component({
  selector: 'app-mise',
  standalone: true,
  imports: [],
  templateUrl: './mise.component.html',
  styleUrls: ['./mise.component.css']
})
export class MiseComponent implements OnInit {

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    console.log('MiseComponent loaded');
    this.loadingService.componentLoaded(); // Notify that this component is loaded
  }
}

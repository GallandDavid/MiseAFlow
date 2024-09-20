import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TopNavBarComponent } from "./top-nav-bar/top-nav-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopNavBarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavBar = true;

  constructor(private router: Router) {}
  title = 'Mystic Flow';
  routerUrl!: string;


  ngOnInit() {
    this.routerUrl = this.router.url;
  }
}

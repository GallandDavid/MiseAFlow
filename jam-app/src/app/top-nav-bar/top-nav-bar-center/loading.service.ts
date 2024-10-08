import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private componentsLoaded = new BehaviorSubject<boolean>(false);
  componentsLoaded$ = this.componentsLoaded.asObservable();

  private loadedComponentsCount = 0;
  private totalComponents = 3; // Update this number based on the actual number of child components

  componentLoaded() {
    this.loadedComponentsCount++;
    console.log(`Component loaded: ${this.loadedComponentsCount}/${this.totalComponents}`);
    if (this.loadedComponentsCount === this.totalComponents) {
      console.log('All components loaded');
      this.componentsLoaded.next(true);
    }
  }
}
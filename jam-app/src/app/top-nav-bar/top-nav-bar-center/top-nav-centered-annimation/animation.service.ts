import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private startAnimationSubject = new Subject<void>();
  startAnimation$ = this.startAnimationSubject.asObservable();

  triggerStartAnimation() {
    this.startAnimationSubject.next();
  }
}
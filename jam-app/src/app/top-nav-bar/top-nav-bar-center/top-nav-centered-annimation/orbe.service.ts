// orbe.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrbeService {  
  private ballElementsSubject = new BehaviorSubject<{ first: HTMLElement | null, second: HTMLElement | null }>({ first: null, second: null });

  ballElements$ = this.ballElementsSubject.asObservable();
  
  setBallElements(elements: { first: HTMLElement | null, second: HTMLElement | null }) {
    this.ballElementsSubject.next(elements);
  }

  getBallElements(): { first: HTMLElement | null, second: HTMLElement | null } {
    return this.ballElementsSubject.value;
  }
}
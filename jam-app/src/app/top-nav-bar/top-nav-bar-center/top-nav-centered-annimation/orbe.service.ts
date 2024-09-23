// orbe.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrbeService {
  private secondOrbeElementSubject = new BehaviorSubject<HTMLElement | null>(null);

  secondOrbeElement$ = this.secondOrbeElementSubject.asObservable();

  setSecondOrbeElement(element: HTMLElement) {
    this.secondOrbeElementSubject.next(element);
  }

  getSecondOrbeElement(): HTMLElement | null {
    return this.secondOrbeElementSubject.value;
  }
}
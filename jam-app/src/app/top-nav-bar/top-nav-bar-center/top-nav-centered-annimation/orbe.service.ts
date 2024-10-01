// orbe.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrbeService {  
  private animated = false;
  private ballPositionsSubject = new BehaviorSubject<{ first: { x: number, y: number } | null, second: { x: number, y: number } | null}>({ first: null , second: null });

  ballPositions$ = this.ballPositionsSubject.asObservable();
  
  setBallPositions(positions: { first: { x: number, y: number } | null, second: { x: number, y: number } | null}) {
    this.ballPositionsSubject.next(positions);
  }

  setAnimated(animated: boolean) {
    this.animated = animated;
  }

  getAnimated(): boolean {
    return this.animated;
  }

  getBallPositions(): { first: { x: number, y: number } | null, second: { x: number, y: number } | null} {
    return this.ballPositionsSubject.value;
  }
}
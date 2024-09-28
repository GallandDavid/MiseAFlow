import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private positions = new BehaviorSubject<{ [key: string]: { x: number, y: number } }>({});
  positions$ = this.positions.asObservable();

  updatePosition(key: string, x: number, y: number) {
    const currentPositions = this.positions.value;
    currentPositions[key] = { x, y };
    this.positions.next(currentPositions);
    console.log(`PositionService: Updated position for ${key} to x: ${x}, y: ${y}`);
  }

  getPosition(key: string) {
    return this.positions.value[key];
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiseComponent } from './mise.component';

describe('MiseComponent', () => {
  let component: MiseComponent;
  let fixture: ComponentFixture<MiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

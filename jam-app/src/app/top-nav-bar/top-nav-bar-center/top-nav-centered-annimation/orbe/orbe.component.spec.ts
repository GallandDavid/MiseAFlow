import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrbeComponent } from './orbe.component';

describe('OrbeComponent', () => {
  let component: OrbeComponent;
  let fixture: ComponentFixture<OrbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

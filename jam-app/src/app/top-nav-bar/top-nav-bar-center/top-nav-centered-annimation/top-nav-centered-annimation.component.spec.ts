import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavCenteredAnnimationComponent } from './top-nav-centered-annimation.component';

describe('TopNavCenteredAnnimationComponent', () => {
  let component: TopNavCenteredAnnimationComponent;
  let fixture: ComponentFixture<TopNavCenteredAnnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopNavCenteredAnnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopNavCenteredAnnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

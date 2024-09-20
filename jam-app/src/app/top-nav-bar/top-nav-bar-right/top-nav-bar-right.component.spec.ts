import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavBarRightComponent } from './top-nav-bar-right.component';

describe('TopNavBarRightComponent', () => {
  let component: TopNavBarRightComponent;
  let fixture: ComponentFixture<TopNavBarRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopNavBarRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopNavBarRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

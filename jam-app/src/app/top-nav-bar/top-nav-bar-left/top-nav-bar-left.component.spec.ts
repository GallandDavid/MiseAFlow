import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavBarLeftComponent } from './top-nav-bar-left.component';

describe('TopNavBarLeftComponent', () => {
  let component: TopNavBarLeftComponent;
  let fixture: ComponentFixture<TopNavBarLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopNavBarLeftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopNavBarLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

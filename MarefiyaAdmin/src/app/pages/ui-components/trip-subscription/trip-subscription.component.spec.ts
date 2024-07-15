import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSubscriptionComponent } from './trip-subscription.component';

describe('TripSubscriptionComponent', () => {
  let component: TripSubscriptionComponent;
  let fixture: ComponentFixture<TripSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

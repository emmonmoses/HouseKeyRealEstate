import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTripSubscriptionComponent } from './create-trip-subscription.component';

describe('CreateTripSubscriptionComponent', () => {
  let component: CreateTripSubscriptionComponent;
  let fixture: ComponentFixture<CreateTripSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTripSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTripSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

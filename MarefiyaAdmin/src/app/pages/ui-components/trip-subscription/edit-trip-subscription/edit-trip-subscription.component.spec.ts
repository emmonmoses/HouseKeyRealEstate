import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripSubscriptionComponent } from './edit-trip-subscription.component';

describe('EditTripSubscriptionComponent', () => {
  let component: EditTripSubscriptionComponent;
  let fixture: ComponentFixture<EditTripSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTripSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTripSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

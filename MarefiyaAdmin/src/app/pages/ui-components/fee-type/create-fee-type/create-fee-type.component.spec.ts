import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeeTypeComponent } from './create-fee-type.component';

describe('CreateFeeTypeComponent', () => {
  let component: CreateFeeTypeComponent;
  let fixture: ComponentFixture<CreateFeeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFeeTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateFeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

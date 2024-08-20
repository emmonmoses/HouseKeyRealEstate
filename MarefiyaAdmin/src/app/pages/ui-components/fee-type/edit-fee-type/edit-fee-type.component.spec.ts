import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeeTypeComponent } from './edit-fee-type.component';

describe('EditFeeTypeComponent', () => {
  let component: EditFeeTypeComponent;
  let fixture: ComponentFixture<EditFeeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeeTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

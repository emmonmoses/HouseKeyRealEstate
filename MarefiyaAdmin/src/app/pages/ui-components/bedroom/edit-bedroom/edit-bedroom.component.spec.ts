import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBedroomComponent } from './edit-bedroom.component';

describe('EditBedroomComponent', () => {
  let component: EditBedroomComponent;
  let fixture: ComponentFixture<EditBedroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBedroomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBedroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

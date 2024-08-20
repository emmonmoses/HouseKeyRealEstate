import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBedroomComponent } from './create-bedroom.component';

describe('CreateBedroomComponent', () => {
  let component: CreateBedroomComponent;
  let fixture: ComponentFixture<CreateBedroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBedroomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBedroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

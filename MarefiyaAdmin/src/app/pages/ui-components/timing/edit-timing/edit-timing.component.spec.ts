import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimingComponent } from './edit-timing.component';

describe('EditTimingComponent', () => {
  let component: EditTimingComponent;
  let fixture: ComponentFixture<EditTimingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTimingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

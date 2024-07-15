import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTypeCreateComponent } from './trip-type-create.component';

describe('TripTypeCreateComponent', () => {
  let component: TripTypeCreateComponent;
  let fixture: ComponentFixture<TripTypeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripTypeCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

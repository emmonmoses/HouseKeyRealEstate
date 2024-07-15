import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTypeEditComponent } from './trip-type-edit.component';

describe('TripTypeEditComponent', () => {
  let component: TripTypeEditComponent;
  let fixture: ComponentFixture<TripTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripTypeEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

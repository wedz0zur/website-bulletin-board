import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsubcategoryDetailComponent } from './subsubcategory-detail.component';

describe('SubsubcategoryDetailComponent', () => {
  let component: SubsubcategoryDetailComponent;
  let fixture: ComponentFixture<SubsubcategoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsubcategoryDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsubcategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

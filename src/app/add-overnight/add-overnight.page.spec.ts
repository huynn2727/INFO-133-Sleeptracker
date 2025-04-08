import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOvernightPage } from './add-overnight.page';

describe('AddOvernightPage', () => {
  let component: AddOvernightPage;
  let fixture: ComponentFixture<AddOvernightPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOvernightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

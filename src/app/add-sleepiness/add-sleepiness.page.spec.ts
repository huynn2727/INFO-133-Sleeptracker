import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSleepinessPage } from './add-sleepiness.page';

describe('AddSleepinessPage', () => {
  let component: AddSleepinessPage;
  let fixture: ComponentFixture<AddSleepinessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSleepinessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

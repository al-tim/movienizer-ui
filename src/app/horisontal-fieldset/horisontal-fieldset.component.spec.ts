/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HorisontalFieldsetComponent } from './horisontal-fieldset.component';

describe('HorisontalFieldsetComponent', () => {
  let component: HorisontalFieldsetComponent;
  let fixture: ComponentFixture<HorisontalFieldsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorisontalFieldsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorisontalFieldsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

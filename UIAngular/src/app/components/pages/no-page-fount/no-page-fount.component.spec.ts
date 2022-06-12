/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NoPageFountComponent } from './no-page-fount.component';

describe('NoPageFountComponent', () => {
  let component: NoPageFountComponent;
  let fixture: ComponentFixture<NoPageFountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoPageFountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPageFountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DioptresComponent } from './Dioptres.component';

describe('DioptresComponent', () => {
  let component: DioptresComponent;
  let fixture: ComponentFixture<DioptresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DioptresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DioptresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

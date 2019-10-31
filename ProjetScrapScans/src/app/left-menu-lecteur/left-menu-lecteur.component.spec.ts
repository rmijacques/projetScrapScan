import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftMenuLecteurComponent } from './left-menu-lecteur.component';

describe('LeftMenuLecteurComponent', () => {
  let component: LeftMenuLecteurComponent;
  let fixture: ComponentFixture<LeftMenuLecteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftMenuLecteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftMenuLecteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

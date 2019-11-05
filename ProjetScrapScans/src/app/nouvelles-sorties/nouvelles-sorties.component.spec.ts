import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvellesSortiesComponent } from './nouvelles-sorties.component';

describe('NouvellesSortiesComponent', () => {
  let component: NouvellesSortiesComponent;
  let fixture: ComponentFixture<NouvellesSortiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvellesSortiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvellesSortiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

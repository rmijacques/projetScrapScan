import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLecteurComponent } from './page-lecteur.component';

describe('PageLecteurComponent', () => {
  let component: PageLecteurComponent;
  let fixture: ComponentFixture<PageLecteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLecteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLecteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

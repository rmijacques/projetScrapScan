import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuivreUnMangaComponent } from './suivre-un-manga.component';

describe('SuivreUnMangaComponent', () => {
  let component: SuivreUnMangaComponent;
  let fixture: ComponentFixture<SuivreUnMangaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuivreUnMangaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuivreUnMangaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

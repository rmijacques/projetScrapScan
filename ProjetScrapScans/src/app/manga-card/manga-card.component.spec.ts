import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaCardComponent } from './manga-card.component';

describe('MangaCardComponent', () => {
  let component: MangaCardComponent;
  let fixture: ComponentFixture<MangaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

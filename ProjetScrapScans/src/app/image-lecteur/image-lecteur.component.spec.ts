import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLecteurComponent } from './image-lecteur.component';

describe('ImageLecteurComponent', () => {
  let component: ImageLecteurComponent;
  let fixture: ComponentFixture<ImageLecteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLecteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLecteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

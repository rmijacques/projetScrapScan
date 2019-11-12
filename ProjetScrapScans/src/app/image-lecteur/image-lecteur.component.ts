import { Component, OnInit , Input , Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-lecteur',
  templateUrl: './image-lecteur.component.html',
  styleUrls: ['./image-lecteur.component.scss']
})
export class ImageLecteurComponent implements OnInit {
  @Output() action = new EventEmitter<number>();
  @Input() src : string;
  @Input() nomMangaEnRecherche : string;
  @Input() numChap : string;
  @Input() afficher : boolean;

  constructor() { }

  ngOnInit() {
  }
  nextPage(){
    this.action.emit(1);
  }
}

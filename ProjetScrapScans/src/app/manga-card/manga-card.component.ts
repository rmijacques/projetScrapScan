import { Component, OnInit, Input } from '@angular/core';
import { from } from 'rxjs';

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss']
})
export class MangaCardComponent implements OnInit {
  mangaCover;
  @Input() mangaName = String;
  @Input() chapitres : any[];
  constructor() { }

  ngOnInit() {
    this.mangaCover = "http://localhost:8080/temp/"+this.mangaName+"/cover.jpg"
  }

}

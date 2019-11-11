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
  chapitresTelecharges;
  tousLesChapitres;
  constructor() { }

  ngOnInit() {
    this.mangaCover = "http://localhost:8080/temp/"+this.mangaName+"/cover.jpg"
    this.chapitresTelecharges = this.chapitres;

    //A modifier pour recevoir directement liste chapter comme ca
    for(let i=0;i<this.chapitresTelecharges.length;i++){
      this.chapitresTelecharges[i] = this.chapitresTelecharges[i].numChapter;
    }
    console.log(this.chapitresTelecharges)
    let dernierChapPossede = this.chapitresTelecharges.reduce(function(a,b){
      return Math.min(a,b);
    })
    console.log(dernierChapPossede)
    this.tousLesChapitres = []
    for(let i=1;i<dernierChapPossede;i++){
      this.tousLesChapitres.push(i);
    }
    this.tousLesChapitres.sort(function(a,b){
      return b - a
    })
  }

}

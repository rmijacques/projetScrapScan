import { Component, OnInit, Input, Injectable } from '@angular/core';
import { from } from 'rxjs';

import { Router } from '@angular/router';
import { SocketService } from '../socket.service';

let localhostURL = "http://localhost:8080/";
let serverURL = "http://172.30.250.55:8080/";

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss']
})


@Injectable()
export class MangaCardComponent implements OnInit {
  mangaCover;
  @Input() mangaName = String;
  @Input() chapitres : any[];
  chapitresTelecharges : any[];
  chapitresNonTelecharges: any[];

  constructor(private _SocketService : SocketService,
              private router : Router) { }


  ngOnInit() {
    this.mangaCover = localhostURL + "temp/"+this.mangaName+"/cover.jpg"
    // this.mangaCover = serverURL + "temp/" + this.mangaName + "/cover.jpg"
    this.chapitresTelecharges = this.chapitres;

    //A modifier pour recevoir directement liste chapter comme ca
    for(let i=0;i<this.chapitresTelecharges.length;i++){
      this.chapitresTelecharges[i] = this.chapitresTelecharges[i].numChapter;
    }
    console.log(this.chapitresTelecharges)
    let dernierChapPossede = this.chapitresTelecharges.reduce(function(a,b){
      return Math.min(a,b);
    });
    console.log(dernierChapPossede)
    this.chapitresNonTelecharges = [];
    for(let i=1;i<dernierChapPossede;i++){
      this.chapitresNonTelecharges.push({num :i,dlEnCours : false});
    }
    this.chapitresNonTelecharges.sort(function(a,b){
      return b.num - a.num;
    });

    this._SocketService.getObservable("getChapitre").subscribe((message)=> {
      message = JSON.parse(message);
      // console.log(reponse);
      if(message.status === "OK"){
        console.log("Chapitre Telecharge");
        this.chapitresTelecharges.push(message.numChapter);
        this.chapitresNonTelecharges.splice(this.chapitresNonTelecharges.indexOf(message.numChapter), 1 );
      }
      else{
        console.log("Chapitre inexistant");
      }
    })
  }

  telechargerLeChapitre(chap){
    let message = {
      mangaName: this.mangaName,
      numChapter: chap.num
    };
    this._SocketService.emit("getChapitre", JSON.stringify(message));
  }

}

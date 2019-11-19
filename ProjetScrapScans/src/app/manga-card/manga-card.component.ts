import { Component, OnInit, Input, Injectable } from '@angular/core';
import { from } from 'rxjs';

import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

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
  
  constructor(private socket : Socket,
              private router : Router) { }

  bindSocket() {
    this.socket.on("getChapitre", (reponse)=> {
      reponse = JSON.parse(reponse);
      // console.log(reponse);
      if(reponse.status === "OK"){
        console.log("Chapitre Telecharge");
        this.chapitresTelecharges.push(reponse.numChapter);
        this.chapitresNonTelecharges.splice(this.chapitresNonTelecharges.indexOf(reponse.numChapter), 1 );
      }
      else{
        console.log("Chapitre inexistant");
      }
    });
  }

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
    this.chapitresNonTelecharges = [];
    for(let i=1;i<dernierChapPossede;i++){
      this.chapitresNonTelecharges.push({num :i,dlEnCours : false});
    }
    this.chapitresNonTelecharges.sort(function(a,b){
      return b.num - a.num;
    })

    this.bindSocket();
  }

  telechargerLeChapitre(chap){
    let message = {
      mangaName: this.mangaName,
      numChapter: chap.num
    };
    this.socket.emit("getChapitre", JSON.stringify(message));
  }

}

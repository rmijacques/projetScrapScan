import { Component, OnInit, Injectable , HostListener } from '@angular/core';
import {NgForm, ɵInternalFormsSharedModule} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Socket } from 'ngx-socket-io';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'app-page-lecteur',
  templateUrl: './page-lecteur.component.html',
  styleUrls: ['./page-lecteur.component.scss']
})


@Injectable()
export class PageLecteurComponent implements OnInit {
  listeImages : string[]  = [];
  imageAEnvoyer : string;
  index : number;
  nbPages : number;
  mangaEnRecherche : string;
  chapEnRecherche : string;
  rechercheTerminee : boolean = true;
  manga :  string;
  chapitre;



  constructor(private socket: Socket,
              private _route: ActivatedRoute) { }

  bindSocket() {
    this.socket.on("getChapitre", (reponse)=> {
      reponse = JSON.parse(reponse);
      this.index = 0;
      if(reponse.status == "NOPE"){
        alert('Impossible de trouver le chapitre ' + this.chapitre + ' de '+ this.manga);
        if(this.listeImages.length > 0){
          this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
        }
      }
      else{
        for(let i=0; i < reponse.urlList.length; i++){
          this.listeImages[i] = "http://localhost:8080/" + reponse.urlList[i];
        }
        this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
        this.nbPages = this.listeImages.length-1;
      }
      this.rechercheTerminee = true;
    });

    this.socket.on("debutDL", (reponse) => {
      this.index = 0;
      this.nbPages = 0;
      this.listeImages = [];
    });

    this.socket.on("getChapitrePageParPage", (reponse) => {
      console.log(reponse);
      reponse = JSON.parse(reponse);
      switch(reponse.typeData){
        case "pageUnique":
            if(reponse.numPage == 1) {
              setTimeout(() => {this.imageAEnvoyer ="http://localhost:8080/" + reponse.urlPage;}, 5000);
            }
            this.listeImages[reponse.numPage] ="http://localhost:8080/" + reponse.urlPage;
            this.nbPages = this.nbPages+1;
            break;
        case "listePages":
            for(let i=0; i < reponse.urlList.length; i++){
              this.listeImages[i] = "http://localhost:8080/" + reponse.urlList[i];
            }
            this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
            this.nbPages = this.listeImages.length-1;
            break;
        default:
          break;
      }
    });
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.getListeUrls(params.mangaName,params.numChap);
    });

    this.bindSocket();
  }

  getListeUrls(manga, chapitre){
    //this.rechercheTerminee = false;
    let chap = {
      mangaName: manga,
      numChapter: chapitre
    };
    this.manga = manga;
    this.chapitre = chapitre;
    this.socket.emit("getChapitrePageParPage", JSON.stringify(chap));
  }

  chargerNouveauScan(recherche){
    console.log(recherche);
    this.getListeUrls(recherche.nomManga,recherche.numChapitre);
    this.index = 0;
  }

  @HostListener('window:keyup',['$event'])
  keyEvent(event: KeyboardEvent){
    if(event.keyCode === KEY_CODE.RIGHT_ARROW){
      this.onPageChange(1);
    }

    if(event.keyCode === KEY_CODE.LEFT_ARROW){
      this.onPageChange(2);
    }
  }

  onPageChange(aFaire){
    switch(aFaire){
      case 1:
        if(this.index===this.nbPages-1){
          this.getListeUrls(this.manga,+this.chapitre + 1);
        }
        else{
          this.index++;
        }
        break;
      case 2:
        if(this.index>0){
          this.index--;
        }
        else{
          alert('Pas de page précédente')
        }
        break;
    }
    if(this.index===this.nbPages){
      this.getListeUrls(this.manga,+this.chapitre + 1);
    }
    this.imageAEnvoyer = this.listeImages[this.index].replace(/^\s+|\s+$/g, '');
    setTimeout(function(){
      window.scrollTo(0,0)
    }, 500);
    
  }
}

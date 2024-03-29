import { Component, OnInit, Injectable , HostListener } from '@angular/core';
import {NgForm, ɵInternalFormsSharedModule} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SocketService } from '../socket.service';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

let localhostURL = "http://localhost:8080/"
let serverURL = "http://172.30.250.55:8080/"

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



  constructor(private _SocketService: SocketService,
              private _route: ActivatedRoute) { }


  ngOnInit() {
    this._route.params.subscribe(params => {
      this.chargerNouveauScan({nomManga :params.mangaName,numChapitre: params.numChap});
    });

    this._SocketService.getObservable("getChapitre").subscribe((message)=> {
      message = JSON.parse(message);
      this.index = 0;
      if(message.status == "NOPE"){
        alert('Impossible de trouver le chapitre ' + this.chapitre + ' de '+ this.manga);
        if(this.listeImages.length > 0){
          this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
        }
      }
      else{
        for(let i=0; i < message.urlList.length; i++){
          this.listeImages[i] = localhostURL + message.urlList[i];
          //this.listeImages[i] = serverURL + message.urlList[i];
        }
        this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
        this.nbPages = this.listeImages.length-1;
      }
      this.rechercheTerminee = true;
    });

    this._SocketService.getObservable("debutDL").subscribe((message) => {
      this.index = 0;
      this.nbPages = 0;
      this.listeImages = [];
    });

    this._SocketService.getObservable("getChapitrePageParPage").subscribe((message) => {
      console.log(message);
      message = JSON.parse(message);
      switch(message.typeData){
        case "pageUnique":
            if(message.numPage == 1) {
              this.rechercheTerminee = true;
              setTimeout(() => {this.imageAEnvoyer = localhostURL + message.urlPage;}, 5000);
              // setTimeout(() => {this.imageAEnvoyer = serverURL + reponse.urlPage;}, 5000);
            }
            this.listeImages[message.numPage] = localhostURL + message.urlPage;
            // this.listeImages[reponse.numPage] = serverURL + reponse.urlPage;
            this.nbPages = this.nbPages+1;
            break;
        case "listePages":
          this.rechercheTerminee = true;
            for(let i=0; i < message.urlList.length; i++){
              this.listeImages[i] = localhostURL + message.urlList[i];
              // this.listeImages[i] = serverURL + reponse.urlList[i];
            }
            this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
            this.nbPages = this.listeImages.length;
            break;
        default:
          break;
      }
    });
  }

  getListeUrls(manga, chapitre){
    this.rechercheTerminee = false;
    let chap = {
      mangaName: manga,
      numChapter: chapitre
    };
    this.manga = manga;
    this.chapitre = chapitre;
    this._SocketService.emit("getChapitrePageParPage", JSON.stringify(chap));
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

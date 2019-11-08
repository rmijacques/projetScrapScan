import { Component, OnInit, Injectable , HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm, ɵInternalFormsSharedModule} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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



  constructor(private httpClient : HttpClient,
    private _route: ActivatedRoute) { 
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.getListeUrlsParam(params);
    });
  }
  
  getListeUrlsParam(scanAChercher){
    console.log(scanAChercher)
    this.rechercheTerminee = false;
    this.mangaEnRecherche = scanAChercher.mangaName;
    this.chapEnRecherche = scanAChercher.numChap;
    this.imageAEnvoyer = "";
    this.httpClient.get<any[]>("http://localhost:8080/recupDerniereSorties/"+sessionStorage.getItem("user")).subscribe( 
      (reponse)=> {
        this.index = 0;
        let chapitres = reponse.find((elem) => elem.name == scanAChercher.mangaName).chapters;
        console.log(chapitres);
        this.listeImages = chapitres.find((elem) => elem.numChapter == scanAChercher.numChap).listePages
        
        for(let i=0;i<this.listeImages.length;i++){
          this.listeImages[i] = "http://localhost:8080/" + this.listeImages[i];
        }
        this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
        this.nbPages = this.listeImages.length-1;
        this.manga = scanAChercher.mangaName;
        this.chapitre = scanAChercher.numChap;
        this.rechercheTerminee = true;
      });
  }

  getListeUrls(manga,chapitre){
    this.rechercheTerminee = false;
    this.mangaEnRecherche = manga;
    this.chapEnRecherche = chapitre;
    this.imageAEnvoyer = "";
    this.httpClient.get<any[]>("http://localhost:8080/lecteur/"+manga+"/"+chapitre).subscribe( 
      (reponse)=> {
        console.log(reponse);
        this.index = 0;
        if(reponse[0] === 0){
          alert('Impossible de trouver le chapitre '+chapitre+ ' de '+manga);
          if(this.listeImages.length > 0){
            this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
          }
        }
        else{
          this.listeImages = reponse;
          this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
          this.nbPages = this.listeImages.length-1;
          this.manga = manga;
          this.chapitre = chapitre;
        }
        this.rechercheTerminee = true;
      },
      (err) => {
       console.log(err);
    });
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

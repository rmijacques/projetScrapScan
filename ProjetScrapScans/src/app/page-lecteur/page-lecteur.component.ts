import { Component, OnInit, Injectable , HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';


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

  constructor(private httpClient : HttpClient) { 

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

  ngOnInit() {
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

  lirePageSuivante(){
    this.index++;
    this.imageAEnvoyer = this.listeImages[this.index];
  }

}

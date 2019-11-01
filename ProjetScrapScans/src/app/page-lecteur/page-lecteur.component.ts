import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';

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
        this.listeImages = reponse;
        if(reponse[0] === 0){
          alert('Impossible de trouver le chapitre '+chapitre+ ' de '+manga);
        }
        else{
          this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
          this.nbPages = this.listeImages.length;
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

  onPageChange(aFaire){
    switch(aFaire){
      case 1:
        this.index++;
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

import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  constructor(private httpClient : HttpClient) { 

  }

  
  async getListeUrls(){
     this.httpClient.get<any[]>("http://localhost:8080/lecteur/Shingeki No Kyojin/122").subscribe( 
      (reponse)=> {
        this.listeImages = reponse;
        this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, '');
      },
      (err) => {
       console.log(err);
    });
  }

  ngOnInit() {
    this.index = 0;
    this.getListeUrls();
    this.imageAEnvoyer = this.listeImages[0].replace(/^\s+|\s+$/g, ''); 
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
    window.scrollTo(0,0)
  }

  lirePageSuivante(){
    this.index++;
    this.imageAEnvoyer = this.listeImages[this.index];
  }

}

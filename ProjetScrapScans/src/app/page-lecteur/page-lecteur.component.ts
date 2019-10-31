import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-lecteur',
  templateUrl: './page-lecteur.component.html',
  styleUrls: ['./page-lecteur.component.scss']
})
export class PageLecteurComponent implements OnInit {
  listeImages : string[] = [];
  imageAEnvoyer : string;
  index : number;
  constructor() {   }

  ngOnInit() {
    for(let i=0;i<10;i++){
      let j = i+1;
      this.listeImages[i] = "https://lelscan-vf.com/uploads/manga/black-clover/chapters/227/0"+j+".png";
    }
    this.index = 0;
    this.imageAEnvoyer = this.listeImages[0]; 
  }
  onPageChange(aFaire){
    switch(aFaire){
      case 1:
        this.index++
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
    this.imageAEnvoyer = this.listeImages[this.index];
    console.log(this.imageAEnvoyer);
    window.scrollTo(0,0)
  }

  lirePageSuivante(){
    this.index++;
    this.imageAEnvoyer = this.listeImages[this.index];
  }

}

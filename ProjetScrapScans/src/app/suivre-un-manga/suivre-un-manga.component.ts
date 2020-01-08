import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-suivre-un-manga',
  templateUrl: './suivre-un-manga.component.html',
  styleUrls: ['./suivre-un-manga.component.scss']
})

@Injectable()
export class SuivreUnMangaComponent implements OnInit {
  ajoutEnCours = false;
  constructor(private router: Router,
              private _SocketService: SocketService) { }


  ngOnInit() { 

    this._SocketService.getObservable("getChapitre").subscribe((message) => {
      message = JSON.parse(message);
      this.ajoutEnCours = false; 
      if(message.status == 'OK') {
        alert("Manga ajouté");
      }
    });

    this._SocketService.getObservable("suivreUnManga").subscribe((message) =>{
      message = JSON.parse(message);
      if(message.status == 'OK'){
        alert("Chapitre téléchargé");
        this.ajoutEnCours = false;
      }
    })
  }
  

  goToLecteurWith(recherche){
    this.router.navigate(['/lecteur',recherche.nomManga,recherche.numChapitre]);
  }

  onSubmit(form: NgForm){
    let infos = form.value;
    let message = {
      userName: sessionStorage.getItem("user"),
      mangaName: infos.nomManga,
      numChapter: infos.numChapitre
    };

    this.ajoutEnCours = true;
    this._SocketService.emit("suivreUnManga", JSON.stringify(message));
  }

}

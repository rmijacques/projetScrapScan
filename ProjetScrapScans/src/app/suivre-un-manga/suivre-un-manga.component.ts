import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-suivre-un-manga',
  templateUrl: './suivre-un-manga.component.html',
  styleUrls: ['./suivre-un-manga.component.scss']
})

@Injectable()
export class SuivreUnMangaComponent implements OnInit {
  ajoutEnCours = false;
  constructor(private router: Router,
              private socket: Socket) { }

  bindSocket() {
    this.socket.on("suivreUnManga", (reponse) => {
      reponse = JSON.parse(reponse);
      this.ajoutEnCours = false; 
      if(reponse.status == 'OK') {
        alert("Manga ajouté");
      }
    });
  }

  ngOnInit() {
    this.bindSocket();
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
    this.socket.emit("suivreUnManga", JSON.stringify(message));
  }

}

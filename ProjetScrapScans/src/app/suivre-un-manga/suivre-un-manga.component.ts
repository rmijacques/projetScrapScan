import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-suivre-un-manga',
  templateUrl: './suivre-un-manga.component.html',
  styleUrls: ['./suivre-un-manga.component.scss']
})

@Injectable()
export class SuivreUnMangaComponent implements OnInit {
  ajoutEnCours = false;
  constructor(private router: Router,
            private httpClient : HttpClient) { }

  ngOnInit() {
  }

  goToLecteurWith(recherche){
    this.router.navigate(['/lecteur',recherche.nomManga,recherche.numChapitre]);
  }

  onSubmit(form: NgForm){
    let infos = form.value;
    this.ajoutEnCours = true;
    this.httpClient.get<any>("http://localhost:8080/suivreUnManga/"+sessionStorage.getItem("user")+"/"+infos.nomManga+"/"+infos.numChapitre).subscribe(function(reponse){
      this.ajoutEnCours = false; 
      if(reponse.status == 'OK'){
        alert("Manga ajouté");
      }
      
    });
  }

}

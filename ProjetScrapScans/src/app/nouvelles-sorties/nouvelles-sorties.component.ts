import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nouvelles-sorties',
  templateUrl: './nouvelles-sorties.component.html',
  styleUrls: ['./nouvelles-sorties.component.scss']
})

@Injectable()
export class NouvellesSortiesComponent implements OnInit {
  toutesLesSorties : any[] = [];
  constructor(private httpClient : HttpClient,
              private router: Router) { }

  ngOnInit() {
    this.httpClient.get<any[]>("http://localhost:8080/recupDerniereSorties/"+sessionStorage.getItem("user")).subscribe( 
      (reponse)=> {
        this.toutesLesSorties = reponse;
      });
    
  }

  goToLecteurWith(recherche){
    this.router.navigate(['/lecteur',recherche.nomManga,recherche.numChapitre]);
  }
  

}

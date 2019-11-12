import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-suivre-un-manga',
  templateUrl: './suivre-un-manga.component.html',
  styleUrls: ['./suivre-un-manga.component.scss']
})

@Injectable()
export class SuivreUnMangaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToLecteurWith(recherche){
    this.router.navigate(['/lecteur',recherche.nomManga,recherche.numChapitre]);
  }

  onSubmit(form: NgForm){
    let infos = form.value;
    
  }

}

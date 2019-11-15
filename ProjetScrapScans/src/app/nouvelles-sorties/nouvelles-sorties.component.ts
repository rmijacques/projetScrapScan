import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-nouvelles-sorties',
  templateUrl: './nouvelles-sorties.component.html',
  styleUrls: ['./nouvelles-sorties.component.scss']
})

@Injectable()
export class NouvellesSortiesComponent implements OnInit {
  toutesLesSorties : any[] = [];
  constructor(private socket: Socket,
              private router: Router) { }

  bindSocket() {
    this.socket.on("recupDernieresSorties", (reponse)=> {
      this.toutesLesSorties = JSON.parse(reponse);
    });
  }


  ngOnInit() {
    this.socket.emit("recupDernieresSorties", JSON.stringify({userName: sessionStorage.getItem("user")}));

    this.bindSocket();
  }

  goToLecteurWith(recherche){
    this.router.navigate(['/lecteur',recherche.nomManga,recherche.numChapitre]);
  }
  

}

import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-nouvelles-sorties',
  templateUrl: './nouvelles-sorties.component.html',
  styleUrls: ['./nouvelles-sorties.component.scss']
})

@Injectable()
export class NouvellesSortiesComponent implements OnInit {

  toutesLesSorties : any[] = [];

  constructor(private _socketService: SocketService,
              private router: Router) { }

  ngOnInit() {
    this._socketService.emit("recupDernieresSorties", JSON.stringify({userName: sessionStorage.getItem("user")}));

    this._socketService.getObservable("recupDernieresSorties").subscribe((message)=> {
      this.toutesLesSorties = JSON.parse(message);
      console.log(this.toutesLesSorties);
    });
  }

  goToLecteurWith(recherche){
    this.router.navigate(['/lecteur',recherche.nomManga,recherche.numChapitre]);
  }
  

}

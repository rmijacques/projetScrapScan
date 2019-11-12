import { Component, OnInit ,Output , Input, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-left-menu-lecteur',
  templateUrl: './left-menu-lecteur.component.html',
  styleUrls: ['./left-menu-lecteur.component.scss']
})
@Injectable()
export class LeftMenuLecteurComponent implements OnInit {
  @Output() action = new EventEmitter<number>();
  @Output() mangaAChercher = new EventEmitter();
  @Input() numPage : number;
  @Input() nbPages : number;
  listeMangasHabituels = [];


  constructor(private router: Router) { }

  ngOnInit() {
  }

  nextPage(){
    this.action.emit(1);
  }

  prevPage(){
    this.action.emit(2);
  }

  onSubmit(form : NgForm){
    this.mangaAChercher.emit(form.value);
  }

  backToLibrary(){
    this.router.navigate(["/dernieresSorties"]);
  }

}

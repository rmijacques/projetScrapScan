import { Component, OnInit ,Output , Input} from '@angular/core';
import { EventEmitter } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-left-menu-lecteur',
  templateUrl: './left-menu-lecteur.component.html',
  styleUrls: ['./left-menu-lecteur.component.scss']
})
export class LeftMenuLecteurComponent implements OnInit {
  @Output() action = new EventEmitter<number>();
  @Output() mangaAChercher = new EventEmitter();
  @Input() numPage : number;
  @Input() nbPages : number;

  constructor() { }

  ngOnInit() {
    console.log("salut");
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

}

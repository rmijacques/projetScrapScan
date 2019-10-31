import { Component, OnInit ,Output , Input} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-left-menu-lecteur',
  templateUrl: './left-menu-lecteur.component.html',
  styleUrls: ['./left-menu-lecteur.component.scss']
})
export class LeftMenuLecteurComponent implements OnInit {
  @Output() action = new EventEmitter<number>();
  @Input() numPage : number;

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

}

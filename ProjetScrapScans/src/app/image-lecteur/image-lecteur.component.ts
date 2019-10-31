import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'app-image-lecteur',
  templateUrl: './image-lecteur.component.html',
  styleUrls: ['./image-lecteur.component.scss']
})
export class ImageLecteurComponent implements OnInit {
  @Input() src : string;
 
  constructor() { }

  ngOnInit() {
    
  }

}

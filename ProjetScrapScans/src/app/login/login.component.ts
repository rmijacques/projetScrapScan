import { Component, OnInit ,Output , Input, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import {NgForm, FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable()
export class LoginComponent implements OnInit {

  constructor(private httpClient : HttpClient) {}

  ngOnInit() {
  }

  checkLoginBackend(userName){
    this.httpClient.get<string>("http://localhost:8080/checkUser/" + userName).subscribe( 
      (reponse)=> {
        if (reponse == 'Baptiste'){
          //Go to 0's nouvelles sorties
        }
        else if (reponse == 'Remi'){
          //Go to 1's nouvelles sorties
        }
        else {
          //throw new Error('Invalid')
        }
      },
      (err) => {
       console.log(err);
    });
  }

  onSubmit(form : NgForm){
    this.checkLoginBackend(form.value); 
  }
}

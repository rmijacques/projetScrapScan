import { Component, OnInit ,Output , Input, Injectable, INJECTOR} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import {NgForm, FormControl} from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable()
export class LoginComponent implements OnInit {

  constructor(private httpClient : HttpClient,
              private router: Router) {}

  ngOnInit() {
  }

  async checkLoginBackend(userName){
    this.httpClient.get<any[]>("http://localhost:8080/checkUser/" + userName).subscribe( 
      (reponse)=> {
        if (reponse["resText"] != "not identified"){
          //Load this special account
          console.log("Welcome " + reponse["resText"]);
          sessionStorage.setItem("user", userName);
          this.router.navigate(["/dernieresSorties"])
        }
        else {
          //throw new Error('Invalid')
          console.log("FUIS");
        }
      },
      (err) => {
       console.log(err);
    });
    
  }

  onSubmit(form : NgForm){
    this.checkLoginBackend(form.value["login"])
  }
}

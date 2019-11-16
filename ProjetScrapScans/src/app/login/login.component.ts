import { Component, OnInit ,Output , Input, Injectable, INJECTOR} from '@angular/core';
import { EventEmitter } from '@angular/core';
import {NgForm, FormControl} from '@angular/forms';
import { Router } from "@angular/router";
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable()
export class LoginComponent implements OnInit {

  constructor(private socket: Socket,
              private router: Router) {}
  
  bindSocket() {
    this.socket.on("checkUser", (message)=> {
      message = JSON.parse(message);
      if (message.userName != "not identified" ){
        //Load this special account
        console.log("Welcome " + message.userName);
        sessionStorage.setItem("user", message.userName);
        this.router.navigate(["/dernieresSorties"]);
      }
      else {
        //throw new Error('Invalid')
        console.log("FUIS");
      }
    });
  }

  ngOnInit() {
    if(sessionStorage.getItem('user') != null){
      this.router.navigate(['/dernieresSorties']);
    }

    this.bindSocket();
  }

  checkLoginBackend(userName){
    let message = {userName: userName};
    this.socket.emit("checkUser", JSON.stringify(message));
  }

  onSubmit(form : NgForm){
    this.checkLoginBackend(form.value["login"]);
  }
}
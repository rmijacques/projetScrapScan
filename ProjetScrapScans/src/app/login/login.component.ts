import { Component, OnInit ,Output , Input, Injectable, INJECTOR} from '@angular/core';
import { EventEmitter } from '@angular/core';
import {NgForm, FormControl} from '@angular/forms';
import { Router } from "@angular/router";
import { SocketService } from '../socket.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable()
export class LoginComponent implements OnInit {

  constructor(private _SocketService: SocketService,
              private router: Router) {}

  ngOnInit() {

    if(sessionStorage.getItem('user') != null){
      this.router.navigate(['/dernieresSorties']);
    }

    this._SocketService.getObservable("checkUser").subscribe((message)=> {
      message = JSON.parse(message);
      if (message.userName != "not identified" ){
        //Load this special account
        console.log("Welcome " + message.userName);
        sessionStorage.setItem("user", message.userName);
        this.router.navigate(["/dernieresSorties"]);
      }
      else {
        throw new Error('Invalid')
        console.log("FUIS");
      }
    });
  }

  checkLoginBackend(userName){
    let message = {userName: userName};
    this._SocketService.emit("checkUser", JSON.stringify(message));
  }

  onSubmit(form : NgForm){
    this.checkLoginBackend(form.value["login"]);
  }
}
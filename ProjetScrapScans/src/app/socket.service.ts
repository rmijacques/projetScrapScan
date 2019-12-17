import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketService {


  constructor(private socket: Socket) { }

  getObservable(eventName) {
    return this.socket.fromEvent<any>(eventName)
  }

  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }
  
}


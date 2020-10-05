import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as io from 'socket.io-client';

interface TokenResponse {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;

  constructor(private http: HttpClient) {}

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  joinChat (username: string, room: string) {
    this.socket.emit('joinRoom', {username, room});
  }

  onNewMessage (){
    return Observable.create(observer => {
      this.socket.on('message', msg => {
        observer.next(msg);
      })
    })
  }

  upDateUsersOnline (room: object) {
    return Observable.create(observer => {
      this.socket.on('updateUser', () => {
        this.showUsersInRoom(room).subscribe(
          (user) => {
            observer.next(user);
          },
          err => {
            console.log(err);
          }
        )
      })
    })
  }

  sendMessage(message: string) {
    this.socket.emit('chatMessage', message);
  }

  showUsersInRoom(room: object): Observable<any> {
      const base = this.http.post(`/users/onlineusers`, room);

      const request = base.pipe(
        map((data: TokenResponse) => {

          let payload = data.token.split('.')[1];
          payload = window.atob(payload);

          let usersinroom = JSON.parse(payload);

          return usersinroom;
      })
    )
      return request;
    }

  getMessage(room: object): Observable<any> {
    const base = this.http.post(`/rooms/message`, room);

    const request = base.pipe(
      map((data: TokenResponse) => {

        let payload = data.token.split('.')[1];
        payload = window.atob(payload);
        
        let message = JSON.parse(payload);

          return message;
      })
    )
    return request;
  }

  leaveUser(room: object){
    const base = this.http.post(`/users/leave`, room);

    return base;
  }

  leaveRoom(room: object){

    const base = this.http.post(`/rooms/leave`, room);
    
    return base;
  }

  disconnect() {
    this.socket.disconnect();
  }

}

export const environment = {
  production: false,
  SOCKET_ENDPOINT: 'http://localhost:3000'
};
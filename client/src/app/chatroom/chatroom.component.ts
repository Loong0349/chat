import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../socketio.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'chatRoom',
  templateUrl: './chatRoom.component.html'
})
export class ChatRoomComponent implements OnInit  {

  title = 'socketio-angular';
  usersInRoom =[];

  message =[];
  msg ="";

  room = {
    id: 0,
    roomname: '',
    username: ""
  }

  constructor(private socketService: SocketioService, private router: Router, private routers: ActivatedRoute) {}
  
  ngOnInit() {
    this.routers.queryParamMap
    .subscribe((params) => {
      this.room.username = params.get('username');
      this.room.roomname = params.get('roomname');
    }
  );

    this.socketService.setupSocketConnection();

    this.socketService.joinChat( this.room.username, this.room.roomname);

    //GET MESSAGE
    this.socketService.getMessage(this.room).subscribe(
      (msg) => {
          if(msg.message != "@") {
            let message = msg.message.split('@');
          for(let i=1; i<message.length-1; i++) {
            this.message.push(JSON.parse(message[i]))
          } 
        }
        
      },
      err => {
        console.log(err);
      }
    )

    this.socketService.showUsersInRoom(this.room).subscribe(
      (user) => {
        this.usersInRoom = user.user;
      },
      err => {
        console.log(err);
      }
    )

    this.socketService.onNewMessage().subscribe(
      (msg: object) => {
        this.message.push(msg);
      },
      err => {
        console.log(err);
      }
    )

    this.socketService.upDateUsersOnline(this.room).subscribe(
      (user) => {
        this.usersInRoom = user.user;
      },
      err => {
        console.log(err);
      }
    )
  }

  public sendMessage () {
      this.socketService.sendMessage(this.msg);
      this.msg = "";
  }

  public leaveRoom() {
    this.socketService.disconnect();
    this.socketService.leaveUser(this.room).subscribe();
    this.socketService.leaveRoom(this.room).subscribe();
    this.router.navigate(['/join'], {queryParamsHandling: 'preserve'});
  }

}
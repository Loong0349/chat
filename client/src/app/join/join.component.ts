import { Component , OnInit} from '@angular/core';
import { JoinService } from '../join.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'join',
  templateUrl: './join.component.html'
})
export class JoinComponent implements OnInit{
  room = {
    id: 0,
    roomname: '',
    username: ""
  }

  availableRooms =[];

  constructor(private joinService: JoinService, private router: Router, private routers: ActivatedRoute) {}

  ngOnInit() {
    this.routers.queryParamMap
    .subscribe((params) => {  
      this.room.username = params.get('username');
    }
  );
    this.joinService.showJoinRooms(this.room).subscribe(
      (room) => {
        this.availableRooms = room.rooms;
      },
      err => {
        console.log(err);
      }
    )
  }

  join() {
    this.joinService.join(this.room).subscribe(
      () => {
        this.router.navigate(['/chatroom'], {queryParams: {roomname: this.room.roomname}, queryParamsHandling: 'merge'});
        this.availableRooms =[];
      },
      err => {
        console.log(err);
      }
    )
  }
}
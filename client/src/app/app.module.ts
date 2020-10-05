import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { UserComponent } from './user/user.component';
import { JoinComponent } from './join/join.component';
import { ChatRoomComponent } from './chatroom/chatroom.component';
import { AuthenticationService } from './authentication.service';
import { JoinService } from './join.service';

import { SocketioService } from './socketio.service';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'users', component: UserComponent},
  {path: 'join', component: JoinComponent},
  {path: 'chatroom',component: ChatRoomComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UserComponent,
    JoinComponent,
    ChatRoomComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [SocketioService, AuthenticationService, JoinService],
  bootstrap: [AppComponent]
})
export class AppModule { }

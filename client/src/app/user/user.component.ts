import { Component } from '@angular/core';
import { AuthenticationService, TokenPayLoad } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
export class UserComponent {
  credentials: TokenPayLoad = {
    id: 0,
    username: '',
    password: '',
    confirmpassword: '',
    type: ''
  };

  errors = {
    text: null
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  reset() {
    this.credentials.username = '';
    this.credentials.password = '';
    this.credentials.confirmpassword = '';

    this.errors.text = null;
  }

  logIn() {
    if(this.credentials.username == '' || this.credentials.password == '') {
      this.errors.text = "Please fill in all the input fields";
    }
    else {
      this.auth.logIn(this.credentials).subscribe(
        () => {
          this.router.navigate(['/join'], {queryParams: {username: this.credentials.username}});
        },
        err => {
          this.errors.text = err.error.text;
        }
      )
    }
  }

  register() {
    if(this.credentials.username == '' || this.credentials.password == '' || this.credentials.confirmpassword == '') {
      this.errors.text = "Please fill in all the input fields";
    }
    else if (this.credentials.password !== this.credentials.confirmpassword ) {
      this.errors.text = "Passwords does not match";
    }
    else {
      this.auth.logIn(this.credentials).subscribe(
        () => {
          this.router.navigate(['/join'], {queryParams: {username: this.credentials.username}});
        },
        err => {
          console.log(err);
          this.errors.text = err.error.text;
          console.log(this.errors.text);
        }
      )
    }
  }
}

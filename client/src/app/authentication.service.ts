import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

export interface TokenPayLoad {
    id: number,
    username: string,
    password: string,
    confirmpassword: string,
    type: string
}


@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient) {}

    public logIn(user: TokenPayLoad) : Observable<any> {
        const base = this.http.post(`/users`, user);

        return base;
    }
}
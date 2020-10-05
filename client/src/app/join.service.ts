import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

interface TokenResponse {
    token: string
}


@Injectable()
export class JoinService {

    constructor(private http: HttpClient) {}

    public join(user: object) : Observable<any> {

        const base = this.http.post(`/rooms/join`, user);

        return base;
    }

    public showJoinRooms(username: object) : Observable<any> {
        const base = this.http.post(`/rooms/availableroom`, username);

        const request = base.pipe(
            map((data: TokenResponse) => {

                let payload = data.token.split('.')[1];
                payload = window.atob(payload);

                let availableRooms = JSON.parse(payload);

                return availableRooms;
            })
        )
        return request;
    }
}
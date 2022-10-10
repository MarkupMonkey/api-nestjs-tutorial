import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    //creiamo i metodi di login e register
    signin() { return { msg: 'I am signed in' } }
    signup() { return { msg: 'I am signed up' } }
}

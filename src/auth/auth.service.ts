import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) { }
    //creiamo i metodi di login e register
    signin() { return { msg: 'I have signed in' } }
    signup() { return { msg: 'I have signed up' } }
}

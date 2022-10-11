import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    //dependencies injection
    constructor(private authService: AuthService) { }
    //POST/auth/signup
    @Post('signup')
    signup(@Req() req: Request) {// @Req viene da ExpressJS
        console.log(req.body)
        //chiamiamo la funzione dal servizio
        return this.authService.signup()
    }

    //POST/auth/signin
    @Post('signin')
    signin() {
        //chiamiamo la funzione dal servizio
        return this.authService.signin()
    }
}
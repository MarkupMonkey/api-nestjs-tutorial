import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    //dependencies injection
    constructor(private authService: AuthService) { }
    //POST/auth/signup
    @Post('signup')
    signup() {
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
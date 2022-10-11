import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";// tutti i dettagli di questa cartella

@Controller('auth')
export class AuthController {
    //dependencies injection
    constructor(private authService: AuthService) { }
    //POST/auth/signup
    @Post('signup')
    // signup(@Req() req: Request) {// @Req viene da ExpressJS
    signup(// utilizzando questo decoratore (@Body()) Express otterrà il corpo giusto senza preoccuparci del framework che utilizziamo
        //     @Body('email') email: string,
        //     @Body('password', ParseIntPipe) password: string
        // ) {
        //     console.log({
        //         email,
        //         typeOfEmail: typeof email,
        //         password,
        //         typeOfPassword: typeof password
        //     }) // anzichè fare una pipe per ogni campo di dati possiamo farne una per la forma DTO e applicare li le trasformazioni
        //semplifichiamo l'error handling con librerie 
        // di trasformatori di classe e validatori di classe


        @Body() dto: AuthDto) {
        console.log({ dto })
        return this.authService.signup();
    }

    //POST/auth/signin
    @Post('signin')
    signin() {
        //chiamiamo la funzione dal servizio
        return this.authService.signin()
    }
}
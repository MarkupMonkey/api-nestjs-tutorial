import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'
import { JwtGuard } from 'src/auth/guard';
@Controller('users')
export class UserController {//  http://localhost:3333/users/me

  // vogliamo bloccare questo percorso se non hai il gettone valido
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: Request) { // oggetto @Req viene da nest e l'interfaccia Req da Express
    // console.log({ user: req.user, })
    return req.user;
  }
}

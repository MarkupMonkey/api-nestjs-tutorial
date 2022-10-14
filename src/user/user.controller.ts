import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

// vogliamo bloccare questo percorso se non hai il gettone valido
// tutto quello che è in user.controller richiede di fornire un token
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {//  http://localhost:3333/users/me
  constructor(private userService: UserService) { }
  @Get('me')
  getMe(@GetUser() user: User) { // vogliamo passare solo l'id dell'oggetto user
    // console.log({ user: req.user, })
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto
  ) {
    return this.userService.editUser(userId, dto);
  }
}

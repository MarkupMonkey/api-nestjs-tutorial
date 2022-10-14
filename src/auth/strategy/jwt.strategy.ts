import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable() // di default la strategia si chiamerà 'jwt' 
// possiamo cambiare il nome della strategy con (Strategy, 'nuovonome')
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    })
  }
  // se user è null ---> 401 unauthorized
  async validate(payload: { sub: number, email: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
    // console.log({ payload, })
    // possiamo ricevere le informazioni di JWT 
    delete user.hash;
    return user;
  }

}
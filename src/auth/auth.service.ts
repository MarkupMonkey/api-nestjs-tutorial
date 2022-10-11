import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    //creiamo i metodi di login e register
    async signup(dto: AuthDto) {
        // generate the password hash
        const hash = await argon.hash(dto.password)
        // save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                // con il selettore andiamo a selezionare solo i campi desiderati
                // ma non è molto comodo 
                // select: {
                //     id: true,
                //     email: true,
                //     createdAt: true
                // }
            });
            // per ora eliminiamo solo l'hash dall'oggetto di ritorno
            delete user.hash;
            // return the saved user
            return user;
        } catch (error) {
            //se è un errore di prisma e non di qualcos'altro
            // prisma ha codici di errore definiti e questo signidica che provi a crearne uno nuovo
            // record con i campi univoci che sono stati violari
            // 'P2002' = duplicated field
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials taken'
                    )
                }
            }
        }
    }


    signin() { return { msg: 'I have signed in' } }
}

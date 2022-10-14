import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService

	) { }
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

			return this.signToken(user.id, user.email);
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


	async signin(dto: AuthDto) {
		// find the user by email
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		// if user does not exist throw exception // create a "guard condition"
		if (!user) throw new ForbiddenException(
			'Credentials incorrect',
		);
		// compare password
		const pwMatches = await argon.verify(
			user.hash,
			dto.password
		);
		// if password incorrect throw exception
		if (!pwMatches) throw new ForbiddenException(
			'Credentials incorrect'
		)
		// send back the token 
		return this.signToken(user.id, user.email)
	}
	//dobbiamo genereare il token (invieremo email e nome in questo caso)
	// più tardi quando tornerà indietro possiamo 
	//ottenere queste due informazioni su quel token ed eseguire le convalide
	async signToken(userId: number, email: string): Promise<{ access_token: string }> {
		//costruiamo l'oggetto che firmeremo
		const payload = {
			sub: userId,
			email,
		};
		const secret = this.config.get('JWT_SECRET');


		const token = await this.jwt.signAsync(
			payload, {
			expiresIn: '15m',// dopo 15 minuti il token verrà rifiutato e dovremmo effettuare di nuovo l'accesso
			secret: secret,
		}
		);
		return {
			access_token: token,
		};
	}
}

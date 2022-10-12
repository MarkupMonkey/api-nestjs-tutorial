import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy";

@Module({
	imports: [JwtModule.register({// per accedere e decodificare il token
		// lo lasciamo bianco per personalizzarlo nel auth.service.ts
	})],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
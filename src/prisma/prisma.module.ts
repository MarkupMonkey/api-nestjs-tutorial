import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global()//permette di rendere disponibile il servizio in tutta l'applicazione
@Module({
  providers: [PrismaService],
  exports: [PrismaService]// se non mettiamo questa riga darà un errore per le dipendenze di AuthService
})
export class PrismaModule { }

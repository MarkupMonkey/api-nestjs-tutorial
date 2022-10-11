import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()//creiamo la logia per connetterci al databse
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {// per ora hard codato poi lo prenderemo direttamente dal file .env
                    url: config.get('DATABASE_URL'),
                }
            }
        });
        console.log(config.get('DATABASE_URL'))
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()//creiamo la logia per connetterci al databse
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {// per ora hard codato poi lo prenderemo direttamente dal file .env
                    url: 'postgresql://postgres:123@localhost:5434/nest?schema=public'
                }
            }
        })
    }
}

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { EditUserDto } from 'src/user/dto/edit-user.dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333')
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'marco.prova@gmail.com',
      password: '123'
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
            password: dto.password
          })
          .expectStatus(400)
      })
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
            email: dto.email
          })
          .expectStatus(400)
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody(dto)
          .expectStatus(201)
      })
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody({
            password: dto.password
          })
          .expectStatus(400)
      })
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody({
            email: dto.email
          })
          .expectStatus(400)
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400)
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      })

    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
      })
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: "Marco Salvo Simone",
          email: 'marco.monkey93@gmail.com'
        }
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
    });
  });

  describe('Bookmarks', () => {
    describe('get empty bookmark', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })

          .expectStatus(200)
          .expectBody([])
      })
    })

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First bookmark',
        link: 'https://www.youtube.com/watch?v=D0bACr_bPM4'
      }
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id')
      })
    })
    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })

          .expectStatus(200)
          .expectJsonLength(1)
      })
    })
    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      })
    })
    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Salmo Unplugged (Amazon Original)',
        description: 'Marco Ledda Lebonski 360 Produzione: Lucia Pantalone Line Producer: Fulvio Bufardeci Ingegnere FOH: Simone Squillario Stage Manager/Tech: Alessandro Scalamonti Crew Audio: Filippo Biondi Crew Audio: Davide Linzi Drum Tech: Andrea Rastelli Mix & Master: Andrea Suriani Runners: Alessio Tanti , Fabio Abeltino Supervisore VFX: Alessandro Fele 3D e Animazione: Andrea Bacciu Compositore: Alessandro Sanna, Alessandro Congiu Servizio: Camera Service Factory Località: Ritual Club, Baja Sardinia SS Realizzato con il supporto della Fondazione Sardegna Film Commission - Fondo Location Scouting. Un particolare ringraziamento a: Ritual Club, Grand Hotel President Olbia, La Sosta, Only Sardinia Autonoleggio, Centro Musica Olbia, Camera Service Factory, Voltura, Warriors Fulvio Bufardeci Ingegnere FOH: Simone Squillario Stage Manager/Tech: Alessandro Scalamonti Crew Audio: Filippo Biondi Crew Audio: Davide Linzi Drum Tech: Andrea Rastelli Mix & Master: Andrea Suriani Runners: Alessio Tanti, Fabio Abeltino VFX Supervisor: Alessandro Fele 3D and Animation : Andrea Bacciu Compositore: Alessandro Sanna, Alessandro Congiu Servizio: Camera Service Factory Luogo: Ritual Club, Baja Sardinia SS Realizzato con il supporto della Fondazione Sardegna Film Commission - Fondo Location Scouting. Un particolare ringraziamento a: Ritual Club, Grand Hotel President Olbia, La Sosta, Only Sardinia Autonoleggio, Centro Musica Olbia, Camera Service Factory, Voltura, Warriors Fulvio Bufardeci Ingegnere FOH: Simone Squillario Stage Manager/Tech: Alessandro Scalamonti Crew Audio: Filippo Biondi Crew Audio: Davide Linzi Drum Tech: Andrea Rastelli Mix & Master: Andrea Suriani Runners: Alessio Tanti, Fabio Abeltino VFX Supervisor: Alessandro Fele 3D and Animation : Andrea Bacciu Compositore: Alessandro Sanna, Alessandro Congiu Servizio: Camera Service Factory Luogo: Ritual Club, Baja Sardinia SS Realizzato con il supporto della Fondazione Sardegna Film Commission - Fondo Location Scouting. Un particolare ringraziamento a: Ritual Club, Grand Hotel President Olbia, La Sosta, Only Sardinia Autonoleggio, Centro Musica Olbia, Camera Service Factory, Voltura, Warriors Andrea Rastelli Mix & Master: Andrea Suriani Runners: Alessio Tanti, Fabio Abeltino VFX Supervisor: Alessandro Fele 3D and Animation: Andrea Bacciu Compositore: Alessandro Sanna, Alessandro Congiu Service: Camera Service Factory Località: Ritual Club, Baja Sardinia SS Realizzato con il supporto della Fondazione Sardegna Film Commission - Fondo Location Scouting. Un particolare ringraziamento a: Ritual Club, Grand Hotel President Olbia, La Sosta, Only Sardinia Autonoleggio, Centro Musica Olbia, Camera Service Factory, Voltura, Warriors Andrea Rastelli Mix & Master: Andrea Suriani Runners: Alessio Tanti, Fabio Abeltino VFX Supervisor: Alessandro Fele 3D and Animation: Andrea Bacciu Compositore: Alessandro Sanna, Alessandro Congiu Service: Camera Service Factory Località: Ritual Club, Baja Sardinia SS Realizzato con il supporto della Fondazione Sardegna Film Commission - Fondo Location Scouting. Un particolare ringraziamento a: Ritual Club, Grand Hotel President Olbia, La Sosta, Only Sardinia Autonoleggio, Centro Musica Olbia, Camera Service Factory, Voltura, Warriors Baja Sardinia SS Realizzato con il supporto della Fondazione Sardegna Film Commission - Fondo Location Scouting. Un particolare ringraziamento a: Ritual Club, Grand Hotel President Olbia, La Sosta, Only Sardinia Autonoleggio, Centro Musica Olbia, Camera Service Factory, Voltura, Warriors Baja Sardinia SS Realizzato con il supporto della Fondazione Sardegna Film Commission - Fondo Location Scouting. Un particolare ringraziamento a: Ritual Club, Grand Hotel President Olbia, La Sosta, Only Sardinia Autonoleggio, Centro Musica Olbia, Camera Service Factory, Voltura, Warriors',
      }
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
      })
    })
    describe('Delete bookmark by id', () => {
      it('should delite bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204)
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })

          .expectStatus(200)
          .expectJsonLength(0)
      })
    });
  });
})
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Connect DB
Add .env file to root project with content:
```bash
DATABASE_URL="postgresql://postgres:123456@localhost:5432/interlux"
```
Generate prisma client:
```bash
$ npx prisma generate
```

Migrate database:
```bash
$ npx prisma migrate dev
```

Seed data:
```bash
$ npm run seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deploy to Vercel

### Build Settings (Vercel Dashboard):

**Install Command:**
```bash
npm install
```

**Build Command:**
```bash
npx prisma generate && npm run build
```

**Output Directory:**
```
dist
```

### Environment Variables:
Add all variables from `.env.example` to Vercel:
- `DATABASE_URL` - PostgreSQL connection (use Supabase/Neon/Railway)
- `PORT` - Port number (default: 3000)
- `JWT_SECRET` - JWT secret key
- `EXPIRES_ACCESS_TOKEN` - Access token expiration
- `JWT_REFRESH_SECRET` - Refresh token secret
- `EXPIRES_REFRESH_TOKEN` - Refresh token expiration
- `CLIENT_URL` - Frontend URL
- `REDIS_HOST` - Redis host (use Upstash Redis)
- `REDIS_PORT` - Redis port
- `EMAIL_USER` - SMTP email
- `EMAIL_PASS` - SMTP password
- `API_URL` - Backend API URL

### Pre-deployment:
1. **Run database migrations on production database:**
   ```bash
   DATABASE_URL="your_production_db_url" npx prisma migrate deploy
   ```

2. **Seed data (optional):**
   ```bash
   DATABASE_URL="your_production_db_url" npm run seed
   ```

3. **Commit and push all changes:**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push
   ```

### Important Notes:
- ✅ `vercel.json` is configured for NestJS
- ✅ Views templates are auto-copied during build
- ✅ Template paths work in both dev and production
- ⚠️ Use external PostgreSQL (Vercel doesn't support local DB)
- ⚠️ Use Upstash Redis for serverless Redis

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# Projex

## Set Up

1. Create `.env`:

   ```env
   DATABASE_URL="postgresql://projex:projex@localhost:5432/projex?schema=public"
   DIRECT_URL="postgresql://projex:projex@localhost:5432/projex?schema=public"
   JWT_SECRET="123456"
   SIGN_UP_CODE="123456"
   ```

2. Run scripts in order:

   ```sh
   npm run submodules:init
   npm install
   npm run prisma:push
   npm start
   ```

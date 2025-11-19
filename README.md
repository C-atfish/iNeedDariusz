# DO YOU NEED DARIUSZ?

![Demo of the app](https://media.tenor.com/SuVGs-GL7RoAAAAi/shocked-shocked-cat.gif)

### DONT WE ALL???

### Queue up for the next session now (Max 5 minutes)

![Demo of the app](https://media1.tenor.com/m/9CJaHEmyKPAAAAAC/chris-pratt-andy-dwyer.gif)

## Just want to test it?

1. clone the .env-example file and name it .env
2. Fill it in with your own values, if you dont plan to use the google signin, you can just leave the client id and secret blank and continue as guest user.

3.

```
cd /server
```

2.

```
docker compose up -d
```

3. Frontend available at 127.0.0.1:5437

## Development steps

### How to set up database

1.

```
cd /server
```

2.

```
docker compose up -d
```

(You can stop the server and client containers, these are just used for prod. This step is just to set up the database)

### How to run the server

1.

```
cd /server
```

2.

```
npm install
```

3.

```
npx prisma generate
```

4.

```
npx prisma db push
```

5.

```
npm run dev
```

### How to run the client

1.

```
cd /i-need-dariusz-client
```

2.

```
npm install
```

3.

```
npm run dev
```

## Deploy changes to db in prod

```
docker compose exec backend npx prisma migrate deploy
```

# SNEK IS HUNGRY. SNEK WILL C̶̖̑Ǒ̵͍N̶̳S̵̨̚Ư̴̧M̴̙E̵̐

This is a slither.io clone for rawb.tv so we can all play together and add lots of memes

_____
#### Running Locally
This should be fairly straightforward. You'll need yarn 3. Next, duplicate `/env/.env` into files 
called `.env.development` and `.env.production`, letting you change version settings.
By default, the dockerfile is set up for a production build on port 80. You'll have to edit all 
the ports in the `.env.production` file to `80` as well.

Then from the project root:
```
yarn install
yarn build
yarn start
```
Congrats! You can play snakey-mouse on `localhost:8080`. Every sub-project has its own
start/build script. Running /engine, /server, and /client in that order with `yarn start` will
get the dev build up and running with a webpack proxy.

You can change env settings using the provided .env file. Just uncomment the variables. Different
environment configs are supported, with the naming convention of `.env.${production|development}`

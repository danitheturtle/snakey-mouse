# Slither.io clone for Rawb.tv

This is a slither.io clone for rawb.tv so we can all play together and add lots of memes
Created with socket.io and a custom js game engine.
___
### Showcase
Gameplay:

https://github.com/user-attachments/assets/0f5bf7a1-6760-48f9-8f9c-e845760e4db0

Mobile controls:

https://github.com/user-attachments/assets/7a5c8027-d305-4380-b092-67e729038a94

_____
#### Running Locally
You'll need yarn 3. 

Duplicate `/env/.env` into files called `.env.development` and `.env.production`, letting you 
change version settings. By default, the dockerfile and prod server version are setup to use 
port `8080`, so edit that value into the `.env.production` file.

Then from the project root:
```
yarn install
yarn build
yarn start
```
Congrats! You can play snakey-mouse on `localhost:8080`. Every sub-project has its own
start/build script. Running /engine, /server, and /client in that order with `yarn start` will
get the dev build up and running with a webpack proxy.

To build a docker image, first run `yarn build`, then run this from the project root
```
docker build . -t snakey-mouse:v1
docker run --rm -it -p 80:8080 snakey-mouse:v1
```
That will get you a docker image, and start it running locally on port 80.

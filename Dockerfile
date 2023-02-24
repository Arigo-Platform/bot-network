FROM node:alpine

# Create the bot's directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub

RUN echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories

RUN apk add doppler

COPY package.json /usr/src/bot
RUN npm install

COPY . /usr/src/bot
RUN doppler --version
# Start the bot.
CMD ["doppler", "run", "--", "node index.js"]
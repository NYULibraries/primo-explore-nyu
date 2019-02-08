FROM cypress/browsers:chrome69

WORKDIR /app

ADD package.json yarn.lock ./

RUN yarn install --frozen-lockfile

ADD . .
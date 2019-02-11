FROM cypress/browsers:chrome69

WORKDIR /app

ADD package.json yarn.lock ./

RUN yarn install --frozen-lockfile

ADD cypress.json .
ADD ./cypress/ ./cypress/

CMD yarn cypress run
FROM cypress/browsers:chrome69

WORKDIR /app

RUN yarn init -y && yarn add --dev cypress

ADD cypress.json .
ADD ./cypress/ ./cypress/

RUN yarn cypress verify

CMD yarn cypress run
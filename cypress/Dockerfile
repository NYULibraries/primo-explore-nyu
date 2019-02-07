FROM cypress/browsers:chrome69

RUN wget --no-check-certificate -q -O - https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh > /tmp/wait-for-it.sh
RUN chmod a+x /tmp/wait-for-it.sh

WORKDIR /app

ADD package.json yarn.lock ./

RUN yarn install --frozen-lockfile
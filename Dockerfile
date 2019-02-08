FROM primo-explore-devenv-nyu:latest

ENV CENTRAL_PACKAGE_REPO https://github.com/NYULibraries/primo-explore-central-package
ENV DEVENV_PATH /app
ENV CENTRAL_PACKAGE_PATH /app/primo-explore/custom/CENTRAL_PACKAGE
ENV INSTALL_PATH /app/primo-explore/custom/NYU

# Install essentials
RUN apt-get update -qq && apt-get install -y git

RUN mkdir -p ${CENTRAL_PACKAGE_PATH} \
  && git clone ${CENTRAL_PACKAGE_REPO} ${CENTRAL_PACKAGE_PATH} \
  && cd ${CENTRAL_PACKAGE_PATH} yarn install --frozen-lockfile --prod

# # Install node_modules with yarn
ADD package.json yarn.lock /tmp/
RUN cd /tmp \
  && yarn install --frozen-lockfile --prod
RUN mkdir -p $INSTALL_PATH \
  && cd $INSTALL_PATH \
  && cp -R /tmp/node_modules $INSTALL_PATH \
  && rm -r /tmp/* && yarn cache clean

WORKDIR ${INSTALL_PATH}

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --prod

ADD . .

WORKDIR ${DEVENV_PATH}

EXPOSE 8003 3001

CMD [ "/bin/bash", "-c", "yarn start --view=${VIEW}"]
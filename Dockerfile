FROM quay.io/nyulibraries/primo-explore-devenv:master

# A url or directory refrence to a zipped CENTRAL_PACkAGE
ARG CENTRAL_PACKAGE_RELEASE

ENV VIEW NYU
ENV DEVENV_PATH /app/
ENV CUSTOM_PACKAGE_PATH /app/primo-explore/custom/
ENV CUSTOM_VIEW_PATH ${CUSTOM_PACKAGE_PATH}/${VIEW}

## Adds central package to image
WORKDIR ${CUSTOM_PACKAGE_PATH}
ADD ${CENTRAL_PACKAGE_RELEASE} .
RUN unzip CENTRAL_PACKAGE.zip && rm CENTRAL_PACKAGE.zip

# Installs Node modules
WORKDIR ${CUSTOM_VIEW_PATH}
ADD yarn.lock package.json ./
RUN yarn install --prod

# Adds NYU files to image
ADD . .

## Sets up for running as a container
WORKDIR ${DEVENV_PATH}
EXPOSE 8004 3001
CMD yarn start
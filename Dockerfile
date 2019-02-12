FROM quay.io/nyulibraries/primo-explore-devenv:latest

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

# Adds NYU files to image
WORKDIR ${CUSTOM_VIEW_PATH}
ADD . .

## Sets up for running as a container
WORKDIR ${DEVENV_PATH}
EXPOSE 8004 3001
CMD yarn start
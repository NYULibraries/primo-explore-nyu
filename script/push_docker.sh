#!/bin/sh -ex

docker tag primo-explore-nyu quay.io/nyulibraries/primo-explore-nyu:latest
docker tag primo-explore-nyu quay.io/nyulibraries/primo-explore-nyu:${CIRCLE_BRANCH//\//_}
docker tag primo-explore-nyu quay.io/nyulibraries/primo-explore-nyu:${CIRCLE_BRANCH//\//_}-${CIRCLE_SHA1}

docker push quay.io/nyulibraries/primo-explore-nyu:latest
docker push quay.io/nyulibraries/primo-explore-nyu:${CIRCLE_BRANCH//\//_}
docker push quay.io/nyulibraries/primo-explore-nyu:${CIRCLE_BRANCH//\//_}-${CIRCLE_SHA1}
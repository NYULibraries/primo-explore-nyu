# #!/bin/sh -ex

docker pull quay.io/nyulibraries/primo-explore-nyu:${CIRCLE_BRANCH//\//_} || docker pull quay.io/nyulibraries/primo-explore-nyu:latest
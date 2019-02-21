[![Github commits (since latest release)](https://img.shields.io/github/commits-since/NYULibraries/primo-explore-nyu/latest.svg)](https://github.com/NYULibraries/primo-explore-nyu/releases/latest)

[![CircleCI](https://circleci.com/gh/NYULibraries/primo-explore-nyu.svg?style=svg)](https://circleci.com/gh/NYULibraries/primo-explore-nyu)
[![Docker Repository on Quay](https://quay.io/repository/nyulibraries/primo-explore-nyu/status "Docker Repository on Quay")](https://quay.io/repository/nyulibraries/primo-explore-nyu)

# NYU Primo-explore package

This the NYU Libraries primo-explore view package.

For more information about primo-explore views please review the example package that this package was cloned from: https://github.com/ExLibrisGroup/primo-explore-package.

For information about developing in the primo-explore UI please review that relevant repository: https://github.com/ExLibrisGroup/primo-explore-devenv

For more information about NYU's customizations read the [wiki](https://github.com/nyulibraries/primo-explore-nyu/wiki).

## Run the Development Environment (only in Docker)

With recommended volumes enabled in the `docker-compose.yml`:

With Docker and docker-compose installed:

1. Configure `docker-compose.yml` to fit your institutional setup in the `x-environment` section.
1. `docker-compose build web`
1. `VIEW=NYU docker-compose up web`

On your local machine, the developer server will be accessible at `http://localhost:8004/primo-explore/search?vid={VIEW}`

Within the [docker network](https://docs.docker.com/network/), this will be accordingly be accessible at the address `http://web:8004`

## Developing in-tandem with CENTRAL_PACKAGE

You can mount your local `central-package` directory with compiled assets to the container's own CENTRAL_PACKAGE

```yml
web:
  volumes:
  - /path/to/primo-explore-central-package:/primo-explore/custom/CENTRAL_PACKAGE
```

If you need to actively develop with your local view and central package together, you can perform the following separate containerized processes.

`primo-explore-central-package`:
Mount local central package rep to volumes
```yml
web:
  volumes:
  - ./:/primo-explore/custom/CENTRAL_PACKAGE
```
then `run` service `web` (without exposing ports) to dynamically recompile JS/CSS.
```sh
docker-compose run web
```

`primo-explore-nyu`:
```sh
docker-compose up web
```

## Build a Package (only in Docker)

With recommended volumes enabled in the `docker-compose.yml`:

```sh
NODE_ENV=[stage] docker-compose run create-package
```

This will output a package to your `./packages/` directory

## Run Tests

Integration/end-to-end testing has been implemented in cypress. Cypress can run in its own container connected to a running `web-test` service.

Simply execute:

```sh
docker-compose run e2e
```

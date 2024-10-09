# This Dockerfile is designed to simply mount the live source code into a
# docker container and use npm to serve it from there (i.e. there should be no
# need to install node or typescript locally to run the Argus frontend(
FROM node:16-buster
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends tini

RUN pwd

RUN mkdir /app
WORKDIR /app

VOLUME ["/app"]
RUN chgrp -R 0 /app && chmod -R g=u /app
ENTRYPOINT ["/usr/bin/tini", "-v", "--"]
COPY docker-entrypoint.sh /app
CMD /app/docker-entrypoint.sh

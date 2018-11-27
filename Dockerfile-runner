FROM nearform/alpine3-s2i-nodejs:10

# Create app directory
WORKDIR /opt/app-root/src

COPY runner runner
USER root
RUN cd runner && npm install
USER 1001
COPY infrastructure/inventory/inventory.yaml infrastructure/inventory/inventory.yaml

EXPOSE 3000

WORKDIR runner
CMD [ "npm", "run", "start" ]
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY run.sh /usr/local/bin/run

ENTRYPOINT ["/usr/local/bin/run"]
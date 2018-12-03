FROM circleci/node:dubnium-browsers

USER root
RUN apt-get update \
  && apt-get -y install --no-install-recommends \
       python-all-dev python-pip rsync \
       python-yaml python-jinja2 python-httplib2 python-paramiko python-pkg-resources python-keyczar \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

RUN pip install ansible && \
    pip install passlib && \
    pip install docker-compose

USER circleci

RUN ansible-galaxy install nickjj.docker && \
    ansible-galaxy install geerlingguy.nodejs \
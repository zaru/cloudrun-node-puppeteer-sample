# Use the official Node.js 10 image.
# https://hub.docker.com/_/node
FROM ubuntu:18.04

# Create and change to the app directory.
WORKDIR /usr/src/app

# RUN apt-get update && apt-get install -yq libgconf-2-4
# RUN apt-get update && apt-get install -y wget --no-install-recommends \
#     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#     && apt-get update \
#     && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
#       --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/* \
#     && apt-get purge --auto-remove -y curl \
#     && rm -rf /src/*.deb
# ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
# RUN chmod +x /usr/local/bin/dumb-init

RUN apt-get update && apt -y install  curl \
                                      nodejs \
                                      npm \
                                      firefox \
                                      dbus-x11 \
                                      libcanberra-gtk-module \
                                      libcanberra-gtk3-module \
                                      language-pack-ja \
                                      fonts-noto \
                                      fonts-noto-cjk \
                                      fonts-noto-color-emoji \
                                      pulseaudio

RUN npm install n -g
RUN n stable
RUN apt purge -y nodejs npm

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD [ "npm", "start" ]

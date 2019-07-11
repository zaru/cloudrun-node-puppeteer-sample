FROM ubuntu:18.04

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install base packages
RUN apt-get update && apt -y install  curl \
                                      software-properties-common \
                                      git \
                                      vim \
                                      nodejs \
                                      npm
                                      # clang \
                                      # make \
                                      # gcc \
                                      # g++ \
                                      # pkg-config \
                                      # libpulse-dev \
                                      # rustc

# TODO: cbindgen がインストールできない

# Install Chrome
RUN apt-get update && apt-get install -yq libgconf-2-4
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Install Firefox
# RUN apt-get update && apt -y install  libcanberra-gtk-module \
#                                       libcanberra-gtk3-module \
#                                       pulseaudio
# RUN apt-get update && apt-get install -y software-properties-common
# RUN add-apt-repository -y ppa:mozillateam/firefox-next
# RUN apt-get update && apt-get install -y firefox \
#     && rm -rf /var/lib/apt/lists/*

# Install customize Firefox for puppeteer
# RUN git clone --depth 1 https://github.com/Puppeteer/juggler
# RUN cd juggler && \
#     ./mach bootstrap --application-choice=browser --no-interactive && \
#     ./mach build

# Install nodejs
RUN npm install n -g
RUN n stable
RUN apt purge -y nodejs npm

# Install font
RUN apt-get update && apt -y install  language-pack-ja \
                                      fonts-noto \
                                      fonts-noto-cjk \
                                      fonts-noto-color-emoji \
                                      fonts-ipafont-gothic \
                                      fonts-wqy-zenhei \
                                      fonts-thai-tlwg \
                                      fonts-kacst \
                                      ttf-freefont
COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]

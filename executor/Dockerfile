FROM ubuntu:latest

WORKDIR /home/app

# Upgrade installed packages
RUN apt-get update && apt-get upgrade -y && apt-get clean && apt-get install -y sudo && apt-get install -y curl

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Install Python package management and basic dependencies
RUN apt-get install -y curl python3.8 python3.8-dev python3.8-distutils

# Register the version in alternatives
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.8 1

# Set python 3 as the default python
RUN update-alternatives --set python /usr/bin/python3.8

# Upgrade pip to latest version
RUN curl -s https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python get-pip.py --force-reinstall
RUN rm get-pip.py

# Install OpenJDK-11
RUN apt-get update
RUN apt-get install -y openjdk-11-jre-headless
RUN apt-get clean

# Install C
# RUN apt-get install -y build-essential --no-cache

# Install container dependencies and run
COPY ./package.json ./
RUN npm install --verbose
RUN npm install -g nodemon
COPY . .
RUN ls /home/app
EXPOSE 5700
CMD ["nodemon", "-L", "index.js"]

FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y build-essential python3.7 python3-pip

RUN mkdir -p /app
# Create app directory
WORKDIR /app

# Install app dependencies
COPY ./requirements.txt ./

RUN pip3 install -r requirements.txt

# Bundle app source
COPY . /app

EXPOSE 5000
CMD [ "python3", "main.py" ]


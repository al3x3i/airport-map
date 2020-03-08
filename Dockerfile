FROM ubuntu:16.04

RUN apt-get -yqq update

# install system dependencies
RUN apt-get -yqq install python3-pip
RUN apt-get -yqq install curl

# install NodeJs
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -yq nodejs

# copy application files
ADD airport-app /opt/aiport-app
WORKDIR /opt/aiport-app/web

# install npm dependencies
RUN npm install

# create optimized build
RUN npm run build

# install python dependencies
WORKDIR /opt/aiport-app/
RUN pip3 install -r requirements.txt

# expose port
EXPOSE 5000

# run the application
#CMD ["python3", "app.py"]




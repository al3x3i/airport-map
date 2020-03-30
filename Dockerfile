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


# copy build files for flask
WORKDIR /opt/aiport-app/

RUN mkdir -p build_template && cp -r ./web/build/* build_template/
RUN mkdir -p static && cp -r ./web/build/static/* static/

# install python dependencies
RUN pip3 install -r requirements.txt

# expose port
EXPOSE 5000
# EXPOSE 3000

# run the application, docker-compose uses environment variable
CMD ["python3", "./app.py"]



#!/bin/bash

# build docker image
docker build -t al3x3i/aiport_app .

# crete docker network
docker network create aiportapp_network

# stop and remove elasticsearch container, it make sence for the second start
docker stop es_db
docker rm es_db

# run elasticsearch using "aiportapp_network"
docker run -dp 9200:9200 -p 9300:9300 --net aiportapp_network --name es_db -v elasticsearch-data:/usr/share/elasticsearch/data -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.5.2

# give some time to run elasticsearch database
max=10
for (( i=0; i <= $max; ++i ))
do
    w=$[$max-$i]
    echo "Please wait:" ${w} "seconds"
    sleep 1
done

# run aiport-app
docker run --rm --net aiportapp_network -p 5000:5000 --env "ES_HOST=es_db" al3x3i/aiport_app

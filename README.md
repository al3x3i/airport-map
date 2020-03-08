This is fun project to create Web app which shows aiports on the map by searching them by different search criterias.
The project itself was splitted into two parts:

1. Develop a Web app
2. Deploy the app to the Cloud Platform

In this project I used next technologies:

#### IDE

- PyCharm Community
- Visual Studio Code

#### What’s Included? Programming languages, frameworks and etc:

- Python3
- JavaScript
- ReactJs
- Elasticsearch
- BootStrap
- HTML/CSS

### Get Started

### Development mode

#### Install Python3 dependencies

pip3 install -r airport-app/requirements.txt

##### Run Elasticsearch

```
docker run -dp 9200:9200 -p 9300:9300 -v elasticsearch-data:/usr/share/elasticsearch/data -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.5.2
```

##### Run Python script

```
python3 app.py
```

##### Run ReactJs

```
cd web && npm start
```

##### Build Docker image

```
docker build -t aiport_app .
```

### How to run Dockerimage with Elasticsearch

#### #1

##### Create Docker network aiportapp_network

```
docker network create aiportapp_network
```

##### Run Elasticsearch with aiportapp_network network

```
docker run -dp 9200:9200 -p 9300:9300 --net aiportapp_network --name es_db -v elasticsearch-data:/usr/share/elasticsearch/data -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.5.2
```

##### Run Dockerimage

```
docker run --rm --net aiportapp_network -p 5000:5000 aiport_app
```

#### Userfull commands which can help while working with docker

###### Inspect Docker network

```
docker network inspect aiportapp_network
```

###### Run shell inside docker container

```
container=3418c1e3f01a
docker exec -it $container sh
```

##### Stop PIDs of processes

```
fuser -k -n tcp 5000
```

#### What’s Included?

##### Elasticsearch indexes fields

| Field      | Description                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| airport_id | Unique OpenFlights identifier for this airport.                                                                                                                                                                                       |
| name       | Name of airport. May or may not contain the City name.                                                                                                                                                                                |
| city       | Main city served by airport. May be spelled differently from Name.                                                                                                                                                                    |
| country    | Country or territory where airport is located. See Countries to cross-reference to ISO 3166-1 codes.                                                                                                                                  |
| iata       | 3-letter IATA code. Null if not assigned/unknown.                                                                                                                                                                                     |
| icao       | 4-letter ICAO code. Null if not assigned.                                                                                                                                                                                             |
| latitude   | Decimal degrees, usually to six significant digits. Negative is South, positive is North.                                                                                                                                             |
| longitude  | Decimal degrees, usually to six significant digits. Negative is West, positive is East.                                                                                                                                               |
| altitude   | In feet.                                                                                                                                                                                                                              |
| timezone   | Hours offset from UTC. Fractional hours are expressed as decimals, eg. India is 5.5.                                                                                                                                                  |
| dst        | Daylight savings time. One of E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown). See also: Help: Time                                                                             |
| tz_db_time | Timezone in "tz" (Olson) format, eg. "America/Los_Angeles".                                                                                                                                                                           |
| type       | Type of the airport. Value "airport" for air terminals, "station" for train stations, "port" for ferry terminals and "unknown" if not known. In airports.csv, only type=airport is included.                                          |
| source     | Source of this data. "OurAirports" for data sourced from OurAirports, "Legacy" for old data not matched to OurAirports (mostly DAFIF), "User" for unverified user contributions. In airports.csv, only source=OurAirports is included |

#### Debug

Get indexes overwiew in Elasticsearch using "ElasticSearch Head" Extension in Chrome

#### Aiport, airline and route data

https://openflights.org/data.html

##### More information you can find here https://hub.docker.com/_/elasticsearch/

##### (Learning) Options to run React App locally:

https://create-react-app.dev/docs/deployment/

This is fun project. Create web app which shows aiports on the map

In this project I used next technologies:

#### IDE

- PyCharm Community
- Visual Studio Code

#### Elasticsearch

```
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.5.2
```

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


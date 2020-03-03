import csv
import json
import time

import requests
from elasticsearch import Elasticsearch, ConnectionError
from elasticsearch_dsl import Search

from termcolor import colored

import json


class ElasticsearchUtils:

    ElIndexAirport = ['airport_id', 'name', 'city', 'country',
                      'iata', 'icao', 'latitude', 'longitude',
                      'altitude', 'timezone', 'dst',
                      'tz_db_time', 'type', 'source']

    def __init__(self, el_host: str, el_port: int):
        self.AIRPORT_INDEX: str = 'airport_data'
        self.TIME_SLEEP_SEC: int = 3
        self.EL_CONNECTION_RETRIES: int = 3
        # Elasticsearch instance
        self.es = Elasticsearch([{'host': el_host, 'port': el_port}])
        self.__airports_url = "https://raw.githubusercontent.com/Al3x3i/airport-map/master/airports.dat"

    def fetch_data(self, cityName: str, airportName: str):

        if cityName:
            result = self.es.search(
                index="airport_data",
                body={
                    "query": {"match_phrase": {"city": cityName}},
                    "size": 750  # max document size
                }
            )
        elif airportName:
            result = self.es.search(
                index="airport_data",
                body={
                    "query": {"match_phrase": {"name": airportName}},
                    "size": 750  # max document size
                }
            )

        airports = [row["_source"] for row in result["hits"]["hits"]]

        if airports:
            # airport = airports[0] // Return only first, obsolete
            print("found:%s", result)
            return airports

        return None

    def initialize_elasticsearch(self):

        if self.check_elasticsearch(self.EL_CONNECTION_RETRIES):

            # //TODO ONLY FOR DEVELOPMENT
            # self.es.indices.delete(self.AIRPORT_INDEX)
            # self.load_airports_data()
            # // TODO REMOVE ABOVE COMMANDS
            return True
        else:
            self.load_airports_data()

    def check_elasticsearch(self, retries: int) -> bool:
        try:
            if not retries:
                print(
                    colored("Failed to establish connection with Elasticsearch", 'red'))
                exit(1)

            return self.es.indices.exists(self.AIRPORT_INDEX)
        except ConnectionError as ex:
            print(
                colored("Retry Elasticsearch connection: {0}".format(retries), 'green'))
            time.sleep(self.TIME_SLEEP_SEC)
            self.check_elasticsearch(retries - 1)

        return True

    def load_airports_data(self):
        print("Start loading records into the Elasticsearch")
        with requests.Session() as s:
            decoded_response = s.get(
                self.__airports_url).content.decode('utf-8')

            formatted_csv_data = csv.reader(
                decoded_response.splitlines(), delimiter=',')

            for record_id, record_data in enumerate(formatted_csv_data):
                # Add records to Elasticsearch
                formatted_fields = dict(zip(self.ElIndexAirport, record_data))
                formatted_fields_json = json.dumps(formatted_fields)
                #
                self.es.index(index=self.AIRPORT_INDEX, doc_type='aiport_data',
                              id=record_id, body=formatted_fields_json)

        print("Finished Loading records into the Elasticsearch")

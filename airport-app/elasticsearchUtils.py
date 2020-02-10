import csv
import time

import requests
from elasticsearch import Elasticsearch, ConnectionError
from termcolor import colored


class ElasticsearchUtils:

    def __init__(self, el_host: str, el_port: int):
        self.AIRPORT_INDEX: str = 'airport_data'
        self.TIME_SLEEP_SEC: int = 3
        self.EL_CONNECTION_RETRIES: int = 3
        self.es = Elasticsearch([{'host': el_host, 'port': el_port}])  # Elasticsearch instance
        self.__airports_url = "https://raw.githubusercontent.com/Al3x3i/airport-map/master/airports.dat"

    def initialize_elasticsearch(self):
        if self.check_elasticsearch(self.EL_CONNECTION_RETRIES):
            return True
        else:
            self.load_airports_data()

    def check_elasticsearch(self, retries: int) -> bool:
        try:
            if not retries:
                print(colored("Failed to establish connection with Elasticsearch", 'red'))
                exit(1)

            el_status = self.es.indices.exists(self.AIRPORT_INDEX)
            return el_status
        except ConnectionError as ex:
            print(colored("Retry Elasticsearch connection: {0}".format(retries), 'green'))
            time.sleep(self.TIME_SLEEP_SEC)
            self.check_elasticsearch(retries - 1)

        return True

    def load_airports_data(self):
        print("Loading records for Elasticsearch")
        with requests.Session() as s:
            decoded_response = s.get(self.__airports_url).content.decode('utf-8')
            formatted_csv_data = csv.reader(decoded_response.splitlines(), delimiter=',')

            for row in formatted_csv_data:
                print(row)

        return None

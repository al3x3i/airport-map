import os
import sys

from flask import Flask

from elasticsearchUtils import ElasticsearchUtils

# Initialize Elasticsearch
DEFAULT_PORT = 9200
DEFAULT_HOST = 'localhost'
if len(sys.argv) == 0:
    ELASTICSEARCH_HOST = os.environ.get("es", sys.argv[0])
else:
    ELASTICSEARCH_HOST = os.environ.get("es", DEFAULT_HOST)

app = Flask(__name__)

IS_DEBUG_ENVIRONMENT: bool = False

if __name__ == '__main__':
    # app.run(IS_DEBUG_ENVIRONMENT)
    utils = ElasticsearchUtils(DEFAULT_HOST, DEFAULT_PORT)
    utils.initialize_elasticsearch()

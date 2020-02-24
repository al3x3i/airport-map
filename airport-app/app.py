from flask import Flask
from flask_cors import CORS

from controller import blueprint
from elasticsearchUtils import ElasticsearchUtils

# Initialize Elasticsearch
EL_DEFAULT_PORT = 9200
EL_DEFAULT_HOST = 'localhost'
APP_DEFAULT_PORT = 5000
APP_DEFAULT_HOST = 'localhost'
APP_DEBUG_MODE = False


# if len(sys.argv) == 0:
#     ELASTICSEARCH_HOST = os.environ.get("es", sys.argv[0])
# else:
#     ELASTICSEARCH_HOST = os.environ.get("es", DEFAULT_HOST)


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object("config.DevelopmentConfig")
    app.register_blueprint(blueprint)

    app.run(host=APP_DEFAULT_HOST, port=APP_DEFAULT_PORT)


utils = ElasticsearchUtils(
    el_host=EL_DEFAULT_HOST, el_port=EL_DEFAULT_PORT)
if __name__ == '__main__':

    utils.initialize_elasticsearch()
    create_app()

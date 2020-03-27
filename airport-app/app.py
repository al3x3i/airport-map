from flask import Flask
from flask_cors import CORS
import socket

from controller import blueprint
from elasticsearchUtils import ElasticsearchUtils

# Initialize Elasticsearch
EL_DEFAULT_PORT = 9200
# the network name is defined by --name es_db, check README.md
EL_DEFAULT_HOST = 'es_db'

APP_DEFAULT_PORT = 5000
APP_DEFAULT_HOST = '0.0.0.0'
APP_DEBUG_MODE = False


# Check Docker container network

s = socket.socket()
try:
    s.connect((EL_DEFAULT_HOST, EL_DEFAULT_PORT))
except Exception as e:
    EL_DEFAULT_HOST = 'localhost'
finally:
    s.close()
print("Elasticsearch connection %s:%d." %
      (EL_DEFAULT_HOST, EL_DEFAULT_PORT))

# if len(sys.argv) == 0:
#     ELASTICSEARCH_HOST = os.environ.get("es", sys.argv[0])
# else:
#     ELASTICSEARCH_HOST = os.environ.get("es", DEFAULT_HOST)
utils = ElasticsearchUtils(el_host=EL_DEFAULT_HOST, el_port=EL_DEFAULT_PORT)


def create_app():
    # The build_webapp is generated buy npm run build
    app = Flask(__name__, static_folder='./static',
                template_folder="./build_template")
    CORS(app)
    app.config.from_object("config.DevelopmentConfig")
    app.register_blueprint(blueprint)
    app.el_utils = utils
    app.run(host='0.0.0.0', port=APP_DEFAULT_PORT)


if __name__ == '__main__':
    utils.initialize_elasticsearch()
    create_app()

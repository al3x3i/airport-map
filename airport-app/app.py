import os
import sys
import requests

from flask import Flask

app = Flask(__name__)

IS_DEBUG_ENVIRONMENT: bool = False

if __name__ == '__main__':
    app.run(IS_DEBUG_ENVIRONMENT)
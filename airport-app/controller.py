# from elasticsearchUtils import ElasticsearchUtils


from flask import Blueprint, render_template, request, jsonify
from flask import current_app as app

blueprint = Blueprint('main', __name__)


@blueprint.route('/')
def index():
    s_result = app._get_current_object().el_utils.fetch_data("tartu")  # TODO Debug
    return s_result  # render_template('index.html', )


@blueprint.route("/search", methods=["GET"])
def getAirportData():
    cityQuery = request.args.get("c")
    nameQuery = request.args.get("n")
    if not cityQuery and not nameQuery:
        message = jsonify({
            "status": "error",
            "msg": "Missing query"
        })
        return message, 400

    try:
        res = app._get_current_object().el_utils.fetch_data(cityQuery, nameQuery)
        if res is None:
            return jsonify()
        return jsonify(res)

    except Exception as e:

        message = jsonify({
            "status": "error",
            "msg": "Cannot fetch data el"
        })
        return message, 400

        print("ERROR")

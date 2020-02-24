# from elasticsearchUtils import ElasticsearchUtils


from flask import Blueprint, render_template, request, jsonify


blueprint = Blueprint('main', __name__)


@blueprint.route('/')
def index():
    return render_template('index.html')


@blueprint.route("/search", methods=["GET"])
def getAirportData():
    query = request.args.get("q")
    if not query:
        message = jsonify({
            "status": "error",
            "msg": "Missing query"
        })
        return message, 400

    try:

        # utils.fetch_data()
        # es.search(
        #     index="sfdata",
        #     body={
        #         "query": {"match": {"fooditems": key}},
        #         "size": 750  # max document size
        #     })

        message = jsonify({
            "status": "error",
            "msg": "Cannot fetch data el"
        })
        return message, 400
    except Exception as e:
        print("ERROR")

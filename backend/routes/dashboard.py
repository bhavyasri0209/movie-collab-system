from flask import Blueprint, jsonify

dashboard = Blueprint(
    "dashboard",
    __name__
)

@dashboard.route("/crew")
def crew():

    return jsonify([

        {
            "name":"Christopher Nolan",
            "role":"Director",
            "status":"Active"
        },

        {
            "name":"Hans Zimmer",
            "role":"Composer",
            "status":"Available"
        },

        {
            "name":"Hoyte van Hoytema",
            "role":"Cinematographer",
            "status":"Busy"
        }

    ])

@dashboard.route("/schedules")
def schedules():

    return jsonify([

        {
            "day":"Monday",
            "scene":"Scene 12 - Space Dock",
            "time":"08:00 AM",
            "location":"Iceland Studio"
        },

        {
            "day":"Tuesday",
            "scene":"Scene 4 - Earth Farm",
            "time":"11:00 AM",
            "location":"Los Angeles Set"
        }

    ])

@dashboard.route("/assets")
def assets():

    return jsonify([

        {
            "title":"Interstellar Trailer",
            "type":"Video"
        },

        {
            "title":"Production Script",
            "type":"PDF"
        }

    ])

@dashboard.route("/approvals")
def approvals():

    return jsonify([

        {
            "id":1,
            "title":"Scene 12 Final Edit",
            "status":"Pending"
        },

        {
            "id":2,
            "title":"Trailer Sound Design",
            "status":"Approved"
        }

    ])
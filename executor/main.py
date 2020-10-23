from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
from subprocess import Popen, PIPE
import os

app = Flask(__name__)
CORS(app)

FILENAME = "prog"


def printer(msg):
    print(msg, flush=True)


def file_suffix(language: str):
    if language == "python":
        return "py"
    elif language == "javascript":
        return "js"


@app.route("/compile", methods=["POST"])
def compile_route():
    try:
        body = request.get_json()
        language = body["language"]
        code = body["code"]
        file_name = "{}.{}".format(FILENAME, file_suffix(language))
        prog_file = open(file_name, "w+")
        prog_file.write(code)
        prog_file.close()
        cmd = f"./run_scripts/run-{language}.sh"
        p = Popen(
            [cmd],
            shell=True,
            stdout=PIPE,
            stderr=PIPE,
        )
        out = p.communicate()
        printer(out)
        return dict(stdout=out[0].decode("utf-8"), stderror=out[1].decode("utf-8"))
    except Exception as e:
        return str({"error": str(e)})


socketio = SocketIO(app)

PORT = 5700
if __name__ == "__main__":
    socketio.run(app, port=PORT, host="0.0.0.0")

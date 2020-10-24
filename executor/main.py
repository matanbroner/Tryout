from flask import Flask, request
from flask_cors import CORS
from subprocess import Popen, PIPE
import os

from sockets import SocketHandler

app = Flask(__name__)
CORS(app)

socket_handler = SocketHandler(app)

PORT = 5700
if __name__ == "__main__":
    socket_handler.run(port=PORT, host="0.0.0.0")

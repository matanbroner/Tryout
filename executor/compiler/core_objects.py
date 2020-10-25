from .utils import current_dir
from subprocess import Popen, PIPE, TimeoutExpired
import os

class CompilerExecution:
    execution_timeout = 5

    def __init__(self, file_path: str, language: str, cb, settings: dict = {}):
        if "timeout" in settings:
            self.execution_timeout = settings["timeout"]
        self.generate_process(file_path, language, cb)
    
    def generate_process(self, file_path: str, language: str, cb):
        print("Got file path: {}".format(file_path))
        cmd = str(os.path.join(current_dir(), f'run_scripts/{language}.sh'))
        cmd += f" {file_path}"
        self.process = Popen(
            [cmd],
            shell=True,
            stdout=PIPE,
            stderr=PIPE,
        )

        try:
            output, errors = self.process.communicate(timeout=self.execution_timeout)
            cb(self.utf8_decoded(output), self.utf8_decoded(errors))
        except TimeoutExpired:
            self.process.kill()
            cb(None, "Execution timeout occured")

    def utf8_decoded(self, string: str):
        return string.decode("utf-8")

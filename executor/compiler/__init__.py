from .core_objects import CompilerExecution
from uuid import uuid4
import os

class Compiler:

    def run_code(self, code: str, language: str, cb, settings: dict = {}):
        file_path = self.generate_build_file(code, language)
        callback = self.create_execution_callback(file_path, cb)
        execution = CompilerExecution(file_path, language, callback)

    def create_execution_callback(self, file_path: str, cb):
        def execution_complete(output: str, errors: str):
            os.remove(file_path)
            cb(output, errors)
        return execution_complete

    
    def generate_build_file(self, code: str, language: str):
        file_id = str(uuid4())
        suffix = self.file_suffix(language)
        file_name = f"{file_id}.{suffix}"
        file_path = os.path.join('./builds', file_name)
        with open(file_path, "w+") as fs:
            fs.write(code)
        return str(file_path)
    
    def file_suffix(self, language: str):
        if language == "python":
            return "py"
        elif language == "javascript":
            return "js"



from subprocess import Popen, PIPE, TimeoutExpired

class CompilerExecution:
    execution_timeout = 15

    def __init__(self, file_path: str, language: str, cb, settings: dict = {}):
        if "timeout" in settings:
            self.execution_timeout = settings["timeout"]
        self.generate_process(file_path, language, cb)
    
    def generate_process(self, file_path: str, language: str, cb):
        cmd = f"./run_scripts/run-{language}.sh"
        self.process = Popen(
            [cmd, file_path],
            shell=True,
            stdout=PIPE,
            stderr=PIPE,
        )

        try:
            output, errors = self.process.communicate(timeout=self.execution_timeout)
            cb(self.utf8_decoded(output), self.utf8_decoded(errors))
        except TimeoutExpired:
            self.process.kill()
            output, errors = self.process.communicate()
            cb(self.utf8_decoded(output), self.utf8_decoded(errors) + "\nExecution timeout occured")

    def utf8_decoded(string: str):
        return string.decode("utf-8")

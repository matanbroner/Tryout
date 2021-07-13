const dockerUtils = require("dockerode-utils");

const pullImage = async (docker, image, onFinishedCallback) => {
    if(await dockerUtils.imageExists(docker, image)){
        onFinishedCallback();
    }
    docker.pull(image, function(err, stream) {
        if(err){
            console.error(err);
        }
        docker.modem.followProgress(stream, async () => {
            if(await dockerUtils.imageExists(docker, image)){
                onFinishedCallback();
            }
        });
      });
}

module.exports = {
    pullImage
}
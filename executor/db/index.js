const mongoose = require("mongoose");
const ShareDB = require("sharedb");
const ShareDBMongo = require("sharedb-mongo");

const constants = require("./constants");

class TryoutFileDb {
  async connect() {
    let that = this;
    return new Promise((resolve, reject) => {
      const db = ShareDBMongo({
        mongo: async function (callback) {
          try {
            await mongoose.connect(
              "mongodb://tryout_dev:dev_password@mongodb:27017/tryout_db",
              {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 3000,
              }
            );
            const conn = mongoose.connection;
            callback(null, conn.getClient());
            that.backend = new ShareDB({ db });
            that.backend.use(constants.RECEIVE, function (request, next) {
              var data = request.data;
              if (data.internal) {
                // Handle app specific messages and don't call next
                return;
              }
              // Call next to pass other messages to ShareDB
              next();
            });
            that.connection = that.backend.connect();
            resolve(null);
          } catch (err) {
            callback(err);
            reject(err);
          }
        },
      });
    });
  }

  listenJsonStream(stream) {
    this.backend.listen(stream);
  }

  createDoc(namespace, docName) {
    while (this.connection == null) {}
    var doc = this.connection.get(namespace, docName);
    doc.fetch(function (err) {
      if (err) throw err;
      if (doc.type === null) {
        doc.create({ content: "HI" });
        return;
      }
    });
  }
}

module.exports = {
  TryoutFileDb,
  mongoose,
};

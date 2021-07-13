const ShareDB = require("sharedb");
const ShareDBMongo = require("sharedb-mongo");

const constants = require("../constants");

class TryoutFileDb {
  constructor() {
    this.connect();
  }

  connect() {
    const db = ShareDBMongo(
      "mongodb://tryout_dev:dev_password@mongodb:27017/tryout_db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    this.backend = new ShareDB({ db });
    this.backend.use(constants.RECEIVE, function (request, next) {
      var data = request.data;
      if (data.internal) {
        // Handle app specific messages and don't call next
        return;
      }
      // Call next to pass other messages to ShareDB
      next();
    });
    this.connection = this.backend.connect();
    this.createDoc("test_ns", "test_doc_2");
  }

  listenJsonStream(stream) {
    this.backend.listen(stream);
  }

  createDoc(namespace, docName) {
    while(this.connection == null){}
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
};

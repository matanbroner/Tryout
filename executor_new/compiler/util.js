const uuidv4 = require("uuid").v4;

module.exports = {
  all: {
    uuid: (length = 8) => {
      let id = uuidv4().substring(0, length);
      // add letter to uuid to allow class names to be uuid
      // TODO: make letter random
      return "z" + id;
    },
  },
  java: {
    mainClassRefactor: (code, fileId) => {
      let mainClass = "";
      let mainIndex = -1;
      words = code.split(" ").filter((word) => {
          return word !== "{" && word !== "}" && word.trim().length !== 0;
      })
      for (let i = 0; i < words.length; i++) {
        if (words[i].includes("main(")) {
          mainIndex = i;
        }
      }
      console.log(mainIndex);
      for (let j = mainIndex; j >= 0; j--) {
        console.log(words[j]);
        if (words[j] === "class") {
          mainClass = words[j + 1];
          console.log("Main class: " + mainClass);
          break;
        }
      }
      return code.replace(mainClass, fileId);
    },
  },
};

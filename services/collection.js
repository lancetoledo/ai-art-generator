const fs = require("fs");
const path = require("path");
const collectionPath = path.resolve("./public/frontmania-collection/images");

export const getCollectionImgsFPs = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir(collectionPath, (err, files) => {
      if (err) {
        console.error("Error reading the output folder:", err);
        return;
      }
      const pngFilePaths = files.filter(
        (file) => path.extname(file).toLowerCase() === ".png"
      );
      resolve(pngFilePaths);
    });
  });
};

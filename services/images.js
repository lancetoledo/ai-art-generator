const fs = require("fs");
const path = require("path");
const generatedImagesPath = path.resolve("./public/output/genImgs/");

export const getGenImgsFilePaths = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir(generatedImagesPath, (err, files) => {
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

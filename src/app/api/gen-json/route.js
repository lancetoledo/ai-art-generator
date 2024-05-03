import fs from "fs"; // Importing 'fs' module for file system operations
import { readFile } from "fs/promises"; // Importing 'readFile' function from 'fs/promises' for asynchronous file reading
import { join } from "path"; // Importing 'join' function from 'path' module for joining file paths
import { getCollectionImgsFPs } from "../../../../services/collection"; // Importing a function to get file paths of images from a collection service

// Function to get base64 data of an image given its file path
async function getImageBase64(imgFp) {
  const fullImagePath = join(process.cwd(), "public", imgFp);
  try {
    const imageBuffer = await readFile(fullImagePath);
    const base64Data = imageBuffer.toString("base64");
    return base64Data;
  } catch (error) {
    console.error(`Error reading image file: ${error.message}`);
    return null;
  }
}

// Function to add an image to the collection
const addImageToCollection = async (imgFp) => {
  // File paths for JSON files containing image metadata
  const jsonFilePath = join(process.cwd(), "public", "JSON", "genImgs.json");
  const collectionFilePath = join(process.cwd(), "public", "JSON", "collection.json");

  try {
    // Read JSON file containing generated images metadata
    const jsonContent = await readFile(jsonFilePath, "utf-8");
    const jsonData = JSON.parse(jsonContent);

    // Find prompt details for the image
    const promptDetails = jsonData.find((promptObj) => promptObj.images.includes(imgFp));

    if (promptDetails) {
      // Read JSON file containing collection data
      const collectionContent = await readFile(collectionFilePath, "utf-8");
      const collectionData = JSON.parse(collectionContent);

      // Construct an object with prompt details and image file path
      const addedImgObj = {
        prompt: promptDetails.prompt,
        imageFile: imgFp,
      };

      // Push the object to the collection data
      collectionData.push(addedImgObj);

      // Write updated collection data to file
      fs.writeFileSync(collectionFilePath, JSON.stringify(collectionData));

      // Get file paths of images in the collection
      const currentImgsFilePaths = await getCollectionImgsFPs();
      const amountCurrentImages = currentImgsFilePaths.length + 1;

      // Construct file path for the new image in the collection
      let imageIndex = amountCurrentImages;
      let imageFilePath = `./public/frontmania-collection/images/${imageIndex}.png`;

      // Get base64 data of the image
      const base64Image = await getImageBase64(imgFp);

      // Write the image to the file system
      await fs.promises.writeFile(
        imageFilePath,
        Buffer.from(base64Image, "base64")
      );

      return { success: true, message: "💥✨Image added to the collection." };
    } else {
      return {
        success: false,
        message: "👹! Image already exists in the collection.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while processing the request.",
    };
  }
};

// Handler for GET requests
export async function GET() {
  // File path for the JSON file containing generated images metadata
  const jsonFilePath = join(process.cwd(), "public", "JSON", "genImgs.json");

  // Read the JSON file and return its content as the response
  const jsonContent = await readFile(jsonFilePath, "utf-8");
  const jsonData = JSON.parse(jsonContent);

  return new Response(
    JSON.stringify({
      data: jsonData,
    })
  );
}

// Handler for POST requests
export async function POST(request) {
  // Extract the image file path from the request body
  const { addedImgFp } = await request.json();

  // Call the function to add the image to the collection
  const result = await addImageToCollection(addedImgFp);

  // Log success or failure message
  if (result.success) {
    console.log("🐲🥷✅✨ Image added");
  } else {
    console.error("An error occurred while adding an image");
  }

  // Return the result as the response
  return new Response(JSON.stringify(result));
}

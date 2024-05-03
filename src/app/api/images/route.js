import fs from "fs"; // Importing the 'fs' module for file system operations
import { readFile } from "fs/promises"; // Importing the 'readFile' function from 'fs/promises' for asynchronous file reading
import { join } from "path"; // Importing the 'join' function from the 'path' module for joining file paths
import { getGenImgsFilePaths } from "../../../../services/images"; // Importing a function to get file paths of generated images from a service

//Notes
/*
- This route receives a prompt from the client; and sends the prompt to an external AI generation API
- Recieves the generated images as a response
- Saves the images to the file system
- Updates a JSON file with image metadata including prompts and file paths.
- Returns a response with the file paths of the newly generated images.
*/

// Function to handle POST requests
export async function POST(request) {
    // Endpoint for sending prompt to DreamStudio API
    const path = `${process.env.NEXT_PUBLIC_API_URL}/stable-diffusion-xl-1024-v1-0/text-to-image`;

    // Headers for the request
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`,
        "Content-Type": "application/json"
    };

    // Extracting 'prompt' from request body
    const { prompt, artStyle } = await request.json();

    // Logging a message indicating that prompt is being sent to DreamStudio API
    console.log("🔥🚀🎨 Sending prompt to DreamStudio API");

    // Body for the request
    const body = {
        steps: 40,
        width: 1024,
        height: 1024,
        seed: 0,
        cfg_scale: 5,
        samples: 1,
        text_prompts: [
            {
                text: `${prompt} in the art style of ${artStyle}`,
                weight: 1
            },
            {
                text: "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
                weight: -1
            }
        ]
    };

    // Sending request to DreamStudio API
    const response = await fetch(path, {
        headers,
        method: "POST",
        body: JSON.stringify(body)
    });

    // Handling error response
    if (!response.ok) {
        const errorResponse = await response.text();
        console.error(`Error response: ${errorResponse}`);
        throw new Error(`Non-200 response: ${errorResponse}`);
    }

    // Parsing response JSON
    const responseJSON = await response.json();

    // Function to generate a random file identifier
    const getFileIdentifier = () => {
        const randomFraction = Math.random();
        const randomNumber = Math.floor(randomFraction * 501);
        return randomNumber;
    };

    // Generating a file identifier
    const identifier = getFileIdentifier();

    // Getting current generated images' file paths
    const currentImgsFilePaths = await getGenImgsFilePaths();
    const amountCurrentImages = currentImgsFilePaths.length + 1;

    // Writing generated images to the file system
    const writeImages = responseJSON.artifacts.map(async (image, index) => {
        let imageIndex = amountCurrentImages + index;
        let imageFilePath = `./public/output/genImgs/${imageIndex}.png`;

        await fs.promises.writeFile(
            imageFilePath,
            Buffer.from(image.base64, "base64")
        );
    });

    // Logging a message indicating that AI art is being written to the folder
    console.log("📝 Writing 🎨 AI art to the folder");

    // Object to store image metadata
    let imageObject = {
        tokenId: "",
        prompt: prompt,
        artStyle: artStyle,
        bookmarked: false,
        images: []
    };

    // Writing JSON data to store image metadata
    const writeJSON = responseJSON.artifacts.map(async (image, index) => {
        let imageIndex = amountCurrentImages + index;
        let imageFilePath = `/output/genImgs/${imageIndex}.png`;
        imageObject.tokenId = image.seed;
        imageObject.images.push(imageFilePath);
    });

    // Reading existing JSON data
    const jsonFilePath = join(process.cwd(), "public", "JSON", "genImgs.json");
    const jsonContent = await readFile(jsonFilePath, "utf-8");
    const jsonData = JSON.parse(jsonContent);

    // Adding new image data to JSON
    jsonData.push(imageObject);

    // Writing updated JSON data to file system
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));

    // Waiting for all write operations to complete
    await Promise.all(writeImages, writeJSON);
    const newImgsFilePaths = await getGenImgsFilePaths();

    // Returning response with new image file paths
    return new Response(
        JSON.stringify({
            message: "🔥🚀 Filepaths with the BRAND NEW generated Images!✨",
            filePaths: newImgsFilePaths
        })
    );
}

// Function to handle GET requests
export async function GET(request) {
    // Getting current generated images' file paths
    const currentImgsFilePaths = await getGenImgsFilePaths();

    // Returning response with current image file paths
    return new Response(
        JSON.stringify({
            message: "🤖✨ Image file paths you have generated so far!",
            filePaths: currentImgsFilePaths
        })
    );
}
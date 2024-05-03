'use client'
import React from "react";
import styles from "../page.module.css";
import Sidebar from "./Sidebar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const makeRequest = async (url, method = "GET", body) => {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
};

const styleGenImgsToAdd = {
  borderRadius: "4px"
};

const AIGenerator = () => {
  const chosenPrompt = ""
  const [prompt, setPrompt] = useState(chosenPrompt ? chosenPrompt : "");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [artStyle, setArtStyle] = useState('Art')

  //Integrate these states
  const [genImgFPs, setGenImgFPs] = useState([]);
  const [genJSON, setGenJSON] = useState([]);
  // const searchParams = useSearchParams();


  const handleClearClick = () => {
    setPrompt("")
  }

  async function onSubmit(e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Log the prompt to console
    console.log("🤖Your prompt is: ", prompt);

    // Display a loading toast message
    toast.loading("🔥🧑‍🍳🤖 Generating images...");

    // Make a request to the '/api/images' endpoint with the prompt data
    const imageFilePaths = await makeRequest("/api/images", "POST", { prompt, artStyle });

    // Update the state with the generated image file paths
    setGenImgFPs(imageFilePaths);

    // Log a message indicating that the images are generated and saved
    console.log("🤖🎨 The generated images are saved!");

    // Dismiss the loading toast message
    toast.dismiss();

    // Display a success toast message for image generation
    toast.success("🔥Images succesfully generated!", {
      duration: 8000
    });

    // Request the latest generated image data from the '/api/gen-json' endpoint
    const genJSONImgs = await makeRequest("/api/gen-json");

    // Reverse the order of the received image data and update the state
    setGenJSON(genJSONImgs.data.reverse());

    setPrompt("")
  }

  // // Static OnSubmit
  // async function onSubmit(e) {
  //   e.preventDefault();
  //   console.log("🤖Your prompt is: ", prompt);

  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/stable-diffusion-xl-1024-v1-0/text-to-image`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`,
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         steps: 40,
  //         width: 1024,
  //         height: 1024,
  //         seed: 0,
  //         cfg_scale: 5,
  //         samples: 1,
  //         text_prompts: [
  //           {
  //             text: prompt,
  //             weight: 1
  //           },
  //           {
  //             text: "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
  //             weight: -1
  //           }
  //         ]
  //       }),
  //     }
  //   )
  //   console.log("🤖 Loading!!!")

  //   if (!response.ok) {
  //     throw new Error(`Non-200 response: ${await response.text()}`)
  //   }


  //   const responseJSON = (await response.json())
  //   console.log(responseJSON, "Response is in base64.")
  //   const imageBase64 = responseJSON.artifacts[0].base64; // Assuming the base64 image data is under 'image' key

  //   setGeneratedImages(prevImages => [
  //     {
  //       prompt: prompt,
  //       image: imageBase64
  //     },
  //     ...prevImages
  //   ]);
  //   setPrompt(""); // Clear the prompt

  // };

  // Effect hook to fetch images and JSON data on component mount
  useEffect(() => {
    async function getImages() {
      // Fetch generated image file paths
      const genImgFPs = await makeRequest("/api/images");
      // Update state with fetched image file paths
      setGenImgFPs(genImgFPs);
      // Fetch generated images JSON data
      const genJSONImgs = await makeRequest("/api/gen-json");
      // Update state with reversed order of JSON data
      setGenJSON(genJSONImgs.data.reverse());
    }
    getImages();
  }, []); // Empty dependency array ensures this effect runs only once after initial render


  return (
    <div className={styles.layout}>
      <Toaster position="top-center" />
      <div className={styles.sidebar}>

        <div className={styles.promptContainer}>
          <div className={styles.promptIntro}>
            <h3>Create an image from text prompt</h3>
            <button
              className={styles.clear}
              onClick={() => handleClearClick()}
            >
              <h3>Clear</h3>
            </button>
          </div>
          <form>
            <div className={styles.promptInput}>
              <textarea
                className="input"
                type="text"
                placeholder="Describe the image you want to generate"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

            </div>
          </form>
        </div>

        <Sidebar artStyle={artStyle} setArtStyle={setArtStyle} onSubmit={onSubmit} recentIMG={genJSON} />

      </div>
      <div className={styles.main}>
        <div className={styles.mainPageContainer}>
          <div className={styles.mainContent}>

            <div className={styles.sectionContainer}>

              {/* Check if genJSON has at least one item and display the first one */}
              {genJSON.length > 0 && (
                <div className={styles.contentContainer}>

                  <div className={styles.rowGallery}>
                    {genJSON[0].images.map((imgFp, imageIndex) => (
                      <div className={styles.addImage} key={imageIndex}>
                        <Image
                          priority={true}
                          src={imgFp}
                          width={440}
                          height={500}
                          alt={"Generated Text"}
                          style={styleGenImgsToAdd}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={styles.recentPrompt}>
                    <p>{genJSON[0].prompt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default AIGenerator;

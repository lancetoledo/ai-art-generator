"use client";
import React, { useEffect, useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Sidebar = ({ artStyle, setArtStyle, onSubmit, recentIMG }) => {


    const changeStyle = (style) => {
        setArtStyle(style)
        console.log(style)
    }



    //Choose style == "Anime"
    // goal: is to grab all images ever created that are of style anime.

    // setup:
    // every time an image is generated
    // => write the image to the fileSystem
    // => write / add the image to a collection.json file where you have a json object of all images
    // each image could be an object with properties (imageLink, style)
    // at StarterPrompt - get from the collective.json, all images that have the style you just choose.


    return (
        <div className={styles.sidebars}>
            <Toaster position="top-center" />
            {/* Add the "Choose a model" section */}
            <div className={styles.modelSelection}>
                <h1>Choose a model</h1>
                <div className={styles.modelButtons}>
                    <button
                        className={`${artStyle === 'Anime' ? styles.activeStyle : ''} ${styles.modelButton}`}
                        onClick={() => changeStyle('Anime')}
                    >
                        Anime
                    </button>
                    <button
                        className={`${artStyle === 'Disney' ? styles.activeStyle : ''} ${styles.modelButton}`}
                        onClick={() => changeStyle('Disney')}
                    >
                        Disney
                    </button>
                    <button
                        className={`${artStyle === 'Painting' ? styles.activeStyle : ''} ${styles.modelButton}`}
                        onClick={() => changeStyle('Painting')}
                    >
                        Painting
                    </button>
                </div>
            </div>
            <div className={styles.sideBarLinks}>
                <div className={styles.spContainer}>
                    <div className={styles.spGrid}>
                        {/* SHOW ALL RECENT GENERATED IMAGES */}
                        {recentIMG.slice(1, 11).map((item, index) => (
                            <div className={styles.contentContainer} key={index}>
                                <div className={styles.rowGallery} key={item.imageIndex}>
                                    {item.images.map((imgFp, imageIndex) => (
                                        <div
                                            className={styles.addImage}
                                            key={imageIndex}
                                        >
                                            <Image
                                                priority={true}
                                                src={imgFp}
                                                width={75}
                                                height={75}
                                                alt={"Text"}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                        }

                    </div>
                    <button className="button" type="submit">
                        <div className={styles.buttonText} onClick={onSubmit}>Generate✨</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

import React from "react";
import styles from "../page.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>AI Art Generator</h1>
      <div className={styles.menu}>
        <div className={styles.menuItem}>
          <Link href="https://discord.gg/rKV6JBTT">
            <p>Discord</p>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="https://www.linkedin.com/in/jessy-the/">
            <p>Connect</p>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="https://www.linkedin.com/in/jessy-the/">
            <p>Resources</p>
          </Link>
        </div>
        <div className={styles.menuItem}></div>
      </div>
    </div>
  );
};

export default Header;

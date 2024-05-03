import Header from "./components/Header";
import AIGenerator from "./components/AIGenerator";
import styles from './page.module.css'


export default function Home() {
  return (
    <div className={styles.Home}>
      <Header />
      <div className={styles.AIGenerator}>
        <AIGenerator />
      </div>

    </div>
  );
}

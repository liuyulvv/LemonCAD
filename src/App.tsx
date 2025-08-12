import { makeStyles } from "@griffel/react";
import LemonCanvas from "./components/LemonCanvas";
import LemonLeftToolNavigation from "./components/LemonLeftToolNavigation";
import LemonNavigation from "./components/LemonNavigation";

const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "100vh",
    userSelect: "none",
  },
  aside: {},
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  main: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  canvas: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  footer: {},
});

export default function App() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.aside}></div>
      <div className={styles.content}>
        <LemonNavigation />
        <div className={styles.main}>
          <LemonLeftToolNavigation />
          <div className={styles.canvas}>
            <LemonCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}

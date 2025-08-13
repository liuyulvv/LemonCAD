import { makeStyles } from "@griffel/react";
import { Splitter } from "antd";
import { useState } from "react";
import LemonAside from "./components/LemonAside";
import LemonCanvas from "./components/LemonCanvas";
import LemonFooter from "./components/LemonFooter";
import LemonNavigation from "./components/LemonNavigation";
import useLemonAsideStore from "./store/LemonAsideStore";

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
});

export default function App() {
  const styles = useStyles();
  const { collapsed } = useLemonAsideStore();
  const [asideSize, setAsideSize] = useState(225);

  return (
    <div className={styles.container}>
      <div className={styles.aside}></div>
      <div className={styles.content}>
        <LemonNavigation />
        <div className={styles.main}>
          <Splitter
            onResize={(sizes) => {
              setAsideSize(sizes[0]);
            }}
          >
            <Splitter.Panel size={collapsed ? 32 : asideSize} min={collapsed ? 32 : 225} resizable={collapsed ? false : true}>
              <LemonAside />
            </Splitter.Panel>
            <Splitter.Panel>
              <LemonCanvas />
            </Splitter.Panel>
          </Splitter>
        </div>
        <LemonFooter />
      </div>
    </div>
  );
}

import { makeStyles } from "@griffel/react";
import { Typography } from "antd";
import useLemonFootStore from "../store/LemonFootStore";

const { Text } = Typography;

const useStyles = makeStyles({
  footer: {
    display: "flex",
    alignItems: "center",
    height: "32px",
  },
});

export default function LemonFooter() {
  const styles = useStyles();
  const { tip } = useLemonFootStore();

  return (
    <div className={styles.footer}>
      <Text>{tip}</Text>
    </div>
  );
}

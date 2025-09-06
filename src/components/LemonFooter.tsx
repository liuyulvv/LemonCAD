import { makeStyles } from "@griffel/react";
import { Tag, Typography } from "antd";
import useLemonFootStore from "../store/LemonFootStore";
import useLemonStageStore from "../store/LemonStageStore";

const { Text } = Typography;

const useStyles = makeStyles({
  footer: {
    display: "flex",
    alignItems: "center",
    height: "32px",
    padding: "0 12px",
    borderTop: "1px solid #d9d9d9",
  },
});

export default function LemonFooter() {
  const styles = useStyles();
  const { tip } = useLemonFootStore();
  const { stageMode } = useLemonStageStore();

  return (
    <div className={styles.footer}>
      <Tag color="cyan">{stageMode}</Tag>
      <Text type="warning">{tip}</Text>
    </div>
  );
}

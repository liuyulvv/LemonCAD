import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { makeStyles } from "@griffel/react";
import { Button, Typography } from "antd";
import { useState } from "react";
import useLemonAsideStore from "../store/LemonAsideStore";
import useLemonStageStore from "../store/LemonStageStore";

const { Text } = Typography;

interface LemonGeometryNodeProps {
  name: string;
  id: string;
  visible?: boolean;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default function LemonGeometryNode({ name, id, visible = true }: LemonGeometryNodeProps) {
  const styles = useStyles();
  const [geometryVisible, setGeometryVisible] = useState(visible);
  const { geometryNodeIconVisibleMap } = useLemonAsideStore();
  const { entityManager } = useLemonStageStore();

  return (
    <div className={styles.container}>
      {geometryVisible ? <Text>{name}</Text> : <Text type="secondary">{name}</Text>}
      {geometryNodeIconVisibleMap[id] && (
        <Button
          size="small"
          icon={geometryVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          onClick={(e) => {
            const entity = entityManager.getEntity(id);
            if (entity) {
              entity.show(!entity.isVisible);
            }
            setGeometryVisible(!geometryVisible);
            e.stopPropagation();
          }}
        />
      )}
    </div>
  );
}

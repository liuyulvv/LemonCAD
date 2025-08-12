import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { makeStyles } from "@griffel/react";
import { Button } from "antd";
import { useState } from "react";
import useLemonStageStore from "../store/LemonStageStore";

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
  const { entityManager } = useLemonStageStore();

  return (
    <div className={styles.container}>
      <span>{name}</span>
      <Button
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
    </div>
  );
}

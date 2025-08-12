import { EditOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";

function LemonNavigation() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Button type="text" icon={<UndoOutlined />} />
      <Button type="text" icon={<RedoOutlined />} />
      <Divider type="vertical" />
      <Button type="text" onClick={() => {}} icon={<EditOutlined />}>
        Sketch
      </Button>
      <Button type="text" onClick={() => {}}>
        Line
      </Button>
    </div>
  );
}

export default LemonNavigation;

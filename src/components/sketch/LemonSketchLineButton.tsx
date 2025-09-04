import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import useLemonFootStore from "../../store/LemonFootStore";

export default function LemonSketchLineButton() {
  const { setTip } = useLemonFootStore();

  return (
    <Button
      type="text"
      onClick={() => {
        setTip("");
      }}
      icon={<EditOutlined />}>
      Line
    </Button>
  );
}

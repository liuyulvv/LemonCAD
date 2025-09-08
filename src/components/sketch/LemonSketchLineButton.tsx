import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { LemonDrawType } from "../../draw/LemonDrawInterface";
import useLemonFootStore from "../../store/LemonFootStore";
import useLemonSketchStore from "../../store/LemonSketchStore";
import useLemonStageStore from "../../store/LemonStageStore";

export default function LemonSketchLineButton() {
  const { setTip } = useLemonFootStore();
  const { drawManager } = useLemonStageStore();
  const { createSketchEntity, createSketchPlaneEntity } = useLemonSketchStore();

  return (
    <Button
      type="text"
      disabled={!createSketchEntity || !createSketchPlaneEntity}
      onClick={() => {
        drawManager.beginDraw(LemonDrawType.SketchLine);
        setTip("Draw line: Left click to start, left click to end, right click to cancel.");
      }}
      icon={<EditOutlined />}>
      Line
    </Button>
  );
}

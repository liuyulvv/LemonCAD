import { EditOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { v4 as uuidv4 } from "uuid";
import { LemonDrawType } from "../draw/LemonDrawInterface";
import LemonDrawManager from "../draw/LemonDrawManager";
import useLemonDialogStore from "../store/LemonDialogStore";
import useLemonFootStore from "../store/LemonFootStore";
import useLemonSketchStore from "../store/LemonSketchStore";
import useLemonStageStore from "../store/LemonStageStore";
import LemonDialog from "./LemonDialog";

function LemonNavigation() {
  const { setTip } = useLemonFootStore();
  const { addDialog } = useLemonDialogStore();
  const { sketchNumber, setSketchNumber } = useLemonSketchStore();
  const { camera } = useLemonStageStore();

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
      }}>
      <Button type="text" icon={<UndoOutlined />} />
      <Button type="text" icon={<RedoOutlined />} />
      <Divider type="vertical" />
      <Button
        type="text"
        onClick={() => {
          setTip("Sketch mode activated. You can now draw on the canvas.");
          LemonDrawManager.getInstance().beginDraw(LemonDrawType.Sketch);
          addDialog(uuidv4(), <LemonDialog initialTitle={"Sketch " + sketchNumber} />);
          setSketchNumber(sketchNumber + 1);
        }}
        icon={<EditOutlined />}>
        Sketch
      </Button>
      <Button type="text" onClick={() => {}}>
        Line
      </Button>
      <Button
        type="text"
        onClick={() => {
          camera.lookFromTop();
        }}>
        Top View
      </Button>
    </div>
  );
}

export default LemonNavigation;

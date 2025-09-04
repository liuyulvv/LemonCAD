import { EditOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { v4 as uuidv4 } from "uuid";
import { LemonDrawType } from "../../draw/LemonDrawInterface";
import LemonDrawManager from "../../draw/LemonDrawManager";
import useLemonDialogStore from "../../store/LemonDialogStore";
import useLemonFootStore from "../../store/LemonFootStore";
import useLemonSketchStore from "../../store/LemonSketchStore";
import useLemonStageStore, { LemonStageMode } from "../../store/LemonStageStore";
import LemonDialog from "../LemonDialog";

export default function LemonSketchButton() {
  const { setTip } = useLemonFootStore();
  const { addDialog } = useLemonDialogStore();
  const { sketchNumber, setSketchNumber, sketchName, setSketchName } = useLemonSketchStore();
  const { drawManager, stageMode } = useLemonStageStore();

  return (
    <Button
      type="text"
      disabled={stageMode == LemonStageMode.Sketch}
      onClick={() => {
        setTip("Sketch mode activated. You can now draw on the canvas.");
        LemonDrawManager.getInstance().beginDraw(LemonDrawType.Sketch);
        const dialogID = uuidv4();
        addDialog({
          id: dialogID,
          dialog: (
            <LemonDialog
              id={dialogID}
              initialTitle={"Sketch " + sketchNumber}
              onConfirm={() => {
                useLemonSketchStore.getState().sketchEntity?.setSketchName(useLemonSketchStore.getState().sketchName);
                useLemonSketchStore.getState().sketchEntity?.createDialog();
                drawManager.endDraw();
                setSketchName("Sketch" + (sketchNumber + 1));
                setSketchNumber(sketchNumber + 1);
                useLemonDialogStore.getState().removeDialog(dialogID);
                setTip("");
              }}
              onCancel={() => {
                drawManager.shutdown();
                useLemonDialogStore.getState().removeDialog(dialogID);
                setTip("");
              }}>
              <Input
                addonBefore="Sketch plane"
                allowClear
                defaultValue={sketchName}
                onChange={(e) => {
                  setSketchName(e.target.value);
                }}
                onClear={() => {
                  setSketchName("");
                }}
              />
            </LemonDialog>
          ),
          visible: true,
        });
      }}
      icon={<EditOutlined />}>
      Sketch
    </Button>
  );
}

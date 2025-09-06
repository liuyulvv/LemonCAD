import { Space, Tag, Typography } from "antd";
import useLemonDialogStore from "../../store/LemonDialogStore";
import useLemonFootStore from "../../store/LemonFootStore";
import useLemonSketchStore from "../../store/LemonSketchStore";
import useLemonStageStore from "../../store/LemonStageStore";
import LemonDialog from "../LemonDialog";

interface LemonSketchDialogProps {
  dialogID: string;
  initialTitle: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function LemonSketchDialog({ dialogID, initialTitle, onConfirm, onCancel }: LemonSketchDialogProps) {
  const { setTip } = useLemonFootStore();
  const { removeDialog } = useLemonDialogStore();
  const {
    createSketchNumber,
    setCreateSketchNumber,
    createSketchName,
    setCreateSketchName,
    createSketchEntity,
    createSketchPlaneEntity,
    setCreateSketchPlaneEntity,
  } = useLemonSketchStore();
  const { drawManager } = useLemonStageStore();

  return (
    <LemonDialog
      id={dialogID}
      initialTitle={initialTitle}
      onTitleChange={(title) => {
        setCreateSketchName(title);
        createSketchEntity?.setSketchName(title);
      }}
      onConfirm={() => {
        if (onConfirm) {
          onConfirm();
        } else {
          createSketchEntity?.setSketchName(createSketchName);
          drawManager.endDraw();
          setCreateSketchName("Sketch" + (createSketchNumber + 1));
          setCreateSketchNumber(createSketchNumber + 1);
          removeDialog(dialogID);
          setTip("");
        }
      }}
      onCancel={() => {
        if (onCancel) {
          onCancel();
        } else {
          drawManager.shutdown();
          removeDialog(dialogID);
          setTip("");
        }
      }}>
      <Space>
        <Typography.Text>Sketch plane</Typography.Text>
        {createSketchPlaneEntity ? (
          <Tag
            color="blue"
            closable
            onClose={() => {
              createSketchEntity?.setPlaneEntityID(null);
              setCreateSketchPlaneEntity(null);
            }}>
            {createSketchPlaneEntity.getEntityName()}
          </Tag>
        ) : null}
      </Space>
    </LemonDialog>
  );
}

import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import LemonSketchEntity from "../../core/entity/LemonSketchEntity";
import useLemonSketchStore from "../../store/LemonSketchStore";
import useLemonStageStore, { LemonStageMode } from "../../store/LemonStageStore";

export default function LemonSketchButton() {
  const { createSketchNumber, setCreateSketchEntity, updateCreateSketchNumber } = useLemonSketchStore();
  const { stageMode, entityManager, interactorManager } = useLemonStageStore();

  return (
    <Button
      type="text"
      disabled={stageMode == LemonStageMode.Sketch}
      onClick={() => {
        interactorManager.clearPickedEntities();
        const sketchEntity = new LemonSketchEntity();
        sketchEntity.setSketchName("Sketch " + createSketchNumber);
        entityManager.addEntity(sketchEntity);
        setCreateSketchEntity(sketchEntity);
        updateCreateSketchNumber();
        interactorManager.pushPickedEntity(sketchEntity);
      }}
      icon={<EditOutlined />}>
      Sketch
    </Button>
  );
}

import { v4 as uuidv4 } from "uuid";
import LemonSketchDialog from "../../components/sketch/LemonSketchDialog";
import { LemonDocumentType } from "../../documents/LemonDocument";
import { LemonDrawType } from "../../draw/LemonDrawInterface";
import useLemonAsideStore from "../../store/LemonAsideStore";
import useLemonDialogStore from "../../store/LemonDialogStore";
import useLemonSketchStore from "../../store/LemonSketchStore";
import useLemonStageStore, { LemonStageMode } from "../../store/LemonStageStore";
import LemonEntity from "./LemonEntity";

export default class LemonSketchEntity extends LemonEntity {
  private sketchName: string;
  private planeEntityID: string | null = null;
  private dialogID: string | null = null;

  public constructor() {
    super();
    this.sketchName = "Sketch";
    useLemonAsideStore.getState().pushGeometryData({ title: this.sketchName, key: this.id, selectable: false });
  }

  public setSketchName(name: string) {
    this.sketchName = name;
    useLemonAsideStore.getState().renameGeometryData(this.id, this.sketchName);
  }

  public getSketchName(): string {
    return this.sketchName;
  }

  public setPlaneEntityID(id: string | null) {
    this.planeEntityID = id;
    if (id == null && this.isSelected()) {
      useLemonStageStore.getState().drawManager.beginDraw(LemonDrawType.Sketch);
    }
  }

  public getPlaneEntityID(): string | null {
    return this.planeEntityID;
  }

  public createDialog() {
    if (this.dialogID) {
      useLemonDialogStore.getState().removeDialog(this.dialogID);
    }
    this.dialogID = uuidv4();
    useLemonSketchStore.getState().setCreateSketchName(this.sketchName);
    useLemonDialogStore.getState().addDialog({
      id: this.dialogID,
      visible: true,
      dialog: (
        <LemonSketchDialog
          dialogID={this.dialogID}
          initialTitle={this.sketchName}
          onConfirm={() => {
            this.setSketchName(useLemonSketchStore.getState().createSketchName);
            const planeEntity = useLemonSketchStore.getState().createSketchPlaneEntity;
            if (planeEntity) {
              this.setPlaneEntityID(planeEntity.id);
            } else {
              this.setPlaneEntityID(null);
            }
            useLemonStageStore.getState().interactorManager.removePickedEntity(this);
            useLemonStageStore.getState().drawManager.endDraw();
          }}
          onCancel={() => {
            useLemonStageStore.getState().interactorManager.removePickedEntity(this);
            useLemonStageStore.getState().drawManager.endDraw();
          }}
        />
      ),
    });
  }

  public onSelected(selected: boolean): void {
    super.onSelected(selected);
    if (selected) {
      useLemonSketchStore.getState().setCreateSketchEntity(this);
      useLemonStageStore.getState().setStageMode(LemonStageMode.Sketch);
      if (this.planeEntityID) {
        const planeEntity = useLemonStageStore.getState().entityManager.getEntity(this.planeEntityID);
        if (planeEntity) {
          useLemonSketchStore.getState().setCreateSketchPlaneEntity(planeEntity);
        } else {
          useLemonSketchStore.getState().setCreateSketchPlaneEntity(null);
        }
      } else {
        useLemonSketchStore.getState().setCreateSketchPlaneEntity(null);
      }
      useLemonStageStore.getState().drawManager.beginDraw(LemonDrawType.Sketch);
      this.createDialog();
    } else {
      if (this.dialogID) {
        useLemonDialogStore.getState().removeDialog(this.dialogID);
        this.dialogID = null;
      }
      useLemonSketchStore.getState().setCreateSketchEntity(null);
      useLemonSketchStore.getState().setCreateSketchPlaneEntity(null);
      useLemonStageStore.getState().setStageMode(LemonStageMode.None);
    }
  }

  public getEntityType(): LemonDocumentType {
    return LemonDocumentType.SketchEntity;
  }
}

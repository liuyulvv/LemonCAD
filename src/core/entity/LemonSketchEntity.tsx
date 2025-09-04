import { Input } from "antd";
import { v4 as uuidv4 } from "uuid";
import LemonDialog from "../../components/LemonDialog";
import useLemonDialogStore from "../../store/LemonDialogStore";
import useLemonSketchStore from "../../store/LemonSketchStore";
import useLemonStageStore from "../../store/LemonStageStore";
import LemonEntity from "./LemonEntity";

export default class LemonSketchEntity extends LemonEntity {
  private sketchName: string;
  private planeEntityID: string | null = null;
  private dialogID: string | null = null;

  public constructor() {
    super();
    this.sketchName = "Sketch";
  }

  public setSketchName(name: string) {
    this.sketchName = name;
  }

  public getSketchName(): string {
    return this.sketchName;
  }

  public setPlaneEntityID(id: string) {
    this.planeEntityID = id;
  }

  public getPlaneEntityID(): string | null {
    return this.planeEntityID;
  }

  public createDialog() {
    if (this.dialogID) {
      useLemonDialogStore.getState().removeDialog(this.dialogID);
    }
    this.dialogID = uuidv4();
    useLemonDialogStore.getState().addDialog({
      id: this.dialogID,
      visible: false,
      dialog: (
        <LemonDialog
          id={this.dialogID}
          initialTitle={this.sketchName}
          onConfirm={() => {
            useLemonStageStore.getState().interactorManager.removePickedEntity(this);
          }}
          onCancel={() => {
            useLemonDialogStore.getState().hideDialog(this.dialogID!);
            useLemonStageStore.getState().interactorManager.removePickedEntity(this);
          }}>
          <Input
            addonBefore="Sketch plane"
            allowClear
            defaultValue={this.sketchName}
            onChange={(e) => {
              useLemonSketchStore.getState().setSketchName(e.target.value);
            }}
            onClear={() => {
              useLemonSketchStore.getState().setSketchName("");
            }}
          />
        </LemonDialog>
      ),
    });
  }

  public onSelected(selected: boolean): void {
    super.onSelected(selected);
    if (selected) {
      if (this.dialogID) {
        useLemonDialogStore.getState().showDialog(this.dialogID);
      }
    } else {
      if (this.dialogID) {
        useLemonDialogStore.getState().hideDialog(this.dialogID);
      }
    }
  }
}

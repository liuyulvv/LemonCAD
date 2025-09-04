import { create } from "zustand";

export interface LemonDialogInterface {
  id: string;
  dialog: React.ReactNode;
  visible: boolean;
}

interface DialogStore {
  maxZIndex: number;
  setMaxZIndex: (zIndex: number) => void;
  dialogs: Map<string, LemonDialogInterface>;
  addDialog: (dialogInterface: LemonDialogInterface) => void;
  removeDialog: (id: string) => void;
  showDialog: (id: string) => void;
  hideDialog: (id: string) => void;
}

const useLemonDialogStore = create<DialogStore>((set) => ({
  maxZIndex: 1000,
  setMaxZIndex: (zIndex) => set({ maxZIndex: zIndex }),
  dialogs: new Map(),
  addDialog: (dialogInterface) =>
    set((state) => {
      const newDialogs = new Map(state.dialogs);
      newDialogs.set(dialogInterface.id, dialogInterface);
      return { dialogs: newDialogs };
    }),
  removeDialog: (id) =>
    set((state) => {
      const newDialogs = new Map(state.dialogs);
      newDialogs.delete(id);
      return { dialogs: newDialogs };
    }),
  showDialog: (id) =>
    set((state) => {
      const newDialogs = new Map(state.dialogs);
      const dialog = newDialogs.get(id);
      if (dialog) {
        newDialogs.set(id, { ...dialog, visible: true });
      }
      return { dialogs: newDialogs };
    }),
  hideDialog: (id) =>
    set((state) => {
      const newDialogs = new Map(state.dialogs);
      const dialog = newDialogs.get(id);
      if (dialog) {
        newDialogs.set(id, { ...dialog, visible: false });
      }
      return { dialogs: newDialogs };
    }),
}));

export default useLemonDialogStore;

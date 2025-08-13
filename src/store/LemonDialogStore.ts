import { create } from "zustand";

export interface LemonDialogInterface {
  id: string;
  title: string;
}

interface DialogStore {
  maxZIndex: number;
  setMaxZIndex: (zIndex: number) => void;
  dialogs: Map<string, React.ReactNode>;
  addDialog: (id: string, dialog: React.ReactNode) => void;
  removeDialog: (id: string) => void;
}

const useLemonDialogStore = create<DialogStore>((set) => ({
  maxZIndex: 10000,
  setMaxZIndex: (zIndex) => set({ maxZIndex: zIndex }),
  dialogs: new Map(),
  addDialog: (id, dialog) =>
    set((state) => {
      const newDialogs = new Map(state.dialogs);
      newDialogs.set(id, dialog);
      return { dialogs: newDialogs };
    }),
  removeDialog: (id) =>
    set((state) => {
      const newDialogs = new Map(state.dialogs);
      newDialogs.delete(id);
      return { dialogs: newDialogs };
    }),
}));

export default useLemonDialogStore;

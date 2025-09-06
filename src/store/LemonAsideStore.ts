import { create } from "zustand";

export interface LemonGeometryData {
  title: string | React.ReactNode;
  key: string;
  children?: LemonGeometryData[];
  selectable?: boolean;
  expanded?: boolean;
}

interface AsideStore {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  geometryData: LemonGeometryData[];
  pushGeometryData: (data: LemonGeometryData) => void;
  renameGeometryData: (key: string, title: string) => void;
  geometryNodeIconVisibleMap: Record<string, boolean>;
  setGeometryNodeIconVisible: (key: string, visible: boolean) => void;
  selectedEntities: string[];
  setSelectedEntities: (ids: string[]) => void;
  pushSelectedEntity: (id: string) => void;
  removeSelectedEntity: (id: string) => void;
}

const useLemonAsideStore = create<AsideStore>()((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
  geometryData: [
    {
      title: "Default geometry",
      key: "default-geometry",
      selectable: false,
      expanded: true,
      children: [
        { title: "Origin", key: "origin-point" },
        { title: "Front plane", key: "front-plane" },
        { title: "Top plane", key: "top-plane" },
        { title: "Right plane", key: "right-plane" },
      ],
    },
  ],
  pushGeometryData: (data: LemonGeometryData) => set((state) => ({ geometryData: [...state.geometryData, data] })),
  renameGeometryData: (key, title) => {
    set((state) => ({
      geometryData: state.geometryData.map((item) => (item.key === key ? { ...item, title } : item)),
    }));
  },
  geometryNodeIconVisibleMap: {},
  setGeometryNodeIconVisible: (key, visible) =>
    set((state) => ({
      geometryNodeIconVisibleMap: { ...state.geometryNodeIconVisibleMap, [key]: visible },
    })),
  selectedEntities: [],
  setSelectedEntities: (ids) => set({ selectedEntities: ids }),
  pushSelectedEntity: (id) =>
    set((state) => ({
      selectedEntities: [...new Set([...state.selectedEntities, id])],
    })),
  removeSelectedEntity: (id) =>
    set((state) => ({
      selectedEntities: state.selectedEntities.filter((eid) => eid !== id),
    })),
}));

export default useLemonAsideStore;

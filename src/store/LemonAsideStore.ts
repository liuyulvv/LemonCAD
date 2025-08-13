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
  setGeometryData: (data: LemonGeometryData[]) => void;
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
  setGeometryData: (data) => set({ geometryData: data }),
}));

export default useLemonAsideStore;

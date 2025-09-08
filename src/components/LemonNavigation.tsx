import { RedoOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import React, { useEffect, useState } from "react";
import LemonVector from "../geom/LemonVector";
import useLemonStageStore from "../store/LemonStageStore";
import LemonSketchButton from "./sketch/LemonSketchButton";
import LemonSketchLineButton from "./sketch/LemonSketchLineButton";

interface NavItem {
  type: "divider" | "component";
  name: string;
  filter: string;
}

function LemonNavigation() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const { stageMode, camera } = useLemonStageStore();

  const customComponents: { [key: string]: React.ReactNode } = {
    LemonSketchButton: <LemonSketchButton />,
    LemonSketchLineButton: <LemonSketchLineButton />,
  };

  useEffect(() => {
    fetch("/navigation.json")
      .then((res) => res.json())
      .then((data) => setNavItems(data));
  }, []);

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
          camera.lookAtPlane(new LemonVector(0, 0, 1));
        }}>
        Top View
      </Button>
      <Divider type="vertical" />
      {navItems.map((item, index) => {
        switch (item.type) {
          case "divider":
            return <Divider key={index} type="vertical" />;
          case "component":
            return item.filter.includes(stageMode) && item.name && customComponents[item.name] ? (
              <React.Fragment key={index}>{customComponents[item.name]}</React.Fragment>
            ) : null;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default LemonNavigation;

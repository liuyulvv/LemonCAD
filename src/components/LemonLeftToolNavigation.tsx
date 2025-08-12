import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Tree } from "antd";
import { useEffect, useRef, useState } from "react";
import useLemonStageStore from "../store/LemonStageStore";
import LemonGeometryNode from "./LemonGeometryNode";

const TreeNode = Tree.TreeNode;

function LemonLeftToolNavigation() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [recordedWidth, setRecordedWidth] = useState("192px");
  const { interactorManager, entityManager } = useLemonStageStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && containerRef.current) {
      const actualWidth = containerRef.current.scrollWidth;
      setRecordedWidth(`${actualWidth}px`);
    }
  }, [isExpanded]);

  const toggleWidth = () => {
    if (isExpanded && containerRef.current) {
      const actualWidth = containerRef.current.scrollWidth;
      setRecordedWidth(`${actualWidth}px`);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        ref={containerRef}
        style={{
          width: isExpanded ? recordedWidth : "0px",
          minWidth: isExpanded ? "192px" : "0px",
          transition: "width 0.3s ease, min-width 0.3s ease",
          overflow: "hidden",
        }}
      >
        <Tree
          multiple
          blockNode
          showLine
          defaultExpandedKeys={["default-geometry"]}
          onSelect={(_value, info) => {
            if (info.node.key) {
              const entity = entityManager.getEntity(info.node.key as string);
              if (entity) {
                if (info.selected) {
                  interactorManager.insertPickedEntity(entity);
                } else {
                  interactorManager.removePickedEntity(entity);
                }
              }
            }
          }}
        >
          <TreeNode title="Default geometry" key="default-geometry" selectable={false}>
            <TreeNode title={<LemonGeometryNode name="Origin" id="origin-point" />} key="origin-point" />
            <TreeNode title={<LemonGeometryNode name="Front plane" id="front-plane" />} key="front-plane" />
            <TreeNode title={<LemonGeometryNode name="Top plane" id="top-plane" />} key="top-plane" />
            <TreeNode title={<LemonGeometryNode name="Right plane" id="right-plane" />} key="right-plane" />
          </TreeNode>
        </Tree>
      </div>
      <Button
        style={{
          alignSelf: "center",
        }}
        icon={isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        type="text"
        onClick={toggleWidth}
      />
    </div>
  );
}

export default LemonLeftToolNavigation;

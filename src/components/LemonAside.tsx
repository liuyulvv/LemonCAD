import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Tree } from "antd";
import { useEffect, useRef, useState } from "react";
import useLemonAsideStore, { type LemonGeometryData } from "../store/LemonAsideStore";
import useLemonStageStore from "../store/LemonStageStore";
import LemonGeometryNode from "./LemonGeometryNode";

function LemonAside() {
  const { interactorManager, entityManager } = useLemonStageStore();
  const { collapsed, setCollapsed, geometryData } = useLemonAsideStore();
  const [treeNode, setTreeNode] = useState<LemonGeometryData[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateTreeNodes = (data: LemonGeometryData[]): LemonGeometryData[] => {
    return data.map((item) => {
      if (item.selectable == undefined || item.selectable) {
        return {
          title: <LemonGeometryNode name={item.title as string} id={item.key} />,
          name: item.title,
          key: item.key,
          children: item.children ? generateTreeNodes(item.children) : [],
          expanded: item.expanded,
          selectable: true,
        };
      } else {
        return {
          title: item.title,
          key: item.key,
          selectable: false,
          children: item.children ? generateTreeNodes(item.children) : [],
          expanded: item.expanded,
        };
      }
    });
  };

  const generateExpandedKeys = (nodes: LemonGeometryData[]): string[] => {
    const keys: string[] = [];
    const findExpandedKeys = (node: LemonGeometryData) => {
      if (node.expanded) {
        keys.push(node.key);
      }
      node.children?.forEach(findExpandedKeys);
    };
    nodes.forEach(findExpandedKeys);
    return keys;
  };

  useEffect(() => {
    const nodes = generateTreeNodes(geometryData);
    const keys = generateExpandedKeys(nodes);
    setTreeNode(nodes);
    setExpandedKeys(keys);
  }, [geometryData]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        ref={containerRef}
        style={{
          width: collapsed ? "0px" : "100%",
          transition: "width 0.3s ease, min-width 0.3s ease",
          overflow: "hidden",
        }}
      >
        <Tree
          multiple
          blockNode
          showLine
          expandedKeys={expandedKeys}
          onExpand={(keys) => {
            setExpandedKeys(keys);
          }}
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
          onMouseEnter={(info) => {
            const key = info.node.key as string;
            if (key == "default-geometry") {
              interactorManager.setHoveredEntity(null);
            } else {
              const entity = entityManager.getEntity(key);
              if (entity) {
                interactorManager.setHoveredEntity(entity);
              }
            }
          }}
          treeData={treeNode}
        />
      </div>
      <Button
        style={{
          alignSelf: "center",
        }}
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        type="text"
        onClick={() => setCollapsed(!collapsed)}
      />
    </div>
  );
}

export default LemonAside;

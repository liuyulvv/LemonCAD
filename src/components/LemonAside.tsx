import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Tree } from "antd";
import { useEffect, useRef, useState } from "react";
import { LemonDocumentType } from "../documents/LemonDocument";
import useLemonAsideStore, { type LemonGeometryData } from "../store/LemonAsideStore";
import useLemonSketchStore from "../store/LemonSketchStore";
import useLemonStageStore, { LemonStageMode } from "../store/LemonStageStore";
import LemonGeometryNode from "./LemonGeometryNode";

function LemonAside() {
  const { interactorManager, entityManager, stageMode, entities } = useLemonStageStore();
  const { collapsed, setCollapsed, geometryData, setGeometryNodeIconVisible } = useLemonAsideStore();
  const { createSketchEntity } = useLemonSketchStore();

  const [treeNode, setTreeNode] = useState<LemonGeometryData[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const findEntityIDByName = (nodes: LemonGeometryData[], name: string): string | null => {
    for (const node of nodes) {
      if (node.title == name) {
        return node.key;
      }
    }
    return null;
  };

  useEffect(() => {
    const generateTreeNodes = (data: LemonGeometryData[]): LemonGeometryData[] => {
      return data.map((item) => {
        if (item.selectable == undefined || item.selectable) {
          setGeometryNodeIconVisible(item.key, false);
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

    const nodes = generateTreeNodes(geometryData);
    const keys = generateExpandedKeys(nodes);
    setTreeNode(nodes);
    setExpandedKeys(keys);
  }, [geometryData, setGeometryNodeIconVisible]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        ref={containerRef}
        style={{
          width: collapsed ? "0px" : "100%",
          transition: "width 0.3s ease, min-width 0.3s ease",
          overflow: "hidden",
        }}>
        <Tree
          multiple
          blockNode
          showLine
          expandedKeys={expandedKeys}
          onExpand={(keys) => {
            setExpandedKeys(keys);
          }}
          onDoubleClick={(e) => {
            const target = e.target as HTMLElement;
            const content = target.textContent || target.innerText;
            const entityID = findEntityIDByName(geometryData, content);
            if (entityID) {
              const entity = entityManager.getEntity(entityID);
              if (entity) {
                if (entity.getEntityType() == LemonDocumentType.SketchEntity) {
                  interactorManager.clearPickedEntities();
                  interactorManager.pushPickedEntity(entity);
                }
              }
            }
          }}
          onSelect={(_value, info) => {
            if (info.node.key) {
              const entity = entityManager.getEntity(info.node.key as string);
              if (entity) {
                if (entity.getEntityType() == LemonDocumentType.SketchEntity) {
                  return;
                }
                if (info.selected) {
                  interactorManager.pushPickedEntity(entity);
                  if (stageMode == LemonStageMode.Sketch && createSketchEntity) {
                    interactorManager.clearPickedEntityExcept(createSketchEntity);
                  }
                } else {
                  interactorManager.removePickedEntity(entity);
                }
              }
            }
          }}
          selectedKeys={entities.map((e) => {
            return e.id;
          })}
          onMouseEnter={(info) => {
            const key = info.node.key as string;
            if (key == "default-geometry") {
              interactorManager.setHoveredEntity(null);
            } else {
              const entity = entityManager.getEntity(key);
              if (entity) {
                interactorManager.setHoveredEntity(entity);
              }
              setGeometryNodeIconVisible(key, true);
            }
          }}
          onMouseLeave={(info) => {
            const key = info.node.key as string;
            if (key != "default-geometry") {
              setGeometryNodeIconVisible(key, false);
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

import { Button, Tree } from "@arco-design/web-react";
import { IconMenuFold, IconMenuUnfold } from "@arco-design/web-react/icon";
import { useEffect, useRef, useState } from "react";

const TreeNode = Tree.Node;

function LemonLeftToolNavigation() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [recordedWidth, setRecordedWidth] = useState("192px");
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
        <Tree blockNode actionOnClick="expand">
          <TreeNode title="Default geometry" key="default-geometry">
            <TreeNode title="Origin" key="origin" />
            <TreeNode title="Front plane" key="front-plane" />
            <TreeNode title="Top Plane" key="top-plane" />
            <TreeNode title="Right plane" key="right-plane" />
          </TreeNode>
        </Tree>
      </div>
      <Button
        style={{
          alignSelf: "center",
        }}
        icon={isExpanded ? <IconMenuFold /> : <IconMenuUnfold />}
        type="text"
        onClick={toggleWidth}
      />
    </div>
  );
}

export default LemonLeftToolNavigation;

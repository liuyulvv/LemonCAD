import { Button, Divider } from "@arco-design/web-react";
import { IconPen, IconRedo, IconUndo } from "@arco-design/web-react/icon";

function LemonNavigation() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Button type="text" icon={<IconUndo />} />
      <Button type="text" icon={<IconRedo />} />
      <Divider type="vertical" />
      <Button type="text" onClick={() => {}} icon={<IconPen />}>
        Sketch
      </Button>
      <Button type="text" onClick={() => {}}>
        Line
      </Button>
    </div>
  );
}

export default LemonNavigation;

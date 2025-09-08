import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { makeStyles } from "@griffel/react";
import { Button, Input, Space, Typography, type InputRef } from "antd";
import React, { useEffect, useRef, useState } from "react";
import useLemonDialogStore from "../store/LemonDialogStore";

export interface LemonDialogProps {
  id: string;
  initialTitle?: string;
  initialPosition?: { x: number; y: number };
  enableEdit?: boolean;
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  onTitleChange?: (title: string) => void;
}

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    backgroundColor: "white",
    userSelect: "none",
    display: "flex",
    flexDirection: "column",
  },
  resizeRegion: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "5px",
    height: "100%",
    cursor: "ew-resize",
  },
  header: {
    padding: "2px",
    cursor: "move",
    backgroundColor: "#f1f1f1",
    borderBottom: "1px solid #ccc",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  content: {
    padding: "10px",
    flexGrow: 1,
  },
});

export default function LemonDialog({
  initialTitle = "Sketch",
  initialPosition = { x: 225, y: 32 },
  enableEdit = true,
  children,
  onConfirm,
  onCancel,
  onTitleChange,
}: LemonDialogProps) {
  const styles = useStyles();

  const { maxZIndex, setMaxZIndex } = useLemonDialogStore();

  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dialogWidth, setDialogWidth] = useState(300);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [editButtonVisible, setEditButtonVisible] = useState(false);
  const [zIndex, setZIndex] = useState(maxZIndex);

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
    onTitleChange?.(newTitle);
  };

  const dragOffset = useRef({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<InputRef>(null);

  const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current) {
      setIsDragging(true);
      const rect = dialogRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isEditing) {
        return;
      }
      if (isDragging && dialogRef.current) {
        const rect = dialogRef.current.getBoundingClientRect();

        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const clampedX = Math.max(0, Math.min(newX, viewportWidth - rect.width));
        const clampedY = Math.max(0, Math.min(newY, viewportHeight - rect.height));

        setPosition({
          x: clampedX,
          y: clampedY,
        });
      }
      if (isResizing && dialogRef.current) {
        const rect = dialogRef.current.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        setDialogWidth(Math.max(newWidth, 300));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, isEditing]);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
      setEditButtonVisible(false);
    }
  }, [isEditing]);

  return (
    <div
      ref={dialogRef}
      className={styles.dialog}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${dialogWidth}px`,
        zIndex: zIndex,
      }}
      onMouseDown={() => {
        setZIndex(maxZIndex + 1);
        setMaxZIndex(maxZIndex + 1);
      }}>
      <div className={styles.resizeRegion} onMouseDown={handleResizeMouseDown}></div>
      <div className={styles.header} onMouseDown={handleDragMouseDown}>
        <div
          style={{ flex: 1 }}
          onMouseEnter={() => {
            if (enableEdit) {
              setEditButtonVisible(true);
            }
          }}
          onMouseLeave={() => {
            if (!isEditing) {
              setEditButtonVisible(false);
            }
          }}>
          {isEditing ? (
            <Input size="small" value={title} onChange={(e) => updateTitle(e.target.value)} ref={titleInputRef} onBlur={() => setIsEditing(false)} />
          ) : (
            <div className={styles.center}>
              <Typography.Text
                className={styles.title}
                style={{
                  maxWidth: dialogWidth - 80,
                }}>
                {title}
              </Typography.Text>
              {editButtonVisible ? (
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                />
              ) : null}
            </div>
          )}
        </div>
        <Space.Compact>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() => {
              onConfirm();
            }}
            variant="solid"
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            size="small"
            onClick={() => {
              onCancel();
            }}
            color="danger"
            variant="solid"
          />
        </Space.Compact>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

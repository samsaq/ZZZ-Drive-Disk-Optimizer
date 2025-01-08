"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useWindowStore } from "@/atomsAndStores/windowStore";

//Creates a window that is draggable in the style of a OS program to serve as an aesthetically appropriate modal

interface Position {
  x: number;
  y: number;
}

type AnchorPoint = "start" | "center" | "end";
type Direction = "top" | "right" | "bottom" | "left";

interface RelativePosition {
  targetRef: React.RefObject<HTMLElement>;
  direction: Direction;
  anchor: AnchorPoint;
  offset?: number;
}

interface OSWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  position?: Position | RelativePosition;
  defaultPosition?: Position;
  titleClassName?: string;
  titleBarClassName?: string;
  closeButtonClassName?: string;
  overrideMinWidth?: number;
}

export function OSWindow({
  id,
  title,
  isOpen,
  onClose,
  children,
  className,
  position,
  defaultPosition = { x: 50, y: 50 },
  titleClassName,
  titleBarClassName,
  closeButtonClassName,
  overrideMinWidth,
}: Readonly<OSWindowProps>) {
  const { addWindow, removeWindow, bringToFront, getWindowZIndex } =
    useWindowStore();
  const [windowPosition, setWindowPosition] =
    useState<Position>(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false); // tracks if the window has completed initial positioning
  const windowRef = useRef<HTMLDivElement>(null);

  // Center the window on mount
  useEffect(() => {
    if (!windowRef.current || isInitialized) return;

    const rect = windowRef.current.getBoundingClientRect();
    const windowWidth = rect.width;
    const windowHeight = rect.height;

    // Adjust position so the window is centered on the default position
    setWindowPosition({
      x: defaultPosition.x - windowWidth / 2,
      y: defaultPosition.y - windowHeight / 2,
    });
    setIsInitialized(true);
  }, [defaultPosition, isInitialized]);

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(e: MouseEvent) {
      setWindowPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Update positioning logic
  useEffect(() => {
    if (!windowRef.current) return;
    setIsPositioned(false); // Reset positioned state when position prop changes

    const windowRect = windowRef.current.getBoundingClientRect();

    if (!position) {
      // Center the window on the default position
      setWindowPosition({
        x: defaultPosition.x - windowRect.width / 2,
        y: defaultPosition.y - windowRect.height / 2,
      });
      setIsPositioned(true);
      return;
    }

    if ("x" in position) {
      // Handle absolute positioning
      setWindowPosition(position);
      setIsPositioned(true);
      return;
    }

    // Handle relative positioning
    const { targetRef, direction, anchor, offset = 0 } = position;
    if (!targetRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    let x = 0;
    let y = 0;

    // Calculate position based on direction
    switch (direction) {
      case "bottom":
        y = targetRect.bottom + offset;
        switch (anchor) {
          case "start":
            x = targetRect.left;
            break;
          case "center":
            x = targetRect.left + (targetRect.width - windowRect.width) / 2;
            break;
          case "end":
            x = targetRect.right - windowRect.width;
            break;
        }
        break;
      case "top":
        y = targetRect.top - windowRect.height - offset;
        switch (anchor) {
          case "start":
            x = targetRect.left;
            break;
          case "center":
            x = targetRect.left + (targetRect.width - windowRect.width) / 2;
            break;
          case "end":
            x = targetRect.right - windowRect.width;
            break;
        }
        break;
      case "left":
        x = targetRect.left - windowRect.width - offset;
        switch (anchor) {
          case "start":
            y = targetRect.top;
            break;
          case "center":
            y = targetRect.top + (targetRect.height - windowRect.height) / 2;
            break;
          case "end":
            y = targetRect.bottom - windowRect.height;
            break;
        }
        break;
      case "right":
        x = targetRect.right + offset;
        switch (anchor) {
          case "start":
            y = targetRect.top;
            break;
          case "center":
            y = targetRect.top + (targetRect.height - windowRect.height) / 2;
            break;
          case "end":
            y = targetRect.bottom - windowRect.height;
            break;
        }
        break;
    }

    setWindowPosition({ x, y });
    setIsPositioned(true);
  }, [position, windowRef.current]);

  // Add window to store when mounted and remove when unmounted
  useEffect(() => {
    if (isOpen) {
      addWindow(id);
    }
    return () => {
      removeWindow(id);
    };
  }, [id, isOpen]);

  // Bring window to front when clicked
  const handleWindowClick = () => {
    bringToFront(id);
  };

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    bringToFront(id);
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const minWidth = overrideMinWidth ?? 300;

  return (
    <div
      ref={windowRef}
      className={cn(
        "windowCRTEffect fixed border-2 border-gray-300 bg-background shadow-lg",
        className,
        !isPositioned && "opacity-0", // Hide window until positioned
      )}
      style={{
        left: `${windowPosition.x}px`,
        top: `${windowPosition.y}px`,
        minWidth: `${minWidth}px`,
        zIndex: getWindowZIndex(id),
      }}
      onClick={handleWindowClick}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex h-8 cursor-move items-center justify-between border-b-2 border-gray-300 bg-black px-2",
          titleBarClassName,
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleMouseDown(e as any);
          }
        }}
        onMouseDown={handleMouseDown}
      >
        <div className={cn("font-DOS text-sm text-white", titleClassName)}>
          {title}
        </div>
        <button
          aria-label="Close window"
          className={cn("rounded-none p-1", closeButtonClassName)}
          onClick={onClose}
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Window Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}

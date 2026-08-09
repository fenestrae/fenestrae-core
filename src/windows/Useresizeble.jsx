import { useState, useEffect, useCallback, useRef } from "react";
import clsx from "clsx";

const getPoint = (e) => {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }
  return {
    x: e.clientX,
    y: e.clientY,
  };
};

// ============================================================================
// FENESTRAE - HOOKS (Useresizeble.jsx)
// Drag and resize hooks with docking support and configurable minimum sizes.
// ============================================================================
export const ResizeHandles = ({ active, onStart }) => {
  if (!active) return null;

  const areas = [
    { dir: "n",  cls: "top-0 left-0 w-full h-1.5 cursor-n-resize" },
    { dir: "s",  cls: "bottom-0 left-0 w-full h-1.5 cursor-s-resize" },
    { dir: "w",  cls: "top-0 left-0 h-full w-1.5 cursor-w-resize" },
    { dir: "e",  cls: "top-0 right-0 h-full w-1.5 cursor-e-resize" },
    { dir: "nw", cls: "top-0 left-0 w-4 h-4 cursor-nw-resize z-10" },
    { dir: "ne", cls: "top-0 right-0 w-4 h-4 cursor-ne-resize z-10" },
    { dir: "sw", cls: "bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10" },
    { dir: "se", cls: "bottom-0 right-0 w-4 h-4 cursor-se-resize z-10" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {areas.map((a) => (
        <div
          key={a.dir}
          className={clsx("absolute pointer-events-auto", a.cls)}
          onMouseDown={(e) => onStart(e, a.dir)}
          onTouchStart={(e) => onStart(e, a.dir)}
        />
      ))}
    </div>
  );
};

// --- DRAG HOOK ---------------------------------------------------------------

const DOCK_THRESHOLD = 40; // px from edge to trigger dock hint

const detectDockZone = (x, y) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (x <= DOCK_THRESHOLD)      return "left";
  if (x >= vw - DOCK_THRESHOLD) return "right";
  if (y <= DOCK_THRESHOLD)      return "top";
  if (y >= vh - DOCK_THRESHOLD) return "bottom";
  return null;
};

/**
 * @param {number} initialX
 * @param {number} initialY
 * @param {function} onDragStop
 * @param {object} options - { winId, dockable }
 *   winId    — required for docking events
 *   dockable — if true, emits fenestrae:dockHint and fenestrae:dockDrop events
 */
export const useDraggable = (initialX, initialY, onDragStop, options = {}) => {
  const { winId = null, dockable = false } = options;

  const positionRef = useRef({ x: initialX, y: initialY });
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });
  const animationFrameRef = useRef(null);

  const dockableRef = useRef(dockable);
  const winIdRef = useRef(winId);

  useEffect(() => {
    dockableRef.current = dockable;
    winIdRef.current = winId;
  }, [dockable, winId]);

  const handleStart = useCallback((e) => {
    const handle = e.target.closest(".handle-movible");
    if (!handle) return;

    const p = getPoint(e);

    dragStartRef.current = {
      mouseX: p.x,
      mouseY: p.y,
      winX: positionRef.current.x,
      winY: positionRef.current.y,
    };

    setIsDragging(true);

    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const p = getPoint(e);

      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = requestAnimationFrame(() => {
        const start = dragStartRef.current;

        const deltaX = p.x - start.mouseX;
        const deltaY = p.y - start.mouseY;

        const newX = Math.max(0, Math.min(start.winX + deltaX, window.innerWidth - 100));
        const newY = Math.max(0, Math.min(start.winY + deltaY, window.innerHeight - 100));

        positionRef.current = { x: newX, y: newY };
        setPosition({ x: newX, y: newY });

        if (dockableRef.current && winIdRef.current) {
          const zone = detectDockZone(p.x, p.y);
          window.dispatchEvent(
            new CustomEvent("fenestrae:dockHint", {
              detail: { zone, winId: winIdRef.current },
            })
          );
        }
      });

      e.preventDefault();
    };

    const handleEnd = (e) => {
      const p = getPoint(e);

      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setIsDragging(false);

      if (dockableRef.current && winIdRef.current) {
        window.dispatchEvent(
          new CustomEvent("fenestrae:dockHint", {
            detail: { zone: null, winId: winIdRef.current },
          })
        );

        const zone = detectDockZone(p.x, p.y);
        if (zone) {
          window.dispatchEvent(
            new CustomEvent("fenestrae:dockDrop", {
              detail: { zone, winId: winIdRef.current },
            })
          );
        }
      }

      onDragStop?.(positionRef.current);
    };

    document.addEventListener("mousemove", handleMove, { passive: false });
    document.addEventListener("mouseup", handleEnd, { passive: false });

    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd, { passive: false });

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);

      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, onDragStop]);

  useEffect(() => {
    positionRef.current = { x: initialX, y: initialY };
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  return {
    position,
    isDragging,
    handleMouseDown: handleStart,
    handleTouchStart: handleStart,
    style: {
      left: `${position.x}px`,
      top: `${position.y}px`,
      position: "absolute",
      cursor: isDragging ? "grabbing" : "default",
      transform: isDragging ? "translateZ(0)" : "none",
    },
  };
};

// --- RESIZE HOOK -------------------------------------------------------------

/**
 * @param {number} initialWidth
 * @param {number} initialHeight
 * @param {number} initialX
 * @param {number} initialY
 * @param {function} onResizeStop
 * @param {object} minSize - { width, height } — defaults to { width: 80, height: 80 }
 */
export const useResizable = (
  initialWidth,
  initialHeight,
  initialX,
  initialY,
  onResizeStop,
  minSize = { width: 80, height: 80 }
) => {
  const minW = minSize.width;
  const minH = minSize.height;

  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [posAdj, setPosAdj] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);

  const sizeRef = useRef({ width: initialWidth, height: initialHeight, x: initialX, y: initialY });
  const resizeStartRef = useRef(null);
  const directionRef = useRef("");

  const handleResizeStart = useCallback((e, direction) => {
    const p = getPoint(e);

    directionRef.current = direction;
    setIsResizing(true);

    resizeStartRef.current = {
      mouseX: p.x,
      mouseY: p.y,
      width: sizeRef.current.width,
      height: sizeRef.current.height,
      x: sizeRef.current.x,
      y: sizeRef.current.y,
    };

    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (e) => {
      const p = getPoint(e);

      const start = resizeStartRef.current;
      const dir = directionRef.current;

      const deltaX = p.x - start.mouseX;
      const deltaY = p.y - start.mouseY;

      let nW = start.width;
      let nH = start.height;
      let nX = 0;
      let nY = 0;

      if (dir.includes("e")) nW = Math.max(minW, start.width + deltaX);
      if (dir.includes("s")) nH = Math.max(minH, start.height + deltaY);

      if (dir.includes("w")) {
        const cw = start.width - deltaX;
        if (cw > minW) {
          nW = cw;
          nX = deltaX;
        }
      }

      if (dir.includes("n")) {
        const ch = start.height - deltaY;
        if (ch > minH) {
          nH = ch;
          nY = deltaY;
        }
      }

      requestAnimationFrame(() => {
        setSize({ width: nW, height: nH });
        setPosAdj({ x: nX, y: nY });
      });

      e.preventDefault();
    };

    const handleEnd = () => {
      setIsResizing(false);

      onResizeStop?.({
        width: size.width,
        height: size.height,
        x: sizeRef.current.x + posAdj.x,
        y: sizeRef.current.y + posAdj.y,
      });

      setPosAdj({ x: 0, y: 0 });
    };

    document.addEventListener("mousemove", handleMove, { passive: false });
    document.addEventListener("mouseup", handleEnd, { passive: false });

    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);

      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isResizing, size, posAdj, onResizeStop, minW, minH]);

  useEffect(() => {
    sizeRef.current = {
      ...sizeRef.current,
      width: initialWidth,
      height: initialHeight,
      x: initialX,
      y: initialY,
    };
    setSize({ width: initialWidth, height: initialHeight });
  }, [initialWidth, initialHeight, initialX, initialY]);

  return { size, posAdj, isResizing, handleResizeStart };
};

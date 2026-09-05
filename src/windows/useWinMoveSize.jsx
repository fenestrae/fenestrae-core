import React, { useState, useEffect, useCallback, useRef } from "react";
import clsx from "clsx";
// Hook para arrastre OPTIMIZADO - CORREGIDO
export const ResizeHandles = ({ active, onStart }) => {
  if (!active) return null;

  const areas = [
    { dir: "n", cls: "top-0 left-0 w-full h-1.5 cursor-n-resize" },
    { dir: "s", cls: "bottom-0 left-0 w-full h-1.5 cursor-s-resize" },
    { dir: "w", cls: "top-0 left-0 h-full w-1.5 cursor-w-resize" },
    { dir: "e", cls: "top-0 right-0 h-full w-1.5 cursor-e-resize" },
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
        />
      ))}
    </div>
  );
};

export const useDraggable = (initialX, initialY, onDragStop, winId) => {
  const positionRef = useRef({ x: initialX, y: initialY });
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 }); // Posición inicial del mouse
  const animationFrameRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (!e.target.classList.contains("handle-movible")) return;

    // IMPORTANTE: Usar la posición actual de la ventana como referencia
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        // Calcular el desplazamiento desde el punto inicial del clic
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        // Nueva posición = posición inicial + desplazamiento
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;

        // Mantener dentro de los límites
        const boundedX = Math.max(0, Math.min(newX, window.innerWidth - 100));
        const boundedY = Math.max(0, Math.min(newY, window.innerHeight - 100));

        positionRef.current = { x: boundedX, y: boundedY };
        setPosition({ x: boundedX, y: boundedY });
      });
    };

    const handleMouseUp = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsDragging(false);
      if (onDragStop) {
        onDragStop(positionRef.current);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, initialX, initialY, onDragStop]);

  // Sincronizar con valores del store
  useEffect(() => {
    positionRef.current = { x: initialX, y: initialY };
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  return {
    position,
    isDragging,
    handleMouseDown,
    style: {
      left: `${position.x}px`,
      top: `${position.y}px`,
      position: "absolute",
      cursor: isDragging ? "grabbing" : "default",
      transform: isDragging ? "translateZ(0)" : "none",
    },
  };
};


// Hook para redimensionamiento OPTIMIZADO - CORREGIDO
export const useResizable = (
  initialWidth,
  initialHeight,
  initialX,
  initialY,
  onResizeStop,
) => {
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [posAdj, setPosAdj] = useState({ x: 0, y: 0 }); // Ajuste temporal durante el resize
  const [isResizing, setIsResizing] = useState(false);

  const sizeRef = useRef({
    width: initialWidth,
    height: initialHeight,
    x: initialX,
    y: initialY,
  });
  const resizeStartRef = useRef(null);
  const directionRef = useRef("");

  const handleResizeStart = useCallback((e, direction) => {
    directionRef.current = direction;
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
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

    const handleMouseMove = (e) => {
      const start = resizeStartRef.current;
      const dir = directionRef.current;
      const deltaX = e.clientX - start.mouseX;
      const deltaY = e.clientY - start.mouseY;

      let nW = start.width;
      let nH = start.height;
      let nX = 0;
      let nY = 0;

      // Lógica de dimensiones y compensación de posición
      if (dir.includes("e")) nW = Math.max(300, start.width + deltaX);
      if (dir.includes("s")) nH = Math.max(200, start.height + deltaY);

      if (dir.includes("w")) {
        const calculatedWidth = start.width - deltaX;
        if (calculatedWidth > 300) {
          nW = calculatedWidth;
          nX = deltaX; // Empujamos la ventana hacia la izquierda/derecha
        }
      }

      if (dir.includes("n")) {
        const calculatedHeight = start.height - deltaY;
        if (calculatedHeight > 200) {
          nH = calculatedHeight;
          nY = deltaY; // Empujamos la ventana hacia arriba/abajo
        }
      }

      requestAnimationFrame(() => {
        setSize({ width: nW, height: nH });
        setPosAdj({ x: nX, y: nY });
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Al terminar, enviamos al store la posición real final (base + ajuste)
      if (onResizeStop) {
        onResizeStop({
          width: size.width,
          height: size.height,
          x: sizeRef.current.x + posAdj.x,
          y: sizeRef.current.y + posAdj.y,
        });
      }
      setPosAdj({ x: 0, y: 0 }); // Reseteamos el ajuste visual
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, size, posAdj, onResizeStop]);

  // Sincronización con el store
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


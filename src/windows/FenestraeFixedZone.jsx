import clsx from "clsx";
import PropTypes from "prop-types";
import FenestraeWinRenderer from "./FenestraeWinRenderer";

const FIXED_STYLE = {
  "top":    { axis: "horizontal", cls: "w-full flex-shrink-0 flex flex-col border-b" },
  "bottom": { axis: "horizontal", cls: "w-full flex-shrink-0 flex flex-col border-t" },
  "left":   { axis: "vertical",   cls: "h-full flex-shrink-0 flex flex-col border-r" },
  "right":  { axis: "vertical",   cls: "h-full flex-shrink-0 flex flex-col border-l" },
};

const FenestraeFixedZone = ({ win }) => {
  const style = FIXED_STYLE[win.fixedZone];
  const size = win.size ?? (style.axis === "vertical" ? 64 : 48);
   
  const sizeStyle =
    style.axis === "vertical"
      ? { width: `${size}px` }
      : { height: `${size}px` };

  return (
    <div className={clsx(style.cls)} style={sizeStyle}>
      
       {/* CONTENIDO */}
      <div
        className="flex-1 overflow-auto"
        style={{ backgroundColor: "var(--color-window-content, #ffffff)" }}
      >
        <FenestraeWinRenderer win={win} />
      </div>
    </div>
  );
};

FenestraeFixedZone.propTypes = {
  win: PropTypes.object.isRequired,
};

export default FenestraeFixedZone;

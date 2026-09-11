import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

if (import.meta.env.MODE === "dist") {
  import("../../dist/fenestrae.css");
}

createRoot(document.getElementById("root")).render(<App />);

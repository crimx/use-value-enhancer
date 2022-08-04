import React from "react";
import ReactDOM from "react-dom/client";
import { Val } from "value-enhancer";
import { App } from "./App";

const val = new Val("Hello");
(window as any).val = val;

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <App val={val} />
);

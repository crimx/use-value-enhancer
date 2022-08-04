import React from "react";
import type { ReadonlyVal } from "value-enhancer";
import { useVal } from "../src";

export interface AppProps {
  val: ReadonlyVal<string>;
}

export const App: React.FC<AppProps> = ({ val }) => {
  const value = useVal(val);
  return <div>Value: {value}</div>;
};

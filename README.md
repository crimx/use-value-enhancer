# use-value-enhancer

React hooks for [value-enhancer](https://github.com/crimx/value-enhancer).

### Install

```bash
npm add use-value-enhancer value-enhancer react
```

### Usage

```ts
import { useVal } from "use-value-enhancer";

const value = useVal(val);
```

### Example

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Val } from "value-enhancer";
import { useVal } from "use-value-enhancer";

export const App = ({ val }) => {
  const value = useVal(val);
  return <div>{value} World!</div>;
};

const val = new Val("Hello");
ReactDOM.createRoot(document.getElementById("app")).render(<App val={val} />);
```

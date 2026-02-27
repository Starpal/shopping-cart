import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./store/store";
import { Provider } from "react-redux";

// ReactDOM typings mismatch with React 16, cast to any
(ReactDOM as any).render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);

import { render } from "preact";
import App from "./app.jsx";
import "./index.css";
import { persistor,store } from "./app/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />{" "}
    </PersistGate>
  </Provider>,
  document.getElementById("app")
);

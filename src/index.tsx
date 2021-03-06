import React from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "./serviceWorker"

import App from "components/App"
import { NavigationContextWrapper } from "reducer-contexts/navigation"
import { PolygonGroupsContextWrapper } from "reducer-contexts/polygon-groups"
import { BackgroundContextWrapper } from "reducer-contexts/background"

import "./reset.css"
import "./utils.css"

ReactDOM.render(
  <React.StrictMode>
    <PolygonGroupsContextWrapper>
      <BackgroundContextWrapper>
        <NavigationContextWrapper>
          <App />
        </NavigationContextWrapper>
      </BackgroundContextWrapper>
    </PolygonGroupsContextWrapper>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

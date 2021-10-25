import React from 'react'

import { Connections } from 'hotglue-elements'
import 'hotglue-elements/dist/index.css'

const App = () => {
  return <Connections tenant="test" styleOverrides={{
    connected: {
      color: "#fa5240"
    },
    linkedSource: {
      border: "0.15rem solid #fa5240"
    },
    loadingContainer: {
      display: "block"
    },
    doneIcon: {
      fill: "#fa5240"
    }
  }}/>
}

export default App

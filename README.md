# hotglue-elements

React element to present [hotglue](https://hotglue.xyz) integrations.

[![NPM](https://img.shields.io/npm/v/hotglue-elements.svg)](https://www.npmjs.com/package/hotglue-elements) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save hotglue-elements
```

## Usage

```jsx
import React, { Component } from 'react'

import Connections from 'hotglue-elements'
import 'hotglue-elements/dist/index.css'

class Example extends Component {
  getUserId() {
    // TODO: Get real id of current user
    return "test-id";
  }

  render() {
    return <Connections tenant={this.getUserId()}/>
  }
}
```

## License

MIT © [hotgluexyz](https://github.com/hotgluexyz)

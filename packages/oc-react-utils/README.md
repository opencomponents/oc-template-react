# oc-react-utils

# ⚠️  THIS PACKAGE IS EXPERIMENTAL, DON'T USE IN PRODUCTION

### getComponent()

This utility allows you to you to require any other OpenComponent to be resused within your react app, so that end-to-end ownership is maintained.

#### usage:

```js
import React from 'react';
import utils from 'oc-react-utils';
const { getComponent } = utils({ baseUrl: 'http://localhost:3030/' });


const Header = getComponent({ name: 'header', version: '1.x' });
const Footer = getComponent({ name: 'footer', version: '1.x' });

const App = props => {
  return (
    <div>
      <Header {...props.header} />
      <h2>This is the Home</h2>
      <Footer {...props.footer} />
    </div>
  );
};

export default App;
``` 

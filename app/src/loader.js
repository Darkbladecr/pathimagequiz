import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
const ScreenLoader = () => (
  <Dimmer active>
    <Loader size="massive" content="Loading" />
  </Dimmer>
);
export default ScreenLoader;

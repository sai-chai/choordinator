import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

import './index.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faInfoCircle);

ReactDOM.render(<App />, document.getElementById("root"));

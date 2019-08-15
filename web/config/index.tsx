
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ConfigPage } from './ConfigPage';

ReactDOM.render(<ConfigPage />, document.getElementById('root'), (... a) => {
    console.log(... a)
    return null;
})
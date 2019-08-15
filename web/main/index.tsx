
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MainPage } from './MainPage';

ReactDOM.render(<MainPage />, document.getElementById('root'), (... a) => {
    console.log(... a)
    return null;
})
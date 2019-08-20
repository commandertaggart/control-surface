import * as React from 'react'
import { AppMessage } from '../../common/AppMessage';

export interface IConfigPageProps {

}

export interface IConfigPageState {
}

export class ConfigPage extends React.Component<IConfigPageProps, IConfigPageState> {
    constructor(props: IConfigPageProps) {
        super(props)
    }

    public componentDidMount() {

    }

    public componentWillUnmount() {

    }

    public handleMessage(msg: AppMessage) {

    }
    
    public render() {
        return (<div id="config-page">
            <h1>Configuration</h1>
        </div>)
    }
}
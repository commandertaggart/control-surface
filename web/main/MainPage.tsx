import * as React from 'react'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'
import Settings from '@material-ui/icons/Settings'
import { CSSProperties } from '@material-ui/styles';

export interface IMainPageProps {

}

export interface IMainPageState {
    host: string;
    pages: string[];
    tabSelection: number;
}

export class MainPage extends React.Component<IMainPageProps, IMainPageState> {
    private _ws: WebSocket;

    constructor(props: IMainPageProps) {
        super(props)

        const host = window.location.hostname + ':' + window.location.port;
        const pageList = window.location.search.match(/pages=([^&]+)/i);
        const pages = pageList ? pageList[1].split(',') : [];

        this.state = {
            host,
            pages,
            tabSelection: 0
        }

        this.handleTabChange = this.handleTabChange.bind(this)
    }

    public componentDidMount() {
        this._ws = new WebSocket(`ws://${this.state.host}/connect`)

        this._ws.onopen = () => {
            // handle network init
            this._ws.send('Hello')
        }

        this._ws.onmessage = (msg) => {
            // handle incoming
            console.log(msg)
        }
    }

    public componentWillUnmount() {
        this._ws.close()
        this._ws = null
    }

    public render() {
        const { tabSelection, pages } = this.state;
        const pageStyle: CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            paddingTop: 40
        };
        return (<div id="main-page">
            <AppBar>
                <Tabs value={tabSelection} onChange={this.handleTabChange}>
                    <Tab label={<Settings />}></Tab>
                </Tabs>
            </AppBar>
            <iframe id="config" className="page" src="/config" style={pageStyle} />
            {pages.map(p => (<iframe id={p} className="page" src={`/pages/${p}`} />))}
        </div>)
    }

    private handleTabChange(_event, newTab) {
        this.setState({
            tabSelection: newTab
        })
    }
}
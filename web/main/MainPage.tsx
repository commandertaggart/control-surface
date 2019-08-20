import * as React from 'react'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'
import Settings from '@material-ui/icons/Settings'
import { CSSProperties } from '@material-ui/styles';
import { AppMessage } from '../common/AppMessage';

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

        window.addEventListener('message', (event: MessageEvent) => {
            if (event.data && 'path' in event.data && 'event' in event.data) {
                const data = event.data as AppMessage;
                if (data.path.indexOf('%pageid%') >= 0) {
                    const frames = document.querySelectorAll('iframe');
                    Array.prototype.some.call(frames as unknown as Array<HTMLIFrameElement>, (f) => {
                        if (f.contentWindow === event.source) {
                            data.path = data.path.replace('%pageid%', f.id);
                            return true;
                        }
                        return false;
                    })
                }
                this._ws.send(event.data);
            }
        })

        this._ws.onopen = () => {
            // handle network init
        }

        this._ws.onmessage = (msg) => {
            const data: AppMessage = msg.data as AppMessage;

            if (data && data.path) {
                if (data.path.startsWith('/pages/')) {
                    const page = data.path.split('/')[2];
                    const frame = document.querySelector(`iframe#${page}`) as HTMLIFrameElement;
                    frame.contentWindow.postMessage(data, '*');
                }
                else {
                    const frames = document.querySelectorAll(`iframe`);
                    for (let i = 0; i < frames.length; ++i) {
                        if (frames[i].id !== 'config') {
                            (frames[i] as HTMLIFrameElement).contentWindow.postMessage(data, '*')
                        }
                    }
                }
            }
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
import { DBPromise, ProgressTypes, PlayerTypes, reduxStore, fmp, isSnapshot, classifyRecords, isDev } from '@TimeCat/utils';
import { ContainerComponent } from './container';
import { Panel } from './panel';
import pako from 'pako';
import io from 'socket.io-client';
function getGZipData() {
    if (isDev) {
        ;
        window.pako = pako;
    }
    const data = window.__ReplayStrData__;
    if (!data) {
        return null;
    }
    const arrayData = data.split(',');
    const str = pako.ungzip(arrayData, {
        to: 'string'
    });
    const dataArray = JSON.parse(str);
    if (isDev) {
        ;
        window.data = dataArray;
    }
    return dataArray;
}
function dispatchEvent(type, data) {
    event = new CustomEvent(type, { detail: data });
    window.dispatchEvent(event);
}
async function getAsyncDataFromSocket(uri) {
    var socket = io(uri);
    return await new Promise(resolve => {
        let initialized = false;
        socket.on('record-data', (data) => {
            if (initialized) {
                dispatchEvent('record-data', data);
            }
            else {
                if (data && isSnapshot(data)) {
                    resolve([{ snapshot: data, records: [] }]);
                    fmp.observe();
                    initialized = true;
                }
            }
        });
    });
}
async function getDataFromDB() {
    const indexedDB = await DBPromise;
    const data = await indexedDB.getRecords();
    return classifyRecords(data);
}
async function getReplayData() {
    const { socketUrl } = window.__ReplayOptions__;
    const replayDataList = (socketUrl && (await getAsyncDataFromSocket(socketUrl))) ||
        getGZipData() ||
        (await getDataFromDB()) ||
        window.__ReplayDataList__;
    if (!replayDataList) {
        return null;
    }
    window.__ReplayDataList__ = replayDataList;
    window.__ReplayData__ = Object.assign({
        index: 0
    }, replayDataList[0]);
    return window.__ReplayData__;
}
export async function replay(options) {
    window.__ReplayOptions__ = options || {};
    const replayData = await getReplayData();
    if (!replayData) {
        return;
    }
    const { records } = replayData;
    const c = new ContainerComponent();
    fmp.ready(() => {
        new Panel(c);
        if (records.length) {
            const firstRecord = records[0];
            const replayList = window.__ReplayDataList__;
            const startTime = firstRecord.time;
            const endTime = replayList
                .map(r => r.records)
                .reduce((acc, records) => {
                return acc + (+records.slice(-1)[0].time - +records[0].time);
            }, 0) + +startTime;
            reduxStore.dispatch({
                type: ProgressTypes.INFO,
                data: {
                    frame: 0,
                    curTime: startTime,
                    startTime,
                    endTime,
                    length: records.length
                }
            });
            reduxStore.dispatch({
                type: PlayerTypes.SPEED,
                data: { speed: 1 }
            });
        }
    });
    if (!records.length) {
        const panel = document.querySelector('#cat-panel');
        if (panel) {
            panel.setAttribute('style', 'display: none');
        }
    }
}

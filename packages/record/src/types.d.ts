import { VNode, VSNode } from "../../virtual-dom/src";
export declare enum RecordType {
    'WINDOW' = "WINDOW",
    'SCROLL' = "SCROLL",
    'MOUSE' = "MOUSE",
    'DOM_UPDATE' = "DOM_UPDATE",
    'FORM_EL_UPDATE' = "FORM_EL_UPDATE"
}
export declare enum FormElementEvent {
    'PROP' = "PROP",
    'INPUT' = "INPUT",
    'CHANGE' = "CHANGE",
    'FOCUS' = "FOCUS",
    'BLUR' = "BLUR"
}
export declare enum MouseEventType {
    'MOVE' = "MOVE",
    'CLICK' = "click"
}
export interface WindowWatcher {
    type: RecordType.WINDOW;
    data: WindowWatcherData;
    time: string;
}
export interface WindowWatcherData {
    id: number;
    width: number;
    height: number;
}
export interface ScrollWatcher {
    type: RecordType.SCROLL;
    data: ScrollWatcherData;
    time: string;
}
export interface ScrollWatcherData {
    id: number;
    top: number;
    left: number;
}
export interface MouseRecord {
    type: RecordType.MOUSE;
    data: MouseRecordData;
    time: string;
}
export interface MouseRecordData {
    type: MouseEventType;
    x: number;
    y: number;
    id?: number;
}
export interface DOMWatcher {
    type: RecordType.DOM_UPDATE;
    data: DOMWatcherData;
    time: string;
}
export interface DOMWatcherData extends DOMUpdateDataType {
}
export interface AttributesUpdateData {
    id: number;
    value: string | boolean;
    key: string;
}
export interface CharacterDataUpdateData {
    parentId: number;
    value: string;
    id: number;
}
export interface UpdateNodeData {
    parentId: number;
    nextId: number | null;
    node: VSNode | VNode | number;
}
export interface movedNodesData {
    parentId: number;
    id: number;
    nextId: number | null;
}
export interface RemoveUpdateData {
    parentId: number;
    id: number;
}
export interface DOMUpdateDataType {
    addedNodes: UpdateNodeData[];
    movedNodes: movedNodesData[];
    removedNodes: RemoveUpdateData[];
    attrs: AttributesUpdateData[];
    texts: CharacterDataUpdateData[];
}
export interface FormElementWatcher {
    type: RecordType.FORM_EL_UPDATE;
    data: FormElementWatcherData;
    time: string;
}
export interface FormElementWatcherData {
    type: FormElementEvent;
    id: number;
    key?: string;
    value?: string;
}
export declare type RecordEvent<T> = (e: T) => void;
export declare type RecordData = FormElementWatcher | DOMWatcher | MouseRecord | WindowWatcher | ScrollWatcher;

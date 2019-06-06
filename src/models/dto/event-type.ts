export enum MapEventType {
    Click,
    ZoomChanged
}

export enum MarkerEventType {
    Click,
    AfterDrag,
    MouseOver,
    MouseOut
}

export enum CircleEventType {
    Click,
    CenterChanged,
    RadiusChanged
}

export enum PolygonEventType {
    InsertAt,
    Move,
    Click
}

export enum PolylineEventType {
    Move,
    InsertAt,
    RemoveAt
}

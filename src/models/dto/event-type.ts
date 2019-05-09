export enum MapEventType {
    Click,
    ZoomChanged
}

export enum MarkerEventType {
    Click,
    AfterDrag,
    MouseOver
}

export enum CircleEventType {
    Click,
    CenterChanged,
    RadiusChanged
}

export enum PolygonEventType {
    InsertAt,
    Move
}

export enum PolylineEventType {
    Move,
    InsertAt,
    RemoveAt
}
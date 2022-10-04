export enum MapEventType {
    Click,
    ZoomChanged
}

export enum MarkerEventType {
    Click,
    AfterDrag,
    MouseOver,
    MouseOut,
    BeforeDrag
}

export enum CircleEventType {
    Click,
    CenterChanged,
    RadiusChanged
}

export enum PolygonEventType {
    SetAt,
    InsertAt,
    RemoveAt,
    DragPolygon,
    Click
}

export enum PolylineEventType {
    SetAt,
    InsertAt,
    RemoveAt,
    DragPolyline
}

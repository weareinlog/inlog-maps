const googleMapsLibParams = {
    libraries: ["drawing", "places"],
    apiKey: "",
    options: {
        mapTypeControl: false,
        zoomControl: false,
    },
    showTraffic: false,
};

const leafletLibParams = {
    scriptsDependencies: [
        "../node_modules/leaflet-editable/src/Leaflet.Editable.js",
        "../node_modules/leaflet.path.drag/src/Path.Drag.js",
        "../node_modules/leaflet-gesture-handling/dist/leaflet-gesture-handling.js",
        "../node_modules/leaflet.markercluster/dist/leaflet.markercluster.js",
        "../node_modules/leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js",
        "../node_modules/leaflet.heat/dist/leaflet-heat.js",
    ],
    cssDependencies: [
        "../node_modules/leaflet-gesture-handling/dist/leaflet-gesture-handling.css",
        "../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css",
    ],
    wikimedia: false,
    gestureHandling: true,
};

const inlogMaps = window.InlogMaps;
const currentMap = new inlogMaps.Map();

//const mapType = inlogMaps.MapType.Leaflet;
//const mapParams = leafletLibParams;

const mapType = inlogMaps.MapType.Google;
const mapParams = googleMapsLibParams;

currentMap.initialize(mapType, mapParams)
    .then(() => console.log("map initialized!"));

let simpleMarkerShow = null;
let customMarkerShow = null;
let circleMarkerShow = null;
let polygonShow = null;
let polylineShow = null;
let circleShow = null;
let drawing = false;
let zoomChanged = false;
let isPolygonEditable = false;
let heatmapShow = null;

/* GEOJson */
function onClick(event) {
    console.log(event);
}

function geojsonMarker() {
    let marker = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [-49.2806026, -25.4327193],
        },
    };

    currentMap.loadGEOJson(
        marker,
        {
            draggable: true,
            editable: true,
        },
        onClick
    );
}

function geojsonPolyline() {
    let polylines = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    id: 1,
                },
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [-43.48283, -23.02487],
                        [-43.48391, -23.02475],
                        [-43.48233, -23.02486],
                        [-43.48212, -23.02443],
                        [-43.48243, -23.02429],
                        [-43.48245, -23.02477],
                    ],
                },
            },
            {
                type: "Feature",
                properties: {
                    id: 2,
                },
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [-46.65953, -23.55865],
                        [-46.65953, -23.5579],
                        [-46.65972, -23.55809],
                        [-46.65941, -23.55878],
                        [-46.65953, -23.55896],
                        [-46.65903, -23.55888],
                    ],
                },
            },
        ],
    };

    currentMap.loadGEOJson(
        polylines,
        {
            draggable: true,
            editable: true,
        },
        onClick
    );
}

function screenshot() {
    console.log(currentMap);
    const image = currentMap.takeMapScreenshot().then((el) => {
        console.log("EL", el);
    });
    console.log("image", image);
}

function geojsonPolygon() {
    let polygon = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [
                [
                    [-67.13734351262877, 45.137451890638886],
                    [-66.96466, 44.8097],
                    [-68.03252, 44.3252],
                    [-69.06, 43.98],
                    [-70.11617, 43.68405],
                    [-70.64573401557249, 43.090083319667144],
                    [-70.75102474636725, 43.08003225358635],
                    [-70.79761105007827, 43.21973948828747],
                    [-70.98176001655037, 43.36789581966826],
                    [-70.94416541205806, 43.46633942318431],
                    [-71.08482, 45.3052400000002],
                    [-70.6600225491012, 45.46022288673396],
                    [-70.30495378282376, 45.914794623389355],
                    [-70.00014034695016, 46.69317088478567],
                    [-69.23708614772835, 47.44777598732787],
                    [-68.90478084987546, 47.184794623394396],
                    [-68.23430497910454, 47.35462921812177],
                    [-67.79035274928509, 47.066248887716995],
                    [-67.79141211614706, 45.702585354182816],
                    [-67.13734351262877, 45.137451890638886],
                ],
            ],
        },
    };

    currentMap.loadGEOJson(
        polygon,
        {
            draggable: true,
            editable: true,
        },
        onClick
    );
}

function geojsonHeatmap() {
    // Criar dados de heatmap a partir de um GeoJSON simulado de pontos de interesse
    const geojsonData = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: { intensity: 0.8, name: "Centro SP" },
                geometry: { type: "Point", coordinates: [-46.633309, -23.550520] }
            },
            {
                type: "Feature",
                properties: { intensity: 0.9, name: "Paulista" },
                geometry: { type: "Point", coordinates: [-46.656139, -23.564608] }
            },
            {
                type: "Feature",
                properties: { intensity: 0.7, name: "Vila Madalena" },
                geometry: { type: "Point", coordinates: [-46.691847, -23.546310] }
            },
            {
                type: "Feature",
                properties: { intensity: 0.6, name: "Itaim Bibi" },
                geometry: { type: "Point", coordinates: [-46.677094, -23.591057] }
            },
            {
                type: "Feature",
                properties: { intensity: 0.8, name: "Copacabana" },
                geometry: { type: "Point", coordinates: [-43.177280, -22.967140] }
            },
            {
                type: "Feature",
                properties: { intensity: 0.7, name: "Ipanema" },
                geometry: { type: "Point", coordinates: [-43.204710, -22.984290] }
            }
        ]
    };

    // Converter GeoJSON para formato de heatmap
    const heatmapData = geojsonData.features.map(feature => {
        const coords = feature.geometry.coordinates;
        const intensity = feature.properties.intensity || 0.5;
        return [coords[1], coords[0], intensity]; // [lat, lng, intensity]
    });

    let options = new inlogMaps.HeatMapOptions(
        heatmapData,
        true,  // addToMap
        35,    // radius
        1.0,   // maxIntensity
        0.2,   // minOpacity
        0.8,   // opacity
        {      // gradient baseado em POIs
            0.0: '#4CAF50',  // verde
            0.4: '#FFEB3B',  // amarelo
            0.7: '#FF9800',  // laranja
            1.0: '#F44336'   // vermelho
        },
        25,    // blur
        15,    // maxZoom
        false, // dissipating
        false, // scaleRadius
        false, // useLocalExtrema
        true,  // fitBounds
        { type: 'geojson-based', geojson: geojsonData }
    );

    currentMap.drawHeatMap("geojsonHeatmap", options);
}

/* Marker tests */
function onClickMarker(event) {
    let options = new inlogMaps.PopupOptions(
        event.latlng,
        "<p>Hello world!<br />This is a nice popup.</p>",
        "simple"
    );
    currentMap.drawPopup("marker", options);
}

function addMarker() {
    if (simpleMarkerShow === null) {
        let options = new inlogMaps.MarkerOptions(
            [-25.4327193, -49.2806026],
            true,
            true,
            null,
            true
        );
        currentMap.drawMarker("simple", options, onClickMarker);
        currentMap.addMarkerEvent(
            "simple",
            inlogMaps.MarkerEventType.MouseOver,
            onMouseOver
        );
        currentMap.addMarkerEvent(
            "simple",
            inlogMaps.MarkerEventType.RightClick,
            onRightClick
        );
        simpleMarkerShow = true;
    } else {
        simpleMarkerShow = !simpleMarkerShow;
        currentMap.toggleMarkers(simpleMarkerShow, "simple");
    }
}

function onMouseOver(event) {
    console.log(event);
}

function onRightClick(event) {
    console.log(event);
}

function setCenterOnMarker() {
    if (simpleMarkerShow) {
        currentMap.setCenterMarker("simple");
    } else alert("wait");
}

function changeMarkerPosition() {
    if (simpleMarkerShow === null) {
        alert("The marker was not created yet");
    } else {
        currentMap.alterMarkerPosition("simple", [-25.4328, -49.28059], true);
    }
}

function onClickMarkerCustom(event, object) {
    let content = `
                <div class="infowindow-default">
                    <h3 class="title">
                        <span>Item</span>
                    </h3>
                    <div class="section">
                        <div class="infowindow-table">
                            <div><strong>Valor 1:</strong><span> ${object.valor1 || ""
        }</span> </div>
                            <div><strong>Valor 2:</strong><span> ${object.valor2 || ""
        }</span></div>
                            <div><strong>Valor 3:</strong><span> ${object.valor3 || ""
        }</span></div>
                            <div><strong>Valor 4:</strong><span> ${object.valor4
        }</span></div>
                            <div><strong>Valor 5:</strong><span> ${object.valor5
        }</span></div>
                        </div>
                    </div>
                </div>`;

    let options = new inlogMaps.PopupOptions(event.latlng, content, "custom");
    currentMap.drawPopup("markerCustom", options);
}

function addMarkerCustom() {
    if (customMarkerShow === null) {
        let item = {
            valor1: "Um valor",
            valor2: "Dois valores",
            valor3: "Três valores",
            valor4: "Quatro valores",
            valor5: "Cinco valores",
        };

        let icon = new inlogMaps.MarkerIcon("images/cursor_locate.png");
        let options = new inlogMaps.MarkerOptions(
            [-26, -50],
            true,
            false,
            icon,
            true,
            item
        );

        currentMap.drawMarker("custom", options, onClickMarkerCustom);
        customMarkerShow = true;
    } else {
        customMarkerShow = !customMarkerShow;
        currentMap.toggleMarkers(customMarkerShow, "custom");
    }
}

function changeCustomMarkerImage() {
    if (customMarkerShow === null) {
        alert("The custom marker was not created yet");
    } else {
        let icon = new inlogMaps.MarkerIcon("images/inicio_rota.png");
        let options = new inlogMaps.MarkerAlterOptions(null, icon);

        currentMap.alterMarkerOptions("custom", options);
    }
}

function onClickCircleMarker(event) {
    let options = new inlogMaps.PopupOptions(
        event.latlng,
        "<p>Hello world!<br />This is a nice popup.</p>",
        "circleMarker"
    );
    currentMap.drawPopup("circleMarker", options);
}

function addCircleMarker() {
    if (circleMarkerShow === null) {

        let style = new inlogMaps.CircleMarkerStyle(5, 1, "#000000", "#FF0000", 0.8);
        if (mapType === inlogMaps.MapType.Leaflet) {
            style.label = {
                text: '1',
                permanent: true,
                direction: 'top',
                open: true
            }
        } else {
            style.labelOrigin = [0, -5];
            style.label = {
                text: '2',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 'bold'
            }
        }

        let options = new inlogMaps.CircleMarkerOptions([-24, -48], style, true, true);

        currentMap.drawCircleMarker("circleMarker", options, onClickCircleMarker);
        circleMarkerShow = true;
    } else {
        circleMarkerShow = !circleMarkerShow;
        currentMap.toggleMarkers(circleMarkerShow, "circleMarker");
    }
}

function changeCircleMarkerColor() {
    if (circleMarkerShow === null) {
        alert("The circle marker was not created yet!");
    } else {
        let style = new inlogMaps.CircleMarkerStyle();

        style.fillColor = "#FFFF00";
        let options = new inlogMaps.MarkerAlterOptions();

        options.style = style;
        currentMap.alterMarkerOptions("circleMarker", options);
    }
}

function addMarkerClusterer() {
    const path = [
        [-23.026949270121056, -43.48603893506065],
        [-23.024657518124023, -43.48285071469786],
        [-23.02484265813435, -43.48359100438597],
        [-23.025441015571875, -43.48343945957663],
        [-23.02518922621311, -43.48251677967551],
        [-23.02535214879308, -43.482527508511566],
        [-23.025524945253615, -43.48268307663443],
        [-23.025618748953754, -43.483053221478485],
        [-23.025692804460373, -43.48372377373221],
        [-23.025762332433345, -43.484101627160385],
        [-23.025828982320164, -43.484316203881576],
        [-23.025944178594504, -43.484607520870725],
        [-23.025988611796098, -43.48474163132147],
        [-23.026284415679036, -43.485281467437744],
        [-23.026438676263012, -43.485623602168175],
        [-23.025967191451137, -43.48567456413946],
        [-23.025775881698536, -43.48496646095953],
        [-23.025542347567463, -43.48405234610573],
        [-23.02516960068853, -43.484262899513396],
        [-23.024949270121056, -43.48403893506065],
    ];

    currentMap.addMarkerClusterer(
        "marker",
        new inlogMaps.MarkerClustererConfig(true, 13, 30)
    );
    path.forEach((p) => {
        let options = new inlogMaps.MarkerOptions(p, true, true, null, true);
        options.addClusterer = true;
        currentMap.drawMarker("marker", options);
    });
}

function onZoomChanged() {
    console.log(currentMap.getZoom());
}

function toogleOnZoomChanged() {
    if (zoomChanged) {
        currentMap.removeEventMap(inlogMaps.MapEventType.ZoomChanged);
        zoomChanged = false;
    } else {
        currentMap.addEventMap(
            inlogMaps.MapEventType.ZoomChanged,
            onZoomChanged
        );
        zoomChanged = true;
    }
}

/* Polyline tests */
function onClickPolyline(event, object) {
    let options = new inlogMaps.PopupOptions(
        event.latlng,
        `<p>${object.item}.</p>`
    );

    const checkIdx = currentMap.checkIdx("polyline", event.latlng, (object) => {
        return object?.uuid === 1;
    });
    console.log("checkIdx", checkIdx);
    currentMap.drawPopup("polyline", options);
}

function addPolyline() {
    if (polylineShow === null) {
        [1].forEach((el) => {
            let options = new inlogMaps.PolylineOptions();

            options.path = [
                [-23.02487, -43.48283],
                [-23.02475, -43.48391],
                [-23.02486, -43.48233],
                [-23.02443, -43.48212],
                [-23.02429, -43.48243],
                [-23.02477, -43.48245],
            ];
            options.addToMap = true;
            options.fitBounds = true;
            options.draggable = true;
            options.editable = true;
            options.object = {
                item: "New",
                uuid: el,
                color: "#009ACA",
            };
            options.style = inlogMaps.PolylineType.Arrow;
            currentMap.drawPolyline("polyline", options, onClickPolyline);

            currentMap.addPolylineEvent(
                "polyline",
                inlogMaps.PolylineEventType.SetAt,
                () => {
                    debugger;
                }
            );
            currentMap.addPolylineEvent(
                "polyline",
                inlogMaps.PolylineEventType.InsertAt,
                () => {
                    debugger;
                }
            );
            currentMap.addPolylineEvent(
                "polyline",
                inlogMaps.PolylineEventType.RemoveAt,
                () => {
                    debugger;
                }
            );
            currentMap.addPolylineEvent(
                "polyline",
                inlogMaps.PolylineEventType.DragPolyline,
                () => {
                    debugger;
                }
            );
            currentMap.addPolylineEvent(
                "polyline",
                inlogMaps.PolylineEventType.RightClick,
                () => onRightClick
            );
        });

        polylineShow = true;
    } else {
        polylineShow = !polylineShow;
        currentMap.togglePolylines(polylineShow, "polyline");
    }
}

function addMouseEvent() {
    currentMap.addPolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.MouseOver,
        onMouseOver
    );
    currentMap.addPolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.MouseOut,
        onMouseOver
    );
    currentMap.addPolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.RightClick,
        onRightClick
    );
}

function removeMouseEvent() {
    currentMap.removePolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.MouseOut
    );
    currentMap.removePolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.MouseOver
    );
    currentMap.removePolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.RightClick
    );
}

function addPolylineWithNavigation() {
    let options = new inlogMaps.PolylineOptions();

    options.path = [
        [-23.024657518124023, -43.48285071469786],
        [-23.02484265813435, -43.48359100438597],
        [-23.025441015571875, -43.48343945957663],
        [-23.02518922621311, -43.48251677967551],
        [-23.02535214879308, -43.482527508511566],
        [-23.025524945253615, -43.48268307663443],
        [-23.025618748953754, -43.483053221478485],
        [-23.025692804460373, -43.48372377373221],
        [-23.025762332433345, -43.484101627160385],
        [-23.025828982320164, -43.484316203881576],
        [-23.025944178594504, -43.484607520870725],
        [-23.025988611796098, -43.48474163132147],
        [-23.026284415679036, -43.485281467437744],
        [-23.026438676263012, -43.485623602168175],
        [-23.025967191451137, -43.48567456413946],
        [-23.025775881698536, -43.48496646095953],
        [-23.025542347567463, -43.48405234610573],
        [-23.02516960068853, -43.484262899513396],
        [-23.024949270121056, -43.48403893506065],
    ];
    options.infowindows = [
        "<h1>1</h1>",
        "<h1>2</h1>",
        "<h1>3</h1>",
        "<h1>4</h1>",
        "<h1>5</h1>",
        "<h1>6</h1>",
        "<h1>7</h1>",
        "<h1>8</h1>",
        "<h1>9</h1>",
        "<h1>10</h1>",
        "<h1>11</h1>",
        "<h1>12</h1>",
        "<h1>13</h1>",
        "<h1>14</h1>",
        "<h1>15</h1>",
        "<h1>16</h1>",
        "<h1>17</h1>",
        "<h1>18</h1>",
        "<h1>19</h1>",
    ];
    options.addToMap = true;
    options.weight = 8;
    options.fitBounds = true;
    options.navigateOptions = new inlogMaps.NavigationOptions("#0000FF");
    options.navigateOptions.navigateByPoint = false;
    options.navigateOptions.navegateOnKeyPress = true;
    currentMap.drawPolylineWithNavigation("polylineNavigation", options);
}

function removePolylineHighlight() {
    currentMap.removePolylineHighlight();
}

function AddEventPolyline(uuid, event) {
    currentMap?.addPolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.InsertAt,
        event
    );
    currentMap?.addPolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.RemoveAt,
        event
    );
    currentMap?.addPolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.SetAt,
        event,
        (object) => object?.uuid === uuid
    );
    currentMap?.addPolylineEvent(
        "polyline",
        inlogMaps.PolylineEventType.DragPolyline,
        event
    );
}

function updatePolyline(event) {
    // TODO: Criando polylines de 2 formas.
    currentMap.addPolylinePath("polyline", event.latlng);

    // const options = new inlogMaps.PolylineOptions([event.latlng]);
    // options.color = "#009ACA";
    // options.weight = 5;
    // options.editable = true;
    // options.addToMap = true;
    // options.fitBounds = false;
    // options.draggable = true;
    // options.object = {};

    // currentMap?.drawPolyline("polyline", options, event);
    // AddEventPolyline(5, () => {
    //     debugger;
    // });
}

function drawPolyline() {
    if (!polylineShow) {
        alert("The polyline is not on the currentMap!");
    } else {
        if (drawing) {
            currentMap.removeEventMap(inlogMaps.MapEventType.Click);
            drawing = false;
        } else {
            currentMap.addEventMap(
                inlogMaps.MapEventType.Click,
                updatePolyline
            );
            drawing = true;
        }
    }
}

function changePolyline() {
    let options = new inlogMaps.PolylineOptions();
    options.addToMap = true;
    options.fitBounds = true;
    options.color = "#00FF00";
    options.weight = 12;
    options.object = {
        item: "Edited",
    };

    currentMap.alterPolylineOptions(
        "polyline",
        options,
        (object) => object.uuid === 2
    );
}

/* Polygon tests */
function onClickPolygon(event) {
    let options = new inlogMaps.PopupOptions(
        event.latlng,
        "<p>Hello world!<br />This is a nice popup.</p>"
    );

    currentMap.drawPopup("polygon", options);
}

function addPolygon() {
    if (polygonShow === null) {
        let path = [
            [25.774, -80.19],
            [18.466, -66.118],
            [32.321, -64.757],
            [25.774, -80.19],
        ];

        let path2 = [
            [
                [
                    [-23.5549420828776, -46.6060495718164],
                    [-23.5549484995503, -46.606048627915],
                    [-23.554949893551, -46.6060484778692],
                    [-23.554954957755196, -46.6060481738201],
                    [-23.5549577606633, -46.6060480601735],
                    [-23.556191508497804, -46.6060064151313],
                    [-23.5575990852915, -46.605958967969094],
                    [-23.558029721689497, -46.605741967196394],
                    [-23.558023865925698, -46.605325804824595],
                    [-23.557854898608, -46.60532326739099],
                    [-23.5578538094402, -46.605323254776],
                    [-23.5578529082925, -46.60532323543],
                    [-23.557670898235802, -46.6053212665799],
                    [-23.5576699944314, -46.6053212402796],
                    [-23.5576628013465, -46.6053208592323],
                    [-23.5576552192352, -46.6053197760823],
                    [-23.5576475289949, -46.605317926657996],
                    [-23.5576400166092, -46.6053153572021],
                    [-23.5576327392519, -46.6053120872697],
                    [-23.557625752308, -46.605308141746995],
                    [-23.5576191089523, -46.6053035506621],
                    [-23.5576128597448, -46.605298348955905],
                    [-23.5576070522458, -46.6052925762166],
                    [-23.557601730653502, -46.6052862763781],
                    [-23.5575969354686, -46.6052794973862],
                    [-23.557592703185197, -46.6052722908328],
                    [-23.5575890660134, -46.605264711564104],
                    [-23.557586051634402, -46.605256817263104],
                    [-23.557583682989303, -46.6052486680099],
                    [-23.557581978105002, -46.6052403258252],
                    [-23.5575809499564, -46.605231854197804],
                    [-23.5575806063686, -46.605223317601904],
                    [-23.5575806388877, -46.605222159939004],
                    [-23.557580821569598, -46.6052147796059],
                    [-23.5575808064563, -46.605204681816105],
                    [-23.5575808360602, -46.6052035239558],
                    [-23.5575811632634, -46.605196145742],
                    [-23.5575812124731, -46.6051955695991],
                    [-23.5575821813517, -46.6051876736273],
                    [-23.5575838862361, -46.60517933144251],
                    [-23.5575862548811, -46.6051711821893],
                    [-23.557589269260202, -46.6051632878882],
                    [-23.557592906431896, -46.6051557086196],
                    [-23.5575971387153, -46.6051485020662],
                    [-23.557601933900298, -46.605141723074205],
                    [-23.5576072554925, -46.6051354232358],
                    [-23.5576130629916, -46.605129650496295],
                    [-23.557619312198998, -46.6051244487902],
                    [-23.5576259555547, -46.6051198577052],
                    [-23.5576329424986, -46.605115912182704],
                    [-23.5576402198558, -46.605112642250305],
                    [-23.5576477322417, -46.605110072794396],
                    [-23.557655422482004, -46.60510822337],
                    [-23.5576632320497, -46.6051071080528],
                    [-23.5576711015091, -46.6051067353309],
                    [-23.5576720052208, -46.605106764983],
                    [-23.557678973132496, -46.6051069035515],
                    [-23.5577568116408, -46.6051076621816],
                    [-23.557758385874898, -46.60498887687189],
                    [-23.5577584234991, -46.604987474020405],
                    [-23.557758746019502, -46.6049803409191],
                    [-23.5577588063281, -46.6049796428928],
                    [-23.5577597623842, -46.604971868689],
                    [-23.557761467268598, -46.6049635264931],
                    [-23.5577638359136, -46.604955377228904],
                    [-23.557766850292502, -46.604947482917204],
                    [-23.5577704874641, -46.604939903638304],
                    [-23.557774719747503, -46.604932697075306],
                    [-23.5577795149323, -46.6049259180742],
                    [-23.5577848365244, -46.6049196182273],
                    [-23.5577906440234, -46.604913845480205],
                    [-23.5577968932308, -46.604908643766805],
                    [-23.557803536586302, -46.6049040526758],
                    [-23.557810523529998, -46.6049001071479],
                    [-23.557817800886998, -46.60489683721109],
                    [-23.557825313272698, -46.6048942677518],
                    [-23.557833003512897, -46.604892418325],
                    [-23.557840813080404, -46.6048913030062],
                    [-23.5578486825397, -46.604890930283794],
                    [-23.557849781673298, -46.604890966662],
                    [-23.5578565541636, -46.6048911191116],
                    [-23.5578673183392, -46.6048911730468],
                    [-23.557868417743602, -46.604891206332496],
                    [-23.557875187110298, -46.6048915605751],
                    [-23.557875734010103, -46.604891615605105],
                    [-23.5578829973197, -46.604892664702696],
                    [-23.5578906875622, -46.6048945141192],
                    [-23.5578981999507, -46.6048970835694],
                    [-23.5579054773116, -46.6049003534984],
                    [-23.557912464259598, -46.6049042990202],
                    [-23.557919107619902, -46.604908890107005],
                    [-23.5579253568324, -46.6049140918179],
                    [-23.557931164336598, -46.60491986456469],
                    [-23.5579364859339, -46.604926164413605],
                    [-23.557941281123902, -46.604932943418795],
                    [-23.5579455134119, -46.6049401499877],
                    [-23.5579491505879, -46.60494772927429],
                    [-23.557952164970597, -46.6049556235953],
                    [-23.557954533618698, -46.60496377287019],
                    [-23.557956238505202, -46.6049721150779],
                    [-23.557957266655002, -46.604980586729106],
                    [-23.557957610243303, -46.6049891233492],
                    [-23.557957570429398, -46.6049905264597],
                    [-23.557957396379404, -46.6049976616844],
                    [-23.5579560184728, -46.605110238056305],
                    [-23.5580216097053, -46.605111220610496],
                    [-23.5580190553982, -46.6047536407327],
                    [-23.556197975292697, -46.6044843448956],
                    [-23.555135869867204, -46.60433983965039],
                    [-23.5551325175168, -46.6043393641449],
                    [-23.5551280649254, -46.604338690328],
                    [-23.5551203746826, -46.604336840939],
                    [-23.5551128622944, -46.6043342715321],
                    [-23.5551055849347, -46.6043310016623],
                    [-23.5550985979885, -46.6043270562151],
                    [-23.5550919546308, -46.6043224652182],
                    [-23.555085705421302, -46.6043172636114],
                    [-23.5550798979202, -46.6043114909824],
                    [-23.555074576326298, -46.6043051912644],
                    [-23.5550697811396, -46.604298412402],
                    [-23.555065548854998, -46.6042912059864],
                    [-23.5550619116819, -46.6042836268627],
                    [-23.555058897302096, -46.6042757327127],
                    [-23.5550565286562, -46.604267583615204],
                    [-23.5550548237713, -46.6042592415901],
                    [-23.555053795622502, -46.6042507701247],
                    [-23.5550534520345, -46.6042422336921],
                    [-23.555053795622502, -46.6042336972595],
                    [-23.5550548237713, -46.604225225794096],
                    [-23.5550565286562, -46.604216883768906],
                    [-23.555058897302096, -46.6042087346715],
                    [-23.5550619116819, -46.6042008405215],
                    [-23.555065548854998, -46.6041932613977],
                    [-23.5550667751232, -46.6041911734003],
                    [-23.555087260127298, -46.6039052657749],
                    [-23.5550876552041, -46.6039009760614],
                    [-23.5551660569969, -46.603204918897205],
                    [-23.555164693717202, -46.6032002286614],
                    [-23.5551629888323, -46.603191886629496],
                    [-23.555161960683403, -46.6031834151572],
                    [-23.5551616170956, -46.6031748787176],
                    [-23.555161960683403, -46.603166342278],
                    [-23.5551629888323, -46.6031578708058],
                    [-23.555164693717202, -46.603149528773706],
                    [-23.5551670623631, -46.6031413796697],
                    [-23.555170076743, -46.603133485513105],
                    [-23.555173713915803, -46.6031259063832],
                    [-23.5551779462006, -46.603118699961804],
                    [-23.5551827413869, -46.6031119210938],
                    [-23.555188062981003, -46.6031056213706],
                    [-23.5551938704819, -46.603099848737],
                    [-23.555200119691204, -46.6030946471259],
                    [-23.555206763048897, -46.603090056125104],
                    [-23.555213749994902, -46.6030861106748],
                    [-23.555221027354502, -46.6030828408021],
                    [-23.555228539742604, -46.6030802713933],
                    [-23.555236229985397, -46.6030784220028],
                    [-23.555244039555504, -46.6030773067059],
                    [-23.5552519090174, -46.6030769339908],
                    [-23.5552597784798, -46.6030773066944],
                    [-23.5552675880513, -46.6030784219799],
                    [-23.5552690113212, -46.603078743820596],
                    [-23.5552753036, -46.603080150497],
                    [-23.5556721356564, -46.6031631049955],
                    [-23.5561072621769, -46.6032259728743],
                    [-23.5561131529039, -46.6032266773482],
                    [-23.556117013233898, -46.6032272858662],
                    [-23.5569675419484, -46.603347003798405],
                    [-23.556972910890103, -46.603347657886594],
                    [-23.5569738067439, -46.6033477755596],
                    [-23.5569770289142, -46.6033482979472],
                    [-23.557958247836297, -46.6034941509985],
                    [-23.557962619103897, -46.6034947981295],
                    [-23.5579660488113, -46.6034953241273],
                    [-23.5579687494296, -46.603496023008205],
                    [-23.5579737209416, -46.6034972481565],
                    [-23.5579749521908, -46.603497589548],
                    [-23.557976401449903, -46.60349801852651],
                    [-23.557977613481903, -46.603498418164],
                    [-23.557981275863, -46.603499671777904],
                    [-23.557983922428498, -46.6035005631766],
                    [-23.5579896421982, -46.603503102468906],
                    [-23.5579912034814, -46.603503825435595],
                    [-23.5581439716865, -46.603577461044395],
                    [-23.5581496436657, -46.603580099575],
                    [-23.5581511793877, -46.603580870257396],
                    [-23.558158186920203, -46.603584778482904],
                    [-23.5581648302802, -46.6035893695782],
                    [-23.558171079492396, -46.60359457129879],
                    [-23.5581768869964, -46.6036003440565],
                    [-23.5581822085937, -46.603606643917004],
                    [-23.5581869904711, -46.6036134322763],
                    [-23.558187389426298, -46.603614051597006],
                    [-23.558191375009397, -46.6036205328263],
                    [-23.558192282171, -46.6036217337266],
                    [-23.558192666134296, -46.6036223634371],
                    [-23.5581965132932, -46.6036289410496],
                    [-23.558200150469098, -46.603636520350506],
                    [-23.558203164851598, -46.60364441468651],
                    [-23.558205533499603, -46.603652563976794],
                    [-23.5582072383861, -46.6036609062004],
                    [-23.558208237076798, -46.6036691327137],
                    [-23.558208588318404, -46.603676941181604],
                    [-23.558208612354896, -46.6036779144835],
                    [-23.5582173192786, -46.6046511535446],
                    [-23.5582175932614, -46.6046591155389],
                    [-23.558217610317303, -46.6046599242611],
                    [-23.5582215879757, -46.6052183756529],
                    [-23.5582216010006, -46.6052191748526],
                    [-23.5582216117305, -46.6052199226475],
                    [-23.558227588650798, -46.6056443463348],
                    [-23.559051911563202, -46.605242130901196],
                    [-23.559052978237702, -46.605241572032],
                    [-23.5590540435437, -46.6052410499281],
                    [-23.559886693204398, -46.6048026644351],
                    [-23.559431457427703, -46.603634790016606],
                    [-23.5594301995059, -46.6036315091072],
                    [-23.5594284711465, -46.6036268846552],
                    [-23.559426102502, -46.6036187352884],
                    [-23.559424397618002, -46.6036103929873],
                    [-23.559423369469798, -46.603601921241896],
                    [-23.5594230258821, -46.603593384527],
                    [-23.559423369469798, -46.6035848478122],
                    [-23.559424397618002, -46.603576376066705],
                    [-23.559426102502, -46.603568033765704],
                    [-23.5594284711465, -46.6035598843989],
                    [-23.5594308980616, -46.603553460560995],
                    [-23.5594315041674, -46.6035519984035],
                    [-23.559433722157, -46.6035472344502],
                    [-23.559435100571402, -46.60354439971349],
                    [-23.559436791914397, -46.6035413183901],
                    [-23.559437499309997, -46.6035396292618],
                    [-23.5594398058694, -46.6035349080718],
                    [-23.5594411976162, -46.603532080006694],
                    [-23.559445429898503, -46.6035248733525],
                    [-23.559450225082397, -46.6035180942657],
                    [-23.559455546673398, -46.6035117943389],
                    [-23.559461354171198, -46.603506021518896],
                    [-23.5594676033771, -46.6035008197398],
                    [-23.5594742467311, -46.6034962285909],
                    [-23.5594812336733, -46.6034922830131],
                    [-23.5594885110289, -46.603489013034896],
                    [-23.5594959972493, -46.6034864511571],
                    [-23.559771094795803, -46.6034062964955],
                    [-23.560045638979002, -46.603306992658105],
                    [-23.5604347808992, -46.6031188334952],
                    [-23.5604361952804, -46.6031181767583],
                    [-23.560442061298897, -46.6031155697903],
                    [-23.5604495736819, -46.603113000280004],
                    [-23.5604572639195, -46.6031111508165],
                    [-23.5604650734844, -46.6031100354756],
                    [-23.5604729429409, -46.6031096627457],
                    [-23.560480812398197, -46.60311003546389],
                    [-23.5604886219644, -46.6031111507935],
                    [-23.5604960502602, -46.603112936793394],
                    [-23.5605028253216, -46.60311520531479],
                    [-23.5605038257651, -46.603115566659696],
                    [-23.560509020290002, -46.603117705383994],
                    [-23.560511221709, -46.6031184956499],
                    [-23.560515487482, -46.603120030900605],
                    [-23.560516488843202, -46.6031203892054],
                    [-23.5605237662017, -46.6031236591992],
                    [-23.560530753147404, -46.6031276047991],
                    [-23.5605373965054, -46.6031321959769],
                    [-23.5605436457157, -46.6031373977909],
                    [-23.560549453218, -46.6031431706522],
                    [-23.5605547748136, -46.6031494706258],
                    [-23.5605595700019, -46.6031562497652],
                    [-23.5605638022886, -46.603163456477105],
                    [-23.560567413210702, -46.603171048302706],
                    [-23.5605679310524, -46.603172259093995],
                    [-23.560570568256104, -46.6031788829525],
                    [-23.5610270484818, -46.6042796095718],
                    [-23.5620736224469, -46.6037603238033],
                    [-23.5620747019862, -46.6037597734749],
                    [-23.562075855549303, -46.6037592289533],
                    [-23.562080243194302, -46.6037572701337],
                    [-23.562436007085303, -46.603594738532905],
                    [-23.5619785904879, -46.6025193920678],
                    [-23.5619757280248, -46.602511852768295],
                    [-23.5619733593811, -46.602503703244295],
                    [-23.5619716544975, -46.6024953607825],
                    [-23.5619706263496, -46.6024868888737],
                    [-23.5619702827621, -46.60247835199421],
                    [-23.5619706263496, -46.602469815114894],
                    [-23.5619716544975, -46.6024613432061],
                    [-23.5619733593811, -46.602453000744305],
                    [-23.5619757280248, -46.6024448512203],
                    [-23.5619787424021, -46.602436956657],
                    [-23.561982379571702, -46.6024293771367],
                    [-23.5619866118528, -46.6024221703438],
                    [-23.561991407035, -46.6024153911266],
                    [-23.5619967286243, -46.602409091078904],
                    [-23.5620025361201, -46.6024033181476],
                    [-23.5620087853241, -46.602398116268695],
                    [-23.562015428675902, -46.6023935250313],
                    [-23.5620224156158, -46.60238957937771],
                    [-23.562029692969098, -46.6023863093367],
                    [-23.5620372053506, -46.6023837397953],
                    [-23.562044895586602, -46.6023818903096],
                    [-23.562052705149902, -46.60238077495531],
                    [-23.562060574604903, -46.602380402221],
                    [-23.5620684440604, -46.6023807749436],
                    [-23.562076253625, -46.60238189028671],
                    [-23.5620839438633, -46.6023837397618],
                    [-23.5620914562479, -46.6023863092936],
                    [-23.562098733604802, -46.602389579326406],
                    [-23.562105720549003, -46.6023935249734],
                    [-23.5621123639057, -46.602398116205805],
                    [-23.5621186131146, -46.602403318081805],
                    [-23.5621244206159, -46.6024090910119],
                    [-23.562129742210402, -46.602415391060696],
                    [-23.5621345373977, -46.602422170280896],
                    [-23.562138769683504, -46.6024293770787],
                    [-23.5621425587718, -46.60243731186969],
                    [-23.5626005719726, -46.603514060635504],
                    [-23.5636180270999, -46.6029859751338],
                    [-23.563624288048, -46.602982624039406],
                    [-23.5636251054673, -46.6029822079449],
                    [-23.5636323738944, -46.6029789187307],
                    [-23.5636398862744, -46.602976349158],
                    [-23.563647576508696, -46.6029744996499],
                    [-23.5636553860705, -46.602973384282],
                    [-23.5636632555238, -46.6029730115433],
                    [-23.5636711249777, -46.6029733842705],
                    [-23.563678934540697, -46.6029744996271],
                    [-23.563686624777496, -46.6029763491247],
                    [-23.5636941371604, -46.6029789186876],
                    [-23.5637014145159, -46.60298218876],
                    [-23.563708401458697, -46.6029861344548],
                    [-23.5637150448139, -46.602990725743],
                    [-23.563721294021697, -46.6029959276821],
                    [-23.563727101521604, -46.6030017006823],
                    [-23.563732423115, -46.6030080008075],
                    [-23.563737218301398, -46.60301478011],
                    [-23.5637414505864, -46.603021986995095],
                    [-23.563745057817002, -46.603029581141506],
                    [-23.563745685983896, -46.603031058196294],
                    [-23.5637482077126, -46.6030374183075],
                    [-23.564131071732398, -46.6039679907507],
                    [-23.5651810480277, -46.6034752214724],
                    [-23.5651820145727, -46.603474760825705],
                    [-23.5651871320517, -46.6034724609788],
                    [-23.5666264640637, -46.60278948201451],
                    [-23.566658250768103, -46.6027269019567],
                    [-23.566659111464404, -46.602725247859404],
                    [-23.5666633437429, -46.6027180408116],
                    [-23.566668138922303, -46.6027112613543],
                    [-23.566673460508298, -46.602704961083504],
                    [-23.5666792680007, -46.602699187948],
                    [-23.5666855172008, -46.6026939858849],
                    [-23.566692160548804, -46.602689394485004],
                    [-23.5666991474845, -46.602685448691496],
                    [-23.5667064248333, -46.6026821785348],
                    [-23.566713937210302, -46.602679608902605],
                    [-23.5667216274417, -46.6026777593514],
                    [-23.566729437000298, -46.602676643957594],
                    [-23.5667373064506, -46.60267627121009],
                    [-23.566745175901303, -46.602676643945905],
                    [-23.5667529854613, -46.6026777593285],
                    [-23.566760675694898, -46.6026796088691],
                    [-23.5667681880749, -46.602682178491804],
                    [-23.5667754654276, -46.602685448640294],
                    [-23.5667824523676, -46.6026893944269],
                    [-23.566789095720203, -46.6026939858219],
                    [-23.566795344925502, -46.602699187882095],
                    [-23.5668011524231, -46.6027049610166],
                    [-23.5668064740145, -46.602711261288306],
                    [-23.5668112691988, -46.6027180407486],
                    [-23.5668155014822, -46.602725247801494],
                    [-23.566819138653997, -46.6027328275968],
                    [-23.566822153033296, -46.602740722447905],
                    [-23.5668245216787, -46.60274887226981],
                    [-23.566826226563098, -46.602757215037606],
                    [-23.5668272547119, -46.6027656872576],
                    [-23.5668275982997, -46.6027742244509],
                    [-23.5668272547119, -46.6027827616441],
                    [-23.566826226563098, -46.6027912338641],
                    [-23.5668245216787, -46.602799576631796],
                    [-23.566822153033296, -46.6028077264537],
                    [-23.5668195047845, -46.602814758618],
                    [-23.5668163621795, -46.6028215470015],
                    [-23.5667602329592, -46.6029316692166],
                    [-23.566757327276697, -46.6029375302827],
                    [-23.56675650146, -46.6029392010317],
                    [-23.5667522691767, -46.6029464080814],
                    [-23.5667474739922, -46.602953187538596],
                    [-23.5667421524008, -46.6029594878076],
                    [-23.566736344903102, -46.6029652609395],
                    [-23.566730095697803, -46.6029704629972],
                    [-23.566723452345098, -46.6029750543903],
                    [-23.566716465405, -46.602979000175196],
                    [-23.5667091880524, -46.602982270322194],
                    [-23.5667016756723, -46.6029848399438],
                    [-23.5666939854386, -46.6029866894836],
                    [-23.566686175878502, -46.6029878048656],
                    [-23.5666783064278, -46.6029881776013],
                    [-23.5666704369773, -46.602987804853996],
                    [-23.5666626274187, -46.60298668946069],
                    [-23.566661797299304, -46.6029864898116],
                    [-23.5652550140809, -46.6036539085777],
                    [-23.565254030323096, -46.6036543801179],
                    [-23.565248911734702, -46.6036566769266],
                    [-23.5641312085724, -46.604181355212106],
                    [-23.5641303387034, -46.6041816047143],
                    [-23.5641288446121, -46.604182368764704],
                    [-23.5641239945413, -46.6041848109695],
                    [-23.564123297292003, -46.6041854299277],
                    [-23.563033529597302, -46.6047504761778],
                    [-23.563032750857097, -46.60475087139471],
                    [-23.563031089963204, -46.6047515311802],
                    [-23.563024054203403, -46.604755374856],
                    [-23.563022971277597, -46.604755919689104],
                    [-23.563016849169, -46.604758789425],
                    [-23.5615076648984, -46.605496139658094],
                    [-23.5615023568637, -46.6055024674333],
                    [-23.5614965493621, -46.6055082403362],
                    [-23.561490300152602, -46.60551344218771],
                    [-23.5614836567955, -46.605518033398496],
                    [-23.561476669850702, -46.605521979026996],
                    [-23.561469392493102, -46.6055252490444],
                    [-23.5614618801079, -46.6055278185639],
                    [-23.561454189869, -46.6055296680304],
                    [-23.561446380303696, -46.6055307833682],
                    [-23.5614385108476, -46.6055311560891],
                    [-23.5614363253864, -46.60553105257579],
                    [-23.5605611547029, -46.60596157157521],
                    [-23.5605564013801, -46.6059671987993],
                    [-23.5605505938778, -46.605972971660904],
                    [-23.5605443446675, -46.60597817347521],
                    [-23.5605377013094, -46.6059827646532],
                    [-23.5605307143638, -46.605986710253305],
                    [-23.5605234370053, -46.605989980247294],
                    [-23.560515924619402, -46.605992549748606],
                    [-23.5605082343795, -46.605994399201805],
                    [-23.560500424813302, -46.60599551453161],
                    [-23.560492555356202, -46.6059958872498],
                    [-23.5604899690895, -46.6059957647535],
                    [-23.5593100379904, -46.6065539112055],
                    [-23.559309104264603, -46.6065543543996],
                    [-23.5582549365912, -46.6070733414047],
                    [-23.5582504806263, -46.607079640859595],
                    [-23.5582451590291, -46.60708594072341],
                    [-23.558239351525003, -46.6070917134841],
                    [-23.558233102312897, -46.60709691520741],
                    [-23.5582264589529, -46.60710150630501],
                    [-23.558219472005202, -46.6071054518361],
                    [-23.558212194644597, -46.6071087217729],
                    [-23.558204682256303, -46.607111291229295],
                    [-23.5581969920142, -46.6071131406501],
                    [-23.5581891824457, -46.6071142559603],
                    [-23.5581813129862, -46.607114628672],
                    [-23.558173443527302, -46.6071142559488],
                    [-23.5581656339601, -46.6071131406272],
                    [-23.558157908559696, -46.607111220828095],
                    [-23.556783641875302, -46.607797726358896],
                    [-23.557092555346298, -46.6085962314816],
                    [-23.5570938995564, -46.6085997506628],
                    [-23.5570955373487, -46.608604138279894],
                    [-23.557097905997, -46.608612287502],
                    [-23.5570996108838, -46.608620629655604],
                    [-23.5571006390338, -46.6086291012519],
                    [-23.557100982621996, -46.6086376378167],
                    [-23.5571006390338, -46.6086461743815],
                    [-23.5570996108838, -46.6086546459777],
                    [-23.557097905997, -46.6086629881314],
                    [-23.5570955373487, -46.6086711373534],
                    [-23.5570925229657, -46.6086790316233],
                    [-23.557088885789398, -46.608686610860694],
                    [-23.5570846535008, -46.608693817383006],
                    [-23.5570798583103, -46.6087005963442],
                    [-23.5570745367123, -46.6087068961523],
                    [-23.5570687292073, -46.6087126688617],
                    [-23.5570624799944, -46.608717870538996],
                    [-23.5570558366334, -46.6087224615959],
                    [-23.5570488496845, -46.6087264070921],
                    [-23.5570415723229, -46.60872967699989],
                    [-23.557041017689798, -46.6087298758653],
                    [-23.557024190592102, -46.6087364030633],
                    [-23.5570236368886, -46.6087366047837],
                    [-23.557016533707, -46.6087390063666],
                    [-23.5570089875938, -46.608740820955504],
                    [-23.557001178024098, -46.608741936255896],
                    [-23.5569933085634, -46.608742308964196],
                    [-23.5569854391032, -46.6087419362442],
                    [-23.5569776295349, -46.6087408209327],
                    [-23.556969939293797, -46.6087389715179],
                    [-23.5569624269073, -46.608736402075095],
                    [-23.556955149549502, -46.608733132159394],
                    [-23.556948162605, -46.608729186657094],
                    [-23.5569415192488, -46.608724595595795],
                    [-23.5569352700407, -46.6087193939163],
                    [-23.556929462541103, -46.6087136212065],
                    [-23.5569241409485, -46.608707321400196],
                    [-23.556919345763, -46.608700542442996],
                    [-23.556915113479302, -46.608693335926496],
                    [-23.556911556611503, -46.6086857199743],
                    [-23.5569100923893, -46.6086822528001],
                    [-23.556908412233703, -46.6086778816634],
                    [-23.556602045559, -46.6078862002081],
                    [-23.5565675376256, -46.6078906736303],
                    [-23.5565568235077, -46.607891365624],
                    [-23.5565499014596, -46.607891077371],
                    [-23.5565430201543, -46.607890214319],
                    [-23.5550803106289, -46.607644668329904],
                    [-23.5550780998782, -46.607644379205205],
                    [-23.5550756520282, -46.6076440057322],
                    [-23.555073769146198, -46.607643725051595],
                    [-23.5548150546872, -46.607613836872204],
                    [-23.554813320946003, -46.607613609240595],
                    [-23.554807246173997, -46.607612712472005],
                    [-23.5547995559307, -46.607610863087594],
                    [-23.5547920435424, -46.607608293687],
                    [-23.554784766182298, -46.607605023825],
                    [-23.554777779235902, -46.6076010783876],
                    [-23.5547711358779, -46.607596487401594],
                    [-23.5547648866681, -46.6075912858075],
                    [-23.5547590791669, -46.6075855131925],
                    [-23.5547537575726, -46.6075792134898],
                    [-23.5547489623859, -46.60757243464381],
                    [-23.5547447301009, -46.6075652282457],
                    [-23.554741092927898, -46.6075576491405],
                    [-23.5547380785478, -46.607549755009494],
                    [-23.5547357099019, -46.6075416059319],
                    [-23.5547340050168, -46.607533263926896],
                    [-23.554732976868, -46.607524792482096],
                    [-23.554732633280103, -46.6075162560703],
                    [-23.554732976868, -46.6075077196584],
                    [-23.5547340050168, -46.6074992482136],
                    [-23.5547357099019, -46.607490906208604],
                    [-23.5547380785478, -46.607482757130995],
                    [-23.554741092927898, -46.60747486300011],
                    [-23.5547447301009, -46.607467283894806],
                    [-23.554747777205, -46.6074620955284],
                    [-23.554786585795902, -46.607139546952794],
                    [-23.5548373238436, -46.6066152496226],
                    [-23.5548673624836, -46.6061460214307],
                    [-23.5548677136732, -46.6061392688097],
                    [-23.5548678492042, -46.606137495866],
                    [-23.554868841721703, -46.6061290204425],
                    [-23.5548705466067, -46.606120678429],
                    [-23.5548729152526, -46.6061125293431],
                    [-23.554875929632598, -46.6061046352041],
                    [-23.554879566805603, -46.606097056091095],
                    [-23.554883799090497, -46.606089849685596],
                    [-23.5548885942771, -46.6060830708327],
                    [-23.554893915871297, -46.6060767711236],
                    [-23.5548997233724, -46.606070998502695],
                    [-23.554905972582098, -46.6060657969034],
                    [-23.5549126159399, -46.6060612059127],
                    [-23.5549196028862, -46.606057260471104],
                    [-23.554926880246096, -46.60605399060589],
                    [-23.5549343926346, -46.6060514212027],
                    [-23.5549420828776, -46.6060495718164],
                ],
                [
                    [-23.556614539940398, -46.607656136744396],
                    [-23.5580876544411, -46.6069200616844],
                    [-23.5580546762229, -46.6059558239552],
                    [-23.557660764243302, -46.6061543188803],
                    [-23.5576536068382, -46.60615752824081],
                    [-23.5576460944495, -46.606160097686306],
                    [-23.557638404206802, -46.6061619470994],
                    [-23.5576319906775, -46.6061629180552],
                    [-23.5576255294899, -46.606163387865394],
                    [-23.5561974327111, -46.606211523900804],
                    [-23.5550509625269, -46.606250199073195],
                    [-23.5550266563328, -46.6066312521061],
                    [-23.555026378288304, -46.6066347166007],
                    [-23.5549753273389, -46.6071622376837],
                    [-23.554975059877897, -46.6071647006458],
                    [-23.554945131586802, -46.6074131795272],
                    [-23.5550647183441, -46.6074270639126],
                    [-23.555070714118997, -46.607425013222695],
                    [-23.555078404362, -46.6074231638344],
                    [-23.5550862139322, -46.6074220485389],
                    [-23.5550940833944, -46.607421675824405],
                    [-23.5551010043699, -46.6074219849343],
                    [-23.555101950735498, -46.6074220654413],
                    [-23.5551078817643, -46.607422860807006],
                    [-23.555109764221303, -46.607423153127],
                    [-23.5565589249668, -46.6076663157257],
                    [-23.556607350708397, -46.607660103977295],
                    [-23.556614539940398, -46.607656136744396],
                ],
                [
                    [-23.5562218863205, -46.6042901781095],
                    [-23.558036091511198, -46.60455845464129],
                    [-23.5580285550366, -46.60373609701659],
                    [-23.5579268420565, -46.6036871476621],
                    [-23.556955275935497, -46.6035425768623],
                    [-23.556949685639598, -46.6035418968173],
                    [-23.556948873288498, -46.603541786076704],
                    [-23.5569456626548, -46.6035412708399],
                    [-23.5560953211064, -46.603421569495396],
                    [-23.556089509466, -46.603420870852304],
                    [-23.556085615685298, -46.6034202586716],
                    [-23.5556457275494, -46.603356910367],
                    [-23.555641942040204, -46.6033562757964],
                    [-23.555640510284697, -46.603355989010005],
                    [-23.555338099181, -46.60329267585811],
                    [-23.555267147075096, -46.6039225941299],
                    [-23.555250279531897, -46.604158013135],
                    [-23.5562209247128, -46.604290041615194],
                    [-23.5562218863205, -46.6042901781095],
                ],
                [
                    [-23.559242063304602, -46.6063725004685],
                    [-23.5603649060162, -46.6058412125465],
                    [-23.559963275527, -46.604979857965404],
                    [-23.559136395868297, -46.6054152052251],
                    [-23.5591307457203, -46.6054183123473],
                    [-23.5591294276373, -46.605419002841394],
                    [-23.559128105057397, -46.6054196498143],
                    [-23.559122132749998, -46.6054224253694],
                    [-23.5582320041724, -46.605856993604405],
                    [-23.5582660120266, -46.6068527718829],
                    [-23.559235820277003, -46.6063753535348],
                    [-23.5592369354151, -46.6063748179907],
                    [-23.559242063304602, -46.6063725004685],
                ],
                [
                    [-23.5600510329409, -46.604721932546894],
                    [-23.560861714635802, -46.604357894078404],
                    [-23.560436395943796, -46.6033325219623],
                    [-23.5601151375473, -46.6034878638442],
                    [-23.5601092587353, -46.6034904420355],
                    [-23.560106937409596, -46.60349131993701],
                    [-23.559825668984004, -46.60359305556759],
                    [-23.559820530360202, -46.6035947318912],
                    [-23.5596331508623, -46.6036493280336],
                    [-23.5600510329409, -46.604721932546894],
                ],
                [
                    [-23.560938204728004, -46.604535427021496],
                    [-23.5601278294607, -46.604899321112],
                    [-23.560526304642202, -46.6057533446319],
                    [-23.5613092054295, -46.6053681153191],
                    [-23.560938204728004, -46.604535427021496],
                ],
                [
                    [-23.5611035221653, -46.604456783682394],
                    [-23.5614775184653, -46.6052959975736],
                    [-23.562874155836496, -46.60461379293201],
                    [-23.5625121066048, -46.6037725369373],
                    [-23.5621486836391, -46.6039384196096],
                    [-23.5621473322615, -46.6039390950497],
                    [-23.5621459011598, -46.6039397552692],
                    [-23.562141824968602, -46.603941664943505],
                    [-23.5611035221653, -46.604456783682394],
                ],
                [
                    [-23.5626766338185, -46.6036917505543],
                    [-23.563034178299898, -46.6045225391353],
                    [-23.563963288124498, -46.604040792615095],
                    [-23.563618585952, -46.6032027420635],
                    [-23.5626766338185, -46.6036917505543],
                ],
            ],
        ];
        let options = new inlogMaps.PolygonOptions(
            path2,
            1,
            true,
            "#000000",
            1,
            "#FFFFFF",
            0.8
        );

        isPolygonEditable = false;
        options.fitBounds = true;
        options.draggable = true;
        options.editable = isPolygonEditable;
        currentMap.drawPolygon("polygon", options, onClickPolygon);

        currentMap.addPolygonEvent(
            "polygon",
            inlogMaps.PolygonEventType.SetAt,
            (old, novo, object, e, path) => {
                console.log(path);
            }
        );
        currentMap.addPolygonEvent(
            "polygon",
            inlogMaps.PolygonEventType.InsertAt,
            (old, novo, object, e, path) => {
                console.log(path);
            }
        );
        currentMap.addPolygonEvent(
            "polygon",
            inlogMaps.PolygonEventType.RemoveAt,
            (e, path, object) => {
                console.log(path);
            }
        );
        currentMap.addPolygonEvent(
            "polygon",
            inlogMaps.PolygonEventType.DragPolygon,
            (event, object) => {
                console.log(event, object);
            }
        );

        polygonShow = true;

        const div = document.createElement("div");
        div.style.fontSize = "13px";
        div.style.position = "absolute";
        div.style.minWidth = "90px";

        const span = document.createElement("span");
        span.textContent = "Eu to aqui!";
        div.appendChild(span);

        const overlayOptions = new inlogMaps.OverlayOptions(div, true);
        overlayOptions.polygon = "polygon";
        currentMap.drawOverlay("ocupacao", overlayOptions);
    } else {
        polygonShow = !polygonShow;
        currentMap.togglePolygons(polygonShow, "polygon");
    }
}

function changePolygonColor() {
    if (polygonShow === null) {
        alert("The polygon was not created yet!");
    } else {
        let options = new inlogMaps.PolygonAlterOptions();

        options.fillColor = "#FFFF00";
        currentMap.alterPolygonOptions("polygon", options);
    }
}

function changePolygonEditable() {
    if (polygonShow === null) {
        alert("The polygon was not created yet!");
    } else {
        let options = new inlogMaps.PolygonAlterOptions();

        isPolygonEditable = !isPolygonEditable;
        options.editable = isPolygonEditable;
        currentMap.alterPolygonOptions("polygon", options);
    }
}

function changePopupValue() {
    if (polygonShow === null) {
        alert("The polygon was not created yet!");
    } else {
        let options = new inlogMaps.PopupOptions(
            [25.774, -80.19],
            "<p>This popup content has changed.</p>"
        );

        currentMap.drawPopup("polygon", options);
    }
}

/* Circle tests */
function onClickCircle(event) {
    let options = new inlogMaps.PopupOptions(
        event.latlng,
        "<p>Hello world!<br />This is a nice popup.</p>"
    );

    currentMap.drawPopup("circle", options);
}

function addCircle() {
    if (circleShow === null) {
        let options = new inlogMaps.CircleOptions();

        options.addToMap = true;
        options.center = [-25.4327193, -49.2784139];
        options.radius = 100;
        options.weight = 1;
        options.fillOpacity = 0.8;
        options.fillColor = "#FF0000";
        options.color = "#000000";
        options.fitBounds = true;
        options.draggable = false;
        options.editable = false;
        currentMap.drawCircle("circle", options, onClickCircle);
        circleShow = true;
    } else {
        circleShow = !circleShow;
        currentMap.toggleCircles(circleShow, "circle");
    }
}

function changeCircleColor() {
    if (circleShow === null) {
        alert("The circle was not created yet!");
    } else {
        let options = new inlogMaps.CircleAlterOptions();

        options.fillColor = "#FFFF00";
        currentMap.alterCircleOptions("circle", options);
    }
}

function enableRuler() {
    currentMap.createRuler();
}

function removeRuler() {
    currentMap.removeRuler();
}

/* Heatmap tests */
function addHeatmap() {
    if (heatmapShow === null) {
        // Gerar dados de exemplo para o heatmap
        const heatmapData = generateHeatmapData();

        let options = new inlogMaps.HeatMapOptions(
            heatmapData,
            true, // addToMap
            25,   // radius
            1.0,  // maxIntensity
            0.05, // minOpacity
            0.6,  // opacity
            {     // gradient
                0.0: 'blue',
                0.2: 'cyan',
                0.4: 'lime',
                0.6: 'yellow',
                1.0: 'red'
            },
            15,   // blur
            18,   // maxZoom
            false, // dissipating
            false, // scaleRadius
            false, // useLocalExtrema
            true   // fitBounds
        );

        currentMap.drawHeatMap("heatmap", options);
        heatmapShow = true;
    } else {
        heatmapShow = !heatmapShow;
        currentMap.toggleHeatMaps(heatmapShow, "heatmap");
    }
}

function generateHeatmapData() {
    // Gerar dados de exemplo concentrados em algumas regiões
    const data = [];
    const centers = [
        [-23.550520, -46.633309], // São Paulo
        [-22.906847, -43.172896], // Rio de Janeiro
        [-25.441105, -49.276855], // Curitiba
        [-30.034647, -51.217658], // Porto Alegre
    ];

    centers.forEach(center => {
        // Adicionar pontos ao redor de cada centro
        for (let i = 0; i < 50; i++) {
            const lat = center[0] + (Math.random() - 0.5) * 0.1;
            const lng = center[1] + (Math.random() - 0.5) * 0.1;
            const intensity = Math.random();
            data.push([lat, lng, intensity]);
        }
    });

    return data;
}

function changeHeatmapIntensity() {
    if (heatmapShow === null) {
        alert("The heatmap was not created yet!");
    } else {
        const options = {
            maxIntensity: 2.0,
            opacity: 0.8
        };
        currentMap.setHeatMapOptions("heatmap", options);
    }
}

function changeHeatmapRadius() {
    if (heatmapShow === null) {
        alert("The heatmap was not created yet!");
    } else {
        const options = {
            radius: 40,
            blur: 25
        };
        currentMap.setHeatMapOptions("heatmap", options);
    }
}

function changeHeatmapGradient() {
    if (heatmapShow === null) {
        alert("The heatmap was not created yet!");
    } else {
        const options = {
            gradient: {
                0.0: 'navy',
                0.25: 'blue',
                0.5: 'green',
                0.75: 'yellow',
                1.0: 'red'
            }
        };
        currentMap.setHeatMapOptions("heatmap", options);
    }
}

function updateHeatmapData() {
    if (heatmapShow === null) {
        alert("The heatmap was not created yet!");
    } else {
        // Gerar novos dados aleatórios
        const newData = [];
        for (let i = 0; i < 100; i++) {
            const lat = -30 + Math.random() * 10; // Latitude entre -30 e -20
            const lng = -55 + Math.random() * 10; // Longitude entre -55 e -45
            const intensity = Math.random();
            newData.push([lat, lng, intensity]);
        }

        currentMap.updateHeatMapData("heatmap", newData);
    }
}

function addHeatmapWithLocationData() {
    // Criar dados baseados em localizações reais do Brasil
    const locationData = [
        // São Paulo - região metropolitana
        [-23.550520, -46.633309, 0.9],
        [-23.563720, -46.654540, 0.8],
        [-23.532100, -46.637800, 0.7],
        [-23.561680, -46.625290, 0.8],
        [-23.550650, -46.640530, 0.9],

        // Rio de Janeiro
        [-22.906847, -43.172896, 0.8],
        [-22.951600, -43.210500, 0.7],
        [-22.906990, -43.179720, 0.8],
        [-22.913100, -43.172900, 0.7],

        // Belo Horizonte
        [-19.916681, -43.934493, 0.6],
        [-19.924430, -43.935190, 0.5],
        [-19.912180, -43.940230, 0.6],

        // Brasília
        [-15.794229, -47.882166, 0.5],
        [-15.789000, -47.870000, 0.4],

        // Salvador
        [-12.971211, -38.501245, 0.6],
        [-12.975000, -38.480000, 0.5],

        // Curitiba
        [-25.441105, -49.276855, 0.7],
        [-25.450000, -49.280000, 0.6],

        // Porto Alegre
        [-30.034647, -51.217658, 0.6],
        [-30.040000, -51.220000, 0.5],
    ];

    let options = new inlogMaps.HeatMapOptions(
        locationData,
        true,  // addToMap
        30,    // radius
        1.0,   // maxIntensity
        0.1,   // minOpacity
        0.7,   // opacity
        {      // gradient personalizado para localizações
            0.0: '#000080',  // azul escuro
            0.3: '#0000FF',  // azul
            0.5: '#00FFFF',  // ciano
            0.7: '#FFFF00',  // amarelo
            0.9: '#FF8000',  // laranja
            1.0: '#FF0000'   // vermelho
        },
        20,    // blur
        16,    // maxZoom
        false, // dissipating
        false, // scaleRadius
        false, // useLocalExtrema
        true,  // fitBounds
        { type: 'location-based', description: 'Heatmap baseado em localizações reais' }
    );

    currentMap.drawHeatMap("locationHeatmap", options);
}
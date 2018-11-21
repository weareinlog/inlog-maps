let mapToUse = 'Leaflet'; // Google ou Leaflet
const map = new inlogMaps.Map(mapToUse);

let simpleMarkerShow = null;
let customMarkerShow = null;
let circleMarkerShow = null;
let polygonShow = null;
let polylineShow = null;
let circleShow = null;
let drawing = false;

/* GEOJson */
function onClick(event) {
    console.log(event);
}

function geojsonMarker() {
    let marker = {
        'type': 'Feature',
        'properties': {
            'marker-color': '#d12c44',
            'marker-size': 'medium',
            'marker-symbol': 'star'
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [-49.2806026, -25.4327193]
        }
    };

    map.loadGEOJson(marker, {
        draggable: true,
        editable: true
    }, onClick);
}

function geojsonPolyline() {
    let polylines = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'id': 1
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [-43.48283, -23.02487],
                        [-43.48391, -23.02475],
                        [-43.48233, -23.02486],
                        [-43.48212, -23.02443],
                        [-43.48243, -23.02429],
                        [-43.48245, -23.02477]
                    ]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'id': 2
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [-46.65953, -23.55865],
                        [-46.65953, -23.5579],
                        [-46.65972, -23.55809],
                        [-46.65941, -23.55878],
                        [-46.65953, -23.55896],
                        [-46.65903, -23.55888]
                    ]
                }
            }
        ]
    };

    map.loadGEOJson(polylines, {
        draggable: true,
        editable: true
    }, onClick);
}

function geojsonPolygon() {
    let polygon = {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
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
                    [-67.13734351262877, 45.137451890638886]
                ]
            ]
        }
    };

    map.loadGEOJson(polygon, {
        draggable: true,
        editable: true
    }, onClick);
}

/* Marker tests */
function onClickMarker(marker, event) {
    let options = new inlogMaps.PopupOptions(event.latlng, '<p>Hello world!<br />This is a nice popup.</p>', marker);

    map.drawPopup('marker', options);
}

function addMarker() {
    if (simpleMarkerShow === null) {
        let options = new inlogMaps.MarkerOptions([-25.4327193, -49.2806026], true, true, null, true);

        map.drawMarker('simple', options, onClickMarker);
        simpleMarkerShow = true;
    } else {
        simpleMarkerShow = !simpleMarkerShow;
        map.showMarkers(simpleMarkerShow, 'simple');
    }
}

function changeMarkerPosition() {
    if (simpleMarkerShow === null) {
        alert('The marker was not created yet');
    } else {
        let options = new inlogMaps.MarkerAlterOptions([-20, -40]);

        map.alterMarkerOptions('simple', options);
    }
}

function onClickMarkerCustom(marker, event, object) {
    let content = `
                <div class="infowindow-default">
                    <h3 class="title">
                        <span>Item</span>
                    </h3>
                    <div class="section">
                        <div class="infowindow-table">
                            <div><strong>Valor 1:</strong><span> ${object.valor1 || ''}</span> </div>
                            <div><strong>Valor 2:</strong><span> ${object.valor2 || ''}</span></div>
                            <div><strong>Valor 3:</strong><span> ${object.valor3 || ''}</span></div>
                            <div><strong>Valor 4:</strong><span> ${object.valor4}</span></div>
                            <div><strong>Valor 5:</strong><span> ${object.valor5}</span></div>
                        </div>
                    </div>
                </div>`;

    let options = new inlogMaps.PopupOptions(event.latlng, content, marker);

    map.drawPopup('markerCustom', options);
}

function addMarkerCustom() {
    if (customMarkerShow === null) {
        let item = {
            valor1: 'Um valor',
            valor2: 'Dois valores',
            valor3: 'Três valores',
            valor4: 'Quatro valores',
            valor5: 'Cinco valores'
        };

        let icon = new inlogMaps.MarkerIcon('images/cursor_locate.png');
        let options = new inlogMaps.MarkerOptions([-26, -50], true, false, icon, true, item);

        map.drawMarker('custom', options, onClickMarkerCustom);
        customMarkerShow = true;
    } else {
        customMarkerShow = !customMarkerShow;
        map.showMarkers(customMarkerShow, 'custom');
    }
}

function changeCustomMarkerImage() {
    if (customMarkerShow === null) {
        alert('The custom marker was not created yet');
    } else {
        let icon = new inlogMaps.MarkerIcon('images/inicio_rota.png');
        let options = new inlogMaps.MarkerAlterOptions(null, icon);

        map.alterMarkerOptions('custom', options);
    }
}

function addCircleMarker() {
    if (circleMarkerShow === null) {
        let style = new inlogMaps.CircleMarkerStyle(5, 1, '#000000', '#FF0000', 0.8);
        let options = new inlogMaps.CircleMarkerOptions([-24, -48], true, style, true);

        map.drawCircleMarker('circleMarker', options, onClickMarker);

        circleMarkerShow = true;
    } else {
        circleMarkerShow = !circleMarkerShow;
        map.showMarkers(circleMarkerShow, 'circleMarker');
    }
}

function changeCircleMarkerColor() {
    if (circleMarkerShow === null) {
        alert('The circle marker was not created yet!');
    } else {
        let style = new inlogMaps.CircleMarkerStyle();

        style.fillColor = '#FFFF00';
        let options = new inlogMaps.MarkerAlterOptions();

        options.style = style;
        map.alterMarkerOptions('circleMarker', options);
    }
}

/* Polyline tests */
function onClickPolyline(polyline, event, object) {
    let options = new inlogMaps.PopupOptions(event.latlng, `<p>${object.item}.</p>`);

    map.drawPopup('polyline', options);
}

function addPolyline() {
    if (polylineShow === null) {
        let options = new inlogMaps.PolylineOptions();

        options.path = [
            [-23.02487, -43.48283],
            [-23.02475, -43.48391],
            [-23.02486, -43.48233],
            [-23.02443, -43.48212],
            [-23.02429, -43.48243],
            [-23.02477, -43.48245]
        ];
        options.addToMap = true;
        options.fitBounds = true;
        options.object = {
            item: 'New'
        };
        map.drawPolyline('polyline', options, onClickPolyline);
        polylineShow = true;
    } else {
        polylineShow = !polylineShow;
        map.showPolyline(polylineShow, 'polyline');
    }
}

function addPolylineWithNavigation() {
    let options = new inlogMaps.PolylineNavigationOptions();

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
        [-23.024949270121056, -43.48403893506065]
    ];
    options.infowindows = [
        '<h1>1</h1>',
        '<h1>2</h1>',
        '<h1>3</h1>',
        '<h1>4</h1>',
        '<h1>5</h1>',
        '<h1>6</h1>',
        '<h1>7</h1>',
        '<h1>8</h1>',
        '<h1>9</h1>',
        '<h1>10</h1>',
        '<h1>11</h1>',
        '<h1>12</h1>',
        '<h1>13</h1>',
        '<h1>14</h1>',
        '<h1>15</h1>',
        '<h1>16</h1>',
        '<h1>17</h1>',
        '<h1>18</h1>',
        '<h1>19</h1>'
    ];
    options.addToMap = true;
    options.weight = 8;
    options.fitBounds = true;
    options.navigateOptions = new inlogMaps.NavigationOptions('#0000FF');
    map.drawPolylineWithNavigation('polylineNavigation', options);
}

function removePolylineHighlight() {
    map.removePolylineHighlight();
}

function updatePolyline(event) {
    map.addPolylinePath('polyline', event.latlng);
}

function drawPolyline() {
    if (!polylineShow) {
        alert('The polyline is not on the map!');
    } else {
        if (drawing) {
            map.removeClickMap();
            drawing = false;
        } else {
            map.addClickMap(updatePolyline);
            drawing = true;
        }
    }
}

function changePolyline() {
    let options = new inlogMaps.PolylineAlterOptions(true, true, '#00FF00', 12, {
        item: 'Edited'
    });

    map.alterPolylineOptions('polyline', options);
}

/* Polygon tests */
function onClickPolygon(polygon, event) {
    let options = new inlogMaps.PopupOptions(event.latlng, '<p>Hello world!<br />This is a nice popup.</p>');

    map.drawPopup('polygon', options);
}

function addPolygon() {
    if (polygonShow === null) {
        let path = [
            [25.774, -80.190],
            [18.466, -66.118],
            [32.321, -64.757],
            [25.774, -80.190]
        ];
        let options = new inlogMaps.PolygonOptions(path, 1, true, '#000000', 1, '#FFFFFF', 0.8);

        options.fitBounds = true;
        map.drawPolygon('polygon', options, onClickPolygon);
        polygonShow = true;
    } else {
        polygonShow = !polygonShow;
        map.showPolygons(polygonShow, 'polygon');
    }
}

function changePolygonColor() {
    if (polygonShow === null) {
        alert('The polygon was not created yet!');
    } else {
        let options = new inlogMaps.PolygonAlterOptions();

        options.fillColor = '#FFFF00';
        map.alterPolygonOptions('polygon', options);
    }
}

function changePopupValue() {
    if (polygonShow === null) {
        alert('The polygon was not created yet!');
    } else {
        let options = new inlogMaps.PopupOptions([25.774, -80.190], '<p>This popup content has changed.</p>');

        map.drawPopup('polygon', options);
    }
}

/* Circle tests */
function onClickCircle(circle, event) {
    let options = new inlogMaps.PopupOptions(event.latlng, '<p>Hello world!<br />This is a nice popup.</p>');

    map.drawPopup('marker', options);
}

function addCircle() {
    if (circleShow === null) {
        let options = new inlogMaps.CircleOptions();

        options.addToMap = true;
        options.center = [-25.4327193, -49.2784139];
        options.radius = 100;
        options.weight = 1;
        options.fillOpacity = 0.8;
        options.fillColor = '#FF0000';
        options.color = '#000000';
        options.fitBounds = true;
        options.draggable = false;
        options.editable = false;
        map.drawCircle('circle', options, onClickCircle);
        circleShow = true;
    } else {
        circleShow = !circleShow;
        map.showCircles(circleShow, 'circle');
    }
}

function changeCircleColor() {
    if (circleShow === null) {
        alert('The circle was not created yet!');
    } else {
        let options = new inlogMaps.CircleAlterOptions();

        options.fillColor = '#FFFF00';
        map.alterCircleOptions('circle', options);
    }
}

import React, { Component } from 'react';
import { render } from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { scaleLinear, scaleThreshold } from 'd3-scale';
import colormap from 'colormap';

const edgeColor = colormap({
  colormap: 'inferno',
  nshades: 256,
  format: 'rba',
  alpha: 1
}).map(d => [d[0], d[1], d[2], 255]);
const edgeScale = scaleLinear()
  .clamp(true)
  .domain([0, 15000])
  .range([0, 255]);
const CAPACITY_TIME_RANGES = [
  'capacity_0200_0659',
  'capacity_0700_0729',
  'capacity_0730_0759',
  'capacity_0800_0829',
  'capacity_0830_0859',
  'capacity_0900_0929',
  'capacity_0930_0959',
  'capacity_1000_1059',
  'capacity_1100_1259',
  'capacity_1300_1459',
  'capacity_1500_1659',
  'capacity_1700_1759',
  'capacity_1800_1859',
  'capacity_1900_1959',
  'capacity_2000_2059',
  'capacity_2100_2159',
  'capacity_2200_2259',
  'capacity_2300_2359',
  'capacity_2400_0159',
];


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeIndex: 5,
    };
    this._onHover = this._onHover.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.accidents !== this.props.accidents) {
    //   this.setState({
    //     ...this._aggregateAccidents(nextProps.accidents)
    //   });
    // }
  }

  _getLineColor(f, timeIndex) {
    const value = Math.abs(f.properties[`${CAPACITY_TIME_RANGES[timeIndex]}_up`] - f.properties[`${CAPACITY_TIME_RANGES[timeIndex]}_down`]);
    if (value) {
      return edgeColor[Math.floor(edgeScale(value))];
    }
    else {
      return [0, 0, 0, 50];
    }
  }
  _getLineWidth(f, timeIndex) {
    const value = Math.abs(f.properties[`${CAPACITY_TIME_RANGES[timeIndex]}_up`] - f.properties[`${CAPACITY_TIME_RANGES[timeIndex]}_down`]);
    if (value) {
      return edgeScale(value) / 255 * 30 + 10;
    }
    else {
      return 1;
    }
  }

  _onHover({ x, y, object }) {
    console.log(x, y, object);
    // this.setState({ x, y, hoveredObject: object });
  }

  _renderLayers() {
    const { trainNetwork, year } = this.props;
    const { incidents, fatalities } = this.state;
    return [
      new GeoJsonLayer({
        id: 'geojson',
        data: trainNetwork,
        stroked: true,
        filled: true,
        lineWidthMinPixels: 5,
        lineJointRounded: true,
        parameters: {
          depthTest: false
        },

        getLineColor: d => this._getLineColor(d, this.state.timeIndex),
        getLineWidth: d => this._getLineWidth(d, this.state.timeIndex),

        pickable: true,
        onHover: this._onHover,

        updateTriggers: {
          getLineColor: { year },
          getLineWidth: { year }
        },

        transitions: {
          getLineColor: 1000,
          getLineWidth: 1000
        }
      })
    ];
  }

  _renderTooltip() {
    //   const {hoveredObject, x, y, fatalities, incidents} = this.state;
    //   const {year} = this.props;

    //   if (!hoveredObject) {
    //     return null;
    //   }

    //   const props = hoveredObject.properties;
    //   const key = getKey(props);
    //   const f = fatalities[year][key];
    //   const r = incidents[year][key];

    //   const content = r ? (
    //     <div>
    //       <b>{f}</b> people died in <b>{r}</b> crashes on{' '}
    //       {props.type === 'SR' ? props.state : props.type}-{props.id} in <b>{year}</b>
    //     </div>
    //   ) : (
    //     <div>
    //       no accidents recorded in <b>{year}</b>
    //     </div>
    //   );

    //   return (
    //     <div className="tooltip" style={{left: x, top: y}}>
    //       <big>
    //         {props.name} ({props.state})
    //       </big>
    //       {content}
    //     </div>
    //   );
  }

  render() {
    const mapStyle = {
      version: 8,
      sources: {
        'cyberjapandata-tiles': {
          type: 'raster',
          tiles: [
            // 'https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png',
            'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
          ],
          tileSize: 256,
          'attribution': '',
        }
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'cyberjapandata-tiles',
          minzoom: 5,
          maxzoom: 22,
        }
      ]
    };
    const initialViewState = {
      longitude: 139.81158,
      latitude: 35.70972,
      zoom: 15
    };

    return (
      <DeckGL
        layers={this._renderLayers()}
        pickingRadius={5}
        initialViewState={initialViewState}
        controller={true}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
        />

        {this._renderTooltip}
      </DeckGL>
    );
  }
}

export function renderToDOM(container) {
  // render(<App />, container);

  fetch('./data/railroad_path.json')
    .then(res => res.json())
    .then(data => {
      render(<App trainNetwork={data} />, container)
    })
    .catch((error) => {
      console.error(error);
      render(<App accidents={error} />, container);
    });
}

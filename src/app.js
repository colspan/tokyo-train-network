import React, { Component } from 'react';
import { render } from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { scaleLinear, scaleThreshold } from 'd3-scale';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredObject: null,
    };
    this._onHover = this._onHover.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    // if (nextProps.accidents !== this.props.accidents) {
    //   this.setState({
    //     ...this._aggregateAccidents(nextProps.accidents)
    //   });
    // }
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
        filled: false,
        lineWidthMinPixels: 0.5,
        parameters: {
          depthTest: false
        },

        // getLineColor: f => this._getLineColor(f, fatalities[year]),
        // getLineWidth: f => this._getLineWidth(f, incidents[year]),

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
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'http://b.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256
        }
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 22
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

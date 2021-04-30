import React, { Component } from 'react';
import ReactMapGL, {Marker, Popup } from 'react-map-gl';
import BusinessDetailsPage from '../BusinessDetails/BusinessDetailsPage';
import './TrackingPage.css';

class PopupComponent extends Component {
    constructor(props) {
        super(props);
    }
  render () {
    return (
        <div>
            {console.log(this.props.businessDetails)}
        </div>
    )
  };
}

export default PopupComponent
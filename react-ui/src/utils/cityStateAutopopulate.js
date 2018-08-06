import React from 'react';
import filter from 'lodash/filter';
import { geocodeByAddress } from 'react-places-autocomplete';

export class CityStateAutopopulate extends React.Component {
  state = {
    city: '',
    state: ''
  };
  geocodeByAddress = postalCode => {
    if (postalCode !== '') {
      geocodeByAddress(postalCode.toString()).then(places => {
        let address = places[0].address_components.reverse();
        let filteredData = filter(
          address,
          item =>
            item.types[0] === 'administrative_area_level_1' ||
            item.types[0] === 'administrative_area_level_2' ||
            item.types[0] === 'locality'
        );
        if (filteredData.length > 1)
          this.setState({
            city: filteredData[1].short_name,
            state: filteredData[0].short_name
          });
      });
    }
  };

  getStateAndHelpers = () => {
    return {
      location: {
        state: this.state.state,
        city: this.state.city
      },
      geocodeByAddress: this.geocodeByAddress
    };
  };

  render() {
    return this.props.children(this.getStateAndHelpers());
  }
}

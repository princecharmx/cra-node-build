import React, { Component } from 'react';

import { AutoFillInput } from '../InputFields';

class ItemGroupSearch extends Component {
  state = {
    showLink: true
  };

  hideLink = () => this.setState({ showLink: false });

  render() {
    const { searchText, updateItemGroup, renderSuggestionList, errorMessage } = this.props;
    return (
      <React.Fragment>
        <AutoFillInput
          width="220px"
          hint="Imitation"
          labelText="Item Group"
          openOnFocus={true}
          searchText={searchText}
          dataSource={renderSuggestionList}
          onUpdateInput={input => updateItemGroup(input)}
          errorText={errorMessage}
        />
      </React.Fragment>
    );
  }
}

export default ItemGroupSearch;

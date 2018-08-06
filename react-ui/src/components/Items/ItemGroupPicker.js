import React, { Component } from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';
import { MenuItem } from 'material-ui';
import {
  setItemGroup,
  showItemGroupDialog,
  setItemPayload,
  resetSelectedItemGroup,
  setItemGroupSearchText
} from '../../actions';
import { getNewContactAdded, getItemGroupSearchText } from '../../reducers';
import ItemGroupSearch from './ItemGroupSearch';

class ItemGroupPicker extends Component {
  state = {
    // components local state
    searchText: '',
    itemGroup: {
      id: '',
      name: '',
      code: '',
      taxPercentage: 0,
      hsn: '',
      description: ''
    },
    renderSuggestionList: []
  };

  setSelectedItemGroup() {
    const { itemGroups, payloadData, setItemPayload } = this.props;
    let dataSource = itemGroups;
    let selectedAccount = filter(
      dataSource,
      item => item.code === this.state.searchText || item.name === this.state.searchText
    );
    if (selectedAccount.length > 0) {
      let itemGrp = selectedAccount[0];
      // local store for using inside this component only
      this.setState(
        {
          itemGroup: {
            ...this.state.itemGroup,
            id: itemGrp.id,
            name: itemGrp.name,
            code: itemGrp.code,
            taxPercentage: itemGrp.taxPercentage,
            hsn: itemGrp.hsn,
            description: itemGrp.description
          }
        },
        () => {
          // store in redux store for use by other componenet (mostly Item form)
          this.props.setItemGroup({
            _selectedItemGroup: this.state.itemGroup
          });
          setItemPayload('itemGroupId', this.state.itemGroup.id);

          let name = `${this.state.itemGroup.name}-${payloadData.collectionType}-${
            payloadData.baseMaterial
          }-${payloadData.color}`;
          setItemPayload('name', name);

          let skuCode = `${this.state.itemGroup.code
            .substring(0, 2)
            .toUpperCase()}-${payloadData.collectionType
            .substring(0, 2)
            .toUpperCase()}-${payloadData.baseMaterial
            .substring(0, 2)
            .toUpperCase()}-${payloadData.color.substring(0, 2).toUpperCase()}`;
          setItemPayload('skuBarcode', skuCode);
        }
      );
    }
  }

  //TODO: bug addContact drawer should be toggled through actions
  populateItemGroupSuggestions() {
    const { showItemGroupDialog, itemGroups } = this.props;
    let dataSource = itemGroups;
    const value = map(dataSource, item => {
      return {
        text: item.name,
        value: (
          <MenuItem
            style={{
              whiteSpace: 'normal',
              margin: '-20px 0 -10px',
              height: '70px',
              width: '100%'
            }}
          >
            <div
              style={{
                padding: '10px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span style={{ fontSize: '14px' }}>{`${item.name} - ${item.code} (tax ${
                item.taxPercentage
              })`}</span>
            </div>
          </MenuItem>
        )
      };
    });

    const addItemGroup = {
      text: `${this.state.searchText}`,
      value: (
        <MenuItem
          onClick={showItemGroupDialog}
          style={{ color: 'blue' }}
          primaryText={`Add ItemGroup ${this.state.searchText} +`}
        />
      )
    };

    this.setState({
      renderSuggestionList: [...value, addItemGroup]
    });
  }

  updateItemGroup = input => {
    const {
      payloadData,
      resetSelectedItemGroup,
      setItemPayload,
      setItemGroupSearchText,
      validateFn,
      formValidation
    } = this.props;
    setItemGroupSearchText(input);
    if (payloadData.itemGroupId !== '') {
      resetSelectedItemGroup();
      setItemPayload('itemGroupId', '');
      let name = `${''}-${payloadData.collectionType}-${payloadData.baseMaterial}-${
        payloadData.color
      }`;
      setItemPayload('name', name);

      let skuCode = `${''}-${payloadData.collectionType
        .substring(0, 2)
        .toUpperCase()}-${payloadData.baseMaterial
        .substring(0, 2)
        .toUpperCase()}-${payloadData.color.substring(0, 2).toUpperCase()}`;
      setItemPayload('skuBarcode', skuCode);
    }
    this.setState({ searchText: input }, () => {
      this.setSelectedItemGroup();
      this.populateItemGroupSuggestions();
    });
    validateFn(input);
    console.log(formValidation);
  };

  render() {
    let { searchText, formValidation } = this.props;
    return (
      <React.Fragment>
        <ItemGroupSearch
          searchText={searchText}
          updateItemGroup={this.updateItemGroup}
          renderSuggestionList={this.state.renderSuggestionList}
          errorMessage={
            formValidation.itemGroupId && formValidation.itemGroupId.isValid
              ? formValidation.itemGroupId.message
              : ''
          }
        />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  setItemGroup,
  showItemGroupDialog,
  setItemPayload,
  resetSelectedItemGroup,
  setItemGroupSearchText
};

const mapStateToProps = state => {
  return {
    addedContact: getNewContactAdded(state),
    searchText: getItemGroupSearchText(state)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemGroupPicker);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Party from './StyledComponents';
import filter from 'lodash/filter';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { MenuItem } from 'material-ui';
import { AvatarIcon, Cancel } from '../../../images';
import { CreditDebitDecorators } from '../../../utils';
import { PartySearch } from '../addSPCDComponent/index';
import {
  closeBusinessContactCard,
  updateBusiness,
  fetchCurrentBalance,
  drawerOpenAddContact
} from '../../../actions';
import {
  getSearchText,
  getCurrentBalance,
  getNewContactAdded,
  getToogleBusinessCard,
  getselectedBusinessAccount
} from '../../../reducers';
function getPartyName(name, aliasName) {
  let partyName = isEmpty(aliasName) ? name : name + '(' + aliasName + ')';
  return partyName;
}

export const ShowDetailsCard = ({
  img,
  name,
  aliasName,
  address,
  currentBalance = 0,
  closeBusinessContactCard,
  show = false
}) => {
  return (
    <CreditDebitDecorators crDrValue={currentBalance}>
      {({ currentBalanceSymbol, colorCode }) => (
        <Party.Details>
          <Party.ImageHolder src={img ? img : AvatarIcon} width="35px" height="35px" />
          <Party.Description>
            <Party.Name>{getPartyName(name, aliasName)}</Party.Name>
            <Party.Address>{address}</Party.Address>
            <Party.CurrentBalance>
              {`Current Balance: `}
              <div style={{ color: colorCode }}>
                {`Rs. ${currentBalance} ${currentBalanceSymbol}`}
              </div>
            </Party.CurrentBalance>
          </Party.Description>
          <Party.ImageHolder
            padding={'0 10px 30px 0px'}
            src={Cancel}
            width="14px"
            height="14px"
            onClick={closeBusinessContactCard}
          />
        </Party.Details>
      )}
    </CreditDebitDecorators>
  );
};

class PartyPicker extends Component {
  state = {
    // components local state
    searchText: '',
    party: {
      name: '',
      state: '', //party's state in address field
      refId: '',
      gstin: '',
      address: '',
      refAccountId: '',
      accountName: '',
      gstPartyType: '',
      accountGroup: 'Sales'
    },

    businessAccountsSuggestions: []
  };

  getSelectedAccountDetails() {
    const { dataSource } = this.props;
    let selectedAccount = filter(
      dataSource,
      item => item.aliasName === this.state.searchText || item.name === this.state.searchText
    );

    if (selectedAccount.length > 0) {
      let tempObj = selectedAccount[0];
      this.setState(
        {
          selectedBusinessAccount: tempObj,
          party: {
            ...this.state.party,
            refId: tempObj.id,
            name: tempObj.name,
            state: tempObj.state, //party's state in address field
            gstin: tempObj.gstin !== '' ? tempObj.gstin : tempObj.pancard,
            address: tempObj.address,
            accountName: tempObj.name,
            gstPartyType: tempObj.gstBusinessType
          }
        },
        () => {
          this.props.fetchCurrentBalance(this.state.selectedBusinessAccount.id);
          this.props.updateBusiness({
            party: this.state.party,
            business: tempObj
          });
        }
      );
    }
  }

  //TODO: bug addContact drawer should be toggled through actions
  populateBusinessAccountSuggestions() {
    const { dataSource, drawerOpenAddContact } = this.props;
    const value = map(dataSource, item => {
      return {
        text: item.name, // make it work like this text: `${item.aliasName} ${item.name}`,
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
              <span style={{ fontSize: '14px' }}>{`${item.name} (${item.aliasName})`}</span>
              <span style={{ fontSize: '12px', marginTop: '-28px' }}>
                {`${item.address}, ${item.city}, ${item.pincode}`}
              </span>
            </div>
          </MenuItem>
        )
      };
    });
    const addItems = {
      text: `${this.state.searchText}`,
      value: (
        <MenuItem
          onClick={drawerOpenAddContact}
          style={{ color: 'blue' }}
          primaryText={`Add Party ${this.state.searchText} +`}
        />
      )
    };

    this.setState({
      businessAccountsSuggestions: [...value, addItems]
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.toogleBusinessCard === true) {
      return {
        searchText: ''
      };
    }
    return null;
  }
  updateBusinessContact = input => {
    this.setState({ searchText: input }, () => {
      this.getSelectedAccountDetails();
      this.populateBusinessAccountSuggestions();
    });
  };

  render() {
    const {
      closeBusinessContactCard,
      selectedBusinessAccount,
      currentBalance,
      addedContact
    } = this.props;

    return (
      <React.Fragment>
        {!isEmpty(selectedBusinessAccount) || !isEmpty(addedContact) ? (
          <ShowDetailsCard
            name={getPartyName(
              selectedBusinessAccount.name || addedContact.name,
              selectedBusinessAccount.aliasName || addedContact.aliasName
            )}
            address={`${selectedBusinessAccount.address || addedContact.address},
              ${selectedBusinessAccount.city || addedContact.city},
              ${selectedBusinessAccount.pincode || addedContact.pincode}`}
            currentBalance={currentBalance < 0 ? currentBalance * -1 : currentBalance}
            symbolCrDr={currentBalance && currentBalance > 0 ? 'Cr' : 'Dr'} //logic for rendering Cr and Dr if -ve Cr else Dr
            closeBusinessContactCard={closeBusinessContactCard}
          />
        ) : (
          <PartySearch
            searchText={this.state.searchText}
            updateBusinessContact={this.updateBusinessContact}
            selectedBusinessAccount={selectedBusinessAccount}
            businessAccountsSuggestions={this.state.businessAccountsSuggestions}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  closeBusinessContactCard,
  updateBusiness,
  drawerOpenAddContact,
  fetchCurrentBalance
};

const mapStateToProps = state => {
  const { vouchers } = state;
  return {
    searchText: getSearchText(vouchers),
    currentBalance: getCurrentBalance(vouchers),
    selectedBusinessAccount: getselectedBusinessAccount(vouchers),
    toogleBusinessCard: getToogleBusinessCard(vouchers),
    addedContact: getNewContactAdded(state)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PartyPicker);

import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import cookie from 'react-cookies';
import isEmpty from 'lodash/isEmpty';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import styled from 'styled-components';
import mixpanel from 'mixpanel-browser';
import React, { Component } from 'react';
import ClevertapReact from 'clevertap-react';

import { setLastVisitedVoucher } from '../actions';
import { Add, PhoneLogo, VouchersLogo } from '../images';
import { API_URL, COMPANY_ID, I_USER_ID } from '../constants';
import { ListHeader, ViewVoucher /* AddVoucher, AddItem, AddContact */ } from '../containers';
import {
  Loader,
  Button,

  // voucher specific components
  Container,
  ImageHolder,
  VoucherCard,
  VouchersList,
  VoucherTitle,
  LeftContainer,
  VoucherDetails,
  VoucherSubTitle,
  LeftHalfContainer,
  RightHalfContainer
} from '../components';

const ButtonExtended = Button.extend`
  ${props =>
    props.type === 'empty' &&
    `
    margin: 20px 0px;
  `};
`;

const StyledSpan = styled.span`
  width: 100%;
  color: #2e6eaf;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
`;

const LoaderContainer = styled.div`
  display: flex;
  width: inherit;
  height: inherit;
  align-items: center;
  justify-content: center;
`;

const AddContact = Loadable({
  loader: () => import('../containers/AddContact'),
  loading() {
    return <div>Loading...</div>;
  }
});

const AddItem = Loadable({
  loader: () => import('../containers/AddItem'),
  loading() {
    return <div>Loading...</div>;
  }
});

const AddVoucher = Loadable({
  loader: () => import('../containers/AddVoucher'),
  loading() {
    return <div>Loading...</div>;
  }
});

class Vouchers extends Component {
  state = {
    newItem: {},
    vouchersData: null,
    openAddItems: false,
    selectedVoucherId: '',
    selectedVoucher: null,
    openAddContact: false,
    openAddVoucher: false,
    voucherItemsData: null,
    itemsUpdatedState: false,
    businesssAccountsData: null,
    voucherItemsSuggestions: [],
    alreadyExistsData: {},
    updatedNameSuccess: false,
    userId: cookie.load(I_USER_ID),
    businessAccountsSuggestions: [],
    resetRecordPaymentDialog: false,
    clearAddVoucherFormValues: false,
    resetToDefaultStateContact: false,
    companyId: cookie.load(COMPANY_ID)
  };

  componentDidMount() {
    // event tracking code
    mixpanel.track('voucher-screen');
    ClevertapReact.event('voucher-screen');

    const companyAccessToken = cookie.load(`${this.state.userId}@${this.state.companyId}`) || '';

    if (companyAccessToken) {
      axios.defaults.headers.common['authorization'] = companyAccessToken || '';

      // get list of vouchers
      this.getVouchersData();
    }

    // fetch the last visited voucher from the store
    if (this.props.lastVisitedVoucher !== null) {
      this.setState({
        selectedVoucher: this.props.lastVisitedVoucher,
        selectedVoucherId: this.props.lastVisitedVoucher.id
      });
    }
  }

  handleAddItem(payload) {
    const { userId, companyId } = this.state;

    const ADD_ITEM_URL = `${API_URL}/i-companies/${companyId}/items`;
    const companyAccessToken = cookie.load(`${userId}@${companyId}`) || '';

    if (companyAccessToken) {
      axios.defaults.headers.common['authorization'] = companyAccessToken || '';

      axios
        .post(ADD_ITEM_URL, payload)
        .then(response => response.data)
        .then(data => {
          this.setState(
            {
              newItem: data,
              openAddItems: false,
              clearAddItemFormFields: true
            },
            this.getItemsData
          );
        })
        .catch(error => {
          alert(
            error.response && error.response.data && error.response.data !== null
              ? error.response.data.error.message
              : 'Something went wrong, please try again!'
          );
        });
    }
  }

  updateName(name) {
    const SAME_NAME_CHANGE_URL = `${API_URL}/i-companies/${this.state.companyId}/contacts/${
      this.state.alreadyExistsData.id
    }`;
    axios
      .put(SAME_NAME_CHANGE_URL, { name: name })
      .then(
        response =>
          response.status === 200 &&
          response.statusText === 'OK' &&
          this.setState({ updatedNameSuccess: true })
      )
      .catch(error =>
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.message
            : 'something went wrong pls try again'
        )
      );
  }

  checkForName(phone) {
    const SAME_PHONE_NUMBER_URL = `${API_URL}/i-companies/${
      this.state.companyId
    }/contacts/${phone}`;
    axios.get(SAME_PHONE_NUMBER_URL).then(response => {
      if (response) {
        this.setState({
          alreadyExistsData: response.data
        });
      }
    });
  }
  getVouchersData() {
    const VOUCHERS_GET_URL = `${API_URL}/i-companies/${this.state.companyId}/vouchers`;

    axios
      .get(VOUCHERS_GET_URL)
      .then(response => response.data)
      .then(data => {
        this.setState(
          {
            vouchersData: data.reverse() || [],
            selectedVoucher:
              _.find(data, voucher => voucher.id === this.state.selectedVoucherId) || null
          },
          () => {
            this.getContactsData();
            this.getItemsData();
          }
        );
      })
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  getContactsData() {
    const CONTACTS_GET_URL = `${API_URL}/i-companies/${this.state.companyId}/businesses`;

    axios
      .get(CONTACTS_GET_URL)
      .then(response => response.data)
      .then(data => this.setState({ businesssAccountsData: data || [] }))
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  getItemsData() {
    const ITEMS_GET_URL = `${API_URL}/i-companies/${this.state.companyId}/items`;
    axios
      .get(ITEMS_GET_URL)
      .then(response => response.data)
      .then(data =>
        this.setState({
          voucherItemsData: data || [],
          itemsUpdatedState: !this.state.itemsUpdatedState
        })
      )
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  getInitialState() {
    this.setState(
      {
        vouchersData: null,
        openAddVoucher: false,
        selectedVoucher: null,
        selectedVoucherId: '',
        voucherItemsSuggestions: [],
        businessAccountsSuggestions: []
      },
      this.getVouchersData
    );
  }

  handleSaveBtnClick(addVoucherPayload) {
    const VOUCHERS_POST_URL = `${API_URL}/i-companies/${this.state.companyId}/vouchers`;
    axios
      .post(VOUCHERS_POST_URL, addVoucherPayload)
      .then(response => response.data)
      .then(data => {
        this.setState(
          {
            clearAddVoucherFormValues: !this.state.clearAddVoucherFormValues
          },
          this.getInitialState
        );
      })
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  handleDeleteVoucher() {
    const { companyId, selectedVoucherId } = this.state;

    const DELETE_VOUCHER_API_URL = `${API_URL}/i-companies/${companyId}/vouchers/${selectedVoucherId}`;

    axios
      .delete(DELETE_VOUCHER_API_URL)
      .then(response => response.data)
      .then(data => {
        this.setState(
          {
            selectedVoucherId: '',
            selectedVoucher: null,
            clearAddVoucherFormValues: !this.state.clearAddVoucherFormValues
          },
          this.getInitialState
        );

        // reset the voucher state in redux
        this.props.setLastVisitedVoucher(null);
      })
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  handleAddNote(payload) {
    const { companyId, selectedVoucherId } = this.state;

    const ADD_NOTE_URL = `${API_URL}/i-companies/${companyId}/vouchers/${selectedVoucherId}/internal-note`;

    if (payload.note !== '') {
      axios
        .post(ADD_NOTE_URL, payload)
        .then(response => response.data)
        .then(data => this.getVouchersData())
        .catch(error => {
          alert(
            error.response && error.response.data && error.response.data !== null
              ? error.response.data.error.message
              : 'Something went wrong, please try again!'
          );
        });
    }
  }

  handleRecordPayment(payload) {
    const { userId, companyId, selectedVoucherId } = this.state;

    const companyAccessToken = cookie.load(`${userId}@${companyId}`) || '';

    const RECORD_PAYMENT_URL = `${API_URL}/i-companies/${companyId}/voucher/${selectedVoucherId}/record-payment`;

    if (companyAccessToken) {
      axios.defaults.headers.common['authorization'] = companyAccessToken || '';

      axios
        .post(RECORD_PAYMENT_URL, payload)
        .then(response => response.data)
        .then(data => {
          this.setState({
            selectedVoucher: data,
            selectedVoucherId: data.id,
            resetRecordPaymentDialog: !this.state.resetRecordPaymentDialog
          });
        })
        .catch(error => {
          alert(
            error.response && error.response.data && error.response.data !== null
              ? error.response.data.error.message
              : 'Something went wrong, please try again!'
          );
        });
    }
  }

  handleAddContact(payload) {
    const { companyId } = this.state;
    const URL = `${API_URL}/i-companies/${companyId}/business-profile`;

    axios
      .post(URL, payload)
      .then(response => {
        this.setState(
          {
            openAddContact: false,
            resetToDefaultState: !this.state.resetToDefaultState
          },
          this.getContactsData
        );
      })
      .catch(error => {
        console.log('error message', error);
      });
  }

  render() {
    if (this.state.vouchersData === null) {
      return (
        <Container>
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        </Container>
      );
    }

    return (
      <Container>
        <LeftHalfContainer>
          <ListHeader
            type="title"
            title="Vouchers"
            icon={Add}
            to="#"
            onClick={() => {
              this.setState({
                openAddVoucher: !this.state.openAddVoucher
              });

              mixpanel.track('goto-voucher-create');
              ClevertapReact.event('goto-voucher-create');

              mixpanel.track('voucher-create-screen');
              ClevertapReact.event('voucher-create-screen');
            }}
          />

          {this.state.vouchersData !== null && !isEmpty(this.state.vouchersData) ? (
            <VouchersList>
              {this.state.vouchersData.map(voucher => (
                <VoucherCard
                  to="#"
                  replace
                  key={voucher.id}
                  onClick={() => {
                    // store the last visited voucher in redux
                    this.props.setLastVisitedVoucher(voucher);

                    this.setState({
                      selectedVoucher: voucher,
                      selectedVoucherId: voucher.id
                    });
                  }}
                  bgcolor={this.state.selectedVoucherId === voucher.id ? '#f9f9fb' : '#ffffff'}
                >
                  <LeftContainer>
                    <VoucherDetails>
                      <VoucherTitle>{voucher.type}</VoucherTitle>
                      <VoucherSubTitle>#{voucher.voucherNo}</VoucherSubTitle>
                    </VoucherDetails>
                  </LeftContainer>

                  <VoucherDetails>
                    <VoucherTitle>Rs {voucher.billTotalAmountAfterTax}</VoucherTitle>
                    <VoucherSubTitle type="time">
                      {moment(voucher.createdAt).format('h.mm A')}
                    </VoucherSubTitle>
                  </VoucherDetails>
                </VoucherCard>
              ))}
            </VouchersList>
          ) : (
            <VouchersList type="empty">
              <ImageHolder height="150px" width="100px" src={VouchersLogo} type="empty" />
              <VoucherTitle type="empty">
                You currently have no vouchers <br /> <br /> Click on the + button to add a voucher
              </VoucherTitle>
            </VouchersList>
          )}
        </LeftHalfContainer>

        {this.state.selectedVoucher !== null ? (
          <ViewVoucher
            selectedVoucher={this.state.selectedVoucher}
            addNote={payload => this.handleAddNote(payload)}
            deleteVoucherClick={() => this.handleDeleteVoucher()}
            resetRecordPaymentDialog={this.state.resetRecordPaymentDialog}
            recordPaymentSubmitClick={payload => this.handleRecordPayment(payload)}
          />
        ) : (
          <RightHalfContainer type="empty">
            <ImageHolder height="150px" width="100px" src={PhoneLogo} type="empty" />
            <VoucherTitle type="empty">
              Download Invock app and automatically <br /> sync vouchers with web
            </VoucherTitle>
            <ButtonExtended
              type="empty"
              to="#"
              replace
              onClick={() => window.open('https://play.google.com/store')}
            >
              Download App
            </ButtonExtended>
            <VoucherTitle type="empty">
              or <br /> <br />{' '}
              <StyledSpan
                onClick={() => this.setState({ openAddVoucher: !this.state.openAddVoucher })}
              >
                click here to add a voucher
              </StyledSpan>
            </VoucherTitle>
          </RightHalfContainer>
        )}

        <AddVoucher
          newAddedItem={this.state.newItem}
          itemsUpdatedState={this.state.itemsUpdatedState}
          addVoucherState={this.state.openAddVoucher}
          resetAddVoucherFormValues={this.state.clearAddVoucherFormValues}
          voucherItemsData={this.state.voucherItemsData}
          businesssAccountsData={this.state.businesssAccountsData}
          saveButtonClick={addVoucherPayload => this.handleSaveBtnClick(addVoucherPayload)}
          openAddItem={() => {
            this.setState({
              openAddItems: true
            });
          }}
          drawerOpen={() => {
            this.setState({
              openAddContact: true
            });
          }}
          voucherCloseClick={() => {
            this.setState({
              openAddVoucher: !this.state.openAddVoucher
            });
          }}
        />

        {this.state.openAddItems && (
          <AddItem
            openAddItem={this.state.openAddItems}
            itemCloseClick={() => this.setState({ openAddItems: false })}
            clearAddItemFormFields={this.state.clearAddItemFormFields}
            saveButtonClick={payload => this.handleAddItem(payload)}
          />
        )}

        {this.state.openAddContact && (
          <AddContact
            drawerOpen={this.state.openAddContact}
            resetToDefaultStateContact={this.state.resetToDefaultStateContact}
            drawerClose={() => {
              this.setState({
                openAddContact: false,
                resetToDefaultStateContact: true
              });
            }}
            checkForName={phone => this.checkForName(phone)}
            onSubmitHandler={payload => this.handleAddContact(payload)}
            alreadyExistsData={this.state.alreadyExistsData}
            updateName={name => this.updateName(name)}
            updatedNameSuccess={this.state.updatedNameSuccess}
          />
        )}
      </Container>
    );
  }
}

const mapStateToProps = ({ lastVisitedVoucher }) => ({ lastVisitedVoucher });

export default connect(mapStateToProps, { setLastVisitedVoucher })(Vouchers);

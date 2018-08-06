import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';

import { AutoFillInput } from '../../InputFields';
import { ThemeDefaultValues } from '../../../ThemeProvider';
import { AddDetailsLink } from '../AddDetailsLink';
import { Fields } from '../AddVoucherStyledComponents';

class PartySearch extends Component {
  state = {
    showLink: true
  };

  hideLink = () => this.setState({ showLink: false });

  render() {
    const {
      searchText,
      updateBusinessContact,
      selectedBusinessAccount,
      businessAccountsSuggestions
    } = this.props;

    return (
      <React.Fragment>
        {this.state.showLink ? (
          <AddDetailsLink
            img={ThemeDefaultValues.addVoucherImage.partyLinkImg}
            addDetailsFieds={'Party'}
            onClick={this.hideLink}
          />
        ) : (
          isEmpty(selectedBusinessAccount) && (
            <Fields>
              <AutoFillInput
                width="18rem"
                hint="Invock"
                labelText="Business Contact"
                searchText={searchText}
                dataSource={businessAccountsSuggestions}
                onUpdateInput={input => updateBusinessContact(input)}
              />
            </Fields>
          )
        )}
      </React.Fragment>
    );
  }
}

export default PartySearch;

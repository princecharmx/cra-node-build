import size from 'lodash/size';
import map from 'lodash/map';
import React from 'react';
import { MenuItem } from 'material-ui';

import {
  VerifiedByList,
  ItemCellContent,
  SelectedVoucherText,
  NotesContainer,
  NotesInputFields
} from '../ListAndViewVoucherStyledComponents';
import {
  Fields,
  FormRow,
  FormBlock,
  SummaryTitle,
  SummaryBlock,
  FormBlockTitle
} from '../AddVoucherStyledComponents';
import { ItemTextInput, ItemDropdown } from '../../InputFields';

const IntenalUseBlock = ({
  payload,
  showNotes,
  verifiedBy,
  setUserId,
  toggleShowNotes,
  teamMembersData,
  selectedUserId,
  addInternalNotes,
  handleAddVerifiedBy
}) => (
  <FormRow type="fourthRow">
    <FormBlock width="50%">
      <FormBlockTitle>For Internal Use</FormBlockTitle>
      <Fields>
        <SummaryBlock marginBottom="0px" paddingTop="30px" height="unset" alingItems="flex-start">
          <SummaryTitle>Verified By</SummaryTitle>
          <VerifiedByList>
            <VerifiedByList>
              {size(verifiedBy) > 0 &&
                map(verifiedBy, (item, index) => (
                  <ItemCellContent key={index} fontSize="14px" color="#868686">
                    {item.name}
                  </ItemCellContent>
                ))}
            </VerifiedByList>
            <VerifiedByList flexDirection="row" alignItems="center" justifyContent="center">
              <ItemDropdown
                width="100px"
                id={`verifiedBy`}
                value={selectedUserId}
                onChange={value => setUserId(value)}
              >
                {teamMembersData.map(item => (
                  <MenuItem value={item.id} primaryText={item.name} key={item.id} />
                ))}
              </ItemDropdown>
              <span
                style={{
                  fontSize: '14px',
                  color: '#428BCA',
                  marginLeft: '10px',
                  height: 'unset',
                  cursor: 'pointer',
                  lineHeight: '30px'
                }}
                onClick={() => selectedUserId !== '' && handleAddVerifiedBy()}
              >
                + add
              </span>
            </VerifiedByList>
          </VerifiedByList>
        </SummaryBlock>
      </Fields>
    </FormBlock>

    <FormBlock width="50%">
      <FormBlockTitle />
      <Fields>
        <SummaryBlock marginBottom="0px" paddingTop="30px">
          {showNotes === false ? (
            <SelectedVoucherText
              cursor="pointer"
              color="#428BCA"
              fontSize="15px"
              onClick={() => toggleShowNotes()}
            >
              Add Internal Notes
            </SelectedVoucherText>
          ) : (
            <NotesContainer>
              <NotesInputFields type="formField">
                <ItemTextInput
                  field="name"
                  page="showNote"
                  id="internalNotes"
                  containerHeight="20px"
                  containerWidth="180px"
                  hint="Add an internal note"
                  value={payload.internalNotes}
                  onChange={value => addInternalNotes(value)}
                />
              </NotesInputFields>
            </NotesContainer>
          )}
        </SummaryBlock>
      </Fields>
    </FormBlock>
  </FormRow>
);
export default IntenalUseBlock;

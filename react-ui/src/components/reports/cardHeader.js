import React from 'react';
import styled from 'styled-components';
import { AddDetailsLink } from './linkButtons';
import { ThemeDefaultValues } from '../../ThemeProvider';
import * as moment from 'moment';

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-container: space-between;
`;

const TitleWithFinancial = Container.extend`
  flex-direction: column;
`;

const AccountName = Container.extend`
  flex-direction: column;
  justify-container: center;
  align-item: center;
`;

const ButtonContainer = Container.extend`
  width: 60%;
  justify-content: flex-end;
`;

export const HeaderComponent = ({
  companyName,
  dateRange,
  showLedgerButton,
  showPeriodButton,
  showDetailButton,
  showDetailView,
  headerProperties,
  showLedgerView,
  showMonthlyView,
  showPeriodDialogAction
}) => (
  <Container>
    <TitleWithFinancial>
      <div>{companyName}</div>
      <div>
        {moment(dateRange.startDate).format('Do-MMM-YYYY')} to{' '}
        {moment(dateRange.endDate).format('Do-MMM-YYYY')}
      </div>
    </TitleWithFinancial>
    {showMonthlyView && (
      <AccountName>
        <div>{headerProperties.groupName}</div>
      </AccountName>
    )}
    <ButtonContainer>
      {headerProperties.renderSubGrp ? (
        showLedgerButton ? (
          <AddDetailsLink
            img={ThemeDefaultValues.report.ledgerWise}
            addDetailsFieds={'Ledger Wise'}
            onClick={showLedgerView}
          />
        ) : (
          <AddDetailsLink
            img={ThemeDefaultValues.report.groups}
            addDetailsFieds={'Group Wise'}
            onClick={showLedgerView}
          />
        )
      ) : null}
      {showPeriodButton && (
        <AddDetailsLink
          img={ThemeDefaultValues.report.period}
          addDetailsFieds={'Period'}
          onClick={showPeriodDialogAction}
        />
      )}
      {headerProperties.renderSubGrp && headerProperties.showDetailsCondencedBtn ? (
        showDetailButton ? (
          <AddDetailsLink
            img={ThemeDefaultValues.report.detailedView}
            addDetailsFieds={'Detail View'}
            onClick={showDetailView}
          />
        ) : (
          <AddDetailsLink
            img={ThemeDefaultValues.report.condenced}
            addDetailsFieds={'Condenced View'}
            onClick={showDetailView}
          />
        )
      ) : null}
    </ButtonContainer>
  </Container>
);

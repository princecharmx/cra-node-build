import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '../';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  background: transparent;
  justify-content: space-between;
`;

export const ListContainer = styled.div`
  width: 30%;
  display: flex;
  height: inherit;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
`;

export const ContactsList = styled.div`
  height: calc(100% - 60px);
  overflow: scroll;
  ${props =>
    props.type === 'empty' &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `};
`;

export const SelectedItemContainer = styled.div`
  display: flex;
  height: inherit;
  margin-left: 30px;
  width: calc(70% - 30px);
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
  ${props =>
    props.type === 'empty'
      ? `
    align-items: center;
    justify-content: center;
  `
      : `
    align-items: center;
    justify-content: flex-start;
  `};
`;

export const ContactCard = styled(Link)`
  height: 80px;
  display: flex;
  cursor: pointer;
  padding: 0px 30px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e7e7e8;
`;

export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ContactDetails = LeftContainer.extend`
  height: 40px;
  padding-left: 10px;
  align-items: flex-start;
  flex-direction: column;
`;

export const ContactTitle = styled.div`
  ${props =>
    props.type === 'empty'
      ? `
    width: 100%;
    color: #b2b2b2;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
  `
      : `
    font-size: 15px;
    color: #121212;
  `};
`;

export const ContactSubTitle = styled.div`
  font-size: 14px;
  color: ${props => (props.type === 'time' ? '#28d368' : '#b2b2b2')};
`;

export const LoaderContainer = styled.div`
  width: 80px;
  height: 80px;
`;

export const ButtonExtended = Button.extend`
  ${props =>
    props.type === 'empty' &&
    `
    margin: 20px 0px;
  `};
`;

export const StyledSpan = styled.span`
  width: 100%;
  color: #2e6eaf;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
`;

export const ContactListItem = ({ name, address, city, state }) => (
  <ContactCard key={`contact-${name}`} to="#" replace>
    <LeftContainer>
      <ContactDetails>
        <ContactTitle>{name}</ContactTitle>
        <ContactSubTitle>{`${address}, ${city}, ${state}`}</ContactSubTitle>
      </ContactDetails>
    </LeftContainer>
  </ContactCard>
);

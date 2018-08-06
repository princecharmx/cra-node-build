import React from 'react';
import styled from 'styled-components';
import { ImageHolder } from '../AppStyledComponents';

const AddLinkContainer = styled.div`
  display: flex;
  color: blue;
  padding: 0.3rem;
  align-items: baseline;
  cursor: pointer;
  font-family: roboto;
  margin-left: 5px;
`;
export const AddDetailsLink = props => (
  <AddLinkContainer onClick={props.onClick}>
    {props.img ? <ImageHolder src={props.img} position="relative" top="7px" left="-3px" /> : ''}
    {`${props.addDetailsFieds}`}
  </AddLinkContainer>
);

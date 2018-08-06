import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #f9f9fb;
  font-family: 'Dax Regular';
  justify-content: space-between;
  border-bottom: 1px solid #e7e7e8;
  ${props =>
    props.type === 'title'
      ? `
    padding: 0px 30px;
  `
      : `
    padding: 0px 20px;
  `};
`;

const Title = styled.div`
  color: #aaaaaa;
  cursor: default;
  font-size: 20px;
  font-family: 'Dax Regular';
  font-weight: ${props => (props.type === 'title' ? '600' : '400')};
`;

const StyledImg = styled.img`
  background-color: transparent;
  width: ${props => (props.imgWidth ? props.imgWidth : '20px')};
  height: ${props => (props.imgHeight ? props.imgHeight : '20px')};
`;

const StyledLink = styled(Link)`
  cursor: pointer;
`;

const ListHeader = ({ title, onClick, to, icon, imgHeight, imgWidth, type, onMouseOver }) => (
  <Container type={type} onMouseOver={onMouseOver}>
    <Title type={type}>{title}</Title>
    {icon && (
      <StyledLink to={to || '#'} replace onClick={onClick}>
        <StyledImg src={icon} imgHeight={imgHeight} imgWidth={imgWidth} />
      </StyledLink>
    )}
  </Container>
);

export { ListHeader };

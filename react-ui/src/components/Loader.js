import React from 'react';
import styled, { keyframes } from 'styled-components';

const Rotate = keyframes`
  0% {
    -webkit-transform: rotate(0deg) scale(0.8);
    -moz-transform: rotate(0deg) scale(0.8);
  }
  50% {
    -webkit-transform: rotate(360deg) scale(1.2);
    -moz-transform: rotate(360deg) scale(1.2);
  }
  100% {
    -webkit-transform: rotate(720deg) scale(0.8);
    -moz-transform: rotate(720deg) scale(0.8);
  }
`;

const Ball1 = keyframes`
  0% {
    box-shadow: 30px 0 0 #FFBE2D;
  }
  50% {
    box-shadow: 0 0 0 #FFBE2D;
    margin-bottom: 0;
    -webkit-transform: translate(15px,15px);
    -moz-transform: translate(15px, 15px);
  }
  100% {
    box-shadow: 30px 0 0 #FFBE2D;
    margin-bottom: 10px;
  }
`;

const Ball2 = keyframes`
  0% {
    box-shadow: 30px 0 0 #5AD797;
  }
  50% {
    box-shadow: 0 0 0 #5AD797;
    margin-top: -20px;
    -webkit-transform: translate(15px,15px);
    -moz-transform: translate(15px, 15px);
  }
  100% {
    box-shadow: 30px 0 0 #5AD797;
    margin-top: 0;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner = styled.div`
  animation: ${Rotate} 1s infinite;
  height: 50px;
  width: 50px;
  &::before {
    border-radius: 50%;
    content: '';
    display: block;
    height: 20px;
    width: 20px;
    animation: ${Ball1} 1s infinite;
    background-color: #ff5f57;
    box-shadow: 30px 0 0 #ffbe2d;
    margin-bottom: 10px;
  }
  &::after {
    border-radius: 50%;
    content: '';
    display: block;
    height: 20px;
    width: 20px;
    animation: ${Ball2} 1s infinite;
    background-color: #558dff;
    box-shadow: 30px 0 0 #5ad797;
  }
`;

export const Loader = () => (
  <LoadingWrapper>
    <LoadingSpinner />
  </LoadingWrapper>
);

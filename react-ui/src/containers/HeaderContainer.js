import React from 'react';
import styled from 'styled-components';

import { AppBar } from 'material-ui/';
import { HeaderItem } from '../components';
import { resetAll } from '../images';

import { removeLocalStorage } from '../utils';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '0 auto',
    marginRight: '0 auto',
    backgroundColor: '#20bea6',
    padding: '0px 125px'
  }
};

const LeftBar = styled.div`
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftHeaderElement = () => (
  <LeftBar style={{ marginTop: '-8px', marginLeft: 'auto' }}>
    <HeaderItem style={{ position: 'relative', right: '80px' }}>Features</HeaderItem>
    <HeaderItem
      style={{ position: 'relative', right: '50px' }}
      onClick={() => window.open('https://play.google.com/store')}
    >
      Download the app
    </HeaderItem>
    <HeaderItem style={{ marginTop: '6px' }} onClick={() => removeLocalStorage()}>
      <img alt="Reset" src={resetAll} height="16px" />
    </HeaderItem>
  </LeftBar>
);

export const Header = () => (
  <AppBar
    style={styles.header}
    iconElementLeft={<div />}
    iconElementRight={<LeftHeaderElement />}
    title={<HeaderItem type="title">Invock</HeaderItem>}
  />
);

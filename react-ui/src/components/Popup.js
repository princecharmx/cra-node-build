import React from 'react';
import { Dialog } from 'material-ui';

const styles = {
  title: {
    margin: '0px',
    fontWeight: '400',
    lineHeight: '32px',
    padding: '24px 24px 20px',
    color: 'rgba(0, 0, 0, 0.87)'
  }
};

const Popup = ({ openPopup, popupButtons, label, children, popupWidth }) => (
  <Dialog
    title={label || ''}
    modal={false} // prevent close on outside click
    actions={popupButtons}
    open={openPopup || false}
    titleStyle={styles.title}
    autoScrollBodyContent={true}
    contentStyle={{ width: popupWidth }}
    bodyStyle={{ padding: '2px 24px 24px' }}
  >
    {children}
  </Dialog>
);

export { Popup };

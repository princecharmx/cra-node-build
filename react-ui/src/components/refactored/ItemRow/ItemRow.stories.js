import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ItemRow } from './Items';
import { store, persistor } from '../../../store';

//for testing purpose, will remove later.
const item = {
  qty: 1,
  hsn: '212454',
  unit: 'gms',
  itemId: '7',
  itemName: 'Test item',
  taxAmount: 10,
  lineAmount: 20,
  qtySellPrice: 20,
  taxPercentage: 2,
  discountUnit: '%',
  discountValue: 2,
  unitSellPrice: 20,
  itemSkuBarCode: 'ASO125454',
  discountAmount: 2,
  discountIconChange: false,
  showItemPicker: true
};

storiesOf('ItemRow', module)
  .addDecorator(story => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {story()}
      </PersistGate>
    </Provider>
  ))
  .add('ItemRow', () => <ItemRow />);

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { storiesOf } from '@storybook/react';
import { store, persistor } from '../../../../store';
import { TaxAnalysis } from './index';

storiesOf('Tax Analysis', module)
  .addDecorator(story => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {story()}
      </PersistGate>
    </Provider>
  ))

  .add('Tax Analysis', () => <TaxAnalysis />);

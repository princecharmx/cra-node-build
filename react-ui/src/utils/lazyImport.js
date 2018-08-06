import React from 'react';
import Loadable from 'react-loadable';
import { LoaderContainer } from '../components/Dashboard';
import { Loader } from '../components';

const Loading = () => {
  return (
    <LoaderContainer>
      <Loader />
    </LoaderContainer>
  );
};

const LazyImport = componentPath =>
  Loadable({
    loader: componentPath,
    loading: Loading
  });

export default LazyImport;

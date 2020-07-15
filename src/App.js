import React, { useEffect, useState } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { DataProvider } from '@dhis2/app-runtime'
import { Store } from './Store';
import { Provider } from './context/context';
import { useConfig } from '@dhis2/app-runtime';
import { LandingPage } from './components/LandingPage';
import 'mobx-react/batchingForReactDom';
import { Spin } from 'antd';

import 'antd/dist/antd.css';
import './styles/tailwind.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './app.css';

const MyApp = () => {
  const engine = useDataEngine();
  const { baseUrl, apiVersion } = useConfig();
  const rootStore = new Store(engine, baseUrl, apiVersion);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    rootStore.setD2().then(() => {
      rootStore.fetchPresentations().then(() => {
        setLoading(false);
      });
    })
  }, [rootStore]);

  return <Provider value={rootStore}>
    <DataProvider>
      {loading ? <div className="height-48"><Spin size="large" /></div> : <LandingPage />}
    </DataProvider>
  </Provider>
}

export default MyApp

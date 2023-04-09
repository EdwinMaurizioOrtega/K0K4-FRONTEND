import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import '../styles/demo/Demos.scss';
import '../styles/layout/layout.scss';
import {reducers} from '../demo/reducers';
// redux
import { Provider as ReduxProvider } from 'react-redux';


import { createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

const store = createStore(reducers, {}, compose(applyMiddleware(thunk)));

export default function MyApp({ Component, pageProps }) {
    if (Component.getLayout) {
        return <ReduxProvider store={store}><LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider></ReduxProvider>

        ;
    } else {
        return (
            <ReduxProvider store={store}>
            <LayoutProvider>

                <Layout>

                        <Component {...pageProps} />

                </Layout>

            </LayoutProvider>
            </ReduxProvider>
        );
    }
}

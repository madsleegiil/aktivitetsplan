import './polyfill';

import NAVSPA from '@navikt/navspa';
import { setDefaultOptions } from 'date-fns';
import nn from 'date-fns/locale/nn';
import React from 'react';
import * as ReactDOM from 'react-dom';

import AppWebComponent from './AppWebComponent';
import { eksternBrukerConfig, veilederConfig } from './mocks/appconfig';
import DemoBanner from './mocks/demo/demoBanner';
import { erEksternBruker } from './mocks/demo/sessionstorage';
import { renderAsReactRoot } from './rootWrapper';

declare global {
    interface Window {
        NAVSPA: any;
        Intl: any;
        appconfig: {
            CONTEXT_PATH: string;
            TILLAT_SET_AVTALT: boolean;
            VIS_MALER: boolean;
            TIMEOUTBOX: boolean;
        };
    }
}
setDefaultOptions({ locale: nn });

const usingHashRouting: boolean = import.meta.env.VITE_USE_HASH_ROUTER === 'true';

const mockfnr = '12345678910';

const useMock = import.meta.env.DEV || usingHashRouting;

const rootElement = document.getElementById('mainapp') as HTMLElement;

const exportToNavSpa = () => {
    NAVSPA.eksporter('aktivitetsplan', AppWebComponent);
    // Denne må lazy importeres fordi den laster inn all css selv inn under sin egen shadow-root
    import('./webcomponentWrapper').then(({ DabAktivitetsplan }) => {
        customElements.define('dab-aktivitetsplan', DabAktivitetsplan);
    });
};

const renderAsRootApp = (props?: { fnr?: string }) => {
    renderAsReactRoot(rootElement, props);
};

const renderApp = (props?: { fnr?: string }) => {
    if (['dev-intern', 'prod-intern'].includes(import.meta.env.MODE)) {
        exportToNavSpa();
    } else {
        renderAsRootApp(props);
    }
};

if (useMock) {
    const fnr = mockfnr;
    const pathnamePrefix = `${import.meta.env.BASE_URL}${usingHashRouting ? '#/' : ''}`;
    if (erEksternBruker()) {
        window.history.replaceState({}, '', pathnamePrefix);
        window.appconfig = eksternBrukerConfig;
    } else if (!erEksternBruker()) {
        window.history.replaceState({}, '', pathnamePrefix + fnr);
        window.appconfig = veilederConfig;
    }

    import('./mocks')
        .then(({ default: startWorker }) => startWorker())
        .then(() => {
            ReactDOM.render(<DemoBanner />, document.getElementById('demo'));
            const props = { fnr: erEksternBruker() ? undefined : mockfnr };
            renderApp(props);
        });
} else {
    renderApp();
}

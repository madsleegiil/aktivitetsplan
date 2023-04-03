import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAppDispatch from '../felles-komponenter/hooks/useAppDispatch';
import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import { hentDialog } from '../moduler/dialog/dialog-reducer';
import HovedsideFeilmelding from '../moduler/feilmelding/HovedsideFeilmelding';
import Nivaa4Feilmelding from '../moduler/feilmelding/IkkeNiva4';
import InformasjonsHenting from '../moduler/informasjon/informasjonHenting';
import Maal from '../moduler/mal-linje/MittMaal';
import OppfolgingStatus from '../moduler/oppfolging-status/OppfolgingStatus';
import { hentEskaleringsvarsel } from '../moduler/varslinger/eskaleringsvarselReducer';
import Varslinger from '../moduler/varslinger/Varslinger';
import Navigasjonslinje from '../moduler/verktoylinje/Navigasjonslinje';
import Verktoylinje from '../moduler/verktoylinje/Verktoylinje';
import { aktivitetRoute } from '../routes';
import Aktivitetstavle from './tavle/Aktivitetstavle';

const Hovedside = () => {
    const navigate = useNavigate();
    useEventListener('visAktivitetsplan', (event) => {
        const aktivitetId = event.detail as string | undefined;
        if (!aktivitetId) return;
        navigate(aktivitetRoute(aktivitetId));
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hentDialog());
        dispatch(hentEskaleringsvarsel());
    }, []);

    return (
        <main id="main" className="hovedside">
            <div className="flex items-center flex-col h-full">
                <HovedsideFeilmelding />
                <Nivaa4Feilmelding />
                <OppfolgingStatus>
                    <InformasjonsHenting />
                    <Varslinger />
                    <div className="container flex flex-col gap-y-6">
                        <Navigasjonslinje />
                        <Maal />
                        <Verktoylinje />
                    </div>
                    <Aktivitetstavle />
                </OppfolgingStatus>
                <Outlet />
            </div>
        </main>
    );
};

export default Hovedside;

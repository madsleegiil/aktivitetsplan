import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { STATUS } from '../../api/utils';
import { loggHarBruktNivaa4, loggIkkeRegistrertIKrr } from '../../felles-komponenter/utils/logging';
import { selectErVeileder } from '../identitet/identitet-selector';
import {
    selectErBrukerManuell,
    selectOppfolgingSlice,
    selectOppfolgingStatus,
    selectReservasjonKRR,
} from '../oppfolging-status/oppfolging-selector';
import { selectNivaa4, selectNivaa4LastetOk } from '../tilgang/tilgang-selector';
import styles from './Feilmelding.module.less';

const Mere = () => (
    <Hjelpetekst type={PopoverOrientering.Under}>
        Denne brukeren har ikke vært innlogget de siste 18 månedene med nivå 4 (for eksempel BankID). <br />
        Du kan derfor ikke sende forhåndsorientering, varsel og meldinger.
    </Hjelpetekst>
);

const Nivaa4Feilmelding = () => {
    const niva4 = useSelector(selectNivaa4);
    const lastetOk = useSelector(selectNivaa4LastetOk);
    const erreservertKRR = useSelector(selectReservasjonKRR);
    const erVeileder = useSelector(selectErVeileder);
    const erManuell = useSelector(selectErBrukerManuell);
    const oppfolging = useSelector(selectOppfolgingSlice).data;
    const oppfolgingLastetOk = useSelector(selectOppfolgingStatus) === STATUS.OK;

    // todo fjern dette etter innsikt er gjort
    useEffect(() => {
        if (!oppfolgingLastetOk) return;
        if (erVeileder) {
            const { reservasjonKRR, manuell, kanVarsles } = oppfolging;
            const ikkeRegistrertIKRR = !reservasjonKRR && !manuell && !kanVarsles;
            if (ikkeRegistrertIKRR) {
                loggIkkeRegistrertIKrr();
            }
        }
    }, [oppfolging, erVeileder, oppfolgingLastetOk]);

    useEffect(() => {
        if (!lastetOk) return;
        if (erVeileder) {
            loggHarBruktNivaa4(niva4);
        }
    }, [niva4, erVeileder, lastetOk]);

    if (niva4 || !lastetOk || erManuell || erreservertKRR) {
        return null;
    }

    return (
        <div className={styles.feilmelding}>
            <AlertStripeAdvarsel>
                Denne brukeren kan ikke logge inn i aktivitetsplan og dialog.
                <Mere />
            </AlertStripeAdvarsel>
        </div>
    );
};

export default Nivaa4Feilmelding;

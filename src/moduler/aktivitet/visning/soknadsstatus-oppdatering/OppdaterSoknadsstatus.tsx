import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { AVSLAG } from '../../../../constant';
import { Aktivitet, StillingFraNavSoknadsstatus } from '../../../../datatypes/aktivitetTypes';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { oppdaterStillingFraNavSoknadsstatus } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import StillingFraNavEtikett from '../../etikett/StillingFraNavEtikett';
import styles from '../dele-cv/DeleCvSvarVisning.module.less';
import EndreLinje from '../endre-linje/endre-linje';
import SoknadsstatusForm from './SoknadsstatusForm';

const useDisableSoknadsstatusEndring = (aktivitet: Aktivitet) => {
    const { historisk } = aktivitet;
    const lasterAktivitet = useSelector(selectLasterAktivitetData);
    const erUnderOppfolging = useSelector(selectErUnderOppfolging);
    const kanEndreAktivitet = !historisk;

    return lasterAktivitet || !erUnderOppfolging || !kanEndreAktivitet;
};

const lagreSoknadsstatus = (dispatch: Dispatch, value: SoknadsstatusValue, aktivitet: Aktivitet): Promise<any> => {
    const { soknadsstatus } = value;

    if (soknadsstatus === aktivitet.stillingFraNavData?.soknadsstatus) {
        return Promise.resolve();
    }

    return oppdaterStillingFraNavSoknadsstatus(aktivitet.id, aktivitet.versjon, soknadsstatus)(dispatch);
};

interface Props {
    aktivitet: Aktivitet;
}

interface SoknadsstatusValue {
    soknadsstatus: StillingFraNavSoknadsstatus;
}

const OppdaterSoknadsstatus = (props: Props) => {
    const { aktivitet } = props;
    const [endring, setEndring] = useState(false);
    const dispatch = useDispatch();
    const disableSoknadsstatusEndring = useDisableSoknadsstatusEndring(aktivitet);

    const onSubmit = (value: SoknadsstatusValue): Promise<any> =>
        lagreSoknadsstatus(dispatch, value, aktivitet).then(() => {
            setEndring(false);
            document.querySelector<HTMLElement>('.aktivitet-modal')?.focus();
        });

    const endretAvOss = aktivitet.lagtInnAv == 'BRUKER';
    const ikkeAvslag = AVSLAG != aktivitet.stillingFraNavData?.soknadsstatus;
    const kanEndre = ikkeAvslag || endretAvOss;
    const skalViseInfoBoks = !kanEndre;

    const visning = (
        <>
            <StillingFraNavEtikett etikett={aktivitet.stillingFraNavData?.soknadsstatus} />
            {skalViseInfoBoks && (
                <AlertStripeInfo className={styles.infoStripe}>
                    Vi har fått beskjed om at arbeidsgiver har ansatt en person. Dessverre var det ikke deg denne
                    gangen. Ansettelsesprosessen er ferdig.
                </AlertStripeInfo>
            )}
        </>
    );
    const form = <SoknadsstatusForm disabled={disableSoknadsstatusEndring} aktivitet={aktivitet} onSubmit={onSubmit} />;

    return (
        <EndreLinje
            tittel="Hvor er du i søknadsprosessen?"
            form={form}
            endring={endring}
            kanEndre={kanEndre}
            setEndring={setEndring}
            visning={visning}
        />
    );
};

export default OppdaterSoknadsstatus;

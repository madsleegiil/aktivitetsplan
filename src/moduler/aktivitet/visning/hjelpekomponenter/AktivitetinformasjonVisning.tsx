import { Heading } from '@navikt/ds-react';
import React from 'react';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    EKSTERN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../../constant';
import { AktivitetType, AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { isSamtaleOrMote } from '../../../../datatypes/internAktivitetTypes';
import AvtaltMarkering from '../../avtalt-markering/AvtaltMarkering';
import IkkeDeltFerdigMarkering, {
    SkalIkkeDeltFerdigMarkeringVises,
} from '../../ikke-delt-ferdig-markering/IkkeDeltFerdigMarkering';
import AktivitetIngress from '../aktivitetingress/AktivitetIngress';
import AvtaltContainer from '../avtalt-container/AvtaltContainer';
import Aktivitetsdetaljer from '../detaljer/Aktivitetsdetaljer';
import ActionRad from './ActionRad';

const VisningIngress = ({ aktivitetstype }: { aktivitetstype: AktivitetType }) => {
    if (
        [
            EGEN_AKTIVITET_TYPE,
            IJOBB_AKTIVITET_TYPE,
            STILLING_AKTIVITET_TYPE,
            BEHANDLING_AKTIVITET_TYPE,
            EKSTERN_AKTIVITET_TYPE,
        ].includes(aktivitetstype)
    ) {
        return null;
    }

    return <AktivitetIngress aktivitetstype={aktivitetstype} />;
};

interface Props {
    valgtAktivitet: AlleAktiviteter;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

const AktivitetinformasjonVisning = (props: Props) => {
    const { valgtAktivitet, tillatEndring, laster, underOppfolging } = props;
    const { tittel, type, avtalt } = valgtAktivitet;

    const deltFerdigMarkeringSkalVises = isSamtaleOrMote(valgtAktivitet)
        ? SkalIkkeDeltFerdigMarkeringVises(valgtAktivitet)
        : false;

    return (
        <div className="space-y-8 mb-8">
            <div className="space-y-8">
                <Heading level="1" className="my-4" size="large" id="modal-aktivitetsvisning-header">
                    {tittel}
                </Heading>
                <VisningIngress aktivitetstype={type} />
                <AvtaltMarkering hidden={!avtalt} />
                <IkkeDeltFerdigMarkering visible={deltFerdigMarkeringSkalVises} />
            </div>
            <AvtaltContainer underOppfolging={underOppfolging} aktivitet={valgtAktivitet} />
            <Aktivitetsdetaljer valgtAktivitet={valgtAktivitet} />
            <ActionRad
                aktivitet={valgtAktivitet}
                tillatEndring={tillatEndring}
                laster={laster}
                underOppfolging={underOppfolging}
            />
        </div>
    );
};

export default AktivitetinformasjonVisning;

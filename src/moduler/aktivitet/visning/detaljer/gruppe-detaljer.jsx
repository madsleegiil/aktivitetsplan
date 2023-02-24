import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { GRUPPE_AKTIVITET_TYPE } from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import { HiddenIf, formaterDatoKortManed, formaterDatoKortManedTid, formaterTid } from '../../../../utils';
import Informasjonsfelt, { HiddenIfInformasjonsfelt } from '../hjelpekomponenter/Informasjonsfelt';
import { Beskrivelse, FraDato, TilDato } from '../hjelpekomponenter/standard-felt';

const Motaplan = (planListe) => (
    <span>
        {planListe.planListe.map((mote) => (
            <BodyShort key={mote.startDato} tag="span">
                {formaterDatoKortManedTid(mote.startDato)}
                {formaterTid(mote.sluttDato) === '00:00' ? '' : ` - ${formaterTid(mote.sluttDato)}`},{` ${mote.sted}`}
            </BodyShort>
        ))}
    </span>
);

function GruppeDetaljer({ aktivitet }) {
    const { fraDato, tilDato, moeteplanListe } = aktivitet;
    const erGruppeDatoLike = formaterDatoKortManed(fraDato) === formaterDatoKortManed(tilDato);

    return (
        <HiddenIf hidden={aktivitet.type !== GRUPPE_AKTIVITET_TYPE}>
            <div className="aktivitetvisning__detaljer">
                <FraDato aktivitet={aktivitet} visIkkeSatt hidden={erGruppeDatoLike} />
                <TilDato aktivitet={aktivitet} visIkkeSatt hidden={erGruppeDatoLike} />
                <HiddenIfInformasjonsfelt
                    hidden={!erGruppeDatoLike}
                    key="likeGruppeDato"
                    tittel={<FormattedMessage id="aktivitetdetaljer.dato-tekst.gruppeaktivitet" />}
                    innhold={formaterDatoKortManed(fraDato) || 'Dato ikke satt'}
                />
                <Informasjonsfelt
                    key="moteplanutenslutteklokke"
                    tittel={<FormattedMessage id="aktivitetdetaljer.moteplan-label" />}
                    beskrivelse
                    innhold={<Motaplan planListe={moeteplanListe} />}
                />
                <Beskrivelse aktivitet={aktivitet} />
            </div>
        </HiddenIf>
    );
}

GruppeDetaljer.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default GruppeDetaljer;

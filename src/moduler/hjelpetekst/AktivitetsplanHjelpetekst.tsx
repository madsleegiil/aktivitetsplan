import { HelpText } from '@navikt/ds-react';
import React from 'react';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../constant';
import { AktivitetStatus } from '../../datatypes/aktivitetTypes';

const hjelpetekster: Record<AktivitetStatus, { tittel: string; innhold: string }> = {
    [STATUS_BRUKER_ER_INTRESSERT]: {
        tittel: 'Informasjon om statusen Forslag',
        innhold:
            'Her kan du legge til en aktivitet du tror du kommer til å gjøre. Dra aktiviteten til "Planlegger" når du bestemmer deg for å gjøre aktiviteten.',
    },
    [STATUS_PLANLAGT]: {
        tittel: 'Informasjon om statusen Planlegger',
        innhold:
            'Her kan du legge til en aktivitet som du planlegger å gjøre. Når du starter å gjøre aktiviteten, drar du den til "Gjennomfører".',
    },
    [STATUS_GJENNOMFOERT]: {
        tittel: 'Informasjon om statusen Gjennomfører',
        innhold: 'Aktiviteter som du holder på med, kan du sette til "Gjennomfører".',
    },
    [STATUS_FULLFOERT]: {
        tittel: 'Informasjon om statusen Fullført',
        innhold:
            'Dra aktiviteter hit som du er ferdig med. Flytter du en aktivitet til "Fullført", blir den låst og kan ikke redigeres. Hvis du angrer, kan du legge til en ny aktivitet.',
    },
    [STATUS_AVBRUTT]: {
        tittel: 'Informasjon om statusen Avbrutt',
        innhold:
            'Dra aktiviteter hit som du avslutter eller ikke begynner på. Flytter du en aktivitet til "Avbrutt", blir den låst og kan ikke redigeres. Hvis du angrer, kan du legge til en ny aktivitet.',
    },
};

interface Props {
    status: AktivitetStatus;
}

const AktivitetsplanHjelpetekst = ({ status }: Props) => {
    const config = hjelpetekster[status];
    const { tittel, innhold } = config;

    return (
        <HelpText placement={'bottom-end'} id={status} aria-label={tittel} title={tittel}>
            <div className="w-80">{innhold}</div>
        </HelpText>
    );
};

export default AktivitetsplanHjelpetekst;

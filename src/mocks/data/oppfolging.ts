import { RestRequest } from 'msw';

import { erKRRBruker, erManuellBruker, erPrivatBruker, ingenOppfPerioder } from '../demo/sessionstorage';

const oppfPerioder = [
    {
        aktorId: '1234567988888',
        veileder: null,
        startDato: '2017-01-30T10:46:10.971+01:00',
        sluttDato: '2017-12-31T10:46:10.971+01:00',
        begrunnelse: null,
        kvpPerioder: [
            {
                aktorId: '1234567988888',
                enhet: 'Z134',
                opprettetAv: 'ZOO',
                opprettetDato: '2017-01-30T10:46:10.971+01:00',
                opprettetBegrunnelse: 'Vet ikke helt',
                opprettetKodeVerkbruker: 'NAV',
                avsluttetAV: 'ZOO',
                avsluttetDato: '2017-12-01T10:46:10.971+01:00',
                avsluttetBegrunnelse: 'vet ikke',
                avsluttetKodeverkbruker: 'NAV',
            },
            {
                aktorId: '1234567988888',
                enhet: 'Z134',
                opprettetAv: 'ZOO',
                opprettetDato: '2017-12-01T10:46:10.971+01:00',
                opprettetBegrunnelse: 'Vet ikke helt',
                opprettetKodeVerkbruker: 'NAV',
                avsluttetAV: 'ZOO',
                avsluttetDato: '2017-12-02T10:46:10.971+01:00',
                avsluttetBegrunnelse: 'vet ikke',
                avsluttetKodeverkbruker: 'NAV',
            },
        ],
    },
    {
        aktorId: '1234567988888',
        veileder: null,
        startDato: '2018-01-31T10:46:10.971+01:00',
        sluttDato: null,
        begrunnelse: null,
    },
];

const oppfolging = {
    fnr: null,
    aktorId: '1234567988888',
    veilederId: null,
    reservasjonKRR: erKRRBruker(),
    manuell: erManuellBruker(),
    underOppfolging: !erPrivatBruker(),
    underKvp: false,
    oppfolgingUtgang: null,
    kanStarteOppfolging: false,
    avslutningStatus: null,
    oppfolgingsPerioder: ingenOppfPerioder() ? [] : oppfPerioder,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    servicegruppe: 'IVURD',
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00',
};

export const mockOppfolging = oppfolging;

export const getOppfolging = (req: RestRequest) => {
    (oppfolging as any).fnr = req.url.searchParams.get('fnr') ?? undefined;
    return oppfolging;
};

export function settDigital() {
    oppfolging.manuell = false;
    return oppfolging;
}

export const avslutningStatus = () => {
    (oppfolging as any).avslutningStatus = {
        kanAvslutte: true,
        underOppfolging: false,
        harYtelser: true,
        harTiltak: true,
        underKvp: false,
        inaktiveringsDato: '2018-06-05T00:00:00+02:00',
    };
    return oppfolging;
};

export default getOppfolging;

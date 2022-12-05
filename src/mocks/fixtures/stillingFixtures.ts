import { StillingAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';

let id = 12000;
let versjon = 6000000;

export const enStillingAktivitet = ({ tittel }: { tittel: string }): StillingAktivitet => {
    versjon += 1000;
    id += 10;

    return {
        id: `${id}`,
        versjon: `${versjon}`,
        tittel: `${tittel}`,
        beskrivelse: 'Ærlig arbeid',
        lenke: 'www.nav.no',
        type: VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
        status: 'PLANLAGT',
        fraDato: '2018-01-24T12:00:00+01:00',
        tilDato: '2030-01-24T12:00:00+01:00',
        opprettetDato: '2018-01-31T10:46:51.622+01:00',
        endretDato: '2018-09-30T10:46:51.622+01:00',
        endretAv: 'z990207',
        historisk: false,
        avtalt: false,
        lagtInnAv: 'NAV',
        transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
        filterTags: [],
    };
};

import { RequestStatus, STATUS } from '../../api/utils';
import { OppfolgingStatus, OppfolgingsPeriode } from '../../datatypes/oppfolgingTypes';
import { State } from '../../reducer';
import { getNowAsISODate } from '../../utils';
import { selectHistoriskeOppfolgingsPerioder } from './oppfolging-selectorts';

export function selectOppfolgingSlice(state: State) {
    return state!!.data.oppfolging;
}

function selectOppfolgingData(state: State): OppfolgingStatus {
    return selectOppfolgingSlice(state).data;
}

export function selectOppfolgingStatus(state: State): RequestStatus {
    return selectOppfolgingSlice(state).status;
}

export const selectReservasjonKRR = (state: State) => selectOppfolgingData(state).reservasjonKRR;

export function selectServicegruppe(state: State) {
    return selectOppfolgingData(state).servicegruppe;
}

export function selectOppfolgingsPerioder(state: State): OppfolgingsPeriode[] {
    return selectOppfolgingData(state).oppfolgingsPerioder || [];
}

export function selectSorterteHistoriskeOppfolgingsPerioder(state: State) {
    let nesteFra = getNowAsISODate();
    return selectHistoriskeOppfolgingsPerioder(state)
        .sort((a, b) => a.sluttDato.localeCompare(b.sluttDato))
        .map((periode) => {
            const { sluttDato } = periode;
            const fra = nesteFra;
            nesteFra = sluttDato;
            return {
                id: sluttDato,
                fra,
                til: sluttDato,
                vistFra: periode.startDato,
            };
        })
        .reverse();
}

export function selectKvpPeriodeForValgteOppfolging(state: State) {
    const valgtOppfolging = state!!.data.filter.historiskPeriode;
    const valgtOppfolgingId = valgtOppfolging && valgtOppfolging.id;
    const oppfolging = selectOppfolgingsPerioder(state).find((p) => p.sluttDato === valgtOppfolgingId);
    return oppfolging && oppfolging.kvpPerioder;
}

export function selectErUnderOppfolging(state: State) {
    return selectOppfolgingData(state).underOppfolging;
}

export function selectErBrukerManuell(state: State) {
    return selectOppfolgingData(state).manuell;
}

export function selectAktorId(state: State) {
    return selectOppfolgingData(state).aktorId;
}

export function selectUnderOppfolging(state: State) {
    return selectOppfolgingData(state).underOppfolging;
}

export function selectErUnderKvp(state: State) {
    return selectOppfolgingData(state).underKvp;
}

export function selectHarSkriveTilgang(state: State) {
    return selectOppfolgingData(state).harSkriveTilgang;
}

export function selectKanReaktiveres(state: State) {
    return selectOppfolgingData(state).kanReaktiveres;
}

export function selectInaktiveringsDato(state: State) {
    return selectOppfolgingData(state).inaktiveringsdato;
}

export function selectOppfolgingFeilmeldinger(state: State) {
    const feilMeldingsdata = selectOppfolgingStatus(state) === STATUS.ERROR && selectOppfolgingSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
}

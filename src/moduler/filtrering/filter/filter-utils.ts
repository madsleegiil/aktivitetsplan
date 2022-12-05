import { isBefore, isWithinInterval } from 'date-fns';
import { Store } from 'redux';

import { AlleAktiviteter, isArenaAktivitet, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { isEksternAktivitet } from '../../../datatypes/internAktivitetTypes';
import { State } from '../../../reducer';
import { selectForrigeHistoriskeSluttDato } from '../../oppfolging-status/oppfolging-selectorts';
import { getType } from './AktivitetTypeFilter';
import { getArenaFilterableFields, getEksternFilterableFields } from './ArenaEtikettFilter';
import {
    selectAktivitetAvtaltMedNavFilter,
    selectAktivitetEtiketterFilter,
    selectAktivitetStatusFilter,
    selectAktivitetTyperFilter,
    selectArenaAktivitetEtiketterFilter,
    selectHistoriskPeriode,
} from './filter-selector';

function erAktivtFilter(filterData: any) {
    return Object.values(filterData).indexOf(true) >= 0;
}

// TODO depricated see selectDatoErIPeriode
export interface Periode {
    fra: string;
    til: string;
}

export function selectDatoErIPeriode(dato: string, state: State): boolean {
    const historiskPeriode = selectHistoriskPeriode(state);
    const forrigeHistoriskeSluttDato = selectForrigeHistoriskeSluttDato(state);

    return datoErIPeriode(dato, historiskPeriode, forrigeHistoriskeSluttDato);
}

//TODO: Flytte til utils når den er ts
const isAfterOrEqual = (date: Date, dateToCompare: Date) => !isBefore(date, dateToCompare);

export function datoErIPeriode(dato: string, valgtHistoriskPeriode?: Periode, sistePeriodeSluttDato?: string) {
    const datoDate = new Date(dato);

    if (valgtHistoriskPeriode) {
        const intervall = {
            start: new Date(valgtHistoriskPeriode.fra),
            end: new Date(valgtHistoriskPeriode.til),
        };
        return isWithinInterval(datoDate, intervall);
    }
    return !sistePeriodeSluttDato || isAfterOrEqual(datoDate, new Date(sistePeriodeSluttDato));
}

const hasNoOverlap = (a: string[], b: string[]): boolean => {
    return a.every((element) => !b.includes(element));
};

const getTiltakstatusEtiketter = (aktivitet: AlleAktiviteter) => {
    if (isArenaAktivitet(aktivitet)) {
        return getArenaFilterableFields(aktivitet);
    } else if (isEksternAktivitet(aktivitet)) {
        return getEksternFilterableFields(aktivitet);
    }
    return [];
};

export function aktivitetMatchesFilters(aktivitet: AlleAktiviteter, state: any): boolean {
    const aktivitetTypeFilter = selectAktivitetTyperFilter(state);
    const aktivitetType = getType(aktivitet);
    if (erAktivtFilter(aktivitetTypeFilter) && !aktivitetTypeFilter[aktivitetType]) {
        return false;
    }

    const etikettFilter = selectAktivitetEtiketterFilter(state);
    if (erAktivtFilter(etikettFilter) && (!etikettFilter[aktivitet.etikett!!] || !isVeilarbAktivitet(aktivitet))) {
        return false;
    }

    const arenaEtikettFilter = selectArenaAktivitetEtiketterFilter(state);
    if (erAktivtFilter(arenaEtikettFilter)) {
        const aktiveFilters = Object.entries(arenaEtikettFilter)
            .filter(([_, val]: [string, unknown]) => !!val)
            .map(([key, _]: [string, unknown]) => key);
        const etiketter = getTiltakstatusEtiketter(aktivitet);
        if (hasNoOverlap(etiketter, aktiveFilters)) {
            return false;
        }
    }

    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);
    if (erAktivtFilter(aktivitetStatusFilter) && !aktivitetStatusFilter[aktivitet.status]) {
        return false;
    }

    const aktivitetAvtaltMedNavFilter = selectAktivitetAvtaltMedNavFilter(state);
    const avtaltMedNavFilter = aktivitetAvtaltMedNavFilter.avtaltMedNav;
    const ikkeAvtaltMedNavFilter = aktivitetAvtaltMedNavFilter.ikkeAvtaltMedNav;
    const { avtalt } = aktivitet;
    const aktivtAvtaltFilter = [avtaltMedNavFilter, ikkeAvtaltMedNavFilter].filter((it) => it).length === 1;
    const muligeAvtaltFiltereringer = (avtaltMedNavFilter && !avtalt) || (ikkeAvtaltMedNavFilter && avtalt);

    return !(aktivtAvtaltFilter && muligeAvtaltFiltereringer);
}

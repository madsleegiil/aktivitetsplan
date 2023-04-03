import * as Api from '../../../api/aktivitetAPI';
import { doThenDispatch } from '../../../api/utils';
import { Status } from '../../../createGenericSlice';
import {
    FHO_BEKREFT_OK,
    FHO_LEST_OK,
    FLYTT_OK,
    OPPDATER_OK,
    OPPDATER_REFERAT_FEILET,
    OPPDATER_REFERAT_OK,
    PUBLISER_REFERAT_FEILET,
    PUBLISER_REFERAT_OK,
} from '../aktivitet-action-types';

// Actions
export const OK = 'versjoner/OK';
export const FEILET = 'versjoner/FEILET';
export const PENDING = 'versjoner/PENDING';

export const FJERN = 'versjoner/fjern';

const initalState = {
    status: Status.NOT_STARTED,
    data: [],
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case PENDING:
            return {
                ...state,
                status: state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING,
            };
        case OPPDATER_REFERAT_FEILET:
        case PUBLISER_REFERAT_FEILET:
        case FEILET:
            return { ...state, status: Status.ERROR, feil: action.data };
        case OPPDATER_OK:
        case OPPDATER_REFERAT_OK:
        case PUBLISER_REFERAT_OK:
        case FHO_LEST_OK:
        case FHO_BEKREFT_OK:
        case FLYTT_OK:
            if (state.status === Status.NOT_STARTED) {
                return state;
            }
            return { ...state, data: [action.data, ...state.data] };
        case OK:
            return { ...state, status: Status.OK, data: action.data };
        case FJERN:
            return initalState;
        default:
            return state;
    }
}

// Action creator
export function hentVersjonerForAktivtet(aktivitet) {
    return doThenDispatch(() => Api.hentVersjonerTilAktivitet(aktivitet), {
        OK,
        FEILET,
        PENDING,
    });
}

export function fjernVersjoner() {
    return (dispatch) => {
        dispatch({ type: FJERN });
    };
}

import { Status } from '../../createGenericSlice';
import { RootState } from '../../store';

function selectTilgangSlice(state: RootState) {
    return state.data.tilgang;
}

function selectTilgangData(state: RootState) {
    return selectTilgangSlice(state).data;
}

export function selectNivaa4(state: RootState) {
    return selectTilgangData(state) ? selectTilgangData(state).harbruktnivaa4 : false;
}

export function selectNivaa4LastetOk(state: RootState) {
    return selectNivaa4Status(state) === Status.OK;
}

export function selectNivaa4Status(state: RootState) {
    return selectTilgangSlice(state).status;
}

export function selectNivaa4Feilmeldinger(state: RootState) {
    const feilmeldinger = selectTilgangSlice(state).status === Status.ERROR && selectTilgangSlice(state).feil;
    return feilmeldinger ? feilmeldinger : [];
}

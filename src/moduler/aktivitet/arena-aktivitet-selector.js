import { Status } from '../../createGenericSlice';

export function selectArenaAktiviteterSlice(state) {
    return state.data.arenaAktiviteter;
}

export function selectArenaAktiviteterData(state) {
    return selectArenaAktiviteterSlice(state).data;
}

export function selectArenaAktivitetStatus(state) {
    return selectArenaAktiviteterSlice(state).status;
}

export const selectArenaFeilmeldinger = (state) => {
    const feilMeldingsdata =
        selectArenaAktivitetStatus(state) === Status.ERROR && selectArenaAktiviteterSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
};

export function selectArenaAktivitetFhoLestStatus(state) {
    return selectArenaAktiviteterSlice(state).fhoLestStatus;
}

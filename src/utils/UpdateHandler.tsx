import React from 'react';
import { AnyAction } from 'redux';

import useAppDispatch from '../felles-komponenter/hooks/useAppDispatch';
import { useEventListener } from '../felles-komponenter/hooks/useEventListner';
import { hentAktiviteter } from '../moduler/aktivitet/aktivitet-actions';
import { hentDialog } from '../moduler/dialog/dialog-reducer';
import { hentOppfolging } from '../moduler/oppfolging-status/oppfolging-reducer';

export enum UpdateTypes {
    Dialog = 'DIALOG',
    Oppfolging = 'OPPFOLGING',
    Aktivitet = 'AKTIVITET',
}

interface UpdateEventType {
    uppdate: string;
    avsender?: string;
}

const eventName = 'uppdate';

export function widowEvent(update: UpdateTypes) {
    window.dispatchEvent(
        new CustomEvent<UpdateEventType>(eventName, { detail: { uppdate: update, avsender: 'aktivitetsplan' } })
    );
}

export function UpdateEventHandler() {
    const dispatch = useAppDispatch();

    useEventListener<UpdateEventType>(eventName, (event) => {
        const updateType = event.detail.uppdate;
        const avsender = event.detail.avsender;

        if (avsender === 'aktivitetsplan') {
            return;
        }

        switch (updateType) {
            case UpdateTypes.Aktivitet:
                return dispatch(hentAktiviteter());
            case UpdateTypes.Dialog:
                return dispatch(hentDialog());
            case UpdateTypes.Oppfolging:
                return dispatch(hentOppfolging());
        }
    });

    return <></>;
}

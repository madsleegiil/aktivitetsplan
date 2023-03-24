import { Alert, Detail } from '@navikt/ds-react';
import useFormstate, { FieldState } from '@nutgaard/use-formstate';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../../api/utils';
import { ArenaAktivitet } from '../../../../../datatypes/arenaAktivitetTypes';
import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import Checkbox from '../../../../../felles-komponenter/skjema/input/Checkbox';
import { loggForhandsorienteringTiltak } from '../../../../../felles-komponenter/utils/logging';
import { selectDialogStatus } from '../../../../dialog/dialog-selector';
import { selectArenaAktivitetStatus } from '../../../arena-aktivitet-selector';
import { sendForhaandsorienteringArenaAktivitet } from '../../../arena-aktiviteter-reducer';
import ForhaandsorienteringsMeldingArenaaktivitet from './ForhaandsorienteringsMeldingArenaaktivitet';

const avtaltTekst =
    'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at ' +
    'stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ' +
    'ber vi deg ta kontakt med veilederen din så snart som mulig.';

const avtaltTekst119 =
    'Du kan få redusert utbetaling av arbeidsavklaringspenger med én stønadsdag hvis du lar være å ' +
    '[komme på møtet vi har innkalt deg til [dato]/ møte på … /levere ... innen [dato]] uten rimelig grunn. Dette går ' +
    'fram av folketrygdloven § 11-9.';

const validate = (val: string) => {
    if (val.trim().length === 0) {
        return 'Du må fylle ut teksten';
    }
    if (val.length > 500) {
        return 'Du må korte ned teksten til 500 tegn';
    }
};

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: ArenaAktivitet;
    hidden: boolean;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

type FormType = {
    tekst: string;
    checked: string;
    forhaandsorienteringType: string;
};

const ArenaForhaandsorienteringForm = (props: Props) => {
    const { setSendtAtErAvtaltMedNav, setForhandsorienteringType, aktivitet, hidden } = props;

    const dialogStatus = useSelector(selectDialogStatus);
    const arenaAktivitetRequestStatus = useSelector(selectArenaAktivitetStatus);
    const dispatch = useDispatch();

    const validator = useFormstate<FormType>({
        tekst: validate,
        checked: () => undefined,
        forhaandsorienteringType: () => undefined,
    });

    const state = validator({
        tekst: avtaltTekst119,
        forhaandsorienteringType: ForhaandsorienteringType.SEND_STANDARD,
        checked: '',
    });

    if (hidden) {
        return null;
    }

    const onSubmit = (data: { forhaandsorienteringType: string; tekst: string }) => {
        const tekst =
            data.forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD ? avtaltTekst : data.tekst;

        setForhandsorienteringType(data.forhaandsorienteringType as ForhaandsorienteringType);
        return sendForhaandsorienteringArenaAktivitet(aktivitet, {
            tekst,
            type: data.forhaandsorienteringType,
        })(dispatch).then(() => {
            setSendtAtErAvtaltMedNav();
            loggForhandsorienteringTiltak();
            // @ts-ignore
            document.querySelector('.aktivitet-modal').focus();
        });
    };

    const lasterData =
        dialogStatus !== STATUS.OK ||
        arenaAktivitetRequestStatus === STATUS.RELOADING ||
        arenaAktivitetRequestStatus === STATUS.PENDING;

    return (
        <form
            className="border border-border-alt-3 bg-surface-alt-3-subtle flex flex-col rounded-md p-4"
            onSubmit={state.onSubmit(onSubmit)}
        >
            <div className="flex items-center justify-between">
                <Checkbox disabled={lasterData} {...(state.fields.checked as FieldState & { error: never })}>
                    Legg til forhåndsorientering
                </Checkbox>
                <Detail>FOR NAV-ANSATT</Detail>
            </div>
            <Alert variant="info" className="mt-2" inline>
                Tiltaket er automatisk merket &quot;Avtalt med NAV&quot;
            </Alert>
            <ForhaandsorienteringsMeldingArenaaktivitet
                visible={state.fields.checked.input.value === 'true'}
                lasterData={lasterData}
                state={state}
            />
        </form>
    );
};

export default ArenaForhaandsorienteringForm;

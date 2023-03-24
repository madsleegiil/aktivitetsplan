import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Alert, Checkbox, Detail } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

import { STATUS } from '../../../../../api/utils';
import { Forhaandsorientering, ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { EksternAktivitet, EksternAktivitetType } from '../../../../../datatypes/internAktivitetTypes';
import { loggForhandsorienteringTiltak } from '../../../../../felles-komponenter/utils/logging';
import { selectDialogStatus } from '../../../../dialog/dialog-selector';
import { settAktivitetTilAvtalt } from '../../../aktivitet-actions';
import { selectArenaAktivitetStatus } from '../../../arena-aktivitet-selector';
import ForhaandsorienteringsMeldingArenaaktivitet from '../arena-aktivitet/ForhaandsorienteringsMeldingArenaaktivitet';
import { AVTALT_TEKST, AVTALT_TEKST_119 } from '../utilsForhaandsorientering';

interface Props {
    aktivitet: EksternAktivitet;
    setSendtAtErAvtaltMedNav(): void;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const schema = z.discriminatedUnion('forhaandsorienteringType', [
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.SEND_STANDARD),
    }),
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.SEND_PARAGRAF_11_9),
        avtaltText119: z.string().min(1, 'Du må fylle ut teksten').max(500, 'Du må korte ned teksten til 500 tegn'),
    }),
]);

export type ForhaandsorienteringFormValues = z.infer<typeof schema>;

const ForhaandsorienteringForm = (props: Props) => {
    const { aktivitet, setSendtAtErAvtaltMedNav, setForhandsorienteringType } = props;

    const [showForm, setShowForm] = useState(false);

    const dialogStatus = useSelector(selectDialogStatus);
    const arenaAktivitetRequestStatus = useSelector(selectArenaAktivitetStatus);
    const dispatch = useDispatch();

    const defaultValues: ForhaandsorienteringFormValues = {
        forhaandsorienteringType: ForhaandsorienteringType.SEND_STANDARD as any,
        avtaltText119: AVTALT_TEKST_119,
    };

    const { register, handleSubmit, watch } = useForm<ForhaandsorienteringFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const onSubmit = (formValues: ForhaandsorienteringFormValues) => {
        const tekst =
            formValues.forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD
                ? AVTALT_TEKST
                : formValues.avtaltText119;

        const forhaandsorientering: Forhaandsorientering = {
            type: formValues.forhaandsorienteringType,
            tekst,
        };

        setForhandsorienteringType(formValues.forhaandsorienteringType);
        return settAktivitetTilAvtalt(
            aktivitet,
            forhaandsorientering
        )(dispatch).then(() => {
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

    const isGammelArenaAktivitet = [EksternAktivitetType.ARENA_TILTAK_TYPE].includes(aktivitet.eksternAktivitet.type);

    return (
        <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="bg-surface-alt-3-subtle py-2 px-4 border border-border-alt-3 rounded-md"
        >
            <div>
                <div className="flex items-center justify-between">
                    <Checkbox disabled={lasterData} onChange={() => setShowForm(!showForm)}>
                        Legg til forhåndsorientering
                    </Checkbox>
                    <Detail>FOR NAV-ANSATT</Detail>
                </div>
                {isGammelArenaAktivitet && (
                    <Alert variant="info" className="mt-2" inline>
                        Tiltaket er automatisk merket &quot;Avtalt med NAV&quot;
                    </Alert>
                )}
                {showForm && (
                    <ForhaandsorienteringsMeldingArenaaktivitet
                        lasterData={lasterData}
                        register={register}
                        watch={watch}
                    />
                )}
            </div>
        </form>
    );
};

export default ForhaandsorienteringForm;

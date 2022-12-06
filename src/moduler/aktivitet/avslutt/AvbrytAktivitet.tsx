import Spinner from 'nav-frontend-spinner';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';

import { STATUS } from '../../../api/utils';
import { STATUS_AVBRUTT } from '../../../constant';
import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import Modal from '../../../felles-komponenter/modal/Modal';
import { avbrytAktivitet } from '../aktivitet-actions';
import { trengerBegrunnelse } from '../aktivitet-util';
import { selectAktivitetListeStatus, selectAktivitetMedId } from '../aktivitetlisteSelector';
import BegrunnelseAktivitet from './begrunnelse-form';
import PubliserReferat from './publiser-referat';
import VisAdvarsel from './vis-advarsel';

const headerTekst = 'Avbrutt aktivitet';
const beskrivelseLabel =
    'Skriv en kort begrunnelse under om hvorfor du avbrøt aktiviteten. ' +
    'Når du lagrer blir aktiviteten låst, og du kan ikke lenger redigere innholdet.';

const AvbrytAktivitet = () => {
    const { id } = useParams();
    const aktivitetId = id as string; // TODO fix (håndter id undefined)

    const valgtAktivitet = useSelector((state) => selectAktivitetMedId(state, aktivitetId));
    const aktivitetListeStatus = useSelector(selectAktivitetListeStatus);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const lagreBegrunnelse = (aktivitet: AlleAktiviteter, begrunnelseTekst: string | null) =>
        dispatch(avbrytAktivitet(valgtAktivitet, begrunnelseTekst) as unknown as AnyAction);

    const lagrer = aktivitetListeStatus !== STATUS.OK;

    const begrunnelse = valgtAktivitet ? (
        <BegrunnelseAktivitet
            headerTekst={headerTekst}
            beskrivelseLabel={beskrivelseLabel}
            lagrer={lagrer}
            onSubmit={(beskrivelseForm) => {
                navigate('/', { replace: true });
                return lagreBegrunnelse(valgtAktivitet, beskrivelseForm.begrunnelse);
            }}
        />
    ) : null;

    const advarsel = valgtAktivitet ? (
        <VisAdvarsel
            headerTekst={headerTekst}
            onSubmit={() => {
                lagreBegrunnelse(valgtAktivitet, null);
                navigate('/', { replace: true });
            }}
        />
    ) : null;

    const maaBegrunnes =
        valgtAktivitet && trengerBegrunnelse(valgtAktivitet.avtalt, STATUS_AVBRUTT, valgtAktivitet.type);

    return (
        <Modal contentLabel="avbryt-aktivitet">
            {valgtAktivitet ? (
                <PubliserReferat aktivitet={valgtAktivitet} nyStatus={STATUS_AVBRUTT}>
                    {maaBegrunnes ? begrunnelse : advarsel}
                </PubliserReferat>
            ) : (
                <Spinner /> // TODO test at det her funker
            )}
        </Modal>
    );
};

export default AvbrytAktivitet;

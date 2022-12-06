import Lenke from 'nav-frontend-lenker';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as Api from '../../api/lestAPI';
import Modal from '../../felles-komponenter/modal/Modal';
import ModalContainer from '../../felles-komponenter/modal/ModalContainer';
import { selectErBruker } from '../identitet/identitet-selector';
import { selectLestInformasjon } from '../lest/lest-reducer';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { BrukePlanenPanel } from './brukePlanenPanel';
import styles from './informasjon-modal.module.less';
import { OkonomiskStotte } from './okonomiskStottePanel';
import { RettigheterPanel } from './rettigheterPanel';
import Video from './video';

export const INFORMASJON_MODAL_VERSJON = 'v1';

const InformasjonModal = () => {
    const navigate = useNavigate();
    const erBruker = useSelector(selectErBruker);
    const lestInfo = useSelector(selectLestInformasjon);
    const underOppfolging = useSelector(selectErUnderOppfolging);

    useEffect(() => {
        if (erBruker && underOppfolging && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON)) {
            Api.postLest(INFORMASJON_MODAL_VERSJON);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Modal
            contentLabel="informasjon-modal"
            contentClass="informasjon-visning"
            onRequestClose={() => {
                navigate('/');
            }}
        >
            <ModalContainer className="informasjon-modal-container">
                <Innholdstittel className={styles.innholdsTittel}>Hva er aktivitetsplanen?</Innholdstittel>
                <Normaltekst className={styles.avsnitt}>
                    I aktivitetsplanen holder du oversikt over det du gjør for å komme i jobb eller annen aktivitet.
                    Både du og veilederen din kan se og endre aktivitetsplanen.
                </Normaltekst>
                <Normaltekst>
                    Du kan legge inn målet ditt, aktiviteter du skal gjøre og stillinger du vil søke på. Veilederen kan
                    blant annet legge inn forslag til aktiviteter eller skrive referat fra et møte dere har hatt. Du kan
                    kommunisere med veilederen din om aktivitetene i <Lenke href="/dialog">dialogen</Lenke>.
                </Normaltekst>
                <BrukePlanenPanel />
                <OkonomiskStotte />
                <RettigheterPanel />
                <Video />
            </ModalContainer>
        </Modal>
    );
};

export default InformasjonModal;

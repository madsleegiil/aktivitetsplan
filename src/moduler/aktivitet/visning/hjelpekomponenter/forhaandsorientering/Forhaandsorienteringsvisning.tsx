import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { STATUS } from '../../../../../api/utils';
import { AlleAktiviteter, isArenaAktivitet } from '../../../../../datatypes/aktivitetTypes';
import EkspanderbarLinjeBase from '../../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinjeBase';
import { loggForhaandsorienteringLest } from '../../../../../felles-komponenter/utils/logging';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import { markerForhaandsorienteringSomLest } from '../../../aktivitet-actions';
import { selectAktivitetFhoLestStatus } from '../../../aktivitet-selector';
import { selectArenaAktivitetFhoLestStatus } from '../../../arena-aktivitet-selector';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../../../arena-aktiviteter-reducer';
import { skalMarkereForhaandsorienteringSomLest } from '../../avtalt-container/utilsForhaandsorientering';
import CustomBodyLong from '../CustomBodyLong';
import styles from './Forhaandsorienteringsvisning.module.less';
import LestDatoVisning from './LestDatoVisning';
import LestKnapp from './LestKnapp';
import Tittel from './Tittel';

interface Props {
    aktivitet: AlleAktiviteter;
    startAapen?: boolean;
}

const Forhaandsorienteringsvisning = (props: Props) => {
    const { aktivitet, startAapen = false } = props;
    const erArenaAktivitet = isArenaAktivitet(aktivitet);

    const forhaandsorientering = aktivitet.forhaandsorientering;
    const forhaandsorienteringTekst = forhaandsorientering?.tekst;
    const forhaandsorienteringLestDato = forhaandsorientering?.lestDato;

    const erLest = !!forhaandsorienteringLestDato;

    const erBruker = useSelector(selectErBruker);
    const arenaAktivitetFhoLestStatus = useSelector(selectArenaAktivitetFhoLestStatus);
    const aktivitetFhoLestStatus = useSelector(selectAktivitetFhoLestStatus);

    const dispatch = useDispatch();

    const kanMarkeresSomLest = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    const [erEkspandert, setErEkspandert] = useState(startAapen);

    if (!forhaandsorienteringTekst) {
        return null;
    }

    const onMarkerSomLest = () => {
        if (erArenaAktivitet) {
            dispatch(markerForhaandsorienteringSomLestArenaAktivitet(aktivitet) as unknown as AnyAction);
        } else {
            dispatch(markerForhaandsorienteringSomLest(aktivitet) as unknown as AnyAction);
        }
        loggForhaandsorienteringLest(aktivitet.type, true);
    };

    const onClickLestKnapp = () => {
        onMarkerSomLest && onMarkerSomLest();
        setErEkspandert(false);
    };

    const onClickToggle = () => setErEkspandert((ekspandert) => !ekspandert);

    const lasterDataArena = arenaAktivitetFhoLestStatus === STATUS.PENDING;
    const lasterDataAktivitet = aktivitetFhoLestStatus === STATUS.PENDING;
    const lasterData = erArenaAktivitet ? lasterDataArena : lasterDataAktivitet;

    return (
        <EkspanderbarLinjeBase
            tittel={<Tittel kanMarkeresSomLest={kanMarkeresSomLest} />}
            aapneTekst="Les"
            lukkeTekst="Lukk"
            erAapen={erEkspandert}
            onClick={onClickToggle}
            kanToogle
        >
            <CustomBodyLong className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</CustomBodyLong>
            <LestDatoVisning hidden={!erLest} lest={forhaandsorienteringLestDato} />
            <LestKnapp hidden={!kanMarkeresSomLest} onClick={onClickLestKnapp} lasterData={lasterData} />
        </EkspanderbarLinjeBase>
    );
};

export default Forhaandsorienteringsvisning;

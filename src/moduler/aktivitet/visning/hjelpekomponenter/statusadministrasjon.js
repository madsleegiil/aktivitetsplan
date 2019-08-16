import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import * as AppPT from '../../../../proptypes';
import OppdaterAktivitetStatus from '../status-oppdatering/oppdater-aktivitet-status';
import OppdaterAktivitetEtikett from '../etikett-oppdatering/oppdater-aktivitet-etikett';
import {
    STILLING_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
} from '../../../../constant';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { selectErBruker } from '../../../identitet/identitet-selector';
import ForhandsorienteringArenaAktivitet from '../forhandsorientering/forhandsorientering-arena-aktivitet';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';

function Statusadministrasjon({
    valgtAktivitet,
    arenaAktivitet,
    erBruker,
    erManuellKrrKvpBruker, // eslint-disable-line
}) {
    const { status, type, id } = valgtAktivitet;

    // TODO add back when used
    const skalViseForhandsorienteringsKomponent = false;
    // !erBruker && !erManuellKrrKvpBruker;

    const visAdministreresAvVeileder = (
        <div className="aktivitetvisning__underseksjon">
            <AlertStripeInfo className="aktivitetvisning__alert">
                <FormattedMessage id="aktivitetvisning.administreres-av-veileder" />
            </AlertStripeInfo>
            <ForhandsorienteringArenaAktivitet
                visible={skalViseForhandsorienteringsKomponent}
                valgtAktivitet={valgtAktivitet}
            />
        </div>
    );

    const visOppdaterStatusContainer = (
        <div>
            <VisibleIfDiv visible={type === STILLING_AKTIVITET_TYPE}>
                <OppdaterAktivitetEtikett
                    status={status}
                    paramsId={id}
                    className="aktivitetvisning__underseksjon"
                />
                <hr className="aktivitetvisning__delelinje" />
            </VisibleIfDiv>
            <OppdaterAktivitetStatus
                status={status}
                aktivitetId={id}
                className="aktivitetvisning__underseksjon"
            />
            <hr className="aktivitetvisning__delelinje" />
        </div>
    );

    if ([SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker) {
        return null;
    }

    return arenaAktivitet
        ? visAdministreresAvVeileder
        : visOppdaterStatusContainer;
}

Statusadministrasjon.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    arenaAktivitet: PT.bool.isRequired,
    erBruker: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    erBruker: selectErBruker(state),
    erManuellKrrKvpBruker:
        selectErBrukerManuell(state) ||
        selectErUnderKvp(state) ||
        selectReservasjonKRR(state),
});

export default connect(mapStateToProps)(Statusadministrasjon);

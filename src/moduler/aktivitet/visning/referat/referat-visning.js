import React from 'react';
import PT from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import * as AppPT from '../../../../proptypes';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import {AlertStripeSuksess} from "nav-frontend-alertstriper";

function ReferatVisning(props) {
    const {
        aktivitet,
        referat,
        erVeileder,
        dispatchPubliserReferat,
        publiserer,
        erReferatPublisert,
        startOppdaterReferat,
        underOppfolging
    } = props;

    const aktivitetStatus = aktivitet.status;
    const erHistorisk = aktivitet.historisk;
    return (
        <div className="oppdater-referat aktivitetvisning__underseksjon">
            <Undertittel>Samtalereferat</Undertittel>
            <Tekstomrade className="oppdater-referat__referat">{referat}</Tekstomrade>
            <HiddenIfDiv
                hidden={!erVeileder || aktivitetStatus === STATUS_FULLFOERT || aktivitetStatus === STATUS_AVBRUTT}
            >
                <HiddenIfDiv hidden={erHistorisk || !underOppfolging}
                             className="oppdater-referat-knapper">
                    <HiddenIfDiv hidden={erReferatPublisert}>
                        <Hovedknapp onClick={dispatchPubliserReferat}
                                    spinner={publiserer}>
                            Del med bruker
                        </Hovedknapp>
                    </HiddenIfDiv>
                    <HiddenIfDiv hidden={!erReferatPublisert}>
                        <AlertStripeSuksess className="oppdater-referat-status">
                            Delt med bruker
                        </AlertStripeSuksess>
                    </HiddenIfDiv>
                    <Knapp onClick={startOppdaterReferat}>Endre</Knapp>
                </HiddenIfDiv>
            </HiddenIfDiv>
        </div>
    );
}

ReferatVisning.propTypes = {
    referat: PT.string.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    erVeileder: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    publiserer: PT.bool.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    startOppdaterReferat: PT.func.isRequired
};
export default ReferatVisning;

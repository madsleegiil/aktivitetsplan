import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import NavFrontendModal from 'nav-frontend-modal';
import * as AppPT from '../../../proptypes';
import {
    selectFnrPaMotpartHvisBruker,
    selectMotpartStatus,
    selectNavnPaMotpart,
} from '../../motpart/motpart-selector';
import {
    selectTilpasseDialogModalHistoriskVisning,
    selectDialogMedId,
} from '../dialog-selector';
import { selectViserHistoriskPeriode } from '../../filtrering/filter/filter-selector';
import Feilmelding from '../../feilmelding/feilmelding';
import DialogHeader from './dialog-header';
import DialogOversikt from './dialog-oversikt';
import DialogHenvendelse from './dialog-henvendelse';
import FnrProvider from './../../../bootstrap/fnr-provider';
import { erPrivateBrukerSomSkalSkrusAv } from '../../privat-modus/privat-modus-selector';

function DialogModal({
    harNyDialogEllerValgtDialog,
    tilpasseStorrelseHistoriskVisning,
    motpartStatus,
    navnPaMotpart,
    fnrPaMotpartHvisBruker,
    valgtDialog,
    valgtAktivitetId,
    harNyDialog,
    harValgtDialog,
    historiskVisning,
    history,
    privateModus,
}) {
    const className = classNames('dialog-modal', 'aktivitet-modal', {
        'dialog-modal--full-bredde': harNyDialogEllerValgtDialog,
        'dialog-modal--historisk-visning': tilpasseStorrelseHistoriskVisning,
    });

    return (
        <NavFrontendModal
            isOpen
            className={className}
            contentClass="aktivitetsplanfs dialog-modal__content"
            contentLabel="dialog-modal"
            overlayClassName="aktivitet-modal__overlay"
            portalClassName="aktivitetsplanfs aktivitet-modal-portal"
            shouldCloseOnOverlayClick={false}
            onRequestClose={() => history.push('/')}
        >
            <DialogHeader
                harNyDialogEllerValgtDialog={harNyDialogEllerValgtDialog}
                motpartStatus={motpartStatus}
                navnPaMotpart={navnPaMotpart}
                fnrPaMotpartHvisBruker={fnrPaMotpartHvisBruker}
            />
            <FnrProvider>
                <div className="dialog-modal__wrapper">
                    <Feilmelding className="feilmelding--systemfeil" />
                    <div className="dialog-modal__innhold">
                        <DialogOversikt
                            valgtDialog={valgtDialog}
                            harNyDialog={harNyDialog}
                            harNyDialogEllerValgtDialog={
                                harNyDialogEllerValgtDialog
                            }
                            historiskVisning={historiskVisning}
                            privateModus={privateModus}
                        />
                        <DialogHenvendelse
                            valgtDialog={valgtDialog}
                            harNyDialog={harNyDialog}
                            harValgtDialog={harValgtDialog}
                            valgtAktivitetId={valgtAktivitetId}
                            harNyDialogEllerValgtDialog={
                                harNyDialogEllerValgtDialog
                            }
                        />
                    </div>
                </div>
            </FnrProvider>
        </NavFrontendModal>
    );
}

DialogModal.defaultProps = {
    valgtAktivitetId: null,
    navnPaMotpart: null,
    fnrPaMotpartHvisBruker: null,
    valgtDialog: null,
    harNyDialog: null,
};

DialogModal.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    harNyDialog: PT.bool,
    valgtDialog: AppPT.dialog,
    harValgtDialog: PT.bool.isRequired,
    valgtAktivitetId: PT.string,
    motpartStatus: AppPT.avhengighet.isRequired,
    navnPaMotpart: PT.string,
    fnrPaMotpartHvisBruker: PT.string,
    historiskVisning: PT.bool.isRequired,
    tilpasseStorrelseHistoriskVisning: PT.bool.isRequired,
    history: AppPT.history.isRequired,
    privateModus: PT.bool.isRequired,
};
const mapStateToProps = (state, props) => {
    const { match } = props;
    const { id } = match.params;
    const valgtDialog = selectDialogMedId(state, id);
    const valgtAktivitetId = valgtDialog && valgtDialog.aktivitetId;
    const harNyDialog = id === 'ny';
    const harValgtDialog = !!valgtDialog;
    const historiskVisning = selectViserHistoriskPeriode(state);
    const fnrPaMotpartHvisBruker = selectFnrPaMotpartHvisBruker(state);
    return {
        harNyDialog,
        valgtDialog,
        harValgtDialog,
        harNyDialogEllerValgtDialog: harNyDialog || harValgtDialog,
        valgtAktivitetId,
        motpartStatus: selectMotpartStatus(state),
        navnPaMotpart: selectNavnPaMotpart(state),
        fnrPaMotpartHvisBruker,
        historiskVisning,
        tilpasseStorrelseHistoriskVisning:
            historiskVisning &&
            selectTilpasseDialogModalHistoriskVisning(state),
        privateModus: erPrivateBrukerSomSkalSkrusAv(state),
    };
};

export default connect(mapStateToProps)(DialogModal);

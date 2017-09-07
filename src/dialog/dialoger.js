import React from 'react';
import PT from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import * as AppPT from '../proptypes';
import Innholdslaster from '../felles-komponenter/utils/innholdslaster';
import {
    selectDialoger,
    selectDialogStatus,
} from '../moduler/dialog/dialog-selector';
import DialogVisning from './dialog-visning';
import { selectAlleAktiviter } from '../moduler/aktivitet/aktivitetliste-selector';
import { selectErBruker } from '../moduler/identitet/identitet-selector';
import {
    sammenlignDialogerForBruker,
    sammenlignDialogerForVeileder,
} from './dialog-utils';

/* eslint-disable jsx-a11y/no-static-element-interactions */

class Dialoger extends React.Component {
    componentWillMount() {
        this.dialogIderSortert = [...this.props.dialoger]
            .sort(
                this.props.erBruker
                    ? sammenlignDialogerForBruker
                    : sammenlignDialogerForVeileder
            )
            .map(dialog => dialog.id);
    }

    render() {
        const { dialoger, valgtDialog, className, aktiviteter } = this.props;
        const dialogerSortert = [...dialoger].sort(
            (a, b) =>
                this.dialogIderSortert.indexOf(a.id) -
                this.dialogIderSortert.indexOf(b.id)
        );

        const erTabBar = dialog =>
            dialog === valgtDialog ||
            (valgtDialog === null && dialog.id === dialoger[0].id);
        const valgtDialogIndex =
            valgtDialog !== null ? dialoger.indexOf(valgtDialog) : 0;
        const dialogRefs = {};

        const byttTilNyDialog = id => {
            // eslint-disable-next-line react/no-find-dom-node
            findDOMNode(dialogRefs[id]).focus();
        };

        const fokusForrigeDialog = () => {
            const nydialogId = dialoger[valgtDialogIndex - 1].id;
            byttTilNyDialog(nydialogId);
        };

        const fokusNesteDialog = () => {
            const nydialogId = dialoger[valgtDialogIndex + 1].id;
            byttTilNyDialog(nydialogId);
        };

        const dialogPiling = e => {
            switch (e.which) {
                case 38: // pil opp
                    if (valgtDialogIndex > 0) {
                        fokusForrigeDialog();
                    }
                    break;
                case 40: // pil ned
                    if (valgtDialogIndex < dialoger.length - 1) {
                        fokusNesteDialog();
                    }
                    break;
                default:
                    break;
            }
        };

        return (
            <div className={className} onKeyDown={dialogPiling}>
                {dialogerSortert.map(d =>
                    <section className="dialoger__dialog--section">
                        <DialogVisning
                            key={d.id}
                            ref={ref => (dialogRefs[d.id] = ref)}
                            dialog={d}
                            erTabBar={erTabBar(d)}
                            erValgt={d === valgtDialog}
                            aktiviteter={aktiviteter}
                        />
                    </section>
                )}
            </div>
        );
    }
}

Dialoger.propTypes = {
    className: PT.string,
    avhengigheter: AppPT.avhengigheter.isRequired,
    dialoger: PT.arrayOf(AppPT.dialog).isRequired,
    aktiviteter: PT.arrayOf(AppPT.aktivitet).isRequired,
    valgtDialog: AppPT.dialog,
    erBruker: PT.bool.isRequired,
};

Dialoger.defaultProps = {
    className: undefined,
    valgtDialog: undefined,
};

function DialogerMedInnholdslaster({ avhengigheter, ...props }) {
    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            <Dialoger {...props} />
        </Innholdslaster>
    );
}

DialogerMedInnholdslaster.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectDialogStatus(state)],
    dialoger: selectDialoger(state),
    aktiviteter: selectAlleAktiviter(state),
    erBruker: selectErBruker(state),
});
export default connect(mapStateToProps)(DialogerMedInnholdslaster);

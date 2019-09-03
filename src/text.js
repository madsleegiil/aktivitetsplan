import React from 'react';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import hiddenIf from './felles-komponenter/hidden-if/hidden-if';
import Innholdslaster from './felles-komponenter/utils/innholdslaster';
import {
    selectErUnderOppfolging,
    selectOppfolgingStatus,
} from './moduler/oppfolging-status/oppfolging-selector';
import {
    selectErVeileder,
    selectIdentitetStatus,
} from './moduler/identitet/identitet-selector';

const mapStateToProps = state => ({
    avhengigheter: [
        selectOppfolgingStatus(state),
        selectIdentitetStatus(state),
    ],
    underOppfolging: selectErUnderOppfolging(state),
    erVeileder: selectErVeileder(state),
});

// TODO: remove this
function textHOC(Component, props) {
    const { visChildrenVedFeil } = props || {};
    // eslint-disable-next-line react/prop-types
    function Text({ id, children, avhengigheter, ...rest }) {
        return (
            <Innholdslaster
                avhengigheter={avhengigheter}
                visChildrenVedFeil={visChildrenVedFeil}
            >
                <Component id={id} values={rest}>
                    {children}
                </Component>
            </Innholdslaster>
        );
    }

    return hiddenIf(connect(mapStateToProps)(Text));
}

export default textHOC(FormattedMessage);
export const FailsafeText = textHOC(FormattedHTMLMessage, {
    visChildrenVedFeil: true,
});

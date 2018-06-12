import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Lenke from '../../felles-komponenter/utils/lenke';
import mittMalSvg from './Illustrasjon_dette_gjor_du_bra.svg';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import {
    hentMal,
    selectGjeldendeMal,
    selectMalStatus,
} from '../../moduler/mal/aktivitetsmal-reducer';
import * as AppPT from '../../proptypes';

function Mal({ mal }) {
    if (!mal) {
        return (
            <FormattedMessage
                tagName="div"
                id={'aktivitetsmal.mitt-mal-deafult'}
            />
        );
    }
    return (
        <i>
            <Tekstomrade>
                {`"${mal}"`}
            </Tekstomrade>
        </i>
    );
}

class MittMaal extends Component {
    componentDidMount() {
        this.props.doHentMal();
    }

    render() {
        const { avhengigheter, mal } = this.props;
        const url = mal ? '/mal' : '/mal/endre';

        return (
            <Lenke brukLenkestyling={false} href={url} className="mitt-maal">
                <img
                    src={mittMalSvg}
                    alt="mittmal-illustrasjon"
                    className="mittmal__illustrasjon"
                />
                <div className="mittmal_content">
                    <Element className="mittmal__content-header">
                        <FormattedMessage id={'aktivitetsmal.mitt-mal'} />
                    </Element>
                    <Innholdslaster avhengigheter={avhengigheter}>
                        <Mal mal={mal} />
                    </Innholdslaster>
                </div>
            </Lenke>
        );
    }
}

Mal.defaultProps = {
    mal: undefined,
};

Mal.propTypes = {
    mal: PT.string,
};

MittMaal.defaultProps = {
    mal: undefined,
};

MittMaal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string,
    doHentMal: PT.func.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectMalStatus(state)],
    mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MittMaal);

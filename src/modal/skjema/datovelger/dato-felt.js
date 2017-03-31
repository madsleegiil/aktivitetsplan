import React, { PropTypes as PT } from 'react';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { datePickerToISODate, erGyldigFormattertDato } from '../../../utils';
import Datovelger from './datovelger';

function parseDato(dato) {
    return erGyldigFormattertDato(dato) ? datePickerToISODate(dato) : dato;
}

function DatoFelt({ feltNavn, labelId, disabled, tidligsteFom, senesteTom }) {
    const datoVelger = (
        <Datovelger
            label={<FormattedMessage id={labelId} />}
            disabled={disabled}
            tidligsteFom={tidligsteFom}
            senesteTom={senesteTom}
        />
    );
    return (
        <CustomField
            name={feltNavn}
            parse={parseDato}
            customComponent={datoVelger}
        />
    );
}

DatoFelt.propTypes = {
    feltNavn: PT.string.isRequired,
    labelId: PT.string.isRequired,
    disabled: PT.bool,
    tidligsteFom: PT.instanceOf(Date),
    senesteTom: PT.instanceOf(Date)
};

export default DatoFelt;

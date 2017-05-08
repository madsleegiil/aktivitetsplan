import React, { PropTypes as PT } from 'react';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { Textarea as NavFrontendTextarea } from 'nav-frontend-skjema';

// eslint-disable-next-line no-unused-vars
function InnerTextAreaComponent({ input, labelId, maxLength, errorMessage, meta, ...rest }) {
    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;
    const inputValues = { ...input, value: undefined, defaultValue: input.value };
    return (
        <NavFrontendTextarea
            textareaClass="skjemaelement__input input--fullbredde"
            label={labelId && <FormattedMessage id={labelId} />}
            maxLength={maxLength}
            feil={feil}
            {...rest}
            {...inputValues}
        />
    );
}
InnerTextAreaComponent.propTypes = {
    labelId: PT.string.isRequired,
    maxLength: PT.number.isRequired,
    errorMessage: PT.arrayOf(PT.oneOfType([PT.string, PT.node])),
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
    input: PT.object // eslint-disable-line react/forbid-prop-types
};

InnerTextAreaComponent.defaultProps = {
    errorMessage: undefined,
    meta: undefined,
    input: undefined
};

function Textarea({ feltNavn, ...rest }) {
    return (
        <CustomField
            name={feltNavn}
            customComponent={<InnerTextAreaComponent {...rest} />}
        />
    );
}

Textarea.propTypes = {
    feltNavn: PT.string
};

Textarea.defaultProps = {
    feltNavn: undefined
};

export default Textarea;


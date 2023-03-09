import { DateValidationT } from '@navikt/ds-react';
import { UNSAFE_DatePicker as DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react/esm/date';
import { ChangeEventHandler, MutableRefObject, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { coerceToUndefined, handlers, validateStandardDateErrors } from './common';
import { FieldSettings } from './ControlledDateRangePicker';

interface Props {
    field: FieldSettings;
}
const ControlledDatePicker = ({ field: { disabled, name, defaultValue, required = false, label } }: Props) => {
    const { control, setValue, setError, clearErrors } = useFormContext();
    const {
        field,
        fieldState: { error },
    } = useController({
        control,
        name: name,
    });
    const [validation, setValidation] = useState<DateValidationT | undefined>();
    const { inputProps, datepickerProps } = UNSAFE_useDatepicker({
        defaultSelected: defaultValue,
        onValidate: (validation) => {
            setValidation(validation);
        },
        onDateChange: (val) => {
            console.log('On data change', val);
            if (val) {
                setValue(name, val);
                const error = validateStandardDateErrors(validation, required);
                if (!error) clearErrors(name);
            }
        },
    });
    const setHookFormValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        console.log('Setting value', event.target.value);
        setValue(name, coerceToUndefined(event.target.value));
    };
    const validateInputs = () => {
        const error = validateStandardDateErrors(validation, required);
        if (error) setError(name, { message: error });
        else clearErrors(name);
    };
    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                disabled={disabled}
                className="flex-1"
                error={error?.message}
                label={label ?? 'Dato' + (required ? ' (obligatorisk)' : '')}
                {...inputProps}
                name={name}
                onBlur={handlers([field.onBlur, inputProps.onBlur, validateInputs])}
                onChange={handlers([setHookFormValue, inputProps.onChange])}
                ref={(ref) => {
                    (inputProps.ref as MutableRefObject<HTMLInputElement | null>).current = ref;
                    field.ref(ref);
                }}
            />
        </DatePicker>
    );
};
export default ControlledDatePicker;

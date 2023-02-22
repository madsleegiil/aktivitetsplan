import { Heading } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

interface Props {
    children: React.ReactNode;
    tittel: React.ReactNode;
    fullbredde?: boolean;
    beskrivelse?: boolean;
}

function DetaljFelt(props: Props) {
    const { tittel, children, fullbredde, beskrivelse } = props;

    return (
        <div
            className={classNames('aktivitetsdetaljer__felt', 'detaljfelt', {
                'detaljfelt--fullbredde': fullbredde,
                'detaljfelt--beskrivelse': beskrivelse,
            })}
        >
            <Heading size="small" className="detaljfelt__tittel" level="2">
                {tittel}
            </Heading>
            {children}
        </div>
    );
}

export default DetaljFelt;

import { Accordion, Heading } from '@navikt/ds-react';
import React, { MouseEventHandler, ReactNode, useMemo } from 'react';

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString()
        .substring(1);
}

function guid() {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

interface Props {
    tittel: string;
    form: ReactNode;
    subtittel: ReactNode;
    open: boolean;
    onClick: MouseEventHandler;
}

const EndreLinje = (props: Props) => {
    const { tittel, form, subtittel, open, onClick } = props;

    //to get a valid css id it needs to start with a letter
    const unique = useMemo(() => 'a' + guid(), []);

    return (
        <Accordion.Item open={open} className="first:border-t-2 first:border-border-divider">
            <Accordion.Header className="flex flex-row" onClick={onClick}>
                <Heading size="small" level="2">
                    {tittel}
                </Heading>
                <div>{subtittel}</div>
            </Accordion.Header>
            <Accordion.Content>
                <div id={unique}>{form}</div>
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndreLinje;

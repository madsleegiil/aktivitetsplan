import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectErVeileder } from '../identitet/identitet-selector';
import { byttTilDialogFlate, getDialogLenke } from './DialogFlateUtils';

interface Props {
    className?: string;
    dialogId?: string;
    aktivitetId?: string;
    hidden?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

function LenkeTilDialog(props: Props) {
    const { className, dialogId, aktivitetId, hidden, onClick, children } = props;
    const navigate = useNavigate();
    const erVeileder = useSelector(selectErVeileder);

    const internalOnClick = (event: MouseEvent) => {
        onClick && onClick();
        if (erVeileder) {
            navigate('/', { replace: true });
            byttTilDialogFlate(event, aktivitetId, dialogId);
        }
    };

    if (hidden) {
        return null;
    }

    return (
        <a href={getDialogLenke(erVeileder, aktivitetId, dialogId)} onClick={internalOnClick} className={className}>
            {children}
        </a>
    );
}

export default LenkeTilDialog;

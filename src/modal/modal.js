import React from 'react';
import ReactModal from 'react-modal';
import './modal.less';

function Modal(props) {
    return (
        <ReactModal
            className="aktivitet-modal"
            overlayClassName="aktivitet-modal__overlay"
            portalClassName="aktivitet-modal-portal"
            {...props}
        />);
}

export default Modal;

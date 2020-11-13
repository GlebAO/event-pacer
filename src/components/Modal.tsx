import React from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

interface ModalInterface {
  onClose: () => void;
  title: string;
  content: JSX.Element;
}

const Modal: React.FC<ModalInterface> = ({ onClose, content, title }) => {
  return ReactDOM.createPortal(
    <div className="modal" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <strong className="modal-title">{title}</strong>
            <button type="button" onClick={onClose} className="btn-close">
            </button>
          </div>
          <div className="modal-body">{content}</div>
        </div>
      </div>
    </div>,
    document.querySelector("#modal")!
  );
};

export default Modal;

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Close } from './Close';
import { detectMobileDevice } from '../../utils/detectMobile';

type FeedbackModalProps = {
  onClose: () => void;
};

export const FeedbackModalName = 'feedback';

export const FeedbackModal: React.FC<FeedbackModalProps> = (props) => {
  const { onClose } = props;
  const isMobile = detectMobileDevice();

  const InnerComponent = () => {
    return (
      <div className="modal modal-feedback" data-cy="modal-feedback">
        <Close onClose={onClose} isMobile={isMobile} />
        <p className="modal-title">
          Feedback
        </p>
        <p className="modal-description">
          Are you missing a feature?
          <br />
          Do you think an existing function could be improved?
        </p>
        <a
          href="https://handsoncode.typeform.com/to/LqlEyO8z"
          target="_blank"
          rel="noopener noreferrer"
          className={`sv-button ${isMobile ? 'mobile-feedback-button' : ''}`}
        >
          Fill out the feedback form
        </a>
      </div>
    );
  };

  return (
    <Dialog
      open
      onClose={onClose}
      PaperComponent={InnerComponent}
      classes={{
        root: 'modal-feedback-background'
      }}
    />
  );
};

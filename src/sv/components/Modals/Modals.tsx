import React from 'react';
import { FeedbackModal, FeedbackModalName } from './FeedbackModal';
import { ModalCloseFn, ModalState } from './abstracts';

interface ModalsProps {
  state: ModalState;
  close: ModalCloseFn;
}

export const Modals: React.FC<ModalsProps> = (props) => {
  const { state, close } = props;

  return (
    <>
      {state[FeedbackModalName] && <FeedbackModal onClose={() => close(FeedbackModalName)} />}
    </>
  );
};

import React, { useState } from 'react';
import { Modals as ModalsInternal } from './Modals';
import {
  ModalCloseFn, ModalName, ModalOpenFn, ModalState
} from './abstracts';

export const useModals = (initialState: ModalState = {}) => {
  const [modalState, setModalState] = useState(() => initialState);

  const openModal: ModalOpenFn = (modalName: ModalName) => {
    setModalState(prevState => ({
      ...prevState,
      [modalName]: true
    }));
  };

  const closeModal: ModalCloseFn = (modalName: ModalName) => {
    setModalState(prevState => ({
      ...prevState,
      [modalName]: false
    }));
  };

  const Modals = () => (<ModalsInternal state={modalState} close={closeModal} />);

  return { Modals, openModal, closeModal };
};

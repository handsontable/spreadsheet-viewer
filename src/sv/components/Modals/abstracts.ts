import { FeedbackModalName } from './FeedbackModal';

export type ModalName = typeof FeedbackModalName;
export type ModalState = {[key in ModalName]?:boolean};
export type ModalCloseFn = (modalName: ModalName) => void;
export type ModalOpenFn = (modalName: ModalName) => void;

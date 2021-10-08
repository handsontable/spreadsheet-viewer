import React from 'react';
import { FeedbackIcon } from '../icons/toolbar/FeedbackIcon';
import { ModalOpenFn } from '../Modals';
import { ToolbarMobileMenuItemText } from './mobile/ItemText';
import { FeedbackModalName } from '../Modals/FeedbackModal';

type FeedbackProps = {
  open: ModalOpenFn;
  mobile?: boolean;
};

export const Feedback = React.forwardRef<HTMLButtonElement, FeedbackProps>(({ open, mobile = false }, ref) => {
  return (
    <button
      type="button"
      className="icon"
      id="feedback-icon"
      onClick={() => open(FeedbackModalName)}
      data-cy={mobile ? 'toolbar-feedback-button-mobile' : 'toolbar-feedback-button'}
      ref={ref}
    >
      <FeedbackIcon />
      {mobile
        ? (
          <ToolbarMobileMenuItemText description="Feedback" />
        )
        : (
          <div role="tooltip" className="icon-tooltip">
            <span>Feedback</span>
          </div>
        )}
    </button>
  );
});

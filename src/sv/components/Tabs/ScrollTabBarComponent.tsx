/**
 * This component is custom implementation of Material Ui TabScrollButton.
 * It is necessary because Materiaul UI TabScrollButton does not have option to configure custom scroll icons.
 * @link https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/TabScrollButton/TabScrollButton.js
 */

/* eslint-disable jsx-a11y/aria-role */
import * as React from 'react';
import { withStyles, StyledComponentProps, WithStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import type { TabScrollButtonProps } from '@material-ui/core/TabScrollButton';
import { CaretLeft } from '../icons/CaretLeft';
import { CaretRight } from '../icons/CaretRight';

const classList = (classes: Record<string, boolean>) => {
  return Object
    .entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(' ');
};

export const styles = {
  /* Styles applied to the root element. */
  root: {
    width: 40,
    flexShrink: 0,
  },
  /* Pseudo-class applied to the root element if `disabled={true}`. */
  disabled: {},
};

const TabScrollButton = React.forwardRef<HTMLAnchorElement, WithStyles & TabScrollButtonProps>((props, ref) => {
  const {
    classes, className: classNameProp, direction, orientation, disabled, ...other
  } = props;

  return (
    <ButtonBase
      component="div"
      className={classList({
        [classes.root || '']: true,
        [classes.vertical || '']: orientation === 'vertical',
        'sv-tab-scroll-button-disabled': Boolean(disabled),
        [classNameProp || '']: true,
        'sv-tab-scroll-button': true
      })}
      ref={ref as any}
      {...other}
    >
      {direction === 'left' ? (
        <CaretLeft data-cy="tabbar-left-caret" />
      ) : (
        <CaretRight data-cy="tabbar-right-caret" />
      )}
    </ButtonBase>
  );
});

export default withStyles(styles)(TabScrollButton);

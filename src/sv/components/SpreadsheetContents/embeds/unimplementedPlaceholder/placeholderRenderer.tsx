import { render } from 'react-dom';
import React from 'react';
import { Placeholder } from './Placeholder';
import { EmbeddedChart } from '../abstracts';
import type { FloatingObjectRenderer } from '../../FloatingBoxPlugin';

export const getUnimplementedPlaceholderRenderer: () => FloatingObjectRenderer = () => {
  return function floatingBoxChartRenderer(
    container,
    width,
    height
  ) {
    container.classList.add('sv-handsontable-chart');
    render(<Placeholder />, container);
  };
};

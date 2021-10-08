import { render } from 'react-dom';
import * as React from 'react';
import { EmbeddedImage } from './abstracts';
import { FloatingObjectRenderer } from '../FloatingBoxPlugin';

export const getImageRenderer = (embeddedObject: EmbeddedImage): FloatingObjectRenderer => {
  return function floatingBoxImageRenderer(container, width, height) {
    container.classList.add('sv-handsontable-image');
    render(<img src={embeddedObject.imageData} alt="" style={{ width, height }} />, container);
  };
};

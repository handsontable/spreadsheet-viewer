import React, { FC } from 'react';
import { Geom } from 'bizcharts';
import {
  imkToMarkerShape,
  getMarkerDef,
  MarkerComponentFlag,
  hasMarkers,
  animationConfig
} from './utils';
import { SeriesDefinition } from '../abstracts';

export enum ImkField {
  FIELD_FRONT = 'front',
  FIELD_BACK = 'back'
}

export enum MarkerColorField {
  FIELD_FRONT = 'rgbFore',
  FIELD_BACK = 'rgbBack'
}

type MarkerComponentProps = {
  chartSeries: SeriesDefinition[];
  componentFlag: MarkerComponentFlag;
  adjust: string;
  imkComponent: ImkField;
  colorField: MarkerColorField;
};

function isValidMarkerShape(imk: number): imk is 1|2|3|4|5|6|7|8|9 {
  return imk > 0 && imk < 10;
}

export const MarkerComponent: FC<MarkerComponentProps> = ({
  chartSeries,
  componentFlag,
  adjust,
  imkComponent,
  colorField
}) => {
  const hasComponent = hasMarkers(chartSeries, componentFlag);
  if (!hasComponent) {
    return null;
  }
  const result = (
    <Geom
      type="point"
      position="key*value"
      adjust={adjust}
      color={[
        'type',
        (t) => {
          const def = getMarkerDef(chartSeries, t);
          if (typeof def?.imk === 'number' && def.imk <= 0 || def?.[componentFlag]) {
            return 'transparent';
          }
          return def?.[colorField] || 'transparent';
        }
      ]}
      shape={[
        'type',
        (t) => {
          const def = getMarkerDef(chartSeries, t);

          if (def === undefined) {
            return '';
          }

          if (!isValidMarkerShape(def.imk)) {
            return '';
          }

          return imkToMarkerShape[def.imk][imkComponent].shape;
        }
      ]}
      size={[
        'type',
        // @ts-ignore
        (t) => {
          const def = getMarkerDef(chartSeries, t);
          return def?.size || 0;
        }
      ]}
      style={{
        fill: 'transparent'
      }}
      animate={animationConfig}
    />
  );
  return result;
};

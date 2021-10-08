import type { WorkSheet } from '@handsontable/js-xlsx';
import { FloatingObjectRenderer } from '../FloatingBoxPlugin';
import { getImageRenderer } from './imageRenderer';
import { getChartLazyRenderer } from './chartLazyRenderer';
import { EmbeddedObject, EmbeddedObjectType } from './abstracts';
import { getUnimplementedPlaceholderRenderer } from './unimplementedPlaceholder/placeholderRenderer';
import { isChartsEnabled } from '../../../utils/featureFlags';

export const getObjectRenderer = (embeddedObject: EmbeddedObject, tableData: WorkSheet): FloatingObjectRenderer => {
  if (embeddedObject.type === EmbeddedObjectType.IMAGE) {
    return getImageRenderer(embeddedObject);
  }

  if (isChartsEnabled()) {
    return getChartLazyRenderer(embeddedObject, tableData);
  }

  return getUnimplementedPlaceholderRenderer();
};

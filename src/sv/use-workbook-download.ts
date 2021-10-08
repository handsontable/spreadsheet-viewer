import { useState, useEffect } from 'react';

import type { WorkbookLocation } from './entities/RequestMessages';

/**
 * This hook translates any workbook input into a URL that will be
 * downloadable with an anchor tag.
 */
export const useWorkbookDownload = (workbookLocation: WorkbookLocation) => {
  const [url, setUrl] = useState<string | undefined>(undefined);

  // We need to create an object url's for the ArrayBuffer if such is present
  // as a workbook input
  useEffect(() => {
    if (typeof workbookLocation === 'string') {
      if (workbookLocation.indexOf('data:') === 0 || workbookLocation.indexOf('blob:') === 0) {
        setUrl(workbookLocation);
        return;
      }

      setUrl(workbookLocation);
      return;
    }

    const objectUrl = URL.createObjectURL(new Blob([workbookLocation]));
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [workbookLocation]);

  return url;
};

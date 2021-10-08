import React from 'react';
import { DownloadIcon } from '../icons/toolbar/DownloadIcon';
import { useWorkbookDownload } from '../../use-workbook-download';
import { ToolbarMobileMenuItemText } from './mobile/ItemText';
import type { WorkbookLocation } from '../../entities/RequestMessages';
import { detectDownloadSupport } from '../../utils/detectDownloadSupport';

type DownloadProps = {
  workbookLocation: WorkbookLocation
  fileName: string
  mobile?: boolean
};

export const Download: React.FC<DownloadProps> = ({ workbookLocation, fileName, mobile }) => {
  const downloadUrl = useWorkbookDownload(workbookLocation);

  if (!detectDownloadSupport()) {
    return null;
  }

  const dataCy = downloadUrl ? 'download-anchor' : undefined;
  const mobileDataCy = dataCy && mobile ? 'download-anchor-mobile' : dataCy;

  return (
    <button type="button" className="icon" id="download-icon">
      <a
        href={downloadUrl}
        download={fileName}
        data-cy={mobileDataCy}
      >
        <DownloadIcon />
        {mobile && <ToolbarMobileMenuItemText description="Download" />}
      </a>
      {!mobile && (
        <div role="tooltip" className="icon-tooltip">
          <span>Download</span>
        </div>
      )}
    </button>
  );
};

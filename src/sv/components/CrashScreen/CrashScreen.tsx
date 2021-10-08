import React from 'react';
import { SvgFurrySnowballIcon } from './SvgFurrySnowballIcon';
import type { WorkbookInput, WorkbookState } from '../../use-workbook';
import { useWorkbookDownload } from '../../use-workbook-download';
import { getErrorCodeFromError, getErrorTextFromErrorCode } from '../../error';
import type { WorkbookLocation } from '../../entities/RequestMessages';
import { getFilenameFromWorkbookInput, unnamedFilename } from '../../filetype';
import { useModals } from '../Modals';
import { Upload } from '../Toolbar/Upload';
import { Feedback } from '../Toolbar/Feedback';
import { ToolbarRightPane, ToolbarWrapper } from '../Toolbar';
import { detectDownloadSupport } from '../../utils/detectDownloadSupport';

type DownloadButtonProps = {
  workbookLocation: WorkbookLocation
  fileName: string
};

const DownloadButton = ({ workbookLocation, fileName }: DownloadButtonProps) => {
  const downloadUrl = useWorkbookDownload(workbookLocation);

  if (!detectDownloadSupport()) {
    return null;
  }

  return (
    <a href={downloadUrl} download={fileName} className="sv-button">
      <span>
        Download file
      </span>
    </a>
  );
};

export type CrashScreenProps = {
  error: unknown
  workbookState: WorkbookState
  loadWorkbook: (workbookInput: WorkbookInput) => void
  resetError: () => void
};

export const formatFileSize = (fileSizeBytes: number) => {
  if (!fileSizeBytes) {
    return '? KB';
  }
  const isGreaterThanMB = fileSizeBytes > 1000000;
  const humanFormattedSize = isGreaterThanMB ? (fileSizeBytes / 1000000).toFixed(2) : Math.ceil(fileSizeBytes / 1000);
  const unit = isGreaterThanMB ? 'MB' : 'KB';
  return `${humanFormattedSize} ${unit}`;
};

export const CrashScreen = ({
  error, workbookState, loadWorkbook, resetError
}: CrashScreenProps) => {
  const formattedFileSize = workbookState?.type === 'ready' ? formatFileSize(workbookState.fileSize) : '? KB';
  const workbookInput = workbookState?.input;
  const fileName: string = (workbookInput ? getFilenameFromWorkbookInput(workbookInput) : unnamedFilename) ?? unnamedFilename;

  const errorCode = getErrorCodeFromError(error);
  const errorText = getErrorTextFromErrorCode(errorCode);

  const { Modals, openModal } = useModals();

  return (
    <>
      <div className="crash-screen--wrapper">
        <Modals />
        <ToolbarWrapper>
          <ToolbarRightPane>
            <Upload renderWorkbook={(props) => {
              resetError();
              loadWorkbook(props);
            }}
            />
            <Feedback open={openModal} />
          </ToolbarRightPane>
        </ToolbarWrapper>
        <div className="crash-screen--body">

          <div className="crash-screen--body-info">

            <SvgFurrySnowballIcon />

            <div className="crash-screen--body-text">
              {errorText}
            </div>

            <div className="crash-screen--body-file-name">
              {fileName}
              {' '}
              ·
              {' '}
              {formattedFileSize}
            </div>

            {
              workbookInput
              && (
                <DownloadButton
                  workbookLocation={
                    workbookInput.type === 'url'
                      ? workbookInput.url
                      : workbookInput.arrayBuffer
                  }
                  fileName={fileName}
                />
              )
            }

          </div>

          <div className="crash-screen--body-error">
            <span>Error code:</span>
            {' '}
            <span className="error-code">{errorCode}</span>
          </div>

        </div>
      </div>
    </>
  );
};

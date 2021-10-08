import React, { useEffect, UIEvent } from 'react';

import { DeveloperWelcomeScreen } from '../DeveloperWelcomeScreen';
import { LoadingScreen } from '../LoadingScreen';
import { useModals } from '../Modals';
import { SpreadsheetContents } from '../SpreadsheetContents';
import { TabBar } from '../Tabs';
import { Toolbar } from '../Toolbar';
import { useTimeout } from '../../use-timeout';
import { SimulateErrorCodes, InvalidRequestMessageError } from '../../error';

import type { WorkbookState, WorkbookInput } from '../../use-workbook';
import { attachSheetCountToBody } from '../../utils/SpreadsheetService';
import { isFullPageEnabled } from '../../utils/featureFlags';
import { getFilenameFromWorkbookInput, unnamedFilename } from '../../filetype';
import type { SvId } from '../../sv-id';

const preventDefaultNoop = (event: UIEvent<HTMLElement>) => {
  event.preventDefault();
};

type SpreadsheetViewerProps = {
  workbookState: WorkbookState
  latestLoadedSheet: number | undefined
  simulateError?: string
  hasValidLicenseKey: boolean
  // The only reason this is needed is for the toolbar to be able to have an
  // upload button.
  loadWorkbook: (workbookInput: WorkbookInput) => void
  onSheetChange: (sheet: number) => void
  requestMessageOnError: (reqMsgError: InvalidRequestMessageError) => void
  svId: SvId
};

const SpreadsheetViewer: React.FC<SpreadsheetViewerProps> = (props) => {
  const {
    onSheetChange,
    simulateError,
    loadWorkbook,
    workbookState,
    latestLoadedSheet,
    requestMessageOnError,
    svId
  } = props;

  const { Modals, openModal } = useModals();

  const isMountedForOverASecond = useTimeout(1000);

  useEffect(() => {
    if (simulateError === SimulateErrorCodes.REACT_INITIALIZATION_ERROR) {
      throw new Error(SimulateErrorCodes.REACT_INITIALIZATION_ERROR);
    }
  }, [simulateError]);

  return (() => {
    if (workbookState === undefined) {
      // Allow a second of no workbook input to be present before showing the
      // developer screen. This is necessary because we're using two
      // different API's to set the workbook input and can't *immediately*
      // know whether a developer screen will be shown or not.
      if (!isMountedForOverASecond) {
        return <LoadingScreen />;
      }

      return <DeveloperWelcomeScreen />;
    }

    if (workbookState.type === 'initialising') {
      return null;
    }

    const { latestSheet } = workbookState.sheetHistory;
    const sheet = latestLoadedSheet === undefined ? undefined : workbookState.sheets.get(latestLoadedSheet);

    const fullPage = isFullPageEnabled();
    attachSheetCountToBody(fullPage, workbookState.sheetNames.length);

    const workbookInput = workbookState.input;
    return (
      <>
        <div className="sv-app-container" onContextMenu={preventDefaultNoop}>
          <Modals />
          {!fullPage && (
            <Toolbar
              fileName={getFilenameFromWorkbookInput(workbookInput) ?? unnamedFilename}
              workbookLocation={
                workbookInput.type === 'url'
                  ? workbookInput.url
                  : workbookInput.arrayBuffer
              }
              renderWorkbook={loadWorkbook}
              openModal={openModal}
            />
          )}
          {latestLoadedSheet !== undefined && sheet?.type === 'ready' && (
            <SpreadsheetContents
              shouldSimulateHandsontableError={
                simulateError === SimulateErrorCodes.RENDER_ERROR
              }
              shouldSimulateInterpreterError={
                simulateError === SimulateErrorCodes.INTERPRETER_ERROR
              }
              parsedData={sheet.parsedData}
              sheet={latestLoadedSheet}
              requestMessageOnError={requestMessageOnError}
              fullPage={fullPage}
              svId={svId}
            />
          )}
          {!fullPage && (
            <TabBar
              currentTabIndex={latestSheet}
              onTabChange={onSheetChange}
              titles={workbookState.sheetNames}
            />
          )}
        </div>
      </>
    );
  })() || <LoadingScreen />;
};

export default SpreadsheetViewer;

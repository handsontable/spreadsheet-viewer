import React, {
  useEffect, useState, useCallback
} from 'react';
import ReactDOM from 'react-dom';

import { MARKERS, startPerfMarker } from '../../perf/markers';

import type { ParseWorker } from './parse-worker';

import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { ThemeLoader } from './components/ThemeLoader';

import type { ThemeStylesheet } from './entities/MessagesShared';
import * as requestMessages from './entities/RequestMessages';

import { useWorkbook } from './use-workbook';
import { useRequestMessage } from './use-request-message';

import { processQueryStringApiParameters } from './utils/QueryStringService';
import { emitReadyForMessages, reEmitWindowInteractionEvents } from './utils/CallbackMessageEmitters';
import { isValidLicenseKey } from './license';
import { InvalidQueryStringApiParameterError, InvalidRequestMessageError } from './error';
import { isMoreFormatsEnabled } from './utils/featureFlags';
import { attachMobileDatasetToElement } from './utils/detectMobile';
import { SvId, create as createSvId } from './sv-id';

const generateId = (desiredLength: number): string => {
  const generated = Math.random().toString(36).substring(2);

  if (generated.length < desiredLength) {
    return generated + generateId(desiredLength - generated.length);
  }

  return generated.substring(0, desiredLength);
};

const CrashScreen = React.lazy(() => import(/* webpackChunkName: "CrashScreen" */ './components/CrashScreen'));

export const run = (parseWorker: ParseWorker) => {
  startPerfMarker(MARKERS.presentation);

  const { queryParameters, error: queryParametersError } = processQueryStringApiParameters(window.location.href);
  const svId: SvId = createSvId(queryParameters.svId || `random-${generateId(25)}`);

  reEmitWindowInteractionEvents(svId, window);
  attachMobileDatasetToElement(document.body);

  const SpreadsheetViewer = React.lazy(() => import(/* webpackChunkName: "SpreadsheetViewer" */ './components/SpreadsheetViewer'));

  const AppContent: React.FC = () => {
    const [themeStylesheet, setThemeStylesheet] = useState<ThemeStylesheet>(() => queryParameters.themeStylesheet || 'dark');
    const [licenseKey, setLicenseKey] = useState<string | undefined>(() => queryParameters.licenseKey);

    const [error, setError] = useState<Error | false>(false);

    const {
      workbookState, latestLoadedSheet, loadWorkbook, changeCurrentSheet
    } = useWorkbook({
      parseWorker,
      onError: setError,
      moreformats: isMoreFormatsEnabled(),
      svId
    });

    // Load initial workbook from the query params, if the required
    // parameters are present. If there has been an error in the params
    // decoding, show that instead.
    useEffect(() => {
      if (queryParametersError) {
        console.error('Query String API:', queryParametersError);
        return setError(new InvalidQueryStringApiParameterError(queryParametersError));
      }

      const { workbookUrl, sheet } = queryParameters;

      if (workbookUrl) {
        loadWorkbook({
          type: 'url',
          url: workbookUrl,
          fileName: queryParameters.fileName
        }, sheet);
      }
    }, [loadWorkbook]);

    const requestMessageOnError = useCallback((reqMsgError: InvalidRequestMessageError) => setError(reqMsgError), []);

    useRequestMessage(requestMessages.loadWorkbook, requestMessages.LoadWorkbook, requestMessageOnError, (request) => {
      setError(false);
      if (typeof request.workbook === 'string') {
        loadWorkbook({
          type: 'url',
          url: request.workbook,
          fileName: request.fileName
        }, request.sheet);
      } else {
        loadWorkbook({
          type: 'arraybuffer',
          arrayBuffer: request.workbook,

          // This will never fallback to the empty string because of the
          // checks above, however it's necessary because of TypeScript's
          // limitations of not being able to discriminate on the `request`
          // like this, using just another property's type.
          fileName: request.fileName ?? ''
        }, request.sheet);
      }
    });

    useRequestMessage(requestMessages.configure, requestMessages.Configure, requestMessageOnError, (configure) => {
      if (configure.themeStylesheet) {
        setThemeStylesheet(configure.themeStylesheet);
      }

      if (configure.licenseKey) {
        setLicenseKey(configure.licenseKey);
      }
    });

    useEffect(() => emitReadyForMessages(svId), []);

    const errorBoundaryOnError = useCallback(
      caughtError => setError(caughtError),
      []
    );

    return (
      <>
        <ThemeLoader themeStylesheet={themeStylesheet} />
        {error
          ? (
            <React.Suspense fallback={<LoadingScreen />}>
              <CrashScreen workbookState={workbookState} error={error} loadWorkbook={loadWorkbook} resetError={() => setError(false)} />
            </React.Suspense>
          )
          : (
            <ErrorBoundary onError={errorBoundaryOnError}>
              <React.Suspense fallback={<LoadingScreen />}>
                <SpreadsheetViewer
                  simulateError={queryParameters.simulateError}
                  loadWorkbook={loadWorkbook}
                  workbookState={workbookState}
                  latestLoadedSheet={latestLoadedSheet}
                  onSheetChange={changeCurrentSheet}
                  requestMessageOnError={requestMessageOnError}
                  hasValidLicenseKey={isValidLicenseKey(licenseKey)}
                  svId={svId}
                />
              </React.Suspense>
            </ErrorBoundary>
          )}
      </>
    );
  };

  const rootElement = document.getElementById('root');
  ReactDOM.render(
    window.Worker ? <AppContent /> : <div>Web Worker unavailable</div>,
    rootElement
  );
};

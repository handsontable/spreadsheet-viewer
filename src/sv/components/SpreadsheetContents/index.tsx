import React, {
  useMemo, useRef, PureComponent
} from 'react';
import { HotTable } from '@handsontable/react';

import { endPerfMarker, MARKERS, startPerfMarker } from '../../../../perf/markers';
import { emitSelectionDetails } from '../../utils/CallbackMessageEmitters';
import Handsontable from '../../../../submodules/handsontable/handsontable';
import { useRequestMessage } from '../../use-request-message';
import * as requestMessages from '../../entities/RequestMessages';
import type { SpreadsheetStyle } from '../../entities/SpreadsheetStyle';
import type { ParsedData } from '../../utils/FileService';

import './FloatingBoxPlugin';
import './HorizontalOverlapPlugin';
import './index.less';
import { cssMapToText, fromData, fullPageModeHotConfig } from './utils';
import { RenderError, InterpreterError, InvalidRequestMessageError } from '../../error';
import {
  resolveEmbedsLoadedFlag,
  initializeLazyEmbedsCounter
} from './embeds/lazyEmbedsCounter';
import { cssFullPageMode } from '../../styles/svFullPageMode';
import { WithSlowChildren } from '../WithSlowChildren';
import { preloadWebFonts } from './preloadFonts';
import { detectMobileDevice } from '../../utils/detectMobile';
import type { SvId } from '../../sv-id';

const reEmitHandsontableAfterSelectionEnd = (svId: SvId) => (
  startRow: number, startColumn: number, endRow: number, endColumn: number
) => {
  emitSelectionDetails(svId, [startRow, startColumn, endRow, endColumn]);
};

type HotTableMockup = {
  hotInstance: Handsontable;
};

type HotInstanceSetter = (table: HotTableMockup | null) => void;

/**
 * Catches any errors thrown by Handsontable and re-throws them as
 * `RenderError`s.
 */
class HandsontableErrorBoundary extends PureComponent {
  componentDidCatch(error: any) {
    throw new RenderError(error?.message);
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export type SpreadsheetContentsProps = {
  parsedData: ParsedData
  sheet: number
  shouldSimulateHandsontableError: boolean
  shouldSimulateInterpreterError: boolean
  requestMessageOnError: (reqMsgError: InvalidRequestMessageError) => void
  fullPage: boolean
  svId: SvId
};

export const SpreadsheetContents: React.FC<SpreadsheetContentsProps> = ((props) => {
  const {
    parsedData,
    sheet,
    shouldSimulateHandsontableError,
    shouldSimulateInterpreterError,
    requestMessageOnError,
    fullPage,
    svId
  } = props;

  const hotInstanceRef = useRef<Handsontable>();
  const isMobile = detectMobileDevice();

  useRequestMessage(requestMessages.selectCells, requestMessages.SelectCells, requestMessageOnError, ({ range }) => {
    hotInstanceRef.current?.selectCells([range]);
  });

  const setHotInstance: HotInstanceSetter = (x) => {
    hotInstanceRef.current = x?.hotInstance;
  };

  const { cssText, tableProps, fontsLoadedPromise } = useMemo(() => {
    initializeLazyEmbedsCounter();

    // Flow of actions done in this function is well explained in this comment https://github.com/handsontable/spreadsheet-viewer-dev/pull/416#discussion_r429871496.

    // INTERPRETER
    try {
      startPerfMarker(MARKERS.interpreter);

      if (shouldSimulateInterpreterError) {
        throw new Error('This is a simulation of an error in the interpreter');
      }

      // It's necessary to clone this object because `cssMapToText` mutates
      // the style map in a way that's not idempotent (as in calling the
      // function multiple times on the same object won't produce the same
      // result). It turns out that this operation is quick enough even on
      // style intensive files, like '/cypress/fixtures/stress-formats.xlsx'
      // that it doesn't hinder performance (between 0-2ms there), and nearly
      // instant on normal files.
      startPerfMarker(MARKERS.interpreterStyleClone);
      const clonedStyleMap = JSON.parse(JSON.stringify(parsedData.styleMap)) as Record<string, SpreadsheetStyle>;
      endPerfMarker(MARKERS.interpreterStyleClone);

      startPerfMarker(MARKERS.interpreterCss);
      const _cssText = cssMapToText(clonedStyleMap);
      endPerfMarker(MARKERS.interpreterCss);

      startPerfMarker(MARKERS.interpreterHotConfig);
      const worksheet = Object.values(parsedData.sheetsData)[sheet];

      if (!worksheet) {
        throw new Error(`Could not retrieve parsed data for the given sheet number (${sheet})`);
      }

      const sheetData = worksheet.data;
      if (!sheetData) {
        throw new Error(
          `Could not retrieve parsed data for the given sheet (${worksheet.title})`
        );
      }
      let { tableProps: _tableProps } = fromData(sheetData, clonedStyleMap);
      _tableProps = fullPage
        ? { ..._tableProps, ...fullPageModeHotConfig }
        : { ..._tableProps, width: '100%', height: '100%' };

      if (!_tableProps) {
        throw new Error(
          'Could not create a `tableProps` object for the given sheet'
        );
      }

      return {
        cssText: _cssText,
        tableProps: _tableProps,
        fontsLoadedPromise: preloadWebFonts()
      };
    } catch (error) {
      console.error('interpreter:', error);
      throw new InterpreterError(error?.message);
    } finally {
      endPerfMarker(MARKERS.interpreterHotConfig);
      endPerfMarker(MARKERS.interpreter);
    }
  }, [parsedData, sheet, shouldSimulateInterpreterError, fullPage]);

  const table = useMemo(() => {
    // Create a new HotTable component whenever the data or the current
    // sheet index changes. A random key forces a new component to be
    // created.
    const key = Math.random().toString(32).substring(2);

    return (
      <HotTable
        settings={tableProps}
        afterSelection={(_row, _col, _row2, _col2, preventScrolling) => {
          if (isMobile) {
            preventScrolling.value = true;
          }
        }}
        afterSelectionEnd={reEmitHandsontableAfterSelectionEnd(svId)}
        afterRender={() => {
          endPerfMarker(MARKERS.presentationHotRendering);
          endPerfMarker(MARKERS.presentation);
          resolveEmbedsLoadedFlag();
          if (shouldSimulateHandsontableError) {
            throw new Error('This is a simulation of an error in rendering of Handsontable');
          }
        }}
        // Disable the copy paste plugin due to a bug with Handsontable that
        // causes they on-screen keyboard to show up on some mobile devices
        // upon tapping a cell.
        //
        // Also, setting this to `false` doesn't prevent the faulty
        // `<textarea>` from being added to the document, therefore we need
        // a dummy element that's not attached to the DOM for Handsontable
        // to have a place to render place the `<textarea>` into. See the
        // links below for details.
        //
        // https://github.com/handsontable/spreadsheet-viewer-dev/issues/875
        // https://github.com/handsontable/handsontable/issues/7414
        copyPaste={isMobile ? {
          // @ts-expect-error
          uiContainer: document.createElement('div')
        } : true}
        ref={setHotInstance}
        key={key}
      />
    );
  }, [shouldSimulateHandsontableError, tableProps, isMobile, svId]);

  return (
    <div className="sv-hottable-wrapper" role="tabpanel">
      <WithSlowChildren holdDownChildRenderPromise={fontsLoadedPromise}>
        <style>{cssText}</style>
        {fullPage && <style>{cssFullPageMode}</style>}
        <HandsontableErrorBoundary>
          {table}
        </HandsontableErrorBoundary>
      </WithSlowChildren>
    </div>
  );
});

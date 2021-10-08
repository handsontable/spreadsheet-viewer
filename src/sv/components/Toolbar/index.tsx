import React from 'react';
import { LogoIcon } from '../icons/toolbar/LogoIcon';
import { Upload } from './Upload';
import { Download } from './Download';
import { Feedback } from './Feedback';
import { ModalOpenFn } from '../Modals';
import { MobileMenu } from './mobile/Menu';
import type { WorkbookInput } from '../../use-workbook';
import type { WorkbookLocation } from '../../entities/RequestMessages';
import { detectMobileDevice } from '../../utils/detectMobile';

type ToolbarProps = {
  fileName: string
  workbookLocation: WorkbookLocation
  renderWorkbook: (workbookInput: WorkbookInput) => void;
  openModal: ModalOpenFn;
};

export const ToolbarWrapper: React.FC = (props) => {
  const { children } = props;

  return (
    <div className="toolbar">
      {children}
    </div>
  );
};

const ToolbarLeftPane: React.FC<{ fileName: string }> = (props) => {
  const { children, fileName } = props;

  return (
    <div className="toolbar-left-pane">
      <div className="icon" id="sv-icon">
        {children}
      </div>
      <p className="file-title">{fileName}</p>
    </div>
  );
};

export const ToolbarRightPane: React.FC = (props) => {
  const { children } = props;

  return (
    <div className="toolbar-right-pane">
      <div className="icons-wrapper">
        {children}
      </div>
    </div>
  );
};

export const Toolbar = ({
  fileName, workbookLocation, renderWorkbook, openModal
}: ToolbarProps) => {
  const isMobile = detectMobileDevice();

  return (
    <ToolbarWrapper>

      <ToolbarLeftPane fileName={fileName}>
        <LogoIcon />
      </ToolbarLeftPane>

      <ToolbarRightPane>
        {!isMobile
          ? (
            <>
              <Upload renderWorkbook={renderWorkbook} />
              <Download workbookLocation={workbookLocation} fileName={fileName} />
              <Feedback open={openModal} />
            </>
          )
          : (
            <MobileMenu>
              <Feedback open={openModal} mobile />
              <Upload renderWorkbook={renderWorkbook} mobile />
              <Download workbookLocation={workbookLocation} fileName={fileName} mobile />
            </MobileMenu>
          )}
        {/* TODO: temporary disabled until https://github.com/handsontable/spreadsheet-viewer-dev/issues/587 resolve */}
        {/* <Close isDisabled={disabledButton} /> */}
        {/* TODO: implement dropbox upload, see https://github.com/handsontable/spreadsheet-viewer-dev/pull/457#discussion_r436972328 */}
        {/* <Dropbox isDisabled={disabledButton} /> */}
        {/* TODO: implement print feature, see https://github.com/handsontable/spreadsheet-viewer-dev/pull/457#discussion_r436961804 */}
        {/* <Print isDisabled={disabledButton} /> */}
      </ToolbarRightPane>

    </ToolbarWrapper>
  );
};

import React from 'react';
import { UploadIcon } from '../icons/toolbar/UploadIcon';
import type { WorkbookInput } from '../../use-workbook';
import { ToolbarMobileMenuItemText } from './mobile/ItemText';

type UploadProps = {
  renderWorkbook: (workbookInput: WorkbookInput) => void;
  mobile?: boolean;
};

export const Upload: React.FC<UploadProps> = ({ renderWorkbook, mobile }) => {
  const getFileAsArrayBuffer = (file: File) => new Promise<ArrayBuffer>((resolve, reject) => {
    if (file.name) {
      console.log(`RECEIVED FILE: ${file.name}`);
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.addEventListener('load', (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(e.target.result);
      } else {
        reject();
      }
    });
  });

  const processFiles = async(files: FileList) => {
    if (files.length === 0) {
      return;
    }
    const file = files.item(0); // if multiple files are provided, we only process the first file

    if (file === null) {
      return;
    }

    const fileAsArrayBuffer = await getFileAsArrayBuffer(file);
    renderWorkbook({
      type: 'arraybuffer',
      arrayBuffer: fileAsArrayBuffer,
      fileName: file.name
    });
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      processFiles(e.target.files);
    }
  };

  const labeledControl = mobile ? 'toolbar-upload-input-mobile' : 'toolbar-upload-input';

  return (
    <label htmlFor={labeledControl}>
      <input
        type="file"
        onChange={onFileUpload}
        hidden
        data-cy={labeledControl}
        id={labeledControl}
      />
      <div className="icon" data-cy={mobile ? 'toolbar-upload-button-mobile' : 'toolbar-upload-button'}>
        <UploadIcon />
        {mobile
          ? <ToolbarMobileMenuItemText description="Upload" />
          : (
            <div role="tooltip" className="icon-tooltip">
              <span>Upload</span>
            </div>
          )}
      </div>
    </label>
  );
};

import React, { useLayoutEffect, useRef } from "react";

import { SpreadsheetViewer } from "../../../spreadsheet-viewer/client-library/clientLibrary";

export default () => {
  const svRef = useRef(null);

  // `useLayoutEffect` is the same as `useEffect`, but the callback inside
  // always gets executed after all DOM mutations, meaning that `svRef.current`
  // will always be populated.
  useLayoutEffect(() => {
    SpreadsheetViewer({
      assetsUrl: "../../../spreadsheet-viewer/sv/index.html",
      container: svRef.current
    })
      .then(instance => {
        instance.configure({
          license: "demo"
        });

        instance.loadWorkbook("../../../common/workbooks/sample-file.xlsx", 0);
      })
      .catch(console.error);
  }, []);

  return (
    <div key="spreadsheet-viewer" id="spreadsheet-viewer" ref={svRef}></div>
  );
};

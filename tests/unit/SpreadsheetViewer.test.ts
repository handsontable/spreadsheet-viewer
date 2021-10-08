import * as chai from 'chai';
import { applyThemeColors } from '../../src/sv/utils/ThemeService';
import { formatFileSize } from '../../src/sv/components/CrashScreen';
import { SpreadsheetStyle, BorderStyles } from '../../src/sv/entities/SpreadsheetStyle';
import { showCellGridlines } from '../../src/sv/components/SpreadsheetContents/utils/gridlinesFormatting';

describe('SpreadsheetViewer unit tests', () => {
  describe('SpreadsheetViewer / utils  tests', () => {
    describe('ThemeService.ts (SpreadsheetViewer / utils) tests', () => {
      getDataForApplyThemesColors().forEach((d) => { // eslint-disable-line @typescript-eslint/no-use-before-define
        it(`applyThemeColors() ${d.label}`, () => {
          const themes = [{ rgb: '00AABB' }, { rgb: '11AABB' }];
          const style = { ...d.inStyle };

          // action
          applyThemeColors(style, themes);

          // assert
          chai.expect(style).eql(d.expectedStyle);
        });
      });
    });
    describe('CrashScreen file size formatter tests', () => {
      it('should format 0 bytes as ? KB', () => {
        const result = formatFileSize(0);
        chai.expect(result).eql('? KB');
      });
      it('should format 123 bytes as 1 KB', () => {
        const result = formatFileSize(123);
        chai.expect(result).eql('1 KB');
      });
      it('should format 1234 bytes as 1 KB', () => {
        const result = formatFileSize(1234);
        chai.expect(result).eql('2 KB');
      });
      it('should format 1234567 bytes as 1.23 MB', () => {
        const result = formatFileSize(1234567);
        chai.expect(result).eql('1.23 MB');
      });
    });
  });
  describe('SpreadsheetContents/utils/gridlinesFormatting - unit tests', () => {
    describe('showCellGridlines', () => {
      it('should get true for borders null', () => {
        // init
        const borders = null;
        // action
        const result = showCellGridlines(borders);
        // assertion
        chai.expect(result).equal(true);
      });
      it('should get false for borders undefined', () => {
        // init
        const borders = undefined;
        // action
        const result = showCellGridlines(borders);
        // assertion
        chai.expect(result).equal(false);
      });
      it('should get false for borders {top: { width: \'thin\', color: \'FFFFFFF\' }}', () => {
        // init
        const borders: BorderStyles = { top: { width: 'thin', color: 'FFFFFF' } };
        // action
        const result = showCellGridlines(borders);
        // assertion
        chai.expect(result).equal(false);
      });
    });
  });
});

function getDataForApplyThemesColors() : {label:string, inStyle: SpreadsheetStyle, expectedStyle: SpreadsheetStyle}[] {

  return [
    {
      label: ' fgColor: Empty object should be not modified',
      inStyle: {},
      expectedStyle: {}
    }, {
      label: ' fgColor: When rgb was set should be not modified',
      inStyle: { fgColor: { rgb: 'AABBAA' } },
      expectedStyle: { fgColor: { rgb: 'AABBAA' } }
    }, {
      label: ' fgColor: When theme wasn\'t set should be not modified',
      inStyle: { fgColor: {} },
      expectedStyle: { fgColor: {} }
    }, {
      label: ' fgColor: When rgb & theme was set should be not modified',
      inStyle: { fgColor: { rgb: 'AABBAA', theme: 1 } },
      expectedStyle: { fgColor: { rgb: 'AABBAA', theme: 1 } }
    }, {
      label: ' fgColor: When theme was set out of range should be not modified',
      inStyle: { fgColor: { theme: -5 } },
      expectedStyle: { fgColor: { theme: -5 } }
    }, {
      label: ' bgColor: Empty object should be not modified',
      inStyle: {},
      expectedStyle: {}
    }, {
      label: ' bgColor: When rgb was set should be not modified',
      inStyle: { bgColor: { rgb: 'AABBAA' } },
      expectedStyle: { bgColor: { rgb: 'AABBAA' } }
    }, {
      label: ' bgColor: When theme wasn\'t set should be not modified',
      inStyle: { bgColor: {} },
      expectedStyle: { bgColor: {} }
    }, {
      label: ' bgColor: When rgb & theme was set should be not modified',
      inStyle: { bgColor: { rgb: 'AABBAA', theme: 1 } },
      expectedStyle: { bgColor: { rgb: 'AABBAA', theme: 1 } }
    }, {
      label: ' bgColor: When theme was set & rgb wasn\'t set should be color applied',
      inStyle: { bgColor: { theme: 1 } },
      expectedStyle: { bgColor: { rgb: '11AABB', theme: 1 } }
    }, {
      label: ' bgColor: When theme was set out of range should be not modified',
      inStyle: { bgColor: { theme: -5 } },
      expectedStyle: { bgColor: { theme: -5 } }
    },
  ];
}

import {
  getFgColor, getBorders, top, bottom, left, right, thin, thick
} from './helpers';
import { LightTableStyles, TableStyleFragments } from '../../entities/SpreadsheetTableStyle';

const PATTERN_TYPE_SOLID = 'solid';

export const lightTableStyles: Record<LightTableStyles, TableStyleFragments | null> = {
  TableStyleLight1: {
    header: {
      border: getBorders([top, bottom], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: getBorders([top, bottom], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    firstRow: {
      border: getBorders([top], thin, '000000'),
    },
    lastRow: {
      border: getBorders([bottom], thin, '000000'),
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([top, bottom, left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([top, bottom, left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight2: {
    header: {
      border: getBorders([top, bottom], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: getBorders([top, bottom], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    firstRow: {
      border: getBorders([top], thin, '4472C4'),
    },
    lastRow: {
      border: getBorders([bottom], thin, '4472C4'),
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('D9E1F2'),
      border: getBorders([top, bottom, left, right], thin, 'D9E1F2'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9E1F2'),
      border: getBorders([top, bottom, left, right], thin, 'D9E1F2'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#305496'
    }
  },
  TableStyleLight3: {
    header: {
      border: getBorders([top, bottom], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: getBorders([top, bottom], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    firstRow: {
      border: getBorders([top], thin, 'ED7D31'),
    },
    lastRow: {
      border: getBorders([bottom], thin, 'ED7D31'),
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('FCE4D6'),
      border: getBorders([top, bottom, left, right], thin, 'FCE4D6'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('FCE4D6'),
      border: getBorders([top, bottom, left, right], thin, 'FCE4D6'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#C65911'
    }
  },
  TableStyleLight4: {
    header: {
      border: getBorders([top, bottom], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: getBorders([top, bottom], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    firstRow: {
      border: getBorders([top], thin, 'A5A5A5'),
    },
    lastRow: {
      border: getBorders([bottom], thin, 'A5A5A5'),
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('EDEDED'),
      border: getBorders([top, bottom, left, right], thin, 'EDEDED'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('EDEDED'),
      border: getBorders([top, bottom, left, right], thin, 'EDEDED'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#7B7B7B'
    }
  },
  TableStyleLight5: {
    header: {
      border: getBorders([top, bottom], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: getBorders([top, bottom], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    firstRow: {
      border: getBorders([top], thin, 'FFC001'),
    },
    lastRow: {
      border: getBorders([bottom], thin, 'FFC001'),
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('FFF2CC'),
      border: getBorders([top, bottom, left, right], thin, 'FFF2CC'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('FFF2CC'),
      border: getBorders([top, bottom, left, right], thin, 'FFF2CC'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#BF8F01'
    }
  },
  TableStyleLight6: {
    header: {
      border: getBorders([top, bottom], 'thin', '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: getBorders([top, bottom], 'thin', '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    firstRow: {
      border: getBorders([top], 'thin', '5B9BD5'),
    },
    lastRow: {
      border: getBorders([bottom], 'thin', '5B9BD5'),
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('DDEBF7'),
      border: getBorders([top, bottom, left, right], thin, 'DDEBF7'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('DDEBF7'),
      border: getBorders([top, bottom, left, right], thin, 'DDEBF7'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#2F75B5'
    }
  },
  TableStyleLight7: {
    header: {
      border: getBorders([top, bottom], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: getBorders([top, bottom], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    firstRow: {
      border: getBorders([top], thin, '70AD47'),
    },
    lastRow: {
      border: getBorders([bottom], thin, '70AD47'),
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('E2EFDA'),
      border: getBorders([top, bottom, left, right], thin, 'E2EFDA'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('E2EFDA'),
      border: getBorders([top, bottom, left, right], thin, 'E2EFDA'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#548235'
    }
  },
  TableStyleLight8: {
    header: {
      fgColor: getFgColor('000000'),
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, '000000'), getBorders([top], thick, '000000')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold'
    },
    firstColumn: {
      border: getBorders([left], thin, '000000')
    },
    lastColumn: {
      border: getBorders([right], thin, '000000')
    },
    firstRow: {
      border: getBorders([top], thin, '000000')
    },
    lastRow: {
      border: getBorders([bottom], thin, '000000')
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      border: getBorders([left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      border: getBorders([top], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight9: {
    header: {
      fgColor: getFgColor('4472C4'),
      border: getBorders([top, bottom, left, right], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    firstColumn: {
      border: getBorders([left], thin, '4472C4')
    },
    lastColumn: {
      border: getBorders([right], thin, '4472C4')
    },
    firstRow: {
      border: getBorders([top], thin, '4472C4')
    },
    lastRow: {
      border: getBorders([bottom], thin, '4472C4')
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      border: getBorders([left, right], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      border: getBorders([top], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, '4472C4'), getBorders([top], thick, '4472C4')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight10: {
    header: {
      fgColor: getFgColor('ED7D31'),
      border: getBorders([top, bottom, left, right], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    firstColumn: {
      border: getBorders([left], thin, 'ED7D31')
    },
    lastColumn: {
      border: getBorders([right], thin, 'ED7D31')
    },
    firstRow: {
      border: getBorders([top], thin, 'ED7D31')
    },
    lastRow: {
      border: getBorders([bottom], thin, 'ED7D31')
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      border: getBorders([left, right], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      border: getBorders([top], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, 'ED7D31'), getBorders([top], thick, 'ED7D31')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight11: {
    header: {
      fgColor: getFgColor('A5A5A5'),
      border: getBorders([top, bottom, left, right], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    firstColumn: {
      border: getBorders([left], thin, 'A5A5A5')
    },
    lastColumn: {
      border: getBorders([right], thin, 'A5A5A5')
    },
    firstRow: {
      border: getBorders([top], thin, 'A5A5A5')
    },
    lastRow: {
      border: getBorders([bottom], thin, 'A5A5A5')
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      border: getBorders([left, right], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      border: getBorders([top], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, 'A5A5A5'), getBorders([top], thick, 'A5A5A5')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight12: {
    header: {
      fgColor: getFgColor('FFC001'),
      border: getBorders([top, bottom, left, right], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    firstColumn: {
      border: getBorders([left], thin, 'FFC001')
    },
    lastColumn: {
      border: getBorders([right], thin, 'FFC001')
    },
    firstRow: {
      border: getBorders([top], thin, 'FFC001')
    },
    lastRow: {
      border: getBorders([bottom], thin, 'FFC001')
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      border: getBorders([left, right], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      border: getBorders([top], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, 'FFC001'), getBorders([top], thick, 'FFC001')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight13: {
    header: {
      fgColor: getFgColor('5B9BD5'),
      border: getBorders([top, bottom, left, right], thin, '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    firstColumn: {
      border: getBorders([left], thin, '5B9BD5')
    },
    lastColumn: {
      border: getBorders([right], thin, '5B9BD5')
    },
    firstRow: {
      border: getBorders([top], thin, '5B9BD5')
    },
    lastRow: {
      border: getBorders([bottom], thin, '5B9BD5')
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      border: getBorders([left, right], thin, '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top], thin, '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      border: getBorders([top], thin, '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, '5B9BD5'), getBorders([top], thick, '5B9BD5')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight14: {
    header: {
      fgColor: getFgColor('70AD47'),
      border: getBorders([top, bottom, left, right], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    firstColumn: {
      border: getBorders([left], thin, '70AD47')
    },
    lastColumn: {
      border: getBorders([right], thin, '70AD47')
    },
    firstRow: {
      border: getBorders([top], thin, '70AD47')
    },
    lastRow: {
      border: getBorders([bottom], thin, '70AD47')
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      border: getBorders([left, right], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      border: getBorders([top], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, '70AD47'), getBorders([top], thick, '70AD47')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight15: {
    header: {
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: Object.assign(getBorders([left, right, bottom], thin, '000000'), getBorders([top], thick, '000000')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight16: {
    header: {
      border: getBorders([top, bottom, left, right], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: Object.assign(getBorders([left, right, bottom], thin, '4472C4'), getBorders([top], thick, '4472C4')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('D9E1F2'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top, bottom, left, right], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9E1F2'),
      border: getBorders([top, bottom, left, right], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight17: {
    header: {
      border: getBorders([top, bottom, left, right], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    averageRow: {
      border: Object.assign(getBorders([left, right, bottom], thin, 'ED7D31'), getBorders([top], thick, 'ED7D31')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('FCE4D6'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top, bottom, left, right], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('FCE4D6'),
      border: getBorders([top, bottom, left, right], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight18: {
    header: {
      border: getBorders([top, bottom, left, right], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold'
    },
    averageRow: {
      border: Object.assign(getBorders([left, right, bottom], thin, 'A5A5A5'), getBorders([top], thick, 'A5A5A5')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('EDEDED'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top, bottom, left, right], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('EDEDED'),
      border: getBorders([top, bottom, left, right], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight19: {
    header: {
      border: getBorders([top, bottom, left, right], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold'
    },
    averageRow: {
      border: Object.assign(getBorders([left, right, bottom], thin, 'FFC001'), getBorders([top], thick, 'FFC001')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('FFF2CC'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top, bottom, left, right], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('FFF2CC'),
      border: getBorders([top, bottom, left, right], thin, 'FFC001'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight20: {
    header: {
      border: getBorders([top, bottom, left, right], thin, '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold'
    },
    averageRow: {
      border: Object.assign(getBorders([left, right, bottom], thin, '5B9BD5'), getBorders([top], thick, '5B9BD5')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('DDEBF7'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top, bottom, left, right], thin, '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('DDEBF7'),
      border: getBorders([top, bottom, left, right], thin, '5B9BD5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleLight21: {
    header: {
      border: getBorders([top, bottom, left, right], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold'
    },
    averageRow: {
      border: Object.assign(getBorders([left, right, bottom], thin, '70AD47'), getBorders([top], thick, '70AD47')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold'
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('E2EFDA'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: getBorders([top, bottom, left, right], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('E2EFDA'),
      border: getBorders([top, bottom, left, right], thin, '70AD47'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  }
};

import {
  getFgColor, getBorders, top, bottom, left, right, thin, medium, thick
} from './helpers';
import { DarkTableStyles, TableStyleFragments } from '../../entities/SpreadsheetTableStyle';

const PATTERN_TYPE_SOLID = 'solid';

export const darkTableStyles: Record<DarkTableStyles, TableStyleFragments | null> = {
  TableStyleDark1: {
    header: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([top, left, right], thin, '000000'), getBorders([bottom], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      fgColor: getFgColor('262626'),
      border: Object.assign(getBorders([bottom, left, right], thin, '262626'), getBorders([top], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('404040'),
      border: Object.assign(getBorders([right], medium, 'FFFFFF'), getBorders([left], thin, '404040'))
    },
    showLastColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('404040'),
      border: Object.assign(getBorders([left], medium, 'FFFFFF'), getBorders([right], thin, '404040'))
    },
    oddColumn: {
      fgColor: getFgColor('404040'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('737373'),
      border: getBorders([top, bottom, left, right], thin, '737373'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('404040'),
      border: getBorders([top, bottom, left, right], thin, '404040'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#FFFFFF'
    }
  },
  TableStyleDark2: {
    header: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([top, left, right], thin, '000000'), getBorders([bottom], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      fgColor: getFgColor('203764'),
      border: Object.assign(getBorders([bottom, left, right], thin, '203764'), getBorders([top], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('305496'),
      border: Object.assign(getBorders([right], medium, 'FFFFFF'), getBorders([left], thin, '305496'))
    },
    showLastColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('305496'),
      border: Object.assign(getBorders([left], medium, 'FFFFFF'), getBorders([right], thin, '305496'))
    },
    oddColumn: {
      fgColor: getFgColor('305496'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('4472C4'),
      border: getBorders([top, bottom, left, right], thin, '4472C4'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('305496'),
      border: getBorders([top, bottom, left, right], thin, '305496'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#FFFFFF'
    },
  },
  TableStyleDark3: {
    header: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([top, left, right], thin, '000000'), getBorders([bottom], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      fgColor: getFgColor('833C0C'),
      border: Object.assign(getBorders([bottom, left, right], thin, '833C0C'), getBorders([top], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('C65911'),
      border: Object.assign(getBorders([right], medium, 'FFFFFF'), getBorders([left], thin, 'C65911'))
    },
    showLastColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('C65911'),
      border: Object.assign(getBorders([left], medium, 'FFFFFF'), getBorders([right], thin, 'C65911'))
    },
    oddColumn: {
      fgColor: getFgColor('C65911'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('ED7D31'),
      border: getBorders([top, bottom, left, right], thin, 'ED7D31'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('C65911'),
      border: getBorders([top, bottom, left, right], thin, 'C65911'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#FFFFFF'
    }
  },
  TableStyleDark4: {
    header: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([top, left, right], thin, '000000'), getBorders([bottom], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      fgColor: getFgColor('525252'),
      border: Object.assign(getBorders([bottom, left, right], thin, '525252'), getBorders([top], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('7B7B7B'),
      border: Object.assign(getBorders([right], medium, 'FFFFFF'), getBorders([left], thin, '7B7B7B'))
    },
    showLastColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('7B7B7B'),
      border: Object.assign(getBorders([left], medium, 'FFFFFF'), getBorders([right], thin, '7B7B7B'))
    },
    oddColumn: {
      fgColor: getFgColor('7B7B7B'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('A5A5A5'),
      border: getBorders([top, bottom, left, right], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('7B7B7B'),
      border: getBorders([top, bottom, left, right], thin, '7B7B7B'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#FFFFFF'
    }
  },
  TableStyleDark5: {
    header: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([top, left, right], thin, '000000'), getBorders([bottom], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      fgColor: getFgColor('816100'),
      border: Object.assign(getBorders([bottom, left, right], thin, '816100'), getBorders([top], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('C09000'),
      border: Object.assign(getBorders([right], medium, 'FFFFFF'), getBorders([left], thin, 'C09000'))
    },
    showLastColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('C09000'),
      border: Object.assign(getBorders([left], medium, 'FFFFFF'), getBorders([right], thin, 'C09000'))
    },
    oddColumn: {
      fgColor: getFgColor('C09000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('FFC101'),
      border: getBorders([top, bottom, left, right], thin, 'FFC101'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('C09000'),
      border: getBorders([top, bottom, left, right], thin, 'C09000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#FFFFFF'
    }
  },
  TableStyleDark6: {
    header: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([top, left, right], thin, '000000'), getBorders([bottom], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      fgColor: getFgColor('1C4D7A'),
      border: Object.assign(getBorders([bottom, left, right], thin, '1C4D7A'), getBorders([top], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('2A74B7'),
      border: Object.assign(getBorders([right], medium, 'FFFFFF'), getBorders([left], thin, '2A74B7'))
    },
    showLastColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('2A74B7'),
      border: Object.assign(getBorders([left], medium, 'FFFFFF'), getBorders([right], thin, '2A74B7'))
    },
    oddColumn: {
      fgColor: getFgColor('2A74B7'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('589AD7'),
      border: getBorders([top, bottom, left, right], thin, '589AD7'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('2A74B7'),
      border: getBorders([top, bottom, left, right], thin, '2A74B7'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#FFFFFF'
    }
  },
  TableStyleDark7: {
    header: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([top, left, right], thin, '000000'), getBorders([bottom], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      fgColor: getFgColor('365720'),
      border: Object.assign(getBorders([bottom, left, right], thin, '365720'), getBorders([top], medium, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('538330'),
      border: Object.assign(getBorders([right], medium, 'FFFFFF'), getBorders([left], thin, '538330'))
    },
    showLastColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('538330'),
      border: Object.assign(getBorders([left], medium, 'FFFFFF'), getBorders([right], thin, '538330'))
    },
    oddColumn: {
      fgColor: getFgColor('538330'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('6EAE40'),
      border: getBorders([top, bottom, left, right], thin, '6EAE40'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('538330'),
      border: getBorders([top, bottom, left, right], thin, '538330'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#FFFFFF'
    }
  },
  TableStyleDark8: {
    header: {
      fgColor: getFgColor('000000'),
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      fgColor: getFgColor('D9D9D9'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'D9D9D9'), getBorders([top], thick, '000000')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold'
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('A6A6A6'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([top, bottom, left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('A6A6A6'),
      border: getBorders([top, bottom, left, right], thin, 'A6A6A6'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleDark9: {
    header: {
      fgColor: getFgColor('EF7D22'),
      border: getBorders([top, bottom, left, right], thin, 'EF7D22'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      fgColor: getFgColor('D9E1F3'),
      border: Object.assign(getBorders([top], thick, '000000'), getBorders([bottom, left, right], thin, 'D9E1F3')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold'
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('B3C5E8'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('D9E1F3'),
      border: getBorders([top, bottom, left, right], thin, 'D9E1F3'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('B3C5E8'),
      border: getBorders([top, bottom, left, right], thin, 'B3C5E8'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleDark10: {
    header: {
      fgColor: getFgColor('FFC101'),
      border: getBorders([top, bottom, left, right], thin, 'FFC101'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      fgColor: getFgColor('EDEDED'),
      border: Object.assign(getBorders([top], thick, '000000'), getBorders([bottom, left, right], thin, 'EDEDED')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('DBDBDB'),
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('DBDBDB'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('EDEDED'),
      border: getBorders([top, bottom, left, right], thin, 'EDEDED'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('DBDBDB'),
      border: getBorders([top, bottom, left, right], thin, 'DBDBDB'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  },
  TableStyleDark11: {
    header: {
      fgColor: getFgColor('6EAE40'),
      border: getBorders([top, bottom, left, right], thin, '6EAE40'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      fgColor: getFgColor('DDEBF8'),
      border: Object.assign(getBorders([top], thick, '000000'), getBorders([bottom, left, right], thin, 'DDEBF8')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    showFirstColumn: {
      fontWeight: 'bold',
      fgColor: getFgColor('BCD7EF'),
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('BCD7EF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('DDEBF8'),
      border: getBorders([top, bottom, left, right], thin, 'DDEBF8'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('BCD7EF'),
      border: getBorders([top, bottom, left, right], thin, 'BCD7EF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    table: {
      color: '#000000'
    }
  }
};

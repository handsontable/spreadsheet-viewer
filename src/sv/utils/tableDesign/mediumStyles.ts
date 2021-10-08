import {
  getBorders, top, left, right, getFgColor, bottom, thin, medium, thick
} from './helpers';
import { MediumTableStyles, TableStyleFragments } from '../../entities/SpreadsheetTableStyle';

const PATTERN_TYPE_SOLID = 'solid';

export const mediumTableStyles: Record<MediumTableStyles, TableStyleFragments | null> = {
  TableStyleMedium1: {
    firstColumn: {
      border: getBorders([left], thin, '000000')
    },
    lastColumn: {
      border: getBorders([right], thin, '000000')
    },
    header: {
      fgColor: getFgColor('000000'),
      color: '#FFFFFF',
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, '000000'), getBorders([top], thick, '000000')),
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fontWeight: 'bold',
    },
    showLastColumn: {
      fontWeight: 'bold',
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: Object.assign(getBorders([top, bottom], thin, '000000'), getBorders([left, right], thin, 'D9D9D9')),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium2: {
    firstColumn: {
      border: getBorders([left], thin, '8DA8DD'),
    },
    lastColumn: {
      border: getBorders([right], thin, '8DA8DD'),
    },
    header: {
      fgColor: getFgColor('4270C7'),
      border: getBorders([top, bottom, left, right], thin, '4270C7'),
      color: '#FFFFFF',
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(getBorders([bottom], thin, '8DA8DD'), getBorders([top], thick, '4270C7')),
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
      border: getBorders([left, right], thin, 'D9E1F2'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9E1F2'),
      border: Object.assign(getBorders([top, bottom], thin, '8EA9DB'), getBorders([left, right], thin, 'D9E1F2')),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium3: {
    firstColumn: {
      border: getBorders([left], thin, 'F6B080'),
    },
    lastColumn: {
      border: getBorders([right], thin, 'F6B080'),
    },
    header: {
      fgColor: getFgColor('F37D22'),
      border: getBorders([top, bottom, left, right], thin, 'F37D22'),
      color: '#FFFFFF',
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(getBorders([top], thick, 'EF7D22'), getBorders([bottom], thin, 'F6B080')),
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
      fgColor: getFgColor('FDE4D5'),
      border: getBorders([left, right], thin, 'FDE4D5'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('FDE4D5'),
      border: Object.assign(getBorders([top, bottom], thin, 'F4B084'), getBorders([left, right], thin, 'FDE4D5')),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium4: {
    firstColumn: {
      border: getBorders([left], thin, 'C9C9C9'),
    },
    lastColumn: {
      border: getBorders([right], thin, 'C9C9C9'),
    },
    header: {
      fgColor: getFgColor('A5A5A5'),
      border: getBorders([top, bottom, left, right], thin, 'A5A5A5'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(getBorders([top], thick, 'A5A5A5'), getBorders([bottom], thin, 'C9C9C9')),
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
      border: getBorders([left, right], thin, 'EDEDED'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('EDEDED'),
      border: Object.assign(getBorders([top, bottom], thin, 'C9C9C9'), getBorders([left, right], thin, 'EDEDED')),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
  },
  TableStyleMedium5: {
    firstColumn: {
      border: getBorders([left], thin, 'FFDA5C'),
    },
    lastColumn: {
      border: getBorders([right], thin, 'FFDA5C'),
    },
    header: {
      fgColor: getFgColor('FFC100'),
      border: getBorders([top, bottom, left, right], thin, 'FFC100'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(getBorders([top], thick, 'FFC100'), getBorders([bottom], thin, 'FFDA5C')),
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
      fgColor: getFgColor('FFF3CA'),
      border: getBorders([left, right], thin, 'FFF3CA'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('FFF3CA'),
      border: Object.assign(getBorders([top, bottom], thin, 'FFDA5C'), getBorders([left, right], thin, 'FFF3CA')),
      patternType: PATTERN_TYPE_SOLID,
    },
  },
  TableStyleMedium6: {
    firstColumn: {
      border: getBorders([left], thin, '9BC2E6'),
    },
    lastColumn: {
      border: getBorders([right], thin, '9BC2E6'),
    },
    header: {
      fgColor: getFgColor('589AD7'),
      border: getBorders([top, bottom, left, right], thin, '589AD7'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(getBorders([top], thick, '589AD7'), getBorders([bottom], thin, '9BC2E6')),
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
      fgColor: getFgColor('DDEBF8'),
      border: getBorders([left, right], thin, 'DDEBF8'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('DDEBF8'),
      border: Object.assign(getBorders([top, bottom], thin, '9BC2E6'), getBorders([left, right], thin, 'DDEBF8')),
      patternType: PATTERN_TYPE_SOLID,
    },
  },
  TableStyleMedium7: {
    firstColumn: {
      border: getBorders([left], thin, 'A8D18B'),
    },
    lastColumn: {
      border: getBorders([right], thin, 'A8D18B'),
    },
    header: {
      fgColor: getFgColor('6EAE40'),
      border: getBorders([top, bottom, left, right], thin, '6EAE40'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(getBorders([top], thick, '6EAE40'), getBorders([bottom], thin, 'A8D18B')),
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
      fgColor: getFgColor('E2EFD9'),
      border: getBorders([left, right], thin, 'E2EFD9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('E2EFD9'),
      border: Object.assign(getBorders([top, bottom], thin, 'A8D18B'), getBorders([left, right], thin, 'E2EFD9')),
      patternType: PATTERN_TYPE_SOLID,
    },
  },
  TableStyleMedium8: {
    header: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([top, left, right], thin, 'FFFFFF'), getBorders([bottom], thick, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      fgColor: getFgColor('000000'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'FFFFFF'), getBorders([top], thick, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    showFirstColumn: {
      fgColor: getFgColor('000000'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('000000'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('A6A6A6'),
      border: getBorders([left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('A6A6A6'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium9: {
    header: {
      fgColor: getFgColor('4472C4'),
      border: Object.assign(getBorders([top, left, right], thin, 'FFFFFF'), getBorders([bottom], thick, 'FFFFFF')),
      color: '#FFFFFF',
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      fgColor: getFgColor('4472C4'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'FFFFFF'), getBorders([top], thick, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    showFirstColumn: {
      fgColor: getFgColor('4472C4'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('4472C4'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('B4C6E7'),
      border: getBorders([left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('D9E1F2'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('B4C6E7'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium10: {
    header: {
      fgColor: getFgColor('ED7D31'),
      border: Object.assign(getBorders([top, left, right], thin, 'FFFFFF'), getBorders([bottom], thick, 'FFFFFF')),
      color: '#FFFFFF',
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      fgColor: getFgColor('ED7D31'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'FFFFFF'), getBorders([top], thick, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    showFirstColumn: {
      fgColor: getFgColor('ED7D31'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('ED7D31'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('F8CBAD'),
      border: getBorders([left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('FCE4D6'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('F8CBAD'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium11: {
    header: {
      fgColor: getFgColor('A5A5A5'),
      border: Object.assign(getBorders([top, left, right], thin, 'FFFFFF'), getBorders([bottom], thick, 'FFFFFF')),
      color: '#FFFFFF',
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      fgColor: getFgColor('A5A5A5'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'FFFFFF'), getBorders([top], thick, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    showFirstColumn: {
      fgColor: getFgColor('A5A5A5'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('A5A5A5'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('DBDBDB'),
      border: getBorders([left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('EDEDED'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('DBDBDB'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium12: {
    header: {
      fgColor: getFgColor('FFC001'),
      border: Object.assign(getBorders([top, left, right], thin, 'FFFFFF'), getBorders([bottom], thick, 'FFFFFF')),
      color: '#FFFFFF',
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      fgColor: getFgColor('FFC001'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'FFFFFF'), getBorders([top], thick, 'FFFFFF')),
      fontWeight: 'bold',
      color: '#FFFFFF',
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fgColor: getFgColor('FFC001'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('FFC001'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('FFE698'),
      border: getBorders([left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('FFF2CC'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('FFE698'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium13: {
    header: {
      fgColor: getFgColor('5B9BD5'),
      border: Object.assign(getBorders([top, left, right], thin, 'FFFFFF'), getBorders([bottom], thick, 'FFFFFF')),
      color: '#FFFFFF',
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      fgColor: getFgColor('5B9BD5'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'FFFFFF'), getBorders([top], thick, 'FFFFFF')),
      fontWeight: 'bold',
      color: '#FFFFFF',
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fgColor: getFgColor('5B9BD5'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('5B9BD5'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('BDD7EE'),
      border: getBorders([left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('DDEBF7'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('BDD7EE'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium14: {
    header: {
      fgColor: getFgColor('6EAE40'),
      border: Object.assign(getBorders([top, left, right], thin, 'FFFFFF'), getBorders([bottom], thick, 'FFFFFF')),
      color: '#FFFFFF',
      fontWeight: 'bold',
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      fgColor: getFgColor('6EAE40'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'FFFFFF'), getBorders([top], thick, 'FFFFFF')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    showFirstColumn: {
      fgColor: getFgColor('6EAE40'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('6EAE40'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('C5E1B2'),
      border: getBorders([left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('E2EFD9'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('C5E1B2'),
      border: getBorders([top, bottom, left, right], thin, 'FFFFFF'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium15: {
    header: {
      fgColor: getFgColor('000000'),
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    showFirstColumn: {
      fgColor: getFgColor('000000'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('000000'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('A6A6A6'),
      border: getBorders([left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    averageRow: {
      border: Object.assign(
        getBorders([left, right], thin, '000000'),
        getBorders([top], thick, '000000'),
        getBorders([bottom], medium, '000000')
      ),
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
    }
  },
  TableStyleMedium16: {
    header: {
      fgColor: getFgColor('4472C4'),
      border: Object.assign(getBorders([top, bottom], thin, '000000'), getBorders([left, right], thin, '4472C4')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(
        getBorders([top], thick, '000000'),
        getBorders([bottom], medium, '000000')
      ),
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fgColor: getFgColor('4472C4'),
      border: getBorders([top, bottom, left, right], thin, '4472C4'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('4472C4'),
      border: getBorders([top, bottom, left, right], thin, '4472C4'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium17: {
    header: {
      fgColor: getFgColor('ED7D31'),
      border: Object.assign(getBorders([top, bottom], thin, '000000'), getBorders([left, right], thin, 'ED7D31')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(
        getBorders([top], thick, '000000'),
        getBorders([bottom], medium, '000000')
      ),
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fgColor: getFgColor('ED7D31'),
      border: getBorders([top, bottom, left, right], thin, 'ED7D31'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('ED7D31'),
      border: getBorders([top, bottom, left, right], thin, 'ED7D31'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium18: {
    header: {
      fgColor: getFgColor('A5A5A5'),
      border: Object.assign(getBorders([top, bottom], thin, '000000'), getBorders([left, right], thin, 'A5A5A5')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(
        getBorders([top], thick, '000000'),
        getBorders([bottom], medium, '000000')
      ),
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fgColor: getFgColor('A5A5A5'),
      border: getBorders([top, bottom, left, right], thin, 'A5A5A5'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('A5A5A5'),
      border: getBorders([top, bottom, left, right], thin, 'A5A5A5'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium19: {
    header: {
      fgColor: getFgColor('FFC001'),
      border: Object.assign(getBorders([top, bottom], thin, '000000'), getBorders([left, right], thin, 'FFC001')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(
        getBorders([top], thick, '000000'),
        getBorders([bottom], medium, '000000')
      ),
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fgColor: getFgColor('FFC001'),
      border: getBorders([top, bottom, left, right], thin, 'FFC001'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('FFC001'),
      border: getBorders([top, bottom, left, right], thin, 'FFC001'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium20: {
    header: {
      fgColor: getFgColor('5B9BD5'),
      border: Object.assign(getBorders([top, bottom], thin, '000000'), getBorders([left, right], thin, '5B9BD5')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(
        getBorders([top], thick, '000000'),
        getBorders([bottom], medium, '000000')
      ),
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fgColor: getFgColor('5B9BD5'),
      border: getBorders([top, bottom, left, right], thin, '5B9BD5'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('5B9BD5'),
      border: getBorders([top, bottom, left, right], thin, '5B9BD5'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium21: {
    header: {
      fgColor: getFgColor('6EAE40'),
      border: Object.assign(getBorders([top, bottom], thin, '000000'), getBorders([left, right], thin, '6EAE40')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    averageRow: {
      border: Object.assign(
        getBorders([top], thick, '000000'),
        getBorders([bottom], medium, '000000')
      ),
      patternType: PATTERN_TYPE_SOLID,
    },
    showFirstColumn: {
      fgColor: getFgColor('6EAE40'),
      border: getBorders([top, bottom, left, right], thin, '6EAE40'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    showLastColumn: {
      fgColor: getFgColor('6EAE40'),
      border: getBorders([top, bottom, left, right], thin, '6EAE40'),
      color: '#FFFFFF',
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      border: undefined,
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([left, right], thin, 'D9D9D9'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium22: {
    header: {
      fgColor: getFgColor('D9D9D9'),
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    averageRow: {
      fgColor: getFgColor('D9D9D9'),
      border: Object.assign(getBorders([bottom, left, right], thin, '000000'), getBorders([top], medium, '000000')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
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
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('A6A6A6'),
      border: getBorders([top, bottom, left, right], thin, '000000'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium23: {
    header: {
      fgColor: getFgColor('D9E1F2'),
      border: getBorders([top, bottom, left, right], thin, '8EA9DB'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    averageRow: {
      fgColor: getFgColor('D9E1F2'),
      border: Object.assign(getBorders([bottom, left, right], thin, '8EA9DB'), getBorders([top], medium, '4472C4')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    showFirstColumn: {
      fontWeight: 'bold'
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('B4C6E7'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('D9E1F2'),
      border: getBorders([top, bottom, left, right], thin, '8EA9DB'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('B4C6E7'),
      border: getBorders([top, bottom, left, right], thin, '8EA9DB'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium24: {
    header: {
      fgColor: getFgColor('FCE4D6'),
      border: getBorders([top, bottom, left, right], thin, 'F3B084'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    averageRow: {
      fgColor: getFgColor('FCE4D6'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'F3B084'), getBorders([top], medium, 'ED7D31')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    showFirstColumn: {
      fontWeight: 'bold'
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('FCE4D6'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('FCE4D6'),
      border: getBorders([top, bottom, left, right], thin, 'F3B084'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('F8CBAD'),
      border: getBorders([top, bottom, left, right], thin, 'F3B084'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium25: {
    header: {
      fgColor: getFgColor('EDEDED'),
      border: getBorders([top, bottom, left, right], thin, 'C9C9C9'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    averageRow: {
      fgColor: getFgColor('EDEDED'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'C9C9C9'), getBorders([top], medium, 'A5A5A5')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    showFirstColumn: {
      fontWeight: 'bold'
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
      border: getBorders([top, bottom, left, right], thin, 'C9C9C9'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('DBDBDB'),
      border: getBorders([top, bottom, left, right], thin, 'C9C9C9'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium26: {
    header: {
      fgColor: getFgColor('FFF2CC'),
      border: getBorders([top, bottom, left, right], thin, 'FFD966'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    averageRow: {
      fgColor: getFgColor('FFF2CC'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'FFD966'), getBorders([top], medium, 'FFC001')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    showFirstColumn: {
      fontWeight: 'bold'
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('FFE698'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('FFF2CC'),
      border: getBorders([top, bottom, left, right], thin, 'FFD966'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('FFE698'),
      border: getBorders([top, bottom, left, right], thin, 'FFD966'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium27: {
    header: {
      fgColor: getFgColor('DDEBF7'),
      border: getBorders([top, bottom, left, right], thin, '9BC2E6'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    averageRow: {
      fgColor: getFgColor('DDEBF7'),
      border: Object.assign(getBorders([bottom, left, right], thin, '9BC2E6'), getBorders([top], medium, '5B9BD5')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    showFirstColumn: {
      fontWeight: 'bold'
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('BDD7EE'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('DDEBF7'),
      border: getBorders([top, bottom, left, right], thin, '9BC2E6'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('BDD7EE'),
      border: getBorders([top, bottom, left, right], thin, '9BC2E6'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
  TableStyleMedium28: {
    header: {
      fgColor: getFgColor('E2EFD9'),
      border: getBorders([top, bottom, left, right], thin, 'A8D18B'),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    averageRow: {
      fgColor: getFgColor('E2EFD9'),
      border: Object.assign(getBorders([bottom, left, right], thin, 'A8D18B'), getBorders([top], medium, '6EAE40')),
      patternType: PATTERN_TYPE_SOLID,
      fontWeight: 'bold',
      color: '#000000'
    },
    showFirstColumn: {
      fontWeight: 'bold'
    },
    showLastColumn: {
      fontWeight: 'bold'
    },
    oddColumn: {
      fgColor: getFgColor('C5E1B2'),
      patternType: PATTERN_TYPE_SOLID,
    },
    evenRow: {
      fgColor: getFgColor('E2EFD9'),
      border: getBorders([top, bottom, left, right], thin, 'A8D18B'),
      patternType: PATTERN_TYPE_SOLID,
    },
    oddRow: {
      fgColor: getFgColor('C5E1B2'),
      border: getBorders([top, bottom, left, right], thin, 'A8D18B'),
      patternType: PATTERN_TYPE_SOLID,
    }
  },
};

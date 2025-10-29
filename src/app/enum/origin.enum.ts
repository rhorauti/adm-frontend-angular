export enum PRODUCT_NUMBER_ORIGIN {
  LOCAL = 1,
  IMPORTED = 2,
  IN_HOUSE = 3,
}

export enum PRODUCT_STRING_ORIGIN {
  LOCAL = 'nacional',
  IMPORTED = 'importado',
  IN_HOUSE = 'interno',
}

export const originList = [
  PRODUCT_STRING_ORIGIN.LOCAL,
  PRODUCT_STRING_ORIGIN.IMPORTED,
  PRODUCT_STRING_ORIGIN.IN_HOUSE,
];

export const onSetOriginToString = (origin: number): string => {
  switch (origin) {
    case PRODUCT_NUMBER_ORIGIN.LOCAL: {
      return PRODUCT_STRING_ORIGIN.LOCAL;
    }
    case PRODUCT_NUMBER_ORIGIN.IMPORTED: {
      return PRODUCT_STRING_ORIGIN.IMPORTED;
    }
    case PRODUCT_NUMBER_ORIGIN.IN_HOUSE: {
      return PRODUCT_STRING_ORIGIN.IN_HOUSE;
    }
  }
  return '';
};

export const onSetOriginToNumber = (origin: string): number => {
  switch (origin) {
    case PRODUCT_STRING_ORIGIN.LOCAL: {
      return PRODUCT_NUMBER_ORIGIN.LOCAL;
    }
    case PRODUCT_STRING_ORIGIN.IMPORTED: {
      return PRODUCT_NUMBER_ORIGIN.IMPORTED;
    }
    case PRODUCT_STRING_ORIGIN.IN_HOUSE: {
      return PRODUCT_NUMBER_ORIGIN.IN_HOUSE;
    }
  }
  return 0;
};

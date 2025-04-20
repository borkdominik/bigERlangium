// Cardinality types of relationships
const CardinalityType = { // const to support multiple notations
    ZERO_OR_ONE: '0..1',
    ZERO_OR_MORE: '0..N',
    ONE: ['1', '1..1'],
    MANY: ['N', '1..N'],
} as const;

type CardinalityType = typeof CardinalityType[keyof typeof CardinalityType];
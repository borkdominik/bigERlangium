const VisibilityType = {
    NONE: 'none',
    PUBLIC: ['public', '+'],
    PRIVATE: ['private', '-'],
    PROTECTED: ['protected', '#'],
    PACKAGE: ['package', '~'],
}

type VisibilityType = typeof VisibilityType[keyof typeof VisibilityType];
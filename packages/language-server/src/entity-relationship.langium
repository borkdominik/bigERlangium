grammar EntityRelationship

entry Model:
    (entities+=Entity | relationships+=Relationship)*;

Entity: 
    'entity' name=ID '{'
        attributes+=Attribute
    '}';

Relationship:
    'relationship' name=ID '{'
        source=[Entity:ID] '->' target=[Entity:ID]
    '}';

Attribute:
    name=ID;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

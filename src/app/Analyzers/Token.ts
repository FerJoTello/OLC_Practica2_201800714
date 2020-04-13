export enum TokenType {
    //PRIMARY ELEMENTS
    ID,//1
    NUMBER,//2
    STRING,//3, 4
    HTML_STRING,
    RW_TRUE,
    RW_FALSE,
    //DATA TYPES AND RESERVED WORDS
    RW_INT,
    RW_DOUBLE,
    RW_CHAR,
    RW_BOOL,
    RW_STRING,
    RW_CLASS,
    RW_VOID,
    RW_MAIN,
    RW_IF,
    RW_ELSE,
    RW_CONSOLE,
    RW_WRITE,
    RW_SWITCH,
    RW_CASE,
    RW_BREAK,
    RW_DEFAULT,
    RW_FOR,
    RW_DO,
    RW_WHILE,
    RW_RETURN,
    RW_CONTINUE,

    S_ASTERISK,//0
    S_L_PARENTHESIS,//0
    S_R_PARENTHESIS,//0
    S_L_BRACKET,//0
    S_R_BRACKET,//0
    S_L_CURLY_BRACKET,//0
    S_R_CURLY_BRACKET,//0

    S_DOT,//0
    S_COLON,
    S_SEMICOLON,//0
    S_COMMA,//0
    AND,//0
    OR,//0
    
    S_SLASH,//5
    
    COMMENT_INLINE,//6
    COMMENT_MULTILINE,//7

    NOT,//8
    DISTINCT,
    
    S_EQUALS,//9
    COMPARISSON,
    
    S_LESS_THAN,//10
    LESS_OR_EQUAL,

    S_GREATER_THAN,//11
    GREATER_OR_EQUAL,

    S_PLUS,//12
    INCREASE,

    S_MINUS,//13
    DECREASE,
    
    UNDEFINED
}
export class Token {
    public Type: TokenType;
    public Value: String;
    public Row: number;
    public Column: number;
    constructor(typeToken: TokenType, value: String, row: number, column: number) {
        this.Type = typeToken;
        this.Value = value;
        this.Row = row;
        this.Column = column;
    }
    static TokensName: string [] = [
        "ID",
        "NUMBER",
        "STRING",
        "HTML_STRING",
        "RW_TRUE",
        "RW_FALSE",
        "RW_INT",
        "RW_DOUBLE",
        "RW_CHAR",
        "RW_BOOL",
        "RW_STRING",
        "RW_CLASS",
        "RW_VOID",
        "RW_MAIN",
        "RW_IF",
        "RW_ELSE",
        "RW_CONSOLE",
        "RW_WRITE",
        "RW_SWITCH",
        "RW_CASE",
        "RW_BREAK",
        "RW_DEFAULT",
        "RW_FOR",
        "RW_DO",
        "RW_WHILE",
        "RW_RETURN",
        "RW_CONTINUE",
        "S_ASTERISK",
        "S_L_PARENTHESIS",
        "S_R_PARENTHESIS",//0
        "S_L_BRACKET",//0
        "S_R_BRACKET",//0
        "S_L_CURLY_BRACKET",//0
        "S_R_CURLY_BRACKET",//0
    
        "S_DOT",//0
        "S_COLON",
        "S_SEMICOLON",//0
        "S_COMMA",//0
        "AND",//0
        "OR",//0
        
        "S_SLASH",//5
        
        "COMMENT_INLINE",//6
        "COMMENT_MULTILINE",//7
    
        "NOT",//8
        "DISTINCT",
        
        "S_EQUALS",//9
        "COMPARISSON",
        
        "S_LESS_THAN",//10
        "LESS_OR_EQUAL",
    
        "S_GREATER_THAN",//11
        "GREATER_OR_EQUAL",
    
        "S_PLUS",//12
        "INCREASE",
    
        "S_MINUS",//13
        "DECREASE",
        
        "UNDEFINED"
    ];
}

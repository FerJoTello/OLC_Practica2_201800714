import { Token } from '../Analyzers/Token';
import { TokenType } from '../Analyzers/Token';
export class LexicalAnalyzer {
    public existsError: Boolean;
    public tokensErrors: Array<Token>;
    public tokensOut: Array<Token>;
    private status: Number;
    //Assigned value of a new token that collects every char analyzed previously.
    private auxLex: string;
    //Assigned value of a new token when it's added to tokensOut
    private startRow = 1;
    private startColumn = 1;
    //Counters that increases when a character is added to auxLex
    private row = 1;
    private column = 1;
    constructor() {
        this.existsError = false;
        this.tokensErrors = new Array<Token>();
        this.tokensOut = new Array<Token>();
    }
    /**
     * Analyze:
     * Returns a Token type Array, generated by analyzing lexically an input, taking each character from the input and comparing it with a possible Token depending on the type.
     * If a character meets the condition of being part of the lexeme, the state changes depending on where it is and what value met that condition.
     * From there, if the status is of acceptance, the lexeme is validated and a new token is created assigning the values of the lexeme, position and type of token.
     * @param input a string to be lexically analyzed.
     */
    public Analyze(input: string) {
        this.existsError = false;
        this.tokensOut = new Array<Token>();
        this.status = 0;
        this.auxLex = "";
        let c = "";
        for (let i = 0; i < input.length; i++) {
            c = input.charAt(i);
            //Each case represents a state on the lexical analyzer and it's used to determine what is each lexeme.
            //If, in a case, the condition is valid the analyzed character is added to an auxiliar lexeme to be saved eventually.
            //Otherwise, it's a lexical error.
            switch (this.status) {
                //Initial state (every other is an acceptance state).
                case 0: {
                    //The value it's assigned where each token starts.
                    this.startRow = this.row;
                    this.startColumn = this.column;
                    //letter
                    if (/\w/.test(c) && /[^0-9]/.test(c) && /[^_]/.test(c)) {
                        this.addCharacter(c);
                        this.status = 1;
                    }
                    else if (/\d/.test(c)) {
                        this.addCharacter(c);
                        this.status = 2;
                    }
                    else if (/"/.test(c)) {
                        this.addCharacter(c);
                        this.status = 3;
                    }
                    else if (/'/.test(c)) {
                        this.addCharacter(c);
                        this.status = 14;
                    }
                    else if (/\//.test(c)) {
                        this.addCharacter(c);
                        this.status = 5;
                    }
                    //None character generate a new acceptance state since status=0 validates them...
                    else if (/\*/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_ASTERISK);
                    }
                    else if (/\(/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_L_PARENTHESIS);
                    }
                    else if (/\)/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_R_PARENTHESIS);
                    }
                    else if (/\[/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_L_BRACKET);
                    }
                    else if (/\]/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_R_BRACKET);
                    }
                    else if (/{/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_L_CURLY_BRACKET);
                    }
                    else if (/}/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_R_CURLY_BRACKET);
                    }
                    else if (/\./.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_DOT);
                    }
                    else if (/:/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_SEMICOLON);
                    }
                    else if (/;/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_SEMICOLON);
                    }
                    else if (/,/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.S_COMMA);
                    }
                    else if (/&/.test(c)) {
                        this.addCharacter(c);
                        c = input.charAt(i + 1);
                        if (/&/.test(c)) {
                            i++;
                            this.addCharacter(c);
                            this.addToken(TokenType.AND);
                        }
                        else {
                            this.addError();
                        }
                    }
                    else if (/\|/.test(c)) {
                        this.addCharacter(c);
                        c = input.charAt(i + 1);
                        if (/\|/.test(c)) {
                            i++;
                            this.addCharacter(c);
                            this.addToken(TokenType.OR);
                        }
                        else {
                            this.addError();
                        }
                    }
                    //...except this ones (and cannot be validated in this status because of ambiguity)
                    else if (/!/.test(c)) {
                        this.addCharacter(c);
                        this.status = 8;
                    }
                    else if (/=/.test(c)) {
                        this.addCharacter(c);
                        this.status = 9;
                    }
                    else if (/</.test(c)) {
                        this.addCharacter(c);
                        this.status = 10;
                    }
                    else if (/>/.test(c)) {
                        this.addCharacter(c);
                        this.status = 11;
                    }
                    else if (/\+/.test(c)) {
                        this.addCharacter(c);
                        this.status = 12;
                    }
                    else if (/-/.test(c)) {
                        this.addCharacter(c);
                        this.status = 13;
                    }
                    else {
                        //console.log("Valor zozpechozo: " + c.charCodeAt(0));
                        if (/\t/.test(c)) {
                            this.column += 4;
                        }
                        else if (c.charCodeAt(0) == 10) {
                            this.row++;
                            this.column = 1;
                        }
                        else if (c.charCodeAt(0) == 32) {
                            this.column++;
                        }
                        else if (/#/.test(c) && i == input.length - 1) {
                            console.log("Lexical analysis completed!");
                        }
                        else {
                            this.addCharacter(c);
                            this.addError();
                        }
                    }
                    break;
                }
                //A letter was received
                case 1: {
                    //Letter, number or underscore
                    if (/\w/.test(c)) {
                        this.addCharacter(c);
                    }
                    else {
                        //Reserved words and id:
                        if (this.auxLex == "true") {
                            this.addToken(TokenType.RW_TRUE);
                        }
                        else if (this.auxLex == "false") {
                            this.addToken(TokenType.RW_FALSE);
                        }
                        else if (this.auxLex == "int") {
                            this.addToken(TokenType.RW_INT);
                        }
                        else if (this.auxLex == "double") {
                            this.addToken(TokenType.RW_DOUBLE);
                        }
                        else if (this.auxLex == "char") {
                            this.addToken(TokenType.RW_CHAR);
                        }
                        else if (this.auxLex == "bool") {
                            this.addToken(TokenType.RW_BOOL);
                        }
                        else if (this.auxLex == "string") {
                            this.addToken(TokenType.RW_STRING);
                        }
                        else if (this.auxLex == "class") {
                            this.addToken(TokenType.RW_CLASS);
                        }
                        else if (this.auxLex == "void") {
                            this.addToken(TokenType.RW_VOID);
                        }
                        else if (this.auxLex == "main") {
                            this.addToken(TokenType.RW_MAIN);
                        }
                        else if (this.auxLex == "if") {
                            this.addToken(TokenType.RW_IF);
                        }
                        else if (this.auxLex == "else") {
                            this.addToken(TokenType.RW_ELSE);
                        }
                        else if (this.auxLex == "Console") {
                            this.addToken(TokenType.RW_CONSOLE);
                        }
                        else if (this.auxLex == "Write") {
                            this.addToken(TokenType.RW_WRITE);
                        }
                        else if (this.auxLex == "switch") {
                            this.addToken(TokenType.RW_SWITCH);
                        }
                        else if (this.auxLex == "case") {
                            this.addToken(TokenType.RW_CASE);
                        }
                        else if (this.auxLex == "break") {
                            this.addToken(TokenType.RW_BREAK);
                        }
                        else if (this.auxLex == "default") {
                            this.addToken(TokenType.RW_DEFAULT);
                        }
                        else if (this.auxLex == "for") {
                            this.addToken(TokenType.RW_FOR);
                        }
                        else if (this.auxLex == "do") {
                            this.addToken(TokenType.RW_DO);
                        }
                        else if (this.auxLex == "while") {
                            this.addToken(TokenType.RW_WHILE);
                        }
                        else if (this.auxLex == "return") {
                            this.addToken(TokenType.RW_RETURN);
                        }
                        else if (this.auxLex == "continue") {
                            this.addToken(TokenType.RW_CONTINUE);
                        }
                        else {
                            this.addToken(TokenType.ID);
                        }
                        //The character is not part of the expresion so it's re-evaluated
                        i -= 1;
                    }
                    break;
                }
                //A number was received
                case 2: {
                    //A digit is received
                    if (/\d/.test(c)) {
                        this.addCharacter(c);
                    }
                    else {
                        this.addToken(TokenType.NUMBER);
                        i -= 1; //Analyzes again the character that is not part of the number.
                    }
                    break;
                }
                //A quotation mark was received
                case 3: {
                    if (!(/"/.test(c)) && i != input.length - 1) {
                        this.addCharacter(c);
                        if (/\n/.test(c)) {
                            this.row++;
                            this.column = 1;
                        }
                    }
                    else if (/"/.test(c)) {
                        this.addCharacter(c);
                        this.status = 4;
                    }
                    else if (/#/.test(c) && i == input.length - 1) {
                        this.addError();
                        i -= 1;
                    }
                    break;
                }
                //string validation
                case 4: {
                    if (this.auxLex.startsWith("\"") && this.auxLex.endsWith("\"")) {
                        this.addToken(TokenType.STRING);
                    }
                    else {
                        this.addError();
                    }
                    i -= 1;
                    break;
                }
                //A slash was received
                case 5: {
                    if (/\//.test(c)) {
                        this.addCharacter(c);
                        this.status = 6;
                    }
                    else if (/\*/.test(c)) {
                        this.addCharacter(c);
                        this.status = 7;
                    }
                    else {
                        this.addToken(TokenType.S_SLASH);
                        i -= 1;
                    }
                    break;
                }
                //In-line Comment validation
                case 6: {
                    if (!(/\n/.test(c))) {
                        this.addCharacter(c);
                    }
                    else {
                        this.addToken(TokenType.COMMENT_INLINE);
                        this.row++;
                        this.column = 1;
                    }
                    break;
                }
                //Multi-line comment validation
                case 7: {
                    if (/\*/.test(c)) {
                        this.addCharacter(c);
                        c = input.charAt(i + 1);
                        if (/\//.test(c)) {
                            i++;
                            this.addCharacter(c);
                            this.addToken(TokenType.COMMENT_MULTILINE);
                        }
                    }
                    else {
                        if (/#/.test(c) && i == input.length - 1) {
                            this.addError();
                        }
                        else {
                            this.addCharacter(c);
                            if (/\n/.test(c)) {
                                this.row++;
                                this.column = 1;
                            }
                        }
                    }
                    break;
                }
                //An '!' (exclamation mark) was received
                case 8: {
                    if (/=/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.DISTINCT);
                    }
                    else {
                        this.addToken(TokenType.NOT);
                        i -= 1;
                    }
                    break;
                }
                //An '=' (equals sign) was received
                case 9: {
                    if (/=/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.COMPARISSON);
                    }
                    else {
                        this.addToken(TokenType.S_EQUALS);
                        i -= 1;
                    }
                    break;
                }
                //A '<' (less than sign) was received
                case 10: {
                    if (/=/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.LESS_OR_EQUAL);
                    }
                    else {
                        this.addToken(TokenType.S_LESS_THAN);
                        i -= 1;
                    }
                    break;
                }
                //A '>' (greater than sign) was received
                case 11: {
                    if (/=/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.GREATER_OR_EQUAL);
                    }
                    else {
                        this.addToken(TokenType.S_GREATER_THAN);
                        i -= 1;
                    }
                    break;
                }
                //A '+' (plus sign) was received
                case 12: {
                    if (/\+/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.INCREASE);
                    }
                    else {
                        this.addToken(TokenType.S_PLUS);
                        i -= 1;
                    }
                    break;
                }
                //A '-' (minus sign) was received
                case 13: {
                    if (/-/.test(c)) {
                        this.addCharacter(c);
                        this.addToken(TokenType.DECREASE);
                    }
                    else {
                        this.addToken(TokenType.S_MINUS);
                        i -= 1;
                    }
                    break;
                }
                //An apostrophe was received
                case 14: {
                    if (!(/'/.test(c)) && i != input.length - 1) {
                        this.addCharacter(c);
                        if (/\n/.test(c)) {
                            this.row++;
                            this.column = 1;
                        }
                    }
                    else if (/'/.test(c)) {
                        this.addCharacter(c);
                        this.status = 15;
                    }
                    else if (/#/.test(c) && i == input.length - 1) {
                        this.addError();
                        i -= 1;
                    }
                    break;
                }
                //html_string validation
                case 15: {
                    if (this.auxLex.startsWith("'") && this.auxLex.endsWith("'")) {
                        this.addToken(TokenType.HTML_STRING);
                    }
                    else {
                        this.addError();
                    }
                    i -= 1;
                    break;
                }
            }
        }
    }
    private addCharacter(char: string) {
        this.auxLex = this.auxLex.concat(char);
        this.column++;
    }
    private addToken(tokenType: TokenType) {
        this.tokensOut.push(new Token(tokenType, this.auxLex, this.startRow, this.startColumn));
        this.auxLex = "";
        this.status = 0;
    }
    private addError() {
        this.tokensErrors.push(new Token(TokenType.UNDEFINED, this.auxLex, this.startRow, this.startColumn));
        this.existsError = true;
        this.addToken(TokenType.UNDEFINED);
    }
    public showTokens() {
        let count = 0;
        console.log("| NO. | LEXEMA | TIPO | FILA | COLUMNA |\n");
        this.tokensOut.forEach(token => {
            console.log("| " + count.toString() + " | " + token.Value + " | " + Token.TokensName[token.Type] + " | " + token.Row + " | " + token.Column + " |\n");
            count++;
        });
    }
    public showErrors() {
        let count = 0;
        console.log("| NO. | ERROR | FILA | COLUMNA |\n");
        this.tokensErrors.forEach(error => {
            console.log("| " + count.toString() + " | " + error.Value + " | " + error.Row + " | " + error.Column + " |\n");
            count++;
        });
    }
}

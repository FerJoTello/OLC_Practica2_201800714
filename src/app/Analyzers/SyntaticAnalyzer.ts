import { Scope } from './SymbolTable';
import { Token } from './Token';
import { TokenType } from './Token';


export class SyntanticAnalyzer {
    private ControlToken: number;
    private ActualToken: Token;
    private TokensList: Array<Token>;
    private ActualScope: Scope;
    private Translation: string;
    public ExistsError: Boolean;
    private SyntaxError: Boolean;
    constructor() {
        this.ActualToken = null;
        this.TokensList = new Array<Token>();
        this.ExistsError = false;
        this.SyntaxError = false;
        this.Translation = "";
    }

    /**
     * Compare: 
     * Checks if the indicated type is the same as the actual token's type.
     * @param type the type of the token that is compared to the actual token.
     */
    private Compare(type: TokenType) {
        return this.ActualToken.Type == type;
    }
    /**
     * Parea:
     * Compares if the pre-analysis token has the same as requested, in case that are not the same indicates error.
     * @param type Token type that the pre-analysis token should be.
     */
    private Parea(type: TokenType) {
        if (this.SyntaxError) {
            //Panic mode error recovery
            if (this.ControlToken < this.TokensList.length - 1) {
                this.ControlToken++;
                this.ActualToken = this.TokensList[this.ControlToken];
                if (this.ActualToken.Type == TokenType.S_SEMICOLON) {
                    this.SyntaxError = false;
                }
                else {
                    console.log("Chale. Ya no se pudo recuperar :c");
                }
            }
        }
        // If there isn't previous error, compares if it meets with Parea.
        else {
            //Parea is good
            if (this.Compare(type)) {
                //If it's not the last token advances on the list to analyze the next token.
                if (this.ControlToken < this.TokensList.length - 1) {
                    this.ControlToken++;
                    this.ActualToken = this.TokensList[this.ControlToken];
                    while ((this.Compare(TokenType.COMMENT_MULTILINE) || this.Compare(TokenType.COMMENT_INLINE)) && this.ControlToken < this.TokensList.length - 1) {
                        this.ControlToken++;
                        this.ActualToken = this.TokensList[this.ControlToken];
                    }
                }
            }
            else {
                console.log("Error en token: " + this.ControlToken);
                alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [" + Token.TokensName[type] + "] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]");
                this.SyntaxError = true;
                this.ExistsError = true;
            }
        }
    }
    /**
     * Parse:
     * Analyzes a list of tokens from a previous lexical analysis according to a previously defined grammar, using the deterministic descending method from left to right LL(1).
     */
    public Parse(tokenList: Array<Token>) {
        this.TokensList = tokenList;
        this.ControlToken = 0;
        this.ActualToken = this.TokensList[this.ControlToken];
        this.Start();
        return null;
    }
    /**
     * The next methods are no-terminals, belonging to the the grammar from the syntactic analysis.
     * The no-terminal awaits for the analyzed token's type to be a specific token type to call Parea. 
     * If no case is meeted then the boolean ExistsError and SyntaxError are activated (the errors are managed on the 'else' sentence; except if an epsilon comes, then nothing happens).
     */
    private Start() {
        //this.ActualScope = new Scope(null);
        if (this.Compare(TokenType.COMMENT_INLINE)) {
            this.Parea(TokenType.COMMENT_INLINE);
        }
        else if (this.Compare(TokenType.COMMENT_MULTILINE)) {
            this.Parea(TokenType.COMMENT_MULTILINE);
        }
        this.Parea(TokenType.RW_CLASS);
        this.Parea(TokenType.ID);
        this.Parea(TokenType.S_L_CURLY_BRACKET);
        this.ClassInstructions();
        console.log("Pido el curly bracket");
        this.Parea(TokenType.S_R_CURLY_BRACKET);
    }
    private ClassInstructions() {
        if (this.Compare(TokenType.RW_VOID)) {
            this.Method_Declaration();
            this.ClassInstructions();
        }
        else if (this.Compare(TokenType.RW_INT) || this.Compare(TokenType.RW_DOUBLE) || this.Compare(TokenType.RW_CHAR) || this.Compare(TokenType.RW_BOOL) || this.Compare(TokenType.RW_STRING)) {
            this.Decla();
            this.ClassInstructions();
        }
        else if (this.Compare(TokenType.ID)) {
            this.Assignation();
            this.ClassInstructions();
        }
        else {
            //epsilon
        }
    }
    private Brackets() {
        //let saved: Scope = this.ActualScope;
        //this.ActualScope = new Scope(this.ActualScope);
        this.Parea(TokenType.S_L_CURLY_BRACKET);
        this.Instructions();
        //this.ActualScope = saved;
        this.Parea(TokenType.S_R_CURLY_BRACKET);
    }
    private Instructions() {
        if (this.Compare(TokenType.RW_INT) || this.Compare(TokenType.RW_DOUBLE) || this.Compare(TokenType.RW_CHAR) || this.Compare(TokenType.RW_BOOL) || this.Compare(TokenType.RW_STRING)) {
            this.Declaration();
            this.Instructions();
        }
        else if (this.Compare(TokenType.ID)) {
            this.Id();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_IF)) {
            this.If();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_SWITCH)) {
            this.Switch();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_FOR)) {
            this.For();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_WHILE)) {
            this.While();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_DO)) {
            this.Do();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_CONSOLE)) {
            this.Print();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_RETURN)) {
            this.Parea(TokenType.RW_RETURN);
            this.ExpressionList();
            this.Parea(TokenType.S_SEMICOLON);
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_BREAK)) {
            this.Parea(TokenType.RW_BREAK);
            this.Parea(TokenType.S_SEMICOLON);
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_CONTINUE)) {
            this.Parea(TokenType.RW_CONTINUE);
            this.Parea(TokenType.S_SEMICOLON);
            this.Instructions();
        }
        else {
            //epsilon
        }
    }
    private Method_Declaration() {
        this.Parea(TokenType.RW_VOID);
        //let id = this.ActualToken.Value;
        //let newVoid;
        this.Parea(TokenType.ID);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.ParametersList();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Brackets();
    }
    private Decla() {
        this.DataType();
        this.Parea(TokenType.ID);
        this.DeclaP();
    }
    private DeclaP() {
        if (this.Compare(TokenType.S_COMMA) || this.Compare(TokenType.S_EQUALS) || this.Compare(TokenType.S_SEMICOLON)) {
            this.IdListP();
            this.DeclaPP();
            this.Parea(TokenType.S_SEMICOLON);
        }
        else if (this.Compare(TokenType.S_L_PARENTHESIS)) {
            this.Parea(TokenType.S_L_PARENTHESIS);
            this.ParametersList();
            this.Parea(TokenType.S_R_PARENTHESIS);
            this.Brackets();
        }
        else {
            console.log("Error en token: " + this.ControlToken);
            alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [S_COMMA|S_EQUALS|S_SEMICOLON] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
            this.ExistsError = true;
            this.SyntaxError = true;
        }
    }
    private DeclaPP() {
        if (this.Compare(TokenType.S_EQUALS)) {
            this.Parea(TokenType.S_EQUALS);
            this.Expression();
        }
        else {
            //epsilon
        }
    }
    private IdListP() {
        if (this.Compare(TokenType.S_COMMA)) {
            this.Parea(TokenType.S_COMMA);
            this.Parea(TokenType.ID);
            this.IdListP();
        }
        else {
            //epsilon
        }
    }
    private ParametersList() {
        if (this.Compare(TokenType.RW_INT) || this.Compare(TokenType.RW_DOUBLE) || this.Compare(TokenType.RW_CHAR) || this.Compare(TokenType.RW_BOOL) || this.Compare(TokenType.RW_STRING)) {
            this.Parameter();
            this.ParametersListP();
        }
        else {
            //epsilon
        }
    }
    private Parameter() {
        this.DataType();
        this.Parea(TokenType.ID);
    }
    private ParametersListP() {
        if (this.Compare(TokenType.S_COMMA)) {
            this.Parea(TokenType.S_COMMA);
            this.Parameter();
            this.ParametersListP();
        }
        else {
            //epsilon
        }
    }
    private Declaration() {
        this.DataType();
        this.Parea(TokenType.ID);
        this.IdListP();
        this.DeclarationP();
        this.Parea(TokenType.S_SEMICOLON);
    }
    private DeclarationP() {
        if (this.Compare(TokenType.S_EQUALS)) {
            this.Parea(TokenType.S_EQUALS);
            this.Expression();
        }
        else {
            //epsilon
        }
    }
    private Assignation() {
        this.Parea(TokenType.ID);
        this.Parea(TokenType.S_EQUALS);
        this.Expression();
        this.Parea(TokenType.S_SEMICOLON);
    }
    private Id() {
        this.Parea(TokenType.ID);
        this.IdP();
        this.Parea(TokenType.S_SEMICOLON);
    }
    private IdP() {
        if (this.Compare(TokenType.S_L_PARENTHESIS)) {
            this.Parea(TokenType.S_L_PARENTHESIS);
            this.ExpressionList();
            this.Parea(TokenType.S_R_PARENTHESIS);
        }
        else if (this.Compare(TokenType.S_EQUALS)) {
            this.Parea(TokenType.S_EQUALS);
            this.Expression();
        }
        else {
            console.log("Error en token: " + this.ControlToken);
            alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [S_L_PARENTHESIS|S_EQUALS] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
            this.ExistsError = true;
            this.SyntaxError = true;
        }
    }
    private If() {
        this.Parea(TokenType.RW_IF);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Expression();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Brackets();
        this.Else();
    }
    private Else() {
        if (this.Compare(TokenType.RW_ELSE)) {
            this.Parea(TokenType.RW_ELSE);
            this.ElseP();
        }
        else {
            //epsilon
        }
    }
    private ElseP() {
        if (this.Compare(TokenType.RW_IF)) {
            this.If();
        }
        else if (this.Compare(TokenType.S_L_CURLY_BRACKET)) {
            this.Brackets();
        }
        else {
            console.log("Error en token: " + this.ControlToken);
            alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [RW_IF|S_L_CURLY_BRACKET] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
            this.ExistsError = true;
            this.SyntaxError = true;
        }
    }
    private Switch() {
        this.Parea(TokenType.RW_SWITCH);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Expression();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Parea(TokenType.S_L_CURLY_BRACKET);
        this.CaseList();
        this.Default();
        this.CaseList();
        this.Parea(TokenType.S_R_CURLY_BRACKET);
    }
    private CaseList() {
        if (this.Compare(TokenType.RW_CASE)) {
            this.Case();
            this.CaseList()
        }
        else {
            //epsilon
        }
    }
    private Case() {
        this.Parea(TokenType.RW_CASE);
        this.Expression();
        this.Parea(TokenType.S_COLON);
        this.Instructions();
        this.Parea(TokenType.RW_BREAK);
        this.Parea(TokenType.S_SEMICOLON);
    }
    private Default() {
        if (this.Compare(TokenType.RW_DEFAULT)) {
            this.Parea(TokenType.RW_DEFAULT);
            this.Parea(TokenType.S_COLON);
            this.Instructions();
            this.Parea(TokenType.RW_BREAK);
            this.Parea(TokenType.S_SEMICOLON);
        }
        else {
            //epsilon
        }
    }
    private For() {
        this.Parea(TokenType.RW_FOR);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Declaration();
        this.Parea(TokenType.S_SEMICOLON);
        this.Expression();
        this.Parea(TokenType.S_SEMICOLON);
        this.Parea(TokenType.ID);
        this.Increment();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Brackets();
    }
    private While() {
        this.Parea(TokenType.RW_WHILE);
        this.Parea(TokenType.S_L_PARENTHESIS);
        console.log("while espera expresion");
        this.Expression();
        console.log("while ya no espera expresion");
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Brackets();
    }
    private Do() {
        this.Parea(TokenType.RW_DO);
        this.Brackets();
        this.Parea(TokenType.RW_WHILE);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Expression();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Parea(TokenType.S_SEMICOLON);
    }
    private Increment() {
        if (this.Compare(TokenType.INCREASE)) {
            this.Parea(TokenType.INCREASE);
        }
        else if (this.Compare(TokenType.DECREASE)) {
            this.Parea(TokenType.DECREASE);
        }
        else {
            console.log("Error en token: " + this.ControlToken);
            alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [INCREASE|DECREASE] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
            this.ExistsError = true;
            this.SyntaxError = true;
        }
    }
    private Print() {
        this.Parea(TokenType.RW_CONSOLE);
        this.Parea(TokenType.S_DOT);
        this.Parea(TokenType.RW_WRITE);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Expression();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Parea(TokenType.S_SEMICOLON);
    }
    private DataType() {
        if (this.Compare(TokenType.RW_INT)) {
            this.Parea(TokenType.RW_INT);
        }
        else if (this.Compare(TokenType.RW_DOUBLE)) {
            this.Parea(TokenType.RW_DOUBLE);
        }
        else if (this.Compare(TokenType.RW_CHAR)) {
            this.Parea(TokenType.RW_CHAR);
        }
        else if (this.Compare(TokenType.RW_BOOL)) {
            this.Parea(TokenType.RW_BOOL);
        }
        else if (this.Compare(TokenType.RW_STRING)) {
            this.Parea(TokenType.RW_STRING);
        }
        else {
            console.log("Error en token: " + this.ControlToken);
            alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [RW_INT|RW_DOUBLE|RW_CHAR|RW_BOOL|RW_STRING] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
            this.ExistsError = true;
            this.SyntaxError = true;
        }
    }
    private Expression() {
        this.E();
        this.LogicRelational();
    }
    private LogicRelational() {
        switch (this.ActualToken.Type) {
            case TokenType.AND: {
                this.Parea(TokenType.AND);
                this.Expression();
                break;
            }
            case TokenType.OR: {
                this.Parea(TokenType.OR);
                this.Expression();
                break;
            }
            case TokenType.COMPARISSON: {
                this.Parea(TokenType.COMPARISSON);
                this.Expression();
                break;
            }
            case TokenType.DISTINCT: {
                this.Parea(TokenType.DISTINCT);
                this.Expression();
                break;
            }
            case TokenType.S_GREATER_THAN: {
                this.Parea(TokenType.S_GREATER_THAN);
                this.Expression();
                break;
            }
            case TokenType.S_LESS_THAN: {
                this.Parea(TokenType.S_LESS_THAN);
                this.Expression();
                break;
            }
            case TokenType.GREATER_OR_EQUAL: {
                this.Parea(TokenType.GREATER_OR_EQUAL);
                this.Expression();
                break;
            }
            case TokenType.LESS_OR_EQUAL: {
                this.Parea(TokenType.LESS_OR_EQUAL);
                this.Expression();
                break;
            }
            default: {
                //epsilon
                break;
            }
        }
    }
    private E() {
        this.T();
        this.EP();
    }
    private EP() {
        if (this.Compare(TokenType.S_PLUS)) {
            this.Parea(TokenType.S_PLUS);
            this.T();
            this.EP();
        }
        else if (this.Compare(TokenType.S_MINUS)) {
            this.Parea(TokenType.S_MINUS);
            this.T();
            this.EP();
        }
        else {
            //epsilon
        }
    }
    private T() {
        this.F();
        this.TP();
    }
    private TP() {
        if (this.Compare(TokenType.S_ASTERISK)) {
            this.Parea(TokenType.S_ASTERISK);
            this.F();
            this.TP();
        }
        else if (this.Compare(TokenType.S_SLASH)) {
            this.Parea(TokenType.S_SLASH);
            this.F();
            this.TP();
        }
        else {
            //epsilon
        }
    }
    private F() {
        switch (this.ActualToken.Type) {
            case TokenType.ID: {
                this.Name();
                break;
            }
            case TokenType.NUMBER: {
                this.Parea(TokenType.NUMBER);
                break;
            }
            case TokenType.STRING: {
                this.Parea(TokenType.STRING);
                break;
            }
            case TokenType.HTML_STRING: {
                this.Parea(TokenType.HTML_STRING);
                break;
            }
            case TokenType.RW_TRUE: {
                this.Parea(TokenType.RW_TRUE);
                break;
            }
            case TokenType.RW_FALSE: {
                this.Parea(TokenType.RW_FALSE);
                break;
            }
            case TokenType.S_MINUS: {
                this.Parea(TokenType.S_MINUS);
                this.Expression();
                break;
            }
            case TokenType.NOT: {
                this.Parea(TokenType.NOT);
                this.Expression();
                break;
            }
            case TokenType.S_L_PARENTHESIS: {
                this.Parea(TokenType.S_L_PARENTHESIS);
                console.log("espero expresion");
                this.Expression();
                console.log("espero parentesis derecho");
                this.Parea(TokenType.S_R_PARENTHESIS);
                break;
            }
            default: {
                console.log("Error en token: " + this.ControlToken);
                alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [ID|NUMBER|STRING|HTML_STRING|RW_TRUE|RW_FALSE|S_MINUS|NOT|S_L_PARENTHESIS] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
                this.ExistsError = true;
                this.SyntaxError = true;
                break;
            }
        }
    }
    private Name() {
        this.Parea(TokenType.ID);
        this.NameP();
    }
    private NameP() {
        if (this.Compare(TokenType.S_L_PARENTHESIS)) {
            this.Parea(TokenType.S_L_PARENTHESIS);
            this.ExpressionList();
            this.Parea(TokenType.S_R_PARENTHESIS);
        }
        else {
            //epsilon
        }
    }
    private ExpressionList() {
        if (this.Compare(TokenType.ID) || this.Compare(TokenType.NUMBER) || this.Compare(TokenType.STRING) || this.Compare(TokenType.HTML_STRING) || this.Compare(TokenType.RW_TRUE) || this.Compare(TokenType.RW_FALSE) || this.Compare(TokenType.S_L_PARENTHESIS)) {
            this.Expression();
            this.ExpressionListP();
        }
        else {
            //epsilon
        }
    }
    private ExpressionListP() {
        if (this.Compare(TokenType.S_COMMA)) {
            this.Parea(TokenType.S_COMMA);
            this.Expression()
            this.ExpressionListP();
        }
        else {
            //epsilon
        }
    }
}
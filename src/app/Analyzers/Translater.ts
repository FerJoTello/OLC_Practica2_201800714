import { Token } from './Token';
import { TokenType } from './Token';

export class Translater {
    private ControlToken: number;
    private ActualToken: Token;
    private TokensList: Array<Token>;
    private Translation: string;
    private TabCounter: number;
    private SyntaxError: Boolean;
    constructor() {
        this.ActualToken = null;
        this.TokensList = new Array<Token>();
        this.SyntaxError = false;
        this.Translation = "";
        this.TabCounter = 0;
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
                    //console.log("Chale. Ya no se pudo recuperar :c");
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
                        if (this.Compare(TokenType.COMMENT_INLINE)) {
                            this.Translation += "#" + this.ActualToken.Value.substring(2) + "\n";
                        }
                        else if (this.Compare(TokenType.COMMENT_MULTILINE)) {
                            this.Translation += "'''" + this.ActualToken.Value.substring(2, this.ActualToken.Value.length - 3) + "'''\n";
                        }
                        this.ControlToken++;
                        this.ActualToken = this.TokensList[this.ControlToken];
                    }
                }
            }
            else {
                console.log("Error en token: " + this.ControlToken);
                alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [" + Token.TokensName[type] + "] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]");
                this.SyntaxError = true;
            }
        }
    }
    /**
     * Translate:
     * It's the same process as the SyntacticAnalyzer method, Analyze, but returns the Python code representation of a C# lexically and syntactically correct code.
     */
    public Translate(tokenList: Array<Token>) {
        this.TokensList = tokenList;
        this.ControlToken = 0;
        this.ActualToken = this.TokensList[this.ControlToken];
        this.Start();
        return this.Translation;
    }
    /**
     * The next methods are no-terminals, belonging to the the grammar from the syntactic analysis.
     * The no-terminal awaits for the analyzed token's type to be a specific token type to call Parea. 
     * If no case is meeted then the boolean ExistsError and SyntaxError are activated (the errors are managed on the 'else' sentence; except if an epsilon comes, then nothing happens).
     */
    private Start() {
        if (this.Compare(TokenType.COMMENT_INLINE)) {
            this.Translation += "#" + this.ActualToken.Value.substring(2) + "\n";
            this.Parea(TokenType.COMMENT_INLINE);
        }
        else if (this.Compare(TokenType.COMMENT_MULTILINE)) {
            this.Translation += "'''" + this.ActualToken.Value.substring(2, this.ActualToken.Value.length - 3) + "'''\n";
            this.Parea(TokenType.COMMENT_MULTILINE);
        }
        this.Parea(TokenType.RW_CLASS);
        this.Parea(TokenType.ID);
        this.Parea(TokenType.S_L_CURLY_BRACKET);
        this.ClassInstructions();
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
        this.Parea(TokenType.S_L_CURLY_BRACKET);
        this.TabCounter++;
        this.Instructions();
        this.Parea(TokenType.S_R_CURLY_BRACKET);
        this.TabCounter--;
    }
    private Instructions() {
        if (this.Compare(TokenType.RW_INT) || this.Compare(TokenType.RW_DOUBLE) || this.Compare(TokenType.RW_CHAR) || this.Compare(TokenType.RW_BOOL) || this.Compare(TokenType.RW_STRING)) {
            this.Declaration();
            this.Instructions();
        }
        else if (this.Compare(TokenType.ID)) {
            this.AddTabs();
            this.Id();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_IF)) {
            this.AddTabs();
            this.If();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_SWITCH)) {
            this.AddTabs();
            this.Switch();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_FOR)) {
            this.For();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_WHILE)) {
            this.AddTabs();
            this.While();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_DO)) {
            this.AddTabs();
            this.Do();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_CONSOLE)) {
            this.AddTabs();
            this.Print();
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_RETURN)) {
            this.AddTabs();
            this.Translation += "return ";
            this.Parea(TokenType.RW_RETURN);
            this.Translation += this.ExpressionList() + "\n";
            this.Parea(TokenType.S_SEMICOLON);
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_BREAK)) {
            this.AddTabs();
            this.Translation += "break\n"
            this.Parea(TokenType.RW_BREAK);
            this.Parea(TokenType.S_SEMICOLON);
            this.Instructions();
        }
        else if (this.Compare(TokenType.RW_CONTINUE)) {
            this.AddTabs();
            this.Translation += "continue\n"
            this.Parea(TokenType.RW_CONTINUE);
            this.Parea(TokenType.S_SEMICOLON);
            this.Instructions();
        }
        else {
            //epsilon
        }
    }
    private AddTabs() {
        for (let i = 0; i < this.TabCounter; i++) {
            this.Translation += "\t";
        }
    }
    private Method_Declaration() {
        this.Parea(TokenType.RW_VOID);
        let id = this.ActualToken.Value;
        this.Parea(TokenType.ID);
        this.Translation += "def " + id;
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Translation += "(";
        this.ParametersList();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Translation += "):\n";
        this.Brackets();
        if (id == "main" || id == "Main") {
            this.Translation += "if __name__ = \"__main__\":\n\t" + id + "()\n";
        }
    }
    private Decla() {
        this.DataType();
        let id = this.ActualToken.Value;
        this.Parea(TokenType.ID);
        this.DeclaP(id);
    }
    private DeclaP(id: string) {
        if (this.Compare(TokenType.S_COMMA) || this.Compare(TokenType.S_EQUALS) || this.Compare(TokenType.S_SEMICOLON)) {
            let ids: Array<string> = new Array<string>();
            ids.push(id);
            this.IdListP(ids);
            this.DeclaPP(ids);
            this.Parea(TokenType.S_SEMICOLON);
        }
        else if (this.Compare(TokenType.S_L_PARENTHESIS)) {
            this.Parea(TokenType.S_L_PARENTHESIS);
            this.Translation += "def " + id + "(";
            this.ParametersList();
            this.Parea(TokenType.S_R_PARENTHESIS);
            this.Translation += "):\n";
            this.Brackets();
        }
        else {
            console.log("Error en token: " + this.ControlToken);
            alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [S_COMMA|S_EQUALS|S_SEMICOLON] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
            this.SyntaxError = true;
        }
    }
    private DeclaPP(ids: Array<String>) {
        if (this.Compare(TokenType.S_EQUALS)) {
            this.Parea(TokenType.S_EQUALS);
            let expression: string = this.Expression();
            ids.forEach(id => {
                this.Translation += id + " = " + expression + "\n";
            });
        }
        else {
            //epsilon
        }
    }
    private IdListP(ids: Array<string>) {
        if (this.Compare(TokenType.S_COMMA)) {
            this.Parea(TokenType.S_COMMA);
            ids.push(this.ActualToken.Value);
            this.Parea(TokenType.ID);
            this.IdListP(ids);
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
        this.Translation += this.ActualToken.Value;
        this.Parea(TokenType.ID);
    }
    private ParametersListP() {
        if (this.Compare(TokenType.S_COMMA)) {
            this.Parea(TokenType.S_COMMA);
            this.Translation += ",";
            this.Parameter();
            this.ParametersListP();
        }
        else {
            //epsilon
        }
    }
    private Declaration() {
        this.DataType();
        let ids: Array<string> = new Array<string>();
        ids.push(this.ActualToken.Value);
        this.Parea(TokenType.ID);
        this.IdListP(ids);
        //Value assigned (if exists)
        let returnedValue = this.DeclarationP(ids);
        this.Parea(TokenType.S_SEMICOLON);
        return returnedValue;
    }
    private DeclarationP(ids: Array<string>) {
        if (this.Compare(TokenType.S_EQUALS)) {
            this.Parea(TokenType.S_EQUALS);
            let expression: string = this.Expression();
            let counter = 0;
            ids.forEach(id => {
                this.AddTabs();
                this.Translation += id + " = " + expression + "\n";
            });
            //this.Translation = this.Translation.substr(0, this.Translation.length - 1);
            return expression;
        }
        else {
            //epsilon
            return "";
        }
    }
    private Assignation() {
        let id: string = this.ActualToken.Value;
        this.Parea(TokenType.ID);
        this.Parea(TokenType.S_EQUALS);
        let expression: string = this.Expression();
        this.Parea(TokenType.S_SEMICOLON);
        this.Translation += id + "=" + expression + "\n";
    }
    private Id() {
        let id = this.ActualToken.Value;
        this.Parea(TokenType.ID);
        this.IdP(id);
        this.Parea(TokenType.S_SEMICOLON);
    }
    private IdP(id: string) {
        if (this.Compare(TokenType.S_L_PARENTHESIS)) {
            //function/method call
            this.Parea(TokenType.S_L_PARENTHESIS);
            this.Translation += id + "(" + this.ExpressionList() + ")\n";
            this.Parea(TokenType.S_R_PARENTHESIS);
        }
        else if (this.Compare(TokenType.S_EQUALS)) {
            //assignation
            this.Parea(TokenType.S_EQUALS);
            this.Translation += id + " = " + this.Expression() + "\n";
        }
        else {
            console.log("Error en token: " + this.ControlToken);
            alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [S_L_PARENTHESIS|S_EQUALS] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
            this.SyntaxError = true;
        }
    }
    private If() {
        this.Parea(TokenType.RW_IF);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Translation += "if " + this.Expression() + ":\n";
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
        this.AddTabs();
        if (this.Compare(TokenType.RW_IF)) {
            //else if
            this.Translation += "el"
            this.If();
        }
        else if (this.Compare(TokenType.S_L_CURLY_BRACKET)) {
            //else (normal else)
            this.Translation += "else:\n"
            this.Brackets();
        }
        else {
            console.log("Error en token: " + this.ControlToken);
            alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [RW_IF|S_L_CURLY_BRACKET] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
            this.SyntaxError = true;
        }
    }
    private Switch() {
        this.Parea(TokenType.RW_SWITCH);
        this.Parea(TokenType.S_L_PARENTHESIS);
        let expression = this.Expression();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Parea(TokenType.S_L_CURLY_BRACKET);
        this.Translation += "def switch(case, valor):\n";
        this.TabCounter++;
        for (let i = 0; i < this.TabCounter; i++) {
            this.Translation += "\t";
        }
        this.Translation += "switcher = {\n";
        this.TabCounter++;
        this.CaseList();
        this.Default();
        this.CaseList();
        this.Parea(TokenType.S_R_CURLY_BRACKET);
        this.TabCounter--;
        for (let i = 0; i < this.TabCounter; i++) {
            this.Translation += "\t";
        }
        this.Translation += "}\n";
        this.TabCounter--;
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
        let expression = this.Expression();
        this.Parea(TokenType.S_COLON);
        for (let i = 0; i < this.TabCounter; i++) {
            this.Translation += "\t";
        }
        this.Translation += expression + ":\n";
        this.TabCounter++;
        this.Instructions();
        this.TabCounter--;
        this.Translation = this.Translation.substr(0, this.Translation.length - 1) + ",\n";
    }
    private Default() {
        if (this.Compare(TokenType.RW_DEFAULT)) {
            this.Parea(TokenType.RW_DEFAULT);
            this.Parea(TokenType.S_COLON);
            this.AddTabs();
            this.Translation += "default:\n";
            this.TabCounter++;
            this.Instructions();
            this.TabCounter--;
            this.Translation = this.Translation.substr(0, this.Translation.length - 1) + ",\n";
        }
        else {
            //epsilon
        }
    }
    private For() {
        this.Parea(TokenType.RW_FOR);
        this.Parea(TokenType.S_L_PARENTHESIS);
        let start = this.Declaration();
        let end = this.TokensList[this.ControlToken + 2].Value;
        this.Expression();
        this.Parea(TokenType.S_SEMICOLON);
        let id = this.ActualToken.Value;
        this.Parea(TokenType.ID);
        this.Increment();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.AddTabs();
        this.Translation += "for " + id + " in range (" + start + "," + end + "):\n";
        this.Brackets();
    }
    private While() {
        this.Parea(TokenType.RW_WHILE);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Translation += "while " + this.Expression() + " :\n"
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Brackets();
    }
    private Do() {
        this.Parea(TokenType.RW_DO);
        this.Parea(TokenType.S_L_CURLY_BRACKET);
        this.Translation += "while True:\n"
        this.TabCounter++;
        this.Instructions();
        this.Parea(TokenType.S_R_CURLY_BRACKET);
        this.Parea(TokenType.RW_WHILE);
        this.Parea(TokenType.S_L_PARENTHESIS);
        let expression = this.Expression();
        this.Parea(TokenType.S_R_PARENTHESIS);
        this.Parea(TokenType.S_SEMICOLON);
        this.AddTabs();
        this.Translation += "if (" + expression + "):\n";
        this.TabCounter++;
        this.AddTabs();
        this.Translation += "break\n"
        this.TabCounter--;
        this.TabCounter--;
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
            this.SyntaxError = true;
        }
    }
    private Print() {
        this.Parea(TokenType.RW_CONSOLE);
        this.Parea(TokenType.S_DOT);
        this.Parea(TokenType.RW_WRITE);
        this.Parea(TokenType.S_L_PARENTHESIS);
        this.Translation += "print(" + this.PrintExpression() + ")\n";
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
            this.SyntaxError = true;
        }
    }
    private PrintExpression() {
        let returnedValue: string;
        returnedValue = this.E(true) + this.LogicRelational();
        return returnedValue;
    }
    private Expression() {
        let returnedValue: string;
        returnedValue = this.E(false) + this.LogicRelational();
        return returnedValue;
    }
    private LogicRelational() {
        let returnedValue: string = this.ActualToken.Value;
        switch (this.ActualToken.Type) {
            case TokenType.AND: {
                this.Parea(TokenType.AND);
                returnedValue = "and " + this.Expression();
                return returnedValue;
            }
            case TokenType.OR: {
                this.Parea(TokenType.OR);
                returnedValue = "or " + this.Expression();
                return returnedValue;
            }
            case TokenType.COMPARISSON: {
                this.Parea(TokenType.COMPARISSON);
                returnedValue += this.Expression();
                return returnedValue;
            }
            case TokenType.DISTINCT: {
                this.Parea(TokenType.DISTINCT);
                returnedValue += this.Expression();
                return returnedValue;
            }
            case TokenType.S_GREATER_THAN: {
                this.Parea(TokenType.S_GREATER_THAN);
                returnedValue += this.Expression();
                return returnedValue;
            }
            case TokenType.S_LESS_THAN: {
                this.Parea(TokenType.S_LESS_THAN);
                returnedValue += this.Expression();
                return returnedValue;
            }
            case TokenType.GREATER_OR_EQUAL: {
                this.Parea(TokenType.GREATER_OR_EQUAL);
                returnedValue += this.Expression();
                return returnedValue;
            }
            case TokenType.LESS_OR_EQUAL: {
                this.Parea(TokenType.LESS_OR_EQUAL);
                returnedValue += this.Expression();
                return returnedValue;
            }
            default: {
                //epsilon
                return "";
            }
        }
    }
    private E(console: boolean) {
        let returnedValue: string;
        returnedValue = this.T() + this.EP(console);
        return returnedValue;
    }
    private EP(console: boolean) {
        let returnedValue: string = "";
        if (this.Compare(TokenType.S_PLUS)) {
            this.Parea(TokenType.S_PLUS);
            if (console) {
                returnedValue = ", " + this.T() + this.EP(true);
            }
            else {
                returnedValue = "+" + this.T() + this.EP(false);
            }
        }
        else if (this.Compare(TokenType.S_MINUS)) {
            this.Parea(TokenType.S_MINUS);
            returnedValue = "-" + this.T() + this.EP(console);
        }
        else {
            //epsilon
        }
        return returnedValue;
    }
    private T() {
        let returnedValue: string;
        returnedValue = this.F() + this.TP();
        return returnedValue;
    }
    private TP() {
        let returnedValue: string = "";
        if (this.Compare(TokenType.S_ASTERISK)) {
            this.Parea(TokenType.S_ASTERISK);
            returnedValue = "*" + this.F() + this.TP();
        }
        else if (this.Compare(TokenType.S_SLASH)) {
            this.Parea(TokenType.S_SLASH);
            returnedValue = "/" + this.F() + this.TP();
        }
        else {
            //epsilon
        }
        return returnedValue;
    }
    private F() {
        let returnedValue: string;
        returnedValue = this.ActualToken.Value;
        switch (this.ActualToken.Type) {
            case TokenType.ID: {
                returnedValue = this.Name();
                return returnedValue;
            }
            case TokenType.NUMBER: {
                this.Parea(TokenType.NUMBER);
                return returnedValue;
            }
            case TokenType.STRING: {
                this.Parea(TokenType.STRING);
                return returnedValue;
            }
            case TokenType.HTML_STRING: {
                this.Parea(TokenType.HTML_STRING);
                return returnedValue;
            }
            case TokenType.RW_TRUE: {
                this.Parea(TokenType.RW_TRUE);
                return returnedValue;
            }
            case TokenType.RW_FALSE: {
                this.Parea(TokenType.RW_FALSE);
                return returnedValue;
            }
            case TokenType.S_MINUS: {
                this.Parea(TokenType.S_MINUS);
                returnedValue += this.Expression();
                return returnedValue;
            }
            case TokenType.NOT: {
                this.Parea(TokenType.NOT);
                returnedValue = "not " + this.Expression();
                return returnedValue;
            }
            case TokenType.S_L_PARENTHESIS: {
                this.Parea(TokenType.S_L_PARENTHESIS);
                returnedValue += this.Expression() + ")"
                this.Parea(TokenType.S_R_PARENTHESIS);
                return returnedValue;
            }
            default: {
                console.log("Error en token: " + this.ControlToken);
                alert("Error Sintactico\nEn Linea: " + this.ActualToken.Row + ", Caracter: " + this.ActualToken.Column + "\nSe esperaba [ID|NUMBER|STRING|HTML_STRING|RW_TRUE|RW_FALSE|S_MINUS|NOT|S_L_PARENTHESIS] en lugar de [" + Token.TokensName[this.ActualToken.Type] + ", " + this.ActualToken.Value + "]\n");
                this.SyntaxError = true;
                break;
            }
        }
        return "";
    }
    private Name() {
        let returnedValue: string = this.ActualToken.Value;
        this.Parea(TokenType.ID);
        returnedValue += this.NameP();
        return returnedValue;
    }
    private NameP() {
        if (this.Compare(TokenType.S_L_PARENTHESIS)) {
            let returnedValue: string = "(";
            this.Parea(TokenType.S_L_PARENTHESIS);
            let expressionList: string = this.ExpressionList();
            returnedValue += expressionList + ")";
            this.Parea(TokenType.S_R_PARENTHESIS);
            return returnedValue;
        }
        else {
            //epsilon
            return "";
        }
    }
    private ExpressionList() {
        if (this.Compare(TokenType.ID) || this.Compare(TokenType.NUMBER) || this.Compare(TokenType.STRING) || this.Compare(TokenType.HTML_STRING) || this.Compare(TokenType.RW_TRUE) || this.Compare(TokenType.RW_FALSE) || this.Compare(TokenType.S_L_PARENTHESIS)) {
            let returnedValue: string = this.Expression();
            returnedValue += this.ExpressionListP();
            return returnedValue;
        }
        else {
            //epsilon
            return "";
        }
    }
    private ExpressionListP() {
        if (this.Compare(TokenType.S_COMMA)) {
            let returnedValue: string = ", ";
            this.Parea(TokenType.S_COMMA);
            returnedValue += this.Expression() + this.ExpressionListP();
            return returnedValue;
        }
        else {
            //epsilon
            return "";
        }
    }
}
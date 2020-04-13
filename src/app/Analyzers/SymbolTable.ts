export class Scope {
    private Table: Map<string, any>;
    protected PrevScope: Scope;
    /**
     * constructor:
     * Creates a new symbol table, represented as a scope where the user can work with variables, functions, etc.
     * @param prevScope: The previous chained scope. Where the actual scope can access to the values declared previously.
     */
    constructor(prevScope: Scope) {
        this.Table = new Map<string, any>();
        this.PrevScope = prevScope;
    }
    /**
     * Put:
     * Adds a new key-value pair to the actual scope.
     * @param key: The name of the variable.
     * @param value: The object that works as a "symbol". Does not have a type since the value may be from different types.
     */
    public Put(key:string, value:any) {
        this.Table.set(key,value);
    }
    /**
     * Get:
     * Searches recursively into each nested previous scope and returns the requested value according to the given key.
     * @param key: The name of the requested variable.
     */
    public Get(key:string) {
        for(let scope:Scope = this; scope!=null; scope = scope.PrevScope){
            let finded:any = scope.Table.get(key);
            if(finded!=null){
                return finded;
            }
        }
        return null;
    }
}
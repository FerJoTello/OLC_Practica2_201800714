import { Component } from '@angular/core';
import { LexicalAnalyzer } from './Analyzers/LexicalAnalyzer';
import { SyntanticAnalyzer } from './Analyzers/SyntaticAnalyzer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Practica02';
  constructor() {
  }
  analyze(cSharpInput) {
    let input: string = cSharpInput.value;
    input += "#";
    let lexical: LexicalAnalyzer = new LexicalAnalyzer();
    console.log("Entrada:\n" + input);
    lexical.Analyze(input);
    if (lexical.tokensOut.length > 0) {
      if (!lexical.existsError) {
        alert("Sin errores lexicos.");
        lexical.showTokens();
        let syntactic: SyntanticAnalyzer = new SyntanticAnalyzer();
        syntactic.Parse(lexical.tokensOut);
        if (!syntactic.ExistsError) {
          alert("Sin errores sintacticos.\nTodo gud.");
        }
        else {
          alert("Se encontraron errores sintacticos.\nNo es posible realizar la traduccion.");
        }
      }
      else {
        alert("Se encontraron errores lexicos.\nNo se puede iniciar analisis sintactico.");
        lexical.showErrors();
      }
    }
    else {
      console.log("El analisis lexico no devolvió ningún token. No puede iniciar análsis sintáctico");
    }
  }
}


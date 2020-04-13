import { Component } from '@angular/core';
import { LexicalAnalyzer } from './Analyzers/LexicalAnalyzer';
import { BrowserStack } from 'protractor/built/driverProviders';

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
    var input: string = cSharpInput.value;
    input += "#";
    var lexical: LexicalAnalyzer = new LexicalAnalyzer();
    console.log("Entrada:\n" + input);
    lexical.Analyze(input);
    if (lexical.tokensOut.length > 0) {
      if (!lexical.existsError) {
        console.log("Sin errores lexicos.");
        lexical.showTokens();
      }
      else {
        console.log("Se encontraron errores lexicos.\nNo se puede iniciar analisis sintactico.");
        lexical.showErrors();
      }
    }
    else {
      console.log("El analisis lexico no devolvió ningún token. No puede iniciar análsis sintáctico");
    }
  }
}


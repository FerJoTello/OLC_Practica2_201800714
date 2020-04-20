import { Component } from '@angular/core';
import { LexicalAnalyzer } from './Analyzers/LexicalAnalyzer';
import { SyntanticAnalyzer } from './Analyzers/SyntaticAnalyzer';
import { Translater } from './Analyzers/Translater';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Practica02';
  python = "";
  html = "";
  json = "";
  errorsOutput: string = "";
  constructor() {
  }
  saveJson() {
    this.saveFile(this.json, "jsonFile.json");
  }
  saveHtml() {
    this.saveFile(this.html, "htmlFile.html");
  }
  savePython() {
    this.saveFile(this.python, "pythonFile.py");
  }
  saveErrorsFile() {
    this.saveFile(this.errorsOutput, "errores.html");
  }
  saveFile(text: string, name: string) {
    // get the textbox data...
    let textToWrite = text;
    // put the data in a Blob object...
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    // create a hyperlink <a> element tag that will be automatically clicked below...
    var downloadLink = document.createElement("a");
    // set the file name...
    downloadLink.download = name;
    // set the <a> tag href as a URL to point to the Blob
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    // automaitcally click the <a> element to go to the URL to save the textFileAsBlob...
    downloadLink.click();
  }
  htmlReport(lexical: LexicalAnalyzer, syntactic: SyntanticAnalyzer) {
    let count = 1;
    this.errorsOutput = "<html>\n" +
      "<head>\n" +
      "<meta charset='utf-16'>\n" +
      "<title>Reporte - Errores</title>\n" +
      "<body>\n" +
      "<h1>\n" +
      "<center>Listado de Errors y su descripcion</center>\n" +
      "</h1>\n" +
      "<body>\n" +
      "<center>\n"
      + "<p>\n"
      + "<br>\n"
      + "</p>\n"
      + "<table border= 4>\n"
      + "<tr>\n" +
      "<td><center><b>#</b></center></td>\n"
      + "<td><center><b>Error</b></center></td>\n"
      + "<td><center><b>Fila</b></center></td>\n"
      + "<td><center><b>Columna</b></center></td>\n"
      + "<td><center><b>Descripción</b></center></td>\n"
      + "</tr>\n"
    if (lexical != null) {
      lexical.tokensErrors.forEach(error => {
        this.errorsOutput += "<tr>\n" +
          "<td><center>" + count.toString() + "</center></td>\n" +
          "<td><center>Léxico</center></td>\n" +
          "<td><center>" + error.Row + "</center></td>\n" +
          "<td><center>" + error.Column + "</center></td>\n" +
          "<td><center>El caracter \"" + error.Value + "\" no pertenece al lenguaje</center></td>\n" +
          "</tr>\n" +
          "</center>\n";
        count++;
      });
      if (syntactic != null) {
        syntactic.htmlErrors().forEach(error => {
          this.errorsOutput += "<tr>\n" +
            "<td><center>" + count.toString() + "</center></td>\n" +
            "<td><center>Sintáctico</center></td>\n" +
            "<td><center>" + error.Row + "</center></td>\n" +
            "<td><center>" + error.Column + "</center></td>\n" +
            "<td><center>" + error.Description + "</center></td>\n" +
            "</tr>\n" +
            "</center>\n";
          count++;
        });
      }
    }
    else {
      if (syntactic != null) {
        syntactic.htmlErrors().forEach(error => {
          this.errorsOutput += "<tr>\n" +
            "<td><center>" + count.toString() + "</center></td>\n" +
            "<td><center>Sintáctico</center></td>\n" +
            "<td><center>" + error.Row + "</center></td>\n" +
            "<td><center>" + error.Column + "</center></td>\n" +
            "<td><center>" + error.Description + "</center></td>\n" +
            "</tr>\n" +
            "</center>\n";
          count++;
        });
      }
    }
    this.errorsOutput += "</table>\n" +
      "</center>\n" +
      "</body>\n" +
      "</html>";
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
          alert("Sin errores sintacticos.\nA continuacion se mostrara la traduccion.");
          let translater: Translater = new Translater();
          this.python = translater.Translate(lexical.tokensOut);
        }
        else {
          alert("Se encontraron errores sintacticos.\nNo es posible realizar la traduccion.");
          this.htmlReport(lexical, syntactic);
        }
      }
      else {
        alert("Se encontraron errores lexicos.\nNo se puede iniciar analisis sintactico.");
        lexical.showErrors();
        this.htmlReport(lexical, null);
      }
    }
    else {
      console.log("El analisis lexico no devolvió ningún token. No puede iniciar análsis sintáctico");
    }
  }
}


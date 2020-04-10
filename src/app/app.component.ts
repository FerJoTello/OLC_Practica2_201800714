import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Practica02';
  constructor()
  {
  }
  analyze(cSharpInput)
  {
    var entry: String = cSharpInput.value;
    console.log(entry);
  }
}

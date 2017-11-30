import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-data-example-dialog',
  template: '<h1>Bron object</h1><pre>{{data.object | json}}</pre>',
})
export class DebugComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
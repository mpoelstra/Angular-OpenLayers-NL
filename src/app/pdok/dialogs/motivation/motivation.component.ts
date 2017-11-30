import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'dialog-motivation',
  template: `<h2>{{title}}</h2>
  <form #motivationForm="ngForm" (ngSubmit)="submitDialog(motivationForm)">
  <mat-form-field style="width:100%;">
    <textarea matInput placeholder="Motivatie" matTextareaAutosize matAutosizeMinRows="5" matAutosizeMaxRows="10" name="motivation" [(ngModel)]="motivation" required></textarea>
  </mat-form-field>
  <div class="button-row">
    <button mat-raised-button color="primary" type="submit">Opslaan</button>
    <button mat-raised-button (click)="closeDialog(motivationForm)" type="button">Sluiten</button>
  </div>`,
})
export class MotivationComponent implements OnInit {
  public motivation: string;
  public title: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MotivationComponent>) { }

  ngOnInit() {
    this.motivation = this.data.motivation;
    this.title = this.data.title ? this.data.title : 'Wat heb je aangepast en waarom?';
  }

  submitDialog(form) {
    if (form.valid) {
      this.dialogRef.close({
        type: 'submit',
        motivation: form.value.motivation
      });
    }
  }

  closeDialog(form) {
    this.dialogRef.close({
      type: 'close',
      motivation: form.value.motivation
    });
  }
}
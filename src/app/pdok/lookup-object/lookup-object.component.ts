import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import { LookupService } from '../lookup.service';
import { LookupObject } from '../lookup-object';

@Component({
  selector: 'app-lookup-object',
  templateUrl: './lookup-object.component.html',
  styleUrls: ['./lookup-object.component.scss']
})
export class LookupObjectComponent implements OnInit {
  @Input() lookupObject: LookupObject;
  @Output() saved = new EventEmitter<LookupObject>();

  public lookupObjectForm: FormGroup;
  public saving: boolean = false;
  private motivation: string;

  constructor(
    private builder: FormBuilder, 
    private lookupService: LookupService, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.lookupObjectForm = this.builder.group({
      bron: [{value: this.lookupObject.bron, disabled: true}],
      weergavenaam: [{value: this.lookupObject.weergavenaam, disabled: true}],
      type: [{value: this.lookupObject.type, disabled: true}]
    });

    if (this.lookupObject.type === 'adres') {
      this.lookupObjectForm.addControl('gemeentenaam', new FormControl(this.lookupObject.gemeentenaam, [Validators.required]));
      this.lookupObjectForm.addControl('huisnummer', new FormControl(this.lookupObject.huisnummer, [Validators.required]));
      this.lookupObjectForm.addControl('huisletter', new FormControl(this.lookupObject.huisletter));
      this.lookupObjectForm.addControl('straatnaam', new FormControl(this.lookupObject.straatnaam, [Validators.required]));
      this.lookupObjectForm.addControl('postcode', new FormControl(this.lookupObject.postcode, [Validators.required]));
      this.lookupObjectForm.addControl('woonplaatsnaam', new FormControl(this.lookupObject.woonplaatsnaam, [Validators.required]));
    }

    if (this.lookupObject.type == 'weg') {
      this.lookupObjectForm.addControl('gemeentenaam', new FormControl(this.lookupObject.gemeentenaam, [Validators.required]));      
      this.lookupObjectForm.addControl('straatnaam', new FormControl(this.lookupObject.straatnaam, [Validators.required]));
      this.lookupObjectForm.addControl('woonplaatsnaam', new FormControl(this.lookupObject.woonplaatsnaam, [Validators.required]));
    }

    if (this.lookupObject.type === 'gemeente') {
      this.lookupObjectForm.addControl('gemeentenaam', new FormControl(this.lookupObject.gemeentenaam, [Validators.required]));
    }

    if (this.lookupObject.type === 'woonplaats') {
      this.lookupObjectForm.addControl('gemeentenaam', new FormControl(this.lookupObject.gemeentenaam, [Validators.required]));      
      this.lookupObjectForm.addControl('woonplaatsnaam', new FormControl(this.lookupObject.woonplaatsnaam, [Validators.required]));
    }

    if (this.lookupObject.type === 'postcode') {
      this.lookupObjectForm.addControl('straatnaam', new FormControl(this.lookupObject.straatnaam, [Validators.required]));
      this.lookupObjectForm.addControl('postcode', new FormControl(this.lookupObject.postcode, [Validators.required]));
      this.lookupObjectForm.addControl('woonplaatsnaam', new FormControl(this.lookupObject.woonplaatsnaam, [Validators.required]));
    }

    this.lookupObjectForm.addControl('aliassen', new FormControl(this.lookupObject.aliassen));
  }

  onSaveClicked() {
    let newLookUpObject: LookupObject;

    console.log('save');
    if (this.lookupObjectForm.valid) {
      newLookUpObject = Object.assign({}, this.lookupObject, this.lookupObjectForm.value);

      let motivationDialogRef = this.dialog.open(MotivationDialog, {
        data: {
          motivation: this.motivation
        }
      });

      motivationDialogRef.afterClosed().subscribe(result => {
        this.motivation = result ? result.motivation : '';

        if (this.motivation && result.type === 'submit') {
          this.saving = true;
          this.lookupService.updateFakeLookup(newLookUpObject, this.motivation)
          .then((result) => {
            console.log('lookupSaved', result);
            this.lookupObjectForm.patchValue(result); //needed for weergavenaam
            this.openSnackBar('Het object is succesvol bijgewerkt', 'ok');
            this.saving = false;
            this.motivation = '';
            this.saved.emit(result);
          })
          .catch((error) => {
            this.openSnackBar('Er is iets misgegaan, probeer het later nog eens', 'ok', 5000);
            this.lookupObjectForm.reset(this.lookupObject);
            this.saving = false;
          });
        }
      });
    } else {
      this.openSnackBar('Niet alle velden zijn correct ingevoerd', 'ok');
    }
    
  }

  onResetClicked(form: FormGroup) {
    console.log('onResetClicked');
    form.reset(this.lookupObject);
  }

  openSnackBar(message: string, action: string, duration: number = 2000) {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }

  openSource() {
    this.dialog.open(LookupObjectComponentDialog, {
      data: {
        object: this.lookupObject
      }
    });
  }

}

@Component({
  selector: 'dialog-data-example-dialog',
  template: '<h1>Bron object</h1><pre>{{data.object | json}}</pre>',
})
export class LookupObjectComponentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'dialog-motivation',
  template: `<h2>Wat heb je aangepast en waarom?</h2>
  <form #motivationForm="ngForm" (ngSubmit)="submitDialog(motivationForm)">
  <mat-form-field style="width:100%;">
    <textarea matInput placeholder="Motivatie" matTextareaAutosize matAutosizeMinRows="5" matAutosizeMaxRows="10" name="motivation" [(ngModel)]="motivation" required></textarea>
  </mat-form-field>
  <div class="button-row">
    <button mat-raised-button color="primary" type="submit">Opslaan</button>
    <button mat-raised-button (click)="closeDialog(motivationForm)" type="button">Sluiten</button>
  </div>`,
})
export class MotivationDialog implements OnInit {
  public motivation: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MotivationDialog>) { }

  ngOnInit() {
    this.motivation = this.data.motivation;
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
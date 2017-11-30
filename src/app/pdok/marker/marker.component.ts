import { Component, OnInit, Inject, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import { MotivationComponent } from '../dialogs/motivation/motivation.component';
import { DebugComponent } from '../dialogs/debug/debug.component';
import { MapPointerEvent } from '../../openlayers/util/map-pointer-event';

import { Marker } from './marker';

import { MarkerService } from '../marker.service';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss']
})
export class MarkerComponent implements OnInit {
  @Input() point: MapPointerEvent;
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<any>();

  public markerForm: FormGroup;
  public saving: boolean = false;
  public statuses: object[];
  private motivation: string;
  private marker: Marker;

  constructor(
    private builder: FormBuilder, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private markerService: MarkerService) {}

  ngOnInit() {
    this.marker = new Marker('custom', 'weegbrug', this.point.coordinate);
    this.statuses = [
      {
        value: 'in_gebruik',
        viewValue: 'In Gebruik'
      },
      {
        value: 'buiten_gebruik',
        viewValue: 'Buiten gebruik'
      }
    ];

    this.markerForm = this.builder.group({
      bron: [{value: this.marker.bron, disabled: true}],
      type: [{value: this.marker.type, disabled: true}],
      centroide_rd: [{value: this.marker.centroide_rd, disabled: true}],
      id: [{value: this.marker.id, disabled: true}]
    });

    this.markerForm.addControl('naam', new FormControl(this.marker.naam, [Validators.required]));
    this.markerForm.addControl('nummer', new FormControl(this.marker.nummer));
    this.markerForm.addControl('status', new FormControl(this.marker.status, [Validators.required]));
    this.markerForm.addControl('omschrijving', new FormControl(this.marker.omschrijving));
    this.markerForm.addControl('aliassen', new FormControl(this.marker.aliassen));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.marker) {
      this.marker.resetMarker(changes.point.currentValue.coordinate);
      this.markerForm.patchValue(this.marker);
    }
  }

  onSaveClicked() {
    let newMarker: Marker;

    if (this.markerForm.valid) {
      newMarker = Object.assign({}, this.marker, this.markerForm.value);

      let motivationDialogRef = this.dialog.open(MotivationComponent, {
        data: {
          motivation: this.motivation,
          title: 'Waarom voeg je dit toe?'
        }
      });

      motivationDialogRef.afterClosed().subscribe(result => {
        this.motivation = result ? result.motivation : '';

        if (this.motivation && result.type === 'submit') {
          this.saving = true;
          this.markerService.saveMarker(newMarker, this.motivation)
          .then((result) => {
            console.log('markerSaved', result);
            this.markerForm.patchValue(result); //needed for weergavenaam
            this.openSnackBar('Het object is succesvol toegevoegd', 'ok');
            this.saving = false;
            this.motivation = '';
            this.markerForm.markAsPristine();
            this.saved.emit(result);
          })
          .catch((error) => {
            this.openSnackBar('Er is iets misgegaan, probeer het later nog eens', 'ok', 5000);
            this.markerForm.reset(this.marker);
            this.saving = false;
          });
        }
      });
    } else {
      this.openSnackBar('Niet alle velden zijn correct ingevoerd', 'ok');
    }
    
  }

  onResetClicked(form: FormGroup) {
    form.reset(this.marker);
  }

  onCancelClicked(form: FormGroup) {
    form.reset(this.marker);
    this.cancelled.emit();
  }

  openSnackBar(message: string, action: string, duration: number = 2000) {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }

  openSource() {
    this.dialog.open(DebugComponent, {
      data: {
        object: this.marker
      }
    });
  }

}

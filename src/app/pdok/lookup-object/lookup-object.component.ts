import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { LookupService } from '../lookup.service';
import { LookupObject } from '../lookup-object';

@Component({
  selector: 'app-lookup-object',
  templateUrl: './lookup-object.component.html',
  styleUrls: ['./lookup-object.component.scss']
})
export class LookupObjectComponent implements OnInit {
  @Input() lookupObject: LookupObject;
  @Output() save = new EventEmitter<LookupObject>();

  public lookupObjectForm: FormGroup;
  public saving: boolean = false;

  constructor(private builder: FormBuilder, private lookupService: LookupService) {

  }

  ngOnInit() {
    // this.movieForm = new FormGroup({
    //   name: new FormControl(this.movie.name, Validators.compose([Validators.required, Validators.minLength(4)])),
    //   genre: new FormControl(this.movie.genre, [Validators.required]),
    //   rating: new FormControl(this.movie.rating, [ratingValidator(1, 10)])
    // });

    //type adres
    this.lookupObjectForm = this.builder.group({
      bron: [this.lookupObject.bron],
      type: [this.lookupObject.type],
      woonplaatsnaam: [this.lookupObject.woonplaatsnaam],
      weergavenaam: [this.lookupObject.weergavenaam],
      gemeentenaam: [this.lookupObject.gemeentenaam],
      huisnummer: [this.lookupObject.huisnummer],
      huisletter: [this.lookupObject.huisletter],
      straatnaam: [this.lookupObject.straatnaam],
      aliassen: [this.lookupObject.aliassen]
    });
  }

  onSaveClicked() {
    console.log('save');
    if (this.lookupObjectForm.valid) {
      //debugger;
      this.saving = true;
      this.lookupObject = Object.assign(this.lookupObject, this.lookupObjectForm.value);
      this.lookupService.updateFakeLookup(this.lookupObject).then((result) => {
        console.log('lookupSaved', this.lookupObject);
        //not needed but hey it's nice
        this.saving = false;
        this.save.emit(this.lookupObject);
      });
    }
    
  }

  onResetClicked(form: FormGroup) {
    console.log('onResetClicked');
    form.reset(this.lookupObject);
  }

}

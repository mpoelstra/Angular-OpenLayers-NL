import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatListModule, MatCardModule, MatExpansionModule, MatButtonModule, MatIconModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './openlayers/map/map.component';

//app wide services
import { SuggestService  } from './pdok/suggest.service';
import { LookupService } from './pdok/lookup.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    SuggestService,
    LookupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

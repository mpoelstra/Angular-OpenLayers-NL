import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatButtonToggleModule, MatListModule, MatCardModule, MatExpansionModule, MatButtonModule, MatIconModule, MatTabsModule } from '@angular/material';
import { NgModule } from '@angular/core';

//components
import { AppComponent } from './app.component';
import { MapComponent } from './openlayers/map/map.component';
import { WmtsComponent } from './openlayers/wmts/wmts.component';

//app wide services
import { SuggestService  } from './pdok/suggest.service';
import { LookupService } from './pdok/lookup.service';
import { OpenlayersService } from './openlayers/openlayers.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    WmtsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonToggleModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  providers: [
    SuggestService,
    LookupService,
    OpenlayersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

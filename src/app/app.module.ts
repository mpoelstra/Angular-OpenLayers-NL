import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonToggleModule, MatListModule, MatCardModule, MatExpansionModule, MatButtonModule, MatIconModule, MatTabsModule, MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule } from '@angular/material';
import { NgModule } from '@angular/core';

// Imports for loading & configuring the in-memory web api
import { HttpModule } from '@angular/http';
import { HttpInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

//components
import { AppComponent } from './app.component';
import { MapComponent } from './openlayers/map/map.component';
import { WmtsComponent } from './openlayers/wmts/wmts.component';
import { LookupObjectComponent } from './pdok/lookup-object/lookup-object.component';
import { MarkerComponent } from './pdok/marker/marker.component';
import { MotivationComponent } from './pdok/dialogs/motivation/motivation.component';
import { DebugComponent } from './pdok/dialogs/debug/debug.component';

//app wide services
import { SuggestService  } from './pdok/suggest.service';
import { LookupService } from './pdok/lookup.service';
import { MarkerService } from './pdok/marker.service';
import { OpenlayersService } from './openlayers/openlayers.service';
import { FeaturesService } from './openlayers/features.service';
import { LoggerService } from './logging/logger.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    WmtsComponent,
    LookupObjectComponent,
    MarkerComponent,
    MotivationComponent,
    DebugComponent
  ],
  entryComponents: [MotivationComponent, DebugComponent],
  imports: [
    BrowserModule,
    HttpModule,
    HttpInMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 1000 }),
    HttpClientModule,    
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    SuggestService,
    LookupService,
    MarkerService,
    OpenlayersService,
    FeaturesService,
    LoggerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

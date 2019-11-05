import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageLecteurComponent } from './page-lecteur/page-lecteur.component';
import { ImageLecteurComponent } from './image-lecteur/image-lecteur.component';
import { LeftMenuLecteurComponent } from './left-menu-lecteur/left-menu-lecteur.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NouvellesSortiesComponent } from './nouvelles-sorties/nouvelles-sorties.component';

@NgModule({
  declarations: [
    AppComponent,
    PageLecteurComponent,
    ImageLecteurComponent,
    LeftMenuLecteurComponent,
    NouvellesSortiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

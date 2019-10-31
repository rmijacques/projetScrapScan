import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageLecteurComponent } from './page-lecteur/page-lecteur.component';
import { ImageLecteurComponent } from './image-lecteur/image-lecteur.component';
import { LeftMenuLecteurComponent } from './left-menu-lecteur/left-menu-lecteur.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PageLecteurComponent,
    ImageLecteurComponent,
    LeftMenuLecteurComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

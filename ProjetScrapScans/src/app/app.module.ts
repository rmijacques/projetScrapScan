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
import { LoginComponent } from './login/login.component';
import { MangaCardComponent } from './manga-card/manga-card.component';
import { SuivreUnMangaComponent } from './suivre-un-manga/suivre-un-manga.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
 
const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    PageLecteurComponent,
    ImageLecteurComponent,
    LeftMenuLecteurComponent,
    NouvellesSortiesComponent,
    LoginComponent,
    MangaCardComponent,
    SuivreUnMangaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

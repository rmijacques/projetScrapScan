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
import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';
import { SocketService } from './socket.service';

let localhostURL = "http://localhost:8080"
let serverURL = "http://172.30.250.55:8080/"

const config: SocketIoConfig = { url: localhostURL, options: {} };
//const config: SocketIoConfig = { url: serverURL, options: {} };

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
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

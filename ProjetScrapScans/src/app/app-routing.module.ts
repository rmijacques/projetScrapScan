import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageLecteurComponent} from './page-lecteur/page-lecteur.component';
import { NouvellesSortiesComponent} from './nouvelles-sorties/nouvelles-sorties.component';
import { LoginComponent } from './login/login.component';
import { SuivreUnMangaComponent } from './suivre-un-manga/suivre-un-manga.component';


const routes: Routes = [
  {path :'lecteur/:mangaName/:numChap',component : PageLecteurComponent },
  {path :'dernieresSorties',component : NouvellesSortiesComponent },
  {path : 'suivreUnManga',component : SuivreUnMangaComponent},
  {path :'',component : LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {ThemeComponent} from './theme/theme.component';
import {LayoutModule} from './theme/layouts/layout.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ScriptLoaderService} from './_services/script-loader.service';
import {ThemeRoutingModule} from './theme/theme-routing.module';
import {AuthModule} from './auth/auth.module';

import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
  declarations: [
    ThemeComponent,
    AppComponent,
  ],
  imports: [
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ThemeRoutingModule,
    AuthModule,
    OAuthModule.forRoot()
  ],
  providers: [
    ScriptLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

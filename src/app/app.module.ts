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
import { AuthenticationService } from './auth/_services/authentication.service';
import { AuthGuard } from './auth/_services/auth.guard';
import { IdentityService } from './auth/_services/identity.service';

import { OAuthModule } from 'angular-oauth2-oidc';
import { OAuthConfig } from './oauth.config';

export function initOAuth(oAuthConfig: OAuthConfig): Function {
  return () => oAuthConfig.load();
}

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
    Title,
    OAuthConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initOAuth,
      deps: [OAuthConfig],
      multi: true
    },
    AuthGuard,
    AuthenticationService,
    IdentityService,
    ScriptLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

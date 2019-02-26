import {APP_INITIALIZER, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AlertService } from './_services/alert.service'

import { AuthRoutingModule } from './auth-routing.routing';
import { AuthComponent } from './auth.component';
import { AlertComponent } from './_directives/alert.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import {IdentityService} from './_services/identity.service';
import {OAuthConfig} from './oauth.config';

import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from '../theme/layouts/layout.module';

import { OAuthModule } from 'angular-oauth2-oidc';

export function initOAuth(oAuthConfig: OAuthConfig): Function {
  return () => oAuthConfig.load();
}

@NgModule({
  declarations: [
    AuthComponent,
    AlertComponent,
    LogoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    AuthRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    OAuthModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    Title,
    OAuthConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initOAuth,
      deps: [OAuthConfig],
      multi: true
    },
    AuthenticationService,
    IdentityService
  ],
  entryComponents: [AlertComponent]
})

export class AuthModule {
}

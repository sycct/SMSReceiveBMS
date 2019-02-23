import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {ThemeComponent} from './theme/theme.component';
import {LayoutModule} from './theme/layouts/layout.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Configuration} from './app.constants';
import {ScriptLoaderService} from './_services/script-loader.service';
import {ThemeRoutingModule} from './theme/theme-routing.module';
import {AuthModule} from './auth/auth.module';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import {OidcConfigService} from './auth/_services/oidc.security.config.service';
import {AuthWellKnownEndpoints} from './auth/_models/auth.well-known-endpoints';

import {OidcSecurityService} from './auth/_services/oidc.security.service';
import {OpenIDImplicitFlowConfiguration} from './auth/_modules/auth.configuration';

export function loadConfig(oidcConfigService: OidcConfigService) {
  console.log('APP_INITIALIZER STARTING');
  return () => oidcConfigService.load(`${window.location.origin}/api/ClientAppSettings`);
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
    AppComponent,
    ForbiddenComponent,
    UnauthorizedComponent
  ],
  providers: [
    ScriptLoaderService,
    OidcConfigService,
    OidcSecurityService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService,
    configuration: Configuration
  ) {
    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

      const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
      openIDImplicitFlowConfiguration.stsServer = this.oidcConfigService.clientConfiguration.stsServer;
      openIDImplicitFlowConfiguration.redirect_url = this.oidcConfigService.clientConfiguration.redirect_url;
      // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer
      // identified by the iss (issuer) Claim as an audience.
      // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
      // or if it contains additional audiences not trusted by the Client.
      openIDImplicitFlowConfiguration.client_id = this.oidcConfigService.clientConfiguration.client_id;
      openIDImplicitFlowConfiguration.response_type = this.oidcConfigService.clientConfiguration.response_type;
      openIDImplicitFlowConfiguration.scope = this.oidcConfigService.clientConfiguration.scope;
      openIDImplicitFlowConfiguration.post_logout_redirect_uri = this.oidcConfigService.clientConfiguration.post_logout_redirect_uri;
      openIDImplicitFlowConfiguration.start_checksession = this.oidcConfigService.clientConfiguration.start_checksession;

      openIDImplicitFlowConfiguration.silent_renew = this.oidcConfigService.clientConfiguration.silent_renew;
      openIDImplicitFlowConfiguration.silent_renew_url = this.oidcConfigService.clientConfiguration.redirect_url + '/silent-renew.html';

      openIDImplicitFlowConfiguration.post_login_route = this.oidcConfigService.clientConfiguration.startup_route;
      // HTTP 403
      openIDImplicitFlowConfiguration.forbidden_route = this.oidcConfigService.clientConfiguration.forbidden_route;
      // HTTP 401
      openIDImplicitFlowConfiguration.unauthorized_route = this.oidcConfigService.clientConfiguration.unauthorized_route;
      openIDImplicitFlowConfiguration.log_console_warning_active = this.oidcConfigService.clientConfiguration.log_console_warning_active;
      openIDImplicitFlowConfiguration.log_console_debug_active = this.oidcConfigService.clientConfiguration.log_console_debug_active;
      // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
      // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds =
        this.oidcConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;
      configuration.Server = this.oidcConfigService.clientConfiguration.apiServer;

      openIDImplicitFlowConfiguration.history_cleanup_off = true;

      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

      this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

    });

    console.log('APP STARTING');
  }
}

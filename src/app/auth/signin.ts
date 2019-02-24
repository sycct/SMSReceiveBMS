import {Router, ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';

import {AuthenticationService} from './_services/';

import {ScriptLoaderService} from '../_services/script-loader.service';
import {UserService} from './_services/user.service';
import {AlertService} from './_services/alert.service';
import {ComponentFactoryResolver, OnInit} from '@angular/core';
import {Helpers} from '../helpers';
import {LoginCustom} from './_helpers/login-custom';
import {AlertComponent} from './_directives/alert.component';

/**
 * Provides signin method to signin & signup components.
 */
export class Signin implements OnInit {
  returnUrl: string;

  model: any = {};

  errorMessages: any[] = [];

  constructor(
    protected router: Router,
    protected oAuthService: OAuthService,
    protected _script: ScriptLoaderService,
    // protected _userService: UserService,
    protected _alert: AlertService,
    protected _route: ActivatedRoute,
    protected cfr: ComponentFactoryResolver,
    protected authenticationService: AuthenticationService) {
  }

  signin(): void {
    this.oAuthService
      .fetchTokenUsingPasswordFlowAndLoadUserProfile(this.model.username, this.model.password)
      .then(() => {
        this.authenticationService.init();

        // Strategy for refresh token through a scheduler.
        this.authenticationService.scheduleRefresh();

        // Gets the redirect URL from authentication service.
        // If no redirect has been set, uses the default.
        const redirect: string = this.authenticationService.redirectUrl
          ? this.authenticationService.redirectUrl
          : '/home';
        // Redirects the user.
        this.router.navigate([redirect]);
      })
      .catch((errorResponse: HttpErrorResponse) => {
        // Checks for error in response (error from the Token endpoint).
        if (errorResponse.error !== '') {
          switch (errorResponse.error.error) {
            case 'invalid_grant':
              this.errorMessages.push({description: 'Invalid email or password.'});
              break;
            default:
              this.errorMessages.push({description: 'Unexpected error. Try again.'});
          }
        } else {
          this.errorMessages.push({description: 'Server error. Try later.'});
        }
      });
  }

  ngOnInit() {
    this.model.remember = true;
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigate([this.returnUrl]);

    this._script.load('body', 'assets/vendors/base/vendors.bundle.js', 'assets/demo/default/base/scripts.bundle.js')
      .then(() => {
        Helpers.setLoading(false);
        LoginCustom.init();
      });
  }

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }


  clearMessages(): void {
    this.errorMessages = [];
  }

}

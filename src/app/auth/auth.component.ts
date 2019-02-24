import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ScriptLoaderService} from '../_services/script-loader.service';
import {AlertService} from './_services/alert.service';
import {UserService} from './_services/user.service';
import {AlertComponent} from './_directives/alert.component';
import {LoginCustom} from './_helpers/login-custom';
import {Helpers} from '../helpers';

import {OAuthService} from 'angular-oauth2-oidc';

import {AuthenticationService} from './_services/authentication.service';
import {Signin} from './signin';

@Component({
  selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
  templateUrl: './templates/login.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AuthComponent extends Signin {
  model: any = {};
  loading = false;

  @ViewChild('alertSignin', {read: ViewContainerRef}) alertSignin: ViewContainerRef;
  @ViewChild('alertSignup', {read: ViewContainerRef}) alertSignup: ViewContainerRef;
  @ViewChild('alertForgotPass', {read: ViewContainerRef}) alertForgotPass: ViewContainerRef;

  constructor(
    protected router: Router,
    protected oAuthService: OAuthService,
    protected _script: ScriptLoaderService,
    // protected _userService: UserService,
    protected _alert: AlertService,
    protected _route: ActivatedRoute,
    protected cfr: ComponentFactoryResolver,
    protected authenticationService: AuthenticationService) {
    super(router, oAuthService,  _script,  _alert, _route, cfr, authenticationService);
  }
}

import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { AccountService } from '../account.service';
import { RegisterModel, Account } from '../auth.models';
import { SpinnerService } from '../../global/spinner/spinner.service';
import { ComponentValidation } from '../../global/component-validation';
import { BaseComponent } from '../../global/base-component';

@Component({
    templateUrl: 'register.template.html'
})

export class RegisterComponent extends BaseComponent {
    public model: RegisterModel = new RegisterModel();
    public formSubmitted = false;

    constructor(private auth: AuthService, private accountService: AccountService, private router: Router,
        private spinner: SpinnerService) {
        super();
    }

    public register(form: NgForm) {
        this.formSubmitted = true;
        if (form.valid) {
            const login = this.model.login;
            this.spinner.displaySpinner(true);
            this.auth.register(this.model).then(response => {
                this.spinner.displaySpinner(false);
                if (response.success) {
                    this.accountService.setAccount(new Account(response.account.externalId, response.account.name));
                    this.router.navigate(['home']);
                } else {
                    response.errors.forEach((err) => this.displayError(err, 'Register error'));
                }
            });
            form.reset();
            this.formSubmitted = false;
        }
    }

    public validationErrors(state: NgModel): string[] {
        return ComponentValidation.validationErrors(state);
    }
}

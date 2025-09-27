export class Register {
    constructor({
        name = '',
        email = '',
        password = '',
        confirmPassword = '',
        company = '',
        acceptTerms = false
    } = {}) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.company = company;
        this.acceptTerms = acceptTerms;
    }
}

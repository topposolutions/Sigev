export class Login {
    constructor({
        email = 'root_tenant1',
        password = 'J35u5!1978!0yFB*!d1uBidJu!*r0yEtpBzi9',
        grant_type='',
        client_id='',
        client_secret='',
    } = {}) {
        this.email = email;
        this.password = password;
        this.grant_type = grant_type;
        this.client_id = client_id;
        this.client_secret = client_secret;
    }
}

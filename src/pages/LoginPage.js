import { render, html } from "lit-html";
import { LitElement } from "lit-element";

class LoginElement extends LitElement {
    render() {
        return html`
        <div class='d-flex justify-content-center mt-5'>
            <form class='mt-5' method="post" @submit="${this._handleSubmit}">
                <div class="text-danger" id="errorMessage"></div>
                <div class="mb-3">
                    <label for="emailInput" class="form-label">Email</label>
                    <input type="email" class="form-control" id="emailInput">
                </div>
                <div class="mb-3">
                    <label for="passwordInput" class="form-label">Password</label>
                    <input type="password" class="form-control" id="passwordInput">
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
        </div>
        `;
    }

    _handleSubmit(e) 
    {
        e.preventDefault();

        const emailInput = document.querySelector('#emailInput');
        const passwordInput = document.querySelector('#passwordInput');
        const errorField = document.querySelector('#errorMessage');

        fetch('http://localhost:3030/users/login',
        {
            method: "POST",
            body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
        })
        .then(response => response.status == 403 ? '' : response.json())
        .then(data => {
            if(data === '') {
                errorField.innerHTML = 'Incorrect Email or password';
                return;
            }

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('username', data.username);

            location.href = '/';
        })
        .catch(error => console.error(error));
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('login-element', LoginElement);

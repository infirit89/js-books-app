import { html } from "lit-html";
import { LitElement } from "lit-element";

class RegisterElement extends LitElement {
    render() {
        return html`
        <div class='d-flex justify-content-center mt-5'>
            <form class='mt-5' method="post" @submit="${this._handleSubmit}">
                <div class="text-danger" id="errorMessage"></div>
                <div class="mb-3">
                    <label for="usernameInput" class="form-label">Username</label>
                    <input type="text" class="form-control" id="usernameInput">
                </div>
                <div class="mb-3">
                    <label for="emailInput" class="form-label">Email</label>
                    <input type="email" class="form-control" id="emailInput">
                </div>
                <div class="mb-3">
                    <label for="passwordInput" class="form-label">Password</label>
                    <input type="password" class="form-control" id="passwordInput">
                </div>
                <div class="mb-3">
                    <label for="confirmPasswordInput" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirmPasswordInput">
                </div>
                <button type="submit" class="btn btn-primary w-100">Register</button>
            </form>
        </div>
        `;
    }

    _handleSubmit(e) 
    {
        e.preventDefault();

        const emailInput = document.querySelector('#emailInput');
        const passwordInput = document.querySelector('#passwordInput');
        const confirmPasswordInput = document.querySelector('#confirmPasswordInput');
        const usernameInput = document.querySelector('#usernameInput');
        
        const errorField = document.querySelector('#errorMessage');
        if(confirmPasswordInput.value != passwordInput.value) {
            errorField.textContent = 'Passwords don\'t match';
            return;
        }
        else
            errorField.textContent = '';

        fetch('http://localhost:3030/users/register',
        {
            method: "POST",
            body: JSON.stringify({ email: emailInput.value, password: passwordInput.value, username: usernameInput.value })
        })
        .then(response => response.status == 403 ? '' : response.json())
        .then(data => {
            console.log(data);

            if(data.code >= 400 && data.code <= 499) {
                errorField.innerHTML = data.message;
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

customElements.define('register-element', RegisterElement);

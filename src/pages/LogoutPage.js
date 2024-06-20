import { render, html } from "lit-html";
import { LitElement } from "lit-element";
import { url } from "../utils";

class LogoutElement extends LitElement {
    render() {
        this._logout();
        return html ``;
    }

    _logout() {
        const accessToken = localStorage.getItem('accessToken');
    
        fetch(`${url}/users/logout`, {
            method: 'GET',
            headers: {
                'X-Authorization': accessToken
            }
        })
        .then(response => {
            console.log(response);
            if(response.status == 204) {
                localStorage.clear();
                location.href = '/';
            }
        })
        .catch(error => console.error(error));
    }
}

customElements.define('logout-element', LogoutElement);

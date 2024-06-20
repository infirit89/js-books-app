import { render, html } from "lit-html";
import { LitElement } from "lit-element";

class UserBooksElement extends LitElement {
    
    static properties = {
        bookData: { type: Object }
    }
    
    constructor() {
        super();
        this._fetchData();
    }

    render() {
        
        if(!this.bookData)
            return html `<h4>Loading...</h4>`;

        return html `<div class="row mt-5">
            ${this.bookData.length > 0 ? this.bookData.map(x => {
                return html `
                <div class="col-sm-3 mb-4">
                    <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${x.title}</h5>
                        <p class="card-text text-truncate">${x.description}</p>
                        <a href="/${x._id}" class="btn btn-primary">Details</a>
                    </div>
                    </div>
                </div>
                `
            }) : html`<h4>Seems pretty emtpy around here... <a href="/addbook">Create a book?</a></h4>`}
            </div>`;
    }

    _fetchData() {
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken == null)
            location.href = '/login';

        fetch('http://localhost:3030/users/me', {
            method: 'GET',
            headers: {
                'X-Authorization': accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            fetch(`http://localhost:3030/data/books?where=_ownerId${encodeURIComponent(`="${data._id}"`)}`, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => this.bookData = data)
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('userbooks-element', UserBooksElement);

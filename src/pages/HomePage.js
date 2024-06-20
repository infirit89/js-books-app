import { render, html } from "lit-html";
import { LitElement } from "lit-element";
import { property } from "lit-element/decorators.js";

class HomeElement extends LitElement {
    
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
            }) : html`<h4>No books... Yet!</h4>`}
            </div>`;
    }

    _fetchData() {
        fetch('http://localhost:3030/data/books', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => this.bookData = data)
        .catch(error => console.error(error));
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('home-element', HomeElement);

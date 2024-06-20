import { render, html } from "lit-html";
import { LitElement } from "lit-element";

class BookDetailsElement extends LitElement {
    
    static get properties() {
        return {
            bookData: Object,
            location: Object,
            userId: Object,
            isEdit: Boolean
        };
    }
    
    constructor() {
        super();
        this._fetchData();
        this.isEdit = false;
    }

    _renderNormal() {
        return  html
        `
        <h2 class="card-title text-center">${this.bookData.title}</h2>
        <p class="card-text display-6 mb-5">${this.bookData.description}</p>
        <p class="card-text">Price: ${this.bookData.price}$</p>
        ${
            this.userId == this.bookData._ownerId ? 
            html
            `
                <button class="btn btn-primary me-2" @click="${this._handleEditToggle}">Edit</button>
                <button class="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header border-0">
                                <h1 class="modal-title fs-5" id="deleteModalLabel">Delete book?</h1>
                            </div>
                            <div class="modal-body border-0">
                                Are you sure you want to delete your book?
                            </div>
                            <div class="modal-footer border-0">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <form @submit="${this._handleDelete}">
                                    <button type="submit" class="btn btn-danger">Delete</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }

    _renderEdit() {
        return  html
        `
        <form @submit="${this._handleEdit}">
            <div class="mb-3">
                <label for="titleInput" class="form-label">Title</label>
                <input type="text" class="form-control" id="titleInput" value="${this.bookData.title}">
            </div>
            <div class="mb-3">
                <label for="descriptionInput" class="form-label">Description</label>
                <textarea rows="8" type="text" class="form-control" id="descriptionInput">${this.bookData.description}</textarea>
            </div>
            <div class="mb-3">
                <label for="priceInput" class="form-label">Price</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">$</span>
                    </div>
                    <input type="number" class="form-control" id="priceInput" placeholder="0.00" min="1" max="1000000" value=${this.bookData.price}>
                </div>
            </div>
            <div class="text-danger" id="errorMessage"></div>
            <button class="btn btn-secondary me-2" @click="${this._handleEditToggle}">Cancel</button>
            <button class="btn btn-primary" type="submit">Save changes</button>
        </form>
        `;
    }

    render() {
        console.log(this.location.params.id);
        if(!this.bookData)
            return html `<h4>Loading...</h4>`;

        return html `<div class="d-flex justify-content-center mt-5">
                <div class="mb-4 w-100">
                    <div class="card">
                        <div class="card-body">
                            ${!this.isEdit ? this._renderNormal() : this._renderEdit()}
                        </div>
                    </div>
                </div>
            </div>`;
    }

    _handleEditToggle() {
        this.isEdit = !this.isEdit;
        console.log(this.isEdit);
    }

    _handleEdit(e) {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');

        const titleInput = document.querySelector('#titleInput');
        const descriptionInput = document.querySelector('#descriptionInput');
        const priceInput = document.querySelector('#priceInput');

        const errorField = document.querySelector('#errorMessage');

        fetch(`http://localhost:3030/data/books/${this.bookData._id}`,{
            method: 'PUT',
            mode: 'cors',
            headers: {
                'X-Authorization': accessToken
            },
            body: JSON.stringify({ title: titleInput.value, description: descriptionInput.value, price: priceInput.value })
        })
        .then(response => {
            if(response.status == 200) {
                location.href = `/${this.bookData._id}`;
                return;
            }

            errorField.textContent = 'Failed to update book!';
        })
        .catch(error => console.error(error));
    }

    _handleDelete() {
        const accessToken = localStorage.getItem('accessToken');
        fetch(`http://localhost:3030/data/books/${this.bookData._id}`,{
            method: 'DELETE',
            headers: {
                'X-Authorization': accessToken
            }
        })
        .then(response => {
            if(response.status == 200)
                location.href = '/';
        })
        .catch(error => console.error(error));
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
            this.userId = data._id;
            fetch(`http://localhost:3030/data/books/${this.location.params.id}`, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                this.bookData = data;
                console.log(data);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('bookdetails-element', BookDetailsElement);

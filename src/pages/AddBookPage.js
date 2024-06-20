import { render, html } from "lit-html";
import { LitElement } from "lit-element";

class AddBookElement extends LitElement {
    render() {
        return html`
        <div class="d-flex justify-content-center mt-5">
            <form class="mt-5 w-50" method="post" @submit="${this._handleSubmit}">
                <h1 class="mb-4">Add a book</h1>
                <div class="text-danger" id="errorMessage"></div>
                <div class="mb-3">
                    <label for="titleInput" class="form-label">Title</label>
                    <input type="text" class="form-control" id="titleInput">
                </div>
                <div class="mb-3">
                    <label for="descriptionInput" class="form-label">Description</label>
                    <textarea rows="8" type="text" class="form-control" id="descriptionInput"></textarea>
                </div>

                <div class="mb-3">
                    <label for="priceInput" class="form-label">Price</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">$</span>
                        </div>
                        <input type="number" class="form-control" id="priceInput" placeholder="0.00" min="1" max="1000000">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary w-25 mt-4">Add book</button>
            </form>
        </div>
        `;
    }

    _handleSubmit(e) 
    {
        e.preventDefault();

        const accessToken = localStorage.getItem('accessToken');

        const titleInput = document.querySelector('#titleInput');
        const descriptionInput = document.querySelector('#descriptionInput');
        const priceInput = document.querySelector('#priceInput');

        fetch('http://localhost:3030/data/books',
            {
                method: "POST",
                body: JSON.stringify({ title: titleInput.value, description: descriptionInput.value, price: priceInput.value }),
                headers: {
                    'X-Authorization': accessToken
                }
            })
            .then(response => {
                if(response.status == 200) {
                    location.href = '/';
                    return;
                }
            })
            .catch(error => console.error(error));
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define('addbook-element', AddBookElement);

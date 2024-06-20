import { render, html } from "lit-html";
import { Router } from "@vaadin/router";
import "./pages/LoginPage.js";
import "./pages/HomePage.js";
import "./pages/RegisterPage.js";
import "./pages/LogoutPage.js";
import "./pages/AddBookPage.js";
import "./pages/UserBooksPage.js";
import "./pages/BookDetailsPage.js";

function renderNavbar() {
    const logoContainer = document.querySelector('#logo-container');
    render(html`<a class="navbar-brand user-select-none" href="/">Books</a>`, logoContainer);
    
    const navbar = document.querySelector('.navbar-nav');
    if(localStorage.getItem('accessToken') != null) 
    {
        const username = localStorage.getItem('username');
        const authenticatedNavbarTemplate =
        html`
        <li class="nav-item"><p class="navbar-text mb-0 me-2">Welcome, ${username}</p></li>
        <li class="nav-item"><a class="nav-link user-select-none" href="/mybooks">My books</a></li>
        <li class="nav-item"><a class="nav-link user-select-none" href="/addbook">Add book</a></li>
        <li class="nav-item"><a class="nav-link user-select-none" id="logout" href="/logout">Logout</a></li>
        `;

        render(authenticatedNavbarTemplate, navbar);
    }
    else 
    {
        const unauthenticatedNavbarTemplate = 
        html`
        <li class="nav-item"><a class="nav-link user-select-none" id="login" href="login">Login</a></li>
        <li class="nav-item"><a class="nav-link user-select-none" href="register">Register</a></li>
        `;

        render(unauthenticatedNavbarTemplate, navbar);
    }
}

(function setup() 
{
    const mainContainer = document.querySelector('main');

    const router = new Router(mainContainer);
    router.setRoutes([
        {path: '/', component: 'home-element'},
        {path: '/login', component: 'login-element'},
        {path: '/register', component: 'register-element'},
        {path: '/logout', component: 'logout-element'},
        {path: '/addbook', component: 'addbook-element'},
        {path: '/mybooks', component: 'userbooks-element'},
        {path: '/:id', component: 'bookdetails-element'},
    ]);

    renderNavbar();
})();

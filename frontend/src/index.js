import * as React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.js';
import { BrowserRouter } from "react-router-dom"

const root = createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App></App>
    </BrowserRouter>
)



import React from "react";
import { createRoot } from 'react-dom/client';
import Editor from "./components/editor";

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Editor />);

// function getPageList() {
//     $('h2').remove();
//     $.get('./api', data => {
//         data.forEach(file => {
//             $('body').append(`<h2>${file}</h2>`)
//         })
//     }, 'JSON');
// }

// getPageList();

// $('button').click(() => {
//     $.post('./api/createNewPage.php', {
//         'name': $('input').val()
//     }, () => {
//         getPageList();
//     })
//     .fail(() => {
//         alert('Страница уже существует!')
//     })
// })
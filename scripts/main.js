// Imports
import { carregarPagina, primeriaPagina, atualizarEstiloBotoes } from './app/router.js'

if (!localStorage.getItem('paginaAtual')) {
    primeriaPagina();
}

const paginaAtual = localStorage.getItem('paginaAtual');

document.querySelectorAll('.tab--bar button').forEach(btn => {
    btn.classList.toggle('botao--page-selecionado', btn.dataset.page === paginaAtual);
});

carregarPagina(paginaAtual);

// Events
document.querySelectorAll('.tab--bar button[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
        const pagina = btn.getAttribute('data-page');
        carregarPagina(pagina);
    })
})



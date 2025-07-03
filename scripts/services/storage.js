import { carregarPagina } from "../app/router.js";
import { edit } from "../components/editor.js";
import { atualizarListaNota, ordenarNotasPorData, qtdLista } from "./notas.js";

let notaAtualId = null;
let debounceTimer = null;

export const excluirNotaAtual = () => {
    if (!notaAtualId) return alert('Nenhuma nota selecionada pra excluir!');

    const todas = JSON.parse(localStorage.getItem('notas') || '{}');
    if (!(notaAtualId in todas)) return alert('Nota não encontrada!');

    delete todas[notaAtualId];
    localStorage.setItem('notas', JSON.stringify(todas));

    const notaEl = document.querySelector(`.nota[data-id="${notaAtualId}"]`);
    if (notaEl && notaEl.parentNode) {
        notaEl.parentNode.removeChild(notaEl);
    }

    const editor = document.querySelector('#nota');
    editor.innerHTML = '';

    notaAtualId = null;

    // Dps alterar a funcionalidade para selecionar a proxima nota e não a primeira
    const primeiraNota = document.querySelector('.list--notes .nota');
    if (primeiraNota) {
        const novoId = primeiraNota.dataset.id;
        selecionarNota(novoId);
    }

    qtdLista()
};



export const salvarNota = (nota) => {
    const todas = JSON.parse(localStorage.getItem('notas') || '{}');
    nota.updatedAt = new Date().toISOString();
    todas[nota.id] = nota;
    localStorage.setItem('notas', JSON.stringify(todas));
}

export const recuperarNota = (id) => {
    const todas = JSON.parse(localStorage.getItem('notas') || '{}');
    return todas[id] || null;
}

export const selecionarNota = (id) => {
    const nota = recuperarNota(id);
    if (!nota) return;

    const editor = document.querySelector('#nota');
    editor.innerHTML = nota.html;

    if (notaAtualId) {
        const notaAnterior = document.querySelector(`.nota[data-id="${notaAtualId}"]`);
        if (notaAnterior) {
            notaAnterior.classList.remove('nota--ativa');
        }
    }

    const notaAtual = document.querySelector(`.nota[data-id="${id}"]`);
    if (notaAtual) {
        notaAtual.classList.add('nota--ativa');
    }

    notaAtualId = id;

    editor.addEventListener('input', () => {
        clearTimeout(debounceTimer); // limpa o timer anterior

        debounceTimer = setTimeout(() => {
            const html = editor.innerHTML;
            salvarNota({ id: notaAtualId, html });

            atualizarListaNota(notaAtualId);
            ordenarNotasPorData();
            console.log("testando o timer do impunt")
        }, 500);
    });

    edit();
}

export const selecionarNotaHome = async (id) => {
    const nota = recuperarNota(id);
    if (!nota) return;

    await carregarPagina('notes');

    setTimeout(() => {
        selecionarNota(id);
    }, 50);

}
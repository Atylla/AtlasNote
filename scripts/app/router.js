import { inicializarNOTAS } from "../components/notes.js";
import { carregarNotasDoStorage, carregarNotasDoStorageHome, copiarConteudo, novaNota, ordenarNotasPorData } from "../services/notas.js";
import { selecionarNota, excluirNotaAtual } from "../services/storage.js";

// Initial Data
export function primeriaPagina() {
    setPaginaAtual('home');
}

export function getPaginaAtual() {
    return localStorage.getItem('paginaAtual') || 'home';
}
export function setPaginaAtual(pagina) {
    localStorage.setItem('paginaAtual', pagina);
}
//Events

const botaoNotaMais = document.querySelector('#b-nota');
botaoNotaMais.addEventListener('click', () => {
    let page = localStorage.getItem('paginaAtual');
    if (page === 'notes') {
        novaNota();
    } else { // esse se nao só vale quando só existe as paginas notes e home.
        carregarPagina('notes');
        setTimeout(() => {
            novaNota();
        }, 100)
    }



})
//Functions
export const carregarPagina = async (pagina) => {

    const container = document.querySelector('#area-pages');

    container.className = container.className
        .split(' ')
        .filter(c => !c.startsWith('pages--'))
        .join(' ');

    container.classList.add(`pages--${pagina}`);

    try {
        const res = await fetch(`../../pages/${pagina}.html`);
        const html = await res.text();

        container.innerHTML = html;


        switchPages(pagina);


    } catch (err) {
        console.error(`Erro ao carregar página "${pagina}":`, err);
    }
}

function switchPages(pagina) {
    switch (pagina) {
        case 'notes':
            paginaNotes(pagina);
            break;
        case 'home':
            paginaHome(pagina);
    }
}

function paginaNotes(pagina) {
    if (pagina == 'notes') {
        carregarNotasDoStorage();
        inicializarNOTAS();

        setTimeout(() => {
            const primeiraNota = document.querySelector('.list--notes .nota');
            if (primeiraNota) {
                const id = primeiraNota.dataset.id;
                if (id) {
                    selecionarNota(id);
                }
            }
        }, 20);
        const btnExcluir = document.querySelector('.top--bar button:nth-child(2)');
        btnExcluir.addEventListener('click', excluirNotaAtual);
        const btnCopiar = document.querySelector('.top--bar button:nth-child(1)');
        btnCopiar.addEventListener('click', copiarConteudo);

        atualizarEstiloBotoes(pagina);
    }

    console.log('ANTES de salvar página:', pagina);
setPaginaAtual(pagina);
console.log('DEPOIS de salvar página:', getPaginaAtual());
}

function paginaHome(pagina) {
    if (pagina == 'home') {
        carregarNotasDoStorageHome();
        inicializarNOTAS();
        ordenarNotasPorData();

        atualizarEstiloBotoes(pagina);

    }
    setPaginaAtual(pagina);
}

export function atualizarEstiloBotoes(paginaAtual) {
    document.querySelectorAll('.tab--bar button').forEach(btn => {
        btn.classList.toggle('botao--page-selecionado', btn.dataset.page === paginaAtual);
    });
}
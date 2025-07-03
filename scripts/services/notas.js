import { salvarNota, selecionarNota, recuperarNota, selecionarNotaHome } from "./storage.js";

export const novaNota = () => {
    const boxLista = document.querySelector('.list--notes');

    const notaId = 'nota_' + Date.now();

    const divNote = document.createElement('div');
    const divTitulo = document.createElement('div');
    const divConteudo = document.createElement('div');
    const divTempo = document.createElement('div');

    divNote.dataset.id = notaId;

    divNote.classList.add('nota');
    divTitulo.classList.add('nota--titulo');
    divConteudo.classList.add('nota--conteudo');
    divTempo.classList.add('nota--tempo');

    divTitulo.innerText = 'Titulo';
    divConteudo.innerText = 'Conteudo';
    divTempo.innerText = new Date().toLocaleTimeString();

    divNote.addEventListener('click', () => selecionarNota(notaId));

    divNote.appendChild(divTitulo);
    divNote.appendChild(divConteudo);
    divNote.appendChild(divTempo);

    boxLista.appendChild(divNote);

    salvarNota({ id: notaId, html: '' });
    selecionarNota(notaId);
    ordenarNotasPorData();
    qtdLista()
}

export const atualizarListaNota = (id) => {
    const nota = recuperarNota(id);
    if (!nota) return;

    const notaEl = document.querySelector(`.nota[data-id="${id}"]`);
    if (!notaEl) {
        console.warn(`Nota com id ${id} não encontrada no DOM.`);
        return;
    }

    const tituloEl = notaEl.querySelector('.nota--titulo');
    const conteudoEl = notaEl.querySelector('.nota--conteudo');
    const tempoEl = notaEl.querySelector('.nota--tempo');

    if (!tituloEl || !conteudoEl || !tempoEl) {
        console.warn('Elementos da nota incompletos');
        return;
    }

    const tituloMatch = nota.html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const tituloBruto = tituloMatch ? tituloMatch[1] : '';
    const titulo = limparTexto(tituloBruto) || 'Sem título';
    tituloEl.innerText = titulo;

    const pMatch = nota.html.match(/<p[^>]*>(.*?)<\/p>/i);
    const conteudoBruto = pMatch ? pMatch[1] : '';
    const conteudo = limparTexto(conteudoBruto) || '...';
    conteudoEl.innerText = conteudo;

    const horaAtual = new Date(nota.updatedAt).toLocaleTimeString();
    tempoEl.innerText = horaAtual;

    ordenarNotasPorData();
    qtdLista()
};


export const ordenarNotasPorData = () => {
    const listaNotas = document.querySelector('.list--notes') || document.querySelector('.home--notes');
    if (!listaNotas) return;

    const ehHome = listaNotas.classList.contains('home--notes');
    const seletorNota = ehHome ? '.home-nota' : '.nota';
    const notasArray = Array.from(listaNotas.querySelectorAll(seletorNota));

    const todas = JSON.parse(localStorage.getItem('notas') || '{}');

    notasArray.sort((a, b) => {
        const idA = a.dataset.id;
        const idB = b.dataset.id;

        const notaA = todas[idA];
        const notaB = todas[idB];

        const dataA = new Date(notaA?.updatedAt || 0);
        const dataB = new Date(notaB?.updatedAt || 0);

        return dataB - dataA;
    });

    notasArray.forEach(nota => listaNotas.appendChild(nota));
};



export const carregarNotasDoStorage = () => {
    const todas = JSON.parse(localStorage.getItem('notas') || '{}');
    const listaNotas = document.querySelector('.list--notes');
    if (!listaNotas) return;

    listaNotas.innerHTML = '';

    Object.values(todas).forEach(nota => {
        const divNote = document.createElement('div');
        divNote.classList.add('nota');
        divNote.dataset.id = nota.id;

        const divTitulo = document.createElement('div');
        divTitulo.classList.add('nota--titulo');
        const tituloMatch = nota.html.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const tituloBruto = tituloMatch ? tituloMatch[1] : '';
        const titulo = limparTexto(tituloBruto) || 'Sem título';
        divTitulo.innerText = titulo;




        const divConteudo = document.createElement('div');
        divConteudo.classList.add('nota--conteudo');
        const pMatch = nota.html.match(/<p[^>]*>(.*?)<\/p>/i);
        const conteudoBruto = pMatch ? pMatch[1] : '';
        const conteudo = limparTexto(conteudoBruto) || 'Sem conteudo';
        divConteudo.innerText = conteudo;

        const divTempo = document.createElement('div');
        divTempo.classList.add('nota--tempo');
        const data = nota.updatedAt ? new Date(nota.updatedAt) : new Date();
        divTempo.innerText = data.toLocaleTimeString();

        divNote.appendChild(divTitulo);
        divNote.appendChild(divConteudo);
        divNote.appendChild(divTempo);

        divNote.addEventListener('click', () => selecionarNota(nota.id));

        listaNotas.appendChild(divNote);
    });

    ordenarNotasPorData();
    qtdLista()
};

export const carregarNotasDoStorageHome = () => {
    const todas = JSON.parse(localStorage.getItem('notas') || '{}');
    const listaNotas = document.querySelector('.home--notes');
    if (!listaNotas) return;

    listaNotas.innerHTML = '';

    Object.values(todas).forEach(nota => {
        const divNote = document.createElement('div');
        divNote.classList.add('home-nota');
        divNote.dataset.id = nota.id;

        const divTitulo = document.createElement('div');
        divTitulo.classList.add('home-notaT');

        const tituloMatch = nota.html.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const tituloBruto = tituloMatch ? tituloMatch[1] : '';
        const titulo = limparTexto(tituloBruto) || 'Sem título';
        divTitulo.innerText = titulo;

        const divConteudo = document.createElement('div');
        divConteudo.classList.add('home-notaC');
        const pMatch = nota.html.match(/<p[^>]*>(.*?)<\/p>/i);
        const conteudoBruto = pMatch ? pMatch[1] : '';
        const conteudo = limparTexto(conteudoBruto) || 'Sem conteudo';
        divConteudo.innerText = conteudo;

        const divTempo = document.createElement('div');
        divTempo.classList.add('home-notaH');
        const data = nota.updatedAt ? new Date(nota.updatedAt) : new Date();
        divTempo.innerText = data.toLocaleTimeString();

        divNote.appendChild(divTitulo);
        divNote.appendChild(divConteudo);
        divNote.appendChild(divTempo);

        divNote.addEventListener('click', () => selecionarNotaHome(nota.id));

        listaNotas.appendChild(divNote);
    });

    ordenarNotasPorData(); 
};

const limparTexto = (str) => {
    if (!str) return '';

    let textoLimpo = str.replace(/<[^>]+>/g, '');

    textoLimpo = textoLimpo.replaceAll(/&nbsp;/g, ' ').trim();
    textoLimpo = textoLimpo.replaceAll(/&amp;/g, '&').trim();

    textoLimpo = textoLimpo.replaceAll(/\s+/g, ' ');

    return textoLimpo;
};

export const copiarConteudo = () => {
    const editor = document.querySelector('#nota');
    if (!editor) {
        console.warn('Editor não encontrado!');
        return;
    }

    const elementos = editor.children;
    const linhas = [];

    for (let el of elementos) {
        if (el.innerText.trim() === '') {
            linhas.push('');
        } else {
            linhas.push(el.innerText.trimEnd());
        }
    }


    const textoFormatado = linhas.join('\n');

    if (!textoFormatado) {
        console.warn('Nada pra copiar!');
        return;
    }

    navigator.clipboard.writeText(textoFormatado)
        .then(() => {
            console.log('Conteúdo formatado copiado!');
        })
        .catch(err => {
            console.error('Erro ao copiar:', err);
        });
};

export const qtdLista = () => {
    const qtdNotas = document.querySelector('#qtd-notas');
    const boxLista = document.querySelector('.list--notes');
    const quant = boxLista.children.length;
    qtdNotas.innerText = `${quant} notas`;

}



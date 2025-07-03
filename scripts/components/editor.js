
export const edit = () => {
    const editor = document.querySelector('#nota');
    if (!editor) return;

    const atualizarPlaceholderParagrafos = () => {
        const paragrafos = Array.from(editor.querySelectorAll('p'));

        const algumTemConteudo = paragrafos.some(p => p.textContent.trim() !== '');

        if (algumTemConteudo) {
            paragrafos.forEach(p => p.removeAttribute('data-placeholder'));
        } else {
            paragrafos.forEach((p, i) => {
                if (i === 0) {
                    p.setAttribute('data-placeholder', 'Digite algo...');
                } else {
                    p.removeAttribute('data-placeholder');
                }
            });
        }
    };

    const garantirH1NoTopo = () => {
        const children = Array.from(editor.children);

        if (editor.innerHTML.trim() === '') {
            const h1 = document.createElement('h1');
            h1.innerHTML = '<br>';
            h1.setAttribute('data-placeholder', 'Digite o título...');
            editor.appendChild(h1);
            colocarCursorDentro(h1);
            return;
        }

        const primeiro = children[0];
        if (primeiro.tagName !== 'H1') {
            const novoH1 = document.createElement('h1');
            novoH1.innerHTML = primeiro.innerHTML;
            editor.replaceChild(novoH1, primeiro);
            colocarCursorDentro(novoH1);
        }
    };

    const tratarEnterNoH1 = (e) => {
        if (e.key !== 'Enter') return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        const offset = range.startOffset;

        const h1 = editor.querySelector('h1');
        if (!h1 || !(container === h1 || h1.contains(container))) return;

        e.preventDefault();

        if (container.nodeType === Node.TEXT_NODE) {
            const fullText = container.textContent;
            const antes = fullText.slice(0, offset);
            const depois = fullText.slice(offset);

            h1.textContent = antes;

            const novoParagrafo = document.createElement('p');
            novoParagrafo.innerHTML = depois.trim() !== '' ? depois : '<br>';

            const numParagrafos = Array.from(editor.children).filter(el => el.tagName === 'P').length;

            if (numParagrafos === 0) {
                novoParagrafo.setAttribute('data-placeholder', 'Digite algo...');
            }


            if (h1.nextSibling) {
                editor.insertBefore(novoParagrafo, h1.nextSibling);
            } else {
                editor.appendChild(novoParagrafo);
            }

            const newRange = document.createRange();
            const sel = window.getSelection();
            newRange.setStart(novoParagrafo, 0);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
        }
    };

    const aplicarEstiloNoH1 = () => {
        const h1 = editor.querySelector('h1');
        if (h1) {
            h1.style.fontSize = '1.6em';
            h1.style.fontWeight = 'bold';
        }
    };

    const colocarCursorDentro = (element) => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(true); 
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const darTab = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const tabNode = document.createTextNode('\u00a0\u00a0\u00a0\u00a0'); // 4 espaços (non-breaking space)

            range.insertNode(tabNode);

            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    editor.addEventListener('keydown', tratarEnterNoH1);
    editor.addEventListener('keydown', darTab);
    editor.addEventListener('input', () => {
        aplicarEstiloNoH1();
        garantirH1NoTopo();
        atualizarPlaceholderParagrafos();
    });

    aplicarEstiloNoH1();
    garantirH1NoTopo();
};



function colocarCursorNoFinal(element) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}

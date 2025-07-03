import { novaNota} from "../services/notas.js";

export const inicializarNOTAS = () => {
    const btnNovaNota = document.querySelector('#bar--novaNota');

    if (btnNovaNota) {
        btnNovaNota.addEventListener('click', () =>{
            novaNota();
            console.log('nova nota criada')
        })
    } else {
        console.log('Botao nova nota nao encontrado')
    }
}
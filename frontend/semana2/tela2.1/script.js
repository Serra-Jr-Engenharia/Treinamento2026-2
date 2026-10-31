let totalIntegrantes = 0;

const btnAdicionar = document.getElementById('btn-adicionar');
const btnRemover = document.getElementById('btn-remover');
const textoQuantidade = document.getElementById('quantidade');

btnAdicionar.addEventListener('click', function() {
    totalIntegrantes++;
    textoQuantidade.textContent = totalIntegrantes;
});

btnRemover.addEventListener('click', function() {
    if (totalIntegrantes > 0) {
        totalIntegrantes--;
        textoQuantidade.textContent = totalIntegrantes;
    }
    else{
        alert('Não é possível remover integrantes. O total já está em 0.');
    }
});
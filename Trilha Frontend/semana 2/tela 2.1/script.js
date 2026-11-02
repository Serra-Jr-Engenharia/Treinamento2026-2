let elemento = document.getElementById('azul');

function adicionar(){
    let numero= Number(elemento.innerHTML);
    elemento.innerHTML = numero + 1;
}
function remover(){
    let numero= Number(elemento.innerHTML);
    if(numero > 0 ){
        elemento.innerHTML = numero - 1;
    }
    else{
        alert("não há membros")
    }
}

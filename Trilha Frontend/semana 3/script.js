let Logradouro = document.getElementById("Log");
let Complemento = document.getElementById("Comp");
let Bairro = document.getElementById("Bai");
let Localidade = document.getElementById("Loc");
let UF = document.getElementById("UF");
let Estado = document.getElementById("Est");
let cep = document.getElementById("laranja")

let CEP = document.getElementById("CEP");

let buscar = (event) => {
    event.preventDefault();
    let digitado = CEP.value.replace(/\D/g,""); 

    fetch(`https://viacep.com.br/ws/${digitado}/json/`)
    .then((r)=> r.json())
    .then((json)=> {
            cep.innerHTML = "CEP:" + json.cep;
            Logradouro.innerHTML = "Logradouro: "+ json.logradouro;
            Complemento.innerHTML = "Complemento: "+ json.complemento;
            Bairro.innerHTML = "Bairro: " + json.bairro;
            Localidade.innerHTML = "Localidade: "+ json.localidade;
            UF.innerHTML = "UF: " + json.uf;
            Estado.innerHTML = "Estado :" + json.estado
    })
    .catch(()=> alert("Erro ao Buscar o  CEP"))

}
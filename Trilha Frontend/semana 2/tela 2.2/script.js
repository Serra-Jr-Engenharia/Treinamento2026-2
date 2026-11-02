function criar(event){
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarsenha = document.getElementById('confirmarsenha').value;
    if(!email || !senha ||!confirmarsenha){
        event.preventDefault();
        alert('preencha todos os campos')
        return
    }
    if(senha == confirmarsenha)
    {
        alert("Usuário criado");
    }
    else{
        event.preventDefault();
        alert("As senhas estão diferentes");
    }
}
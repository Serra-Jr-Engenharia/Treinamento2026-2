const form = document.getElementById('form-cadastro');

form.addEventListener('submit', function(evento) {
    evento.preventDefault(); 
    
    const emailValor = document.getElementById('email').value;
    const senhaValor = document.getElementById('senha').value;
    const confirmarSenhaValor = document.getElementById('confirmar-senha').value;
    
    if (emailValor === "" || senhaValor === "" || confirmarSenhaValor === "") {
        alert("Preencha todos os campos obrigatórios");
        return;
    }
    
    if (senhaValor !== confirmarSenhaValor) {
        alert("As senhas não são iguais");
        return;
    }
    
    alert("Dados preenchidos no formulário:\nEmail: " + emailValor + "\nSenha: " + senhaValor);
});
const enter = document.getElementById("enter");
const email = document.getElementById("email");
const passwd = document.getElementById("passwd");
const confpass = document.getElementById("confpass");
enter.onclick = () => {
  if (!(email.value.trim() && passwd.value.trim() && confpass.value.trim()))
    return window.alert("Preencha todos os campos obrigatórios.");
  if (passwd.value.trim() !== confpass.value.trim())
    return window.alert("As senhas não são iguais.");

  window.alert(
    `Email: ${email.value.trim()}\nSenha: ${passwd.value.trim()}\nConfirmação: ${confpass.value.trim()}`,
  );
};

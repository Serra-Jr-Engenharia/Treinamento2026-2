const CepTitulo = document.getElementById("cep-titulo");
const Logradouro = document.getElementById("logradouro");
const Complemento = document.getElementById("complemento");
const Bairro = document.getElementById("bairro");
const Localidade = document.getElementById("localidade");
const UF = document.getElementById("uf");
const Estado = document.getElementById("estado");


const CEPInput = document.getElementById("input-cep");
const BtnPesquisar = document.getElementById("btn-pesquisar");
const ModalErro = document.getElementById("modal-erro");
const BtnFecharModal = document.getElementById("btn-fechar-modal");
const MensagemErro = document.getElementById("mensagem-erro");


const camposTela = {
    CepTitulo,
    Logradouro,
    Complemento,
    Bairro,
    Localidade,
    UF,
    Estado
};

const exibirErro = (mensagem) => {
    MensagemErro.textContent = mensagem;
    ModalErro.classList.add("active");
};

const fecharErro = () => {
    ModalErro.classList.remove("active");
};

const buscarCEP = async () => {
    const cepLimpo = CEPInput.value.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
        exibirErro("Formato de CEP inválido! Digite exatamente 8 números.");
        return;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            exibirErro("Este CEP não foi encontrado na base de dados.");
            return;
        }

        const { cep, logradouro, complemento, bairro, localidade, uf, estado } = dados;

        camposTela.CepTitulo.textContent = cep;
        camposTela.Logradouro.textContent = logradouro || "Não informado";
        camposTela.Complemento.textContent = complemento || "Sem complemento";
        camposTela.Bairro.textContent = bairro || "Não informado";
        camposTela.Localidade.textContent = localidade;
        camposTela.UF.textContent = uf;
        camposTela.Estado.textContent = estado;

    } catch (erro) {
        exibirErro("Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.");
    }
};

BtnPesquisar.addEventListener("click", buscarCEP);
BtnFecharModal.addEventListener("click", fecharErro);

CEPInput.addEventListener("keypress", (evento) => {
    if (evento.key === "Enter") {
        buscarCEP();
    }
});

ModalErro.addEventListener("click", (evento) => {
    if (evento.target === ModalErro) {
        fecharErro();
    }
});
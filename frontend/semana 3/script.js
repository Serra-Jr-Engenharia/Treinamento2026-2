const submit = document.getElementById("submit");
const cep = document.getElementById("cep");
const subcep = document.getElementById("subcep");
const info = {};
submit.onclick = async () => {
  try {
    const data = await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);
    if (data.ok) {
      const /**@type{unknown}*/ json = await data.json();
      if (typeof json === "object" && json !== null)
        for (const [k, v] of Object.entries(json)) {
          const el = document.getElementById(k);
          if (el) el.innerText = v;
        }
      subcep.innerText = cep.value;
    } else {
      alert("Cep inválido!");
    }
  } catch (_) {
    alert("Cep inválido!");
  }
};

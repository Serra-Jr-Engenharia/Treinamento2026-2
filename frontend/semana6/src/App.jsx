import { useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import logoSerra from './assets/logo-serra.png';

function CardMembro({ titulo, nome, idade, curso }) {
  return (
    <div className="relative w-full max-w-[336px] pt-[32px]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[187px] h-[64px] bg-[#FF6600] rounded-[22px] flex items-center justify-center shadow-md z-10">
        <h2 className="text-white font-bold text-[24px]">{titulo}</h2>
      </div>

      <div className="w-full h-[277px] bg-[#001830] rounded-[22px] flex flex-col items-center justify-center gap-4 pt-[30px] shadow-lg">
        <p className="text-white font-bold text-[24px] text-center">{nome}</p>
        <p className="text-white font-bold text-[24px] text-center">{idade}</p>
        <p className="text-white font-bold text-[24px] text-center">{curso}</p>
      </div>
    </div>
  );
}

function TelaSemana4() {
  const membros = [
    { id: 1, titulo: 'Membro 1', nome: 'Nome', idade: 'Idade', curso: 'Curso' },
    { id: 2, titulo: 'Membro 2', nome: 'Nome', idade: 'Idade', curso: 'Curso' },
    { id: 3, titulo: 'Membro 3', nome: 'Nome', idade: 'Idade', curso: 'Curso' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <header className="w-full h-[97px] bg-[#FF6600] flex items-center px-[23px] gap-[25px]">
        <img
          src={logoSerra}
          alt="Logo Equipe Serra Jr"
          className="w-[58px] h-[57px] object-contain"
        />
        <h1 className="text-white font-bold text-[36px] leading-[54px]">
          Equipe Serra Jr
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 w-full">
        <div className="flex flex-wrap justify-center gap-[57px] w-full max-w-[1200px]">
          {membros.map((membro) => (
            <CardMembro
              key={membro.id}
              titulo={membro.titulo}
              nome={membro.nome}
              idade={membro.idade}
              curso={membro.curso}
            />
          ))}
        </div>
      </main>

      <footer className="w-full h-[83px] bg-[#FF6600] flex items-center justify-center mt-auto">
        <p className="text-white font-medium text-[16px] leading-[24px] text-center">
          COPYRIGHT Ⓒ 2026 - SERRA JUNIOR ENGENHARIA
        </p>
      </footer>
    </div>
  );
}

function TelaSemana5() {
  const [termoBusca, setTermoBusca] = useState('');
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  async function buscarFilmes(e) {
    e.preventDefault();
    const termoLimpo = termoBusca.trim();
    if (!termoLimpo) {
      setErro('Digite o nome de um filme para pesquisar.');
      setFilmes([]);
      return;
    }

    if (!apiKey) {
      setErro('Chave VITE_OMDB_API_KEY não encontrada no .env da semana6.');
      setFilmes([]);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const resposta = await fetch(
        `https://www.omdbapi.com/?apikey=${encodeURIComponent(apiKey)}&s=${encodeURIComponent(termoLimpo)}`
      );
      const dados = await resposta.json();

      if (dados.Response === 'True' && Array.isArray(dados.Search)) {
        setFilmes(dados.Search);
      } else {
        setFilmes([]);
        setErro(dados.Error || 'Nenhum filme encontrado.');
      }
    } catch {
      setFilmes([]);
      setErro('Erro ao conectar com a API da OMDb.');
    } finally {
      setCarregando(false);
    }
  }

  function removerFilme(imdbID) {
    setFilmes((lista) => lista.filter((filme) => filme.imdbID !== imdbID));
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full h-[97px] bg-[#001830] flex items-center px-[106px]">
        <h1 className="text-white font-bold text-[36px] leading-[54px]">
          Lista de Filmes
        </h1>
      </header>

      <main className="flex-1 w-full px-[41px] py-8">
        <form onSubmit={buscarFilmes} className="w-full flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Nome do filme..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="flex-1 h-[48px] px-5 bg-white border-2 border-[#FF6600] rounded-[22px] text-[16px] font-medium text-[#001830] placeholder:text-[#9B9B9B] outline-none"
          />
          <button
            type="submit"
            className="w-full md:w-[266px] h-[48px] bg-[#FF6600] border-2 border-[#FF6600] rounded-[22px] text-[24px] font-medium text-white cursor-pointer"
          >
            Pesquisar
          </button>
        </form>

        {carregando && <p className="text-center text-neutral-600 my-6">Buscando...</p>}
        {!carregando && erro && <p className="text-center text-red-700 font-medium my-6">{erro}</p>}

        {!carregando && !erro && filmes.length > 0 && (
          <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
            {filmes.map((filme) => (
              <article
                key={filme.imdbID}
                className="relative bg-[#FF6600] rounded-[22px] p-4 flex flex-col items-center justify-between gap-3 text-white"
              >
                <button
                  type="button"
                  onClick={() => removerFilme(filme.imdbID)}
                  title="Remover filme da lista"
                  className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full bg-[#001830] text-white text-sm font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>

                <div className="w-full h-[220px] bg-[#D9D9D9] rounded-[18px] overflow-hidden flex items-center justify-center">
                  {filme.Poster && filme.Poster !== 'N/A' ? (
                    <img
                      src={filme.Poster}
                      alt={`Poster de ${filme.Title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-black text-[16px]">Poster</span>
                  )}
                </div>

                <h2 className="text-[20px] font-bold text-center leading-[30px]">
                  {filme.Title}
                </h2>
                <p className="text-[15px] font-normal text-center">{filme.Year}</p>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full h-[83px] bg-[#001830] flex items-center justify-center mt-auto">
        <p className="text-white font-medium text-[16px] leading-[24px] text-center">
          COPYRIGHT Ⓒ 2026 - SERRA JUNIOR ENGENHARIA
        </p>
      </footer>
    </div>
  );
}

function Pagina404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#001830] text-white px-6 text-center gap-4">
      <p className="text-[#FF6600] font-bold text-6xl">404</p>
      <h1 className="text-2xl md:text-3xl font-bold">Página não encontrada</h1>
      <p className="text-white/80 max-w-md">
        A rota que você tentou acessar não existe nesta aplicação.
      </p>
      <Link
        to="/semana4"
        className="mt-2 px-6 py-3 rounded-[22px] bg-[#FF6600] text-white font-semibold hover:opacity-90"
      >
        Voltar para a Semana 4
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <nav className="w-full bg-neutral-900 text-white px-6 py-2.5 flex flex-wrap items-center gap-3 text-sm">
        <NavLink
          to="/semana4"
          className={({ isActive }) =>
            `px-3 py-1 rounded-md font-medium ${isActive ? 'bg-[#FF6600] text-white' : 'bg-white/10'}`
          }
        >
          Semana 4
        </NavLink>
        <NavLink
          to="/semana5"
          className={({ isActive }) =>
            `px-3 py-1 rounded-md font-medium ${isActive ? 'bg-[#FF6600] text-white' : 'bg-white/10'}`
          }
        >
          Semana 5
        </NavLink>
        <NavLink
          to="/rota-inexistente"
          className={({ isActive }) =>
            `px-3 py-1 rounded-md font-medium ${isActive ? 'bg-[#FF6600] text-white' : 'bg-white/10'}`
          }
        >
          Semana 67
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<TelaSemana4 />} />
        <Route path="/semana4" element={<TelaSemana4 />} />
        <Route path="/semana5" element={<TelaSemana5 />} />
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </BrowserRouter>
  );
}
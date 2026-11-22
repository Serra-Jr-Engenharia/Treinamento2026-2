import { useState } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'SUA_CHAVE_AQUI';

export default function App() {
  const [termoBusca, setTermoBusca] = useState('');
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [pesquisou, setPesquisou] = useState(false);

  async function buscarFilmes(e) {
    e.preventDefault();

    const termoLimpo = termoBusca.trim();
    if (!termoLimpo) {
      setErro('Digite o nome de um filme para pesquisar.');
      setFilmes([]);
      return;
    }

    setCarregando(true);
    setErro('');
    setPesquisou(true);

    try {
      const resposta = await fetch(
        `https://www.omdbapi.com/?apikey=${encodeURIComponent(API_KEY)}&s=${encodeURIComponent(termoLimpo)}`
      );
      const dados = await resposta.json();

      if (dados.Response === 'True' && Array.isArray(dados.Search)) {
        setFilmes(dados.Search);
      } else {
        setFilmes([]);
        setErro(dados.Error || 'Nenhum filme encontrado com esse nome.');
      }
    } catch {
      setFilmes([]);
      setErro('Erro ao conectar com a API da OMDb. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  function removerFilme(imdbID) {
    setFilmes((listaAtual) => listaAtual.filter((filme) => filme.imdbID !== imdbID));
  }

  return (
    <div className="pagina-container">
      <header className="topo">
        <h1 className="topo-titulo">Lista de Filmes</h1>
      </header>

      <main className="conteudo">
        <form className="barra-pesquisa" onSubmit={buscarFilmes}>
          <input
            type="text"
            className="input-filme"
            placeholder="Nome do filme..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          <button type="submit" className="botao-pesquisar">
            Pesquisar
          </button>
        </form>

        {carregando && (
          <p className="mensagem-status">Buscando filmes na OMDb...</p>
        )}

        {!carregando && erro && (
          <p className="mensagem-erro">{erro}</p>
        )}

        {!carregando && !erro && filmes.length > 0 && (
          <section className="grid-filmes">
            {filmes.map((filme) => (
              <article key={filme.imdbID} className="card-filme">
                <button
                  type="button"
                  className="botao-remover"
                  title="Remover filme da lista"
                  aria-label={`Remover ${filme.Title}`}
                  onClick={() => removerFilme(filme.imdbID)}
                >
                  ✕
                </button>

                <div className="poster-box">
                  {filme.Poster && filme.Poster !== 'N/A' ? (
                    <img
                      src={filme.Poster}
                      alt={`Poster de ${filme.Title}`}
                      className="poster-img"
                    />
                  ) : (
                    <span className="poster-placeholder">Poster</span>
                  )}
                </div>

                <h2 className="card-titulo">{filme.Title}</h2>
                <p className="card-ano">{filme.Year}</p>
              </article>
            ))}
          </section>
        )}

        {!carregando && !erro && pesquisou && filmes.length === 0 && (
          <p className="mensagem-status">Nenhum filme restante na lista.</p>
        )}
      </main>

      <footer className="rodape">
        <p className="rodape-texto">COPYRIGHT Ⓒ 2026 - SERRA JUNIOR ENGENHARIA</p>
      </footer>
    </div>
  );
}
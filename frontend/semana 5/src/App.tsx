import { lazy, Suspense, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const API_KEY = "f18f56f8";

export default () => (
  <>
    <Header />
    <Main />
    <Footer />
  </>
);

const Header = () => (
  <header className="flex flex-row justify-start items-center pl-[24px] gap-[25px] h-[97px] pl-[64px] w-full bg-[#001830] text-[36px]">
    <span>Lista de Filmes</span>
  </header>
);

const Main = () => (
  <main className="flex flex-col justify-around items-center h-full w-full gap-[32px]">
    <Search />
    <div className="flex flex-row justify-around w-[80%]" id="filmes"></div>
  </main>
);

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const callback = async () => {
    document.getElementById("filmes").innerHTML = renderToStaticMarkup(
      await Filmes({ search: searchText }),
    );
  };
  return (
    <div className="flex flex-row justify-center h-auto w-full gap-[32px]">
      <input
        className="text-[#000000] w-[60%] border-[2px] border-[#ff6600] rounded-[16px] p-[4px]"
        type="text"
        placeholder="Nome do filme..."
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button
        className="text-[#ffffff] w-[20%] bg-[#ff6600] rounded-[16px] p-[4px]"
        onClick={callback}
        type="button"
      >
        Pesquisar
      </button>
    </div>
  );
};
const Filmes = async ({ search }: { search: string }) => {
  const filmes = await fetch(
    `https://www.omdbapi.com?apikey=${API_KEY}&s=${search}`,
  );
  const json: { Poster: string; Title: string; Year: string }[] = (
    await filmes.json()
  ).Search;
  return (
    <>
      {json
        .map((f) => <Filme poster={f.Poster} title={f.Title} year={f.Year} />)
        .slice(0, 5)}
    </>
  );
};

const Filme = ({
  poster,
  title,
  year,
}: {
  poster: string;
  title: string;
  year: string;
}) => (
  <article className="flex flex-col items-center bg-[#ff6600] rounded-3xl w-[150px] h-[300px] text-[24px] p-[8px]">
    <img className="w-auto h-[200px] rounded-3xl " src={poster} alt={title} />
    <p>{title}</p>
    <small>{year}</small>
  </article>
);

const Footer = () => (
  <footer className="flex justify-center items-center h-[83px] w-full bg-[#001830] font-medium">
    COPYRIGHT © 2026 - SERRA JUNIOR ENGENHARIA
  </footer>
);

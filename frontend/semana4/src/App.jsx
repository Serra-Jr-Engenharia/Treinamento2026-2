import { useState } from "react";
import { CardMembro } from "./CardMembro";
import logoSerra from "./assets/logo-serra.png";

export function App() {
  const [membros] = useState([
    { id: 1, titulo: "Membro 1", nome: "Nome", idade: "Idade", curso: "Curso" },
    { id: 2, titulo: "Membro 2", nome: "Nome", idade: "Idade", curso: "Curso" },
    { id: 3, titulo: "Membro 3", nome: "Nome", idade: "Idade", curso: "Curso" }
  ]);

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
          COPYRIGHT Ⓒ 2025 - SERRA JUNIOR ENGENHARIA
        </p>
      </footer>
    </div>
  );
}

export default App;
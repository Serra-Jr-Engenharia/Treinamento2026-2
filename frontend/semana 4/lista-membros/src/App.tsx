export default () =>
  <>
    <Header />
    <Main />
    <Footer />
  </>


const Header = () =>
  <header className="flex flex-row justify-start items-center pl-[24px] gap-[25px] h-[97px] w-full bg-[#ff6600] text-[36px]">
    <img src="/serra_logo.png" alt="Logo da SerraJR" className="size-[58px]" /> <span>Equipe Serra Jr</span>
  </header>

const Main = () =>
  <main className="flex flex-row justify-center items-center h-auto w-full gap-[56px]">
    <Membro id={1} />
    <Membro id={2} />
    <Membro id={3} />
  </main>

const Membro = ({ id }: { id: number }) =>
  <article className="flex flex-col items-center bg-[#001830] rounded-3xl w-[336px] h-[277px] gap-[24px] text-[24px]">
    <div className="flex justify-center items-center bg-[#ff6600] -translate-y-1/2 w-[187px] h-[64px]  rounded-3xl">
      <span>Membro {id}</span>
    </div>
    <div className="h-auto w-full flex flex-col justify-center items-center gap-[16px]">
      <p>Nome</p>
      <p>Idade</p>
      <p>Curso</p>
    </div>
  </article>

const Footer = () =>
  <footer className="flex justify-center items-center h-[83px] w-full bg-[#ff6600] font-medium">
    COPYRIGHT © 2025 - SERRA JUNIOR ENGENHARIA
  </footer>

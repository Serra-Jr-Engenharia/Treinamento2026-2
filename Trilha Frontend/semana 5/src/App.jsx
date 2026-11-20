import { useEffect, useState } from 'react'
import './App.css'
import '@fontsource/poppins'; 
import '@fontsource/poppins/700.css';
export default function App() {
  const [filmes,setfilmes] = useState([]);
  
    function loadapi(){
      let url=`http://www.omdbapi.com/?apikey=fa079d2b&s=${encodeURIComponent(Nome)}`
      fetch(url)
      .then((result)=> result.json())
      .then(data=>{
        setfilmes(data.Search || [] )
      })
  }

  const [Nome,setNome] = useState("")
  function pesquisar(e){
    e.preventDefault()
    //if(!Nome){
      //return
    //}
    loadapi()
  }
  return (
    <>
      <div class="flex flex-col justify-between items-center h-screen w-screen ">
        <Header/>

        <form class="w-310.75 h-12 flex gap-5 " onSubmit={pesquisar}>
          <input type="text" class="w-249.25 h-12 border-orange-500 border rounded-4xl font-[poppins]  " placeholder='Nome do filme' value={Nome} onChange={(e)=> setNome(e.target.value)} />
          <input type='submit' class="bg-orange-500 w-66.5 font-bold font-[poppins] text-[24px] text-amber-50 h-12 rounded-4xl" value={"Pesquisar"}/>
        </form>
        <div class=" flex flex-row justify-evenly items-center h-79.5 w-full ">
          {filmes.map((item,index)=>{
            if(index > 4){
              return;
            }
          return(

            <Caixa key = {index}
              poster = {item.Poster}
              titulo = {item.Title}
              ano = {item.Year}
            />
          )})}
        </div>
        <Footer/>
      </div>
    </>
  )
}


export function Caixa(item){
  return(
        <div class=" items-center rounded-3xl bg-orange-500 h-79.5 w-57 flex justify-center">
          <ul class="flex justify-center items-center flex-col">
            <img src={item.poster} alt="poster do filme" class="w-48.5 h-57.25 object-fill rounded-3xl" />
            <li class=" font-bold font-[poppins] text-[20px] text-amber-50">{item.titulo}</li>
            <li class=" text-amber-50 font-medium font-[poppins] text-[15px]">{item.ano}</li>
          </ul>
        </div>
        )
}

export function Header(){
  return(
    <header class="  font-bold font-[poppins] text-amber-50  bg-indigo-950 w-screen h-24.25 flex items-center gap-26.5  ">
      <h1 class="text-[36px] p-5 ">Lista de Filmes</h1>
    </header>
  )
}

export function Footer(){
  return(
    <footer class="  w-screen  font-medium flex items-center justify-center bg-indigo-950 h-20.75  text-amber-50 font-[poppins]">COPYRIGHT Ⓒ 2026 - SERRA JUNIOR ENGENHARIA</footer>
  )
}

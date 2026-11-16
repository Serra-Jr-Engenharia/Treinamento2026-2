import { useState } from 'react'
import './App.css'
import '@fontsource/poppins'; 
import '@fontsource/poppins/700.css';
import Serralogo from  './logoSerra.png'
export default function App() {
  return (
    <>
      <div class="flex flex-col justify-between items-center h-screen w-screen ">
        <Header/>
        <div class="flex w-screen justify-around items-center" >
          <Caixa membro= "Membro 1" nome="Nome" idade= "Idade" curso="Curso" />
          <Caixa membro="Membro 2" nome="Nome" idade= "Idade" curso="Curso"/>
          <Caixa membro="Membro 3" nome="Nome" idade= "Idade" curso="Curso"/>
        </div>
        <Footer/>
      </div>
    </>
  )
}

export function Caixa(prop){
  return(
    <div class="flex   flex-col font-[poppins] font-bold text-amber-50 items-center justify-center w-84  h-77.25">
      <div class=" text-amber-50 w-84 h-69.25 rounded-3xl flex justify-center items-center bg-indigo-950 absolute ">
        <ul class="text-[24px] flex flex-col justify-around items-center gap-4 ">
          <li>{prop.nome}</li>
          <li>{prop.idade}</li>
          <li>{prop.curso}</li>
        </ul>
      </div>

      <div class="w-46.75 text-[24px] h-16 rounded-3xl flex justify-center items-center absolute  top-57   bg-orange-500">{prop.membro}</div>
    </div>
  )
}

export function Header(){
  return(
    <header class="  font-bold font-[poppins] text-amber-50 bg-orange-500 w-screen h-24.25 flex items-center gap-4  ">
      <img src="{Serralogo}" alt="" class="w-14.5 h-14.25" />
      <h1 class="text-[36px] p-5 ">Equipe Serra Jr</h1>
    </header>
  )
}

export function Footer(){
  return(
    <footer class="  w-screen  font-medium flex items-center justify-center bg-orange-500 h-20.75  text-amber-50 font-[poppins]">COPYRIGHT Ⓒ 2025 - SERRA JUNIOR ENGENHARIA</footer>
  )
}

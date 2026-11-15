import { motion } from "framer-motion";

export function CardMembro({ titulo, nome, idade, curso }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative w-full max-w-[336px] pt-[32px] cursor-pointer"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[187px] h-[64px] bg-[#FF6600] rounded-[22px] flex items-center justify-center shadow-md z-10">
        <h2 className="text-white font-bold text-[24px]">
          {titulo}
        </h2>
      </div>

      <div className="w-full h-[277px] bg-[#001830] rounded-[22px] flex flex-col items-center justify-center gap-4 pt-[30px] shadow-lg">
        <p className="text-white font-bold text-[24px] text-center">{nome}</p>
        <p className="text-white font-bold text-[24px] text-center">{idade}</p>
        <p className="text-white font-bold text-[24px] text-center">{curso}</p>
      </div>
    </motion.div>
  );
}
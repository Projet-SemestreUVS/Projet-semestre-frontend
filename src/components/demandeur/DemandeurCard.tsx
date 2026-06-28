interface DemandeurCardProps {
  titre?: string;
  valeur?: number;
}

export default function DemandeurCard({
  titre = "Demandeuteur",
  valeur = 800
}: DemandeurCardProps) {
  return (
    <div className="w-[310px] h-[203px] bg-gradient-to-br from-blue-800 to-blue-500 rounded-2xl shadow-lg p-6 text-white hover:scale-105 hover:shadow-2xl transition-all duration-300 border-white/20 flex-col justify-center cursor-pointer">
      
      {/* Icône user */}
      <svg 
        className="w-8 h-8 mb-3 opacity-80" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>

      {/* Titre bleu */}
      <h3 className="text-sm font-semibold uppercase tracking-wider opacity-85 mb-2 flex items-center gap-2">
        <i className="bi bi-star-fill"></i>
        {titre}
      </h3>

      {/* Chiffre */}
      <p className="text-5xl font-extrabold tracking-tight">{valeur}</p>
    </div>
  );
}
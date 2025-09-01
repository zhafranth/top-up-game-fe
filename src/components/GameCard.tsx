import { Game } from '../types/game';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
}

// Game image placeholders
const gameImages: { [key: string]: string } = {
  'Mobile Legends': 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop&crop=center',
  'Free Fire': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center',
  'PUBG Mobile': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center',
  'Genshin Impact': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
  'Honkai Impact 3rd': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
  'Call of Duty Mobile': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center',
  'default': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center'
};

export function GameCard({ game, onClick }: GameCardProps) {
  const gameImage = gameImages[game.name] || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center';
  
  return (
    <div 
      className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 border border-slate-700/50 backdrop-blur-sm"
      onClick={() => onClick(game)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-30">
        <img 
          src={gameImage} 
          alt={game.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[140px]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {game.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-purple-200 transition-colors">
                  {game.name}
                </h3>
                <p className="text-slate-400 text-xs font-medium">
                  {game.category}
                </p>
              </div>
            </div>
          </div>
          
          {game.isPopular && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
              <span>🔥</span>
              <span>Popular</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-slate-300 text-sm">
            Mulai dari
          </div>
          <div className="text-right">
            <div className="text-green-400 font-bold text-lg">
              Rp {game.minTopUp.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>
    </div>
  );
}
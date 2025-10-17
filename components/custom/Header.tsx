import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">Vagar</Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/chalets" className="text-gray-600 hover:text-gray-800">Chalets</Link></li>
            <li><Link href="/mapa" className="text-gray-600 hover:text-gray-800">Mapa</Link></li>
            <li><Link href="/experiencias" className="text-gray-600 hover:text-gray-800">Experiencias</Link></li>
            <li><Link href="/nosotros" className="text-gray-600 hover:text-gray-800">Nosotros</Link></li>
            <li><Link href="/contacto" className="text-gray-600 hover:text-gray-800">Contacto</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

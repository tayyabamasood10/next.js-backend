import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold">
          MyLogo
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8 text-lg font-medium">
          <li>
            <Link href="/" className="hover:text-yellow-300 transition">
              Home
            </Link>
          </li>

    

          <li>
            <Link href="/contact" className="hover:text-yellow-300 transition">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/blogs" className="hover:text-yellow-300 transition">
              Blogs
            </Link>
          </li>
        </ul>

        {/* Login Button */}
        <button className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
          Login
        </button>
      </div>
    </nav>
  );
}



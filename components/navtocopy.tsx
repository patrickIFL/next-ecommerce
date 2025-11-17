// /* eslint-disable no-unused-vars */
// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <header className="z-100 fixed top-0 left-0 w-full bg-gray-950 backdrop-blur-md shadow-lg">
//         <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center transition-all duration-300 ease-in-out">
//           {/* Logo / Title */}
//           <ScrollLink
//             to="home"
//             smooth={true}
//             duration={500}
//             className="text-2xl font-extrabold text-white tracking-wide cursor-pointer"
//           >
//             FULLSTACK <span className="text-gray-400">DEVELOPER</span>
//           </ScrollLink>

//           {/* Desktop Nav */}
//           <nav className="hidden sm:flex space-x-8 text-gray-200 font-medium">
//             <ScrollLink
//               to="services"
//               smooth={true}
//               duration={500}
//               className="hover:text-white transition-colors duration-300 cursor-pointer"
//             >
//               Services
//             </ScrollLink>
//             <ScrollLink
//               to="works"
//               smooth={true}
//               duration={500}
//               className="hover:text-white transition-colors duration-300 cursor-pointer"
//             >
//               Works
//             </ScrollLink>
//             <ScrollLink
//               to="about"
//               smooth={true}
//               duration={500}
//               className="hover:text-white transition-colors duration-300 cursor-pointer"
//             >
//               About
//             </ScrollLink>
//             <ScrollLink
//               to="contact"
//               smooth={true}
//               duration={500}
//               className="hover:text-white transition-colors duration-300 cursor-pointer"
//             >
//               Contact
//             </ScrollLink>
//           </nav>

          
//         </div>
//       </header>

      
//     </>
//   );
// };

// export default Navbar;
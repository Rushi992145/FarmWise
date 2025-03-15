import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [user, setuser] = useState({ name: "Anuj" });

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const navItemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (index) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const underlineVariants = {
    initial: {
      width: "0%",
      left: "50%",
      opacity: 0
    },
    hover: {
      width: "100%",
      left: "0%",
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md">
      <motion.div
        className="text-2xl font-bold text-green-600"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Farmwise
      </motion.div>

      <div className="flex space-x-6">
        {[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: "Discussion", path: "/discussion" }, { name: "About Us", path: "/about-us" }].map((item, index) => (
          <motion.div
            key={index}
            className="relative"
            initial="initial"
            whileHover="hover"
          >
            <motion.a
              href={item.path}
              className="text-gray-800 px-4 py-2 rounded-lg block"
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                scale: 1.05
              }}
            >
              {item.name}
            </motion.a>
            <motion.div
              variants={underlineVariants}
              className="absolute bottom-0 left-0 h-[2px] bg-green-600"
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {isLoggedIn ? (
          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
            <span className="material-symbols-outlined text-green-600 text-3xl">account_circle</span>
            <span className="text-gray-800 ml-2">{user.name}</span>
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-3 w-40 bg-white border border-gray-200 top-10 shadow-lg rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.a
                    href="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-green-50 rounded-t-lg"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                  >
                    Profile
                  </motion.a>
                  <motion.a
                    href="/logout"
                    className="block px-4 py-2 text-gray-800 hover:bg-green-50 rounded-b-lg"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                  >
                    Logout
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex space-x-4">
            <motion.div
              className=" text-black rounded-2xl px-4 py-2 cursor-pointer"
              whileHover={{ scale: 1.05, backgroundColor: "#22c55e" }}
            >
              <Link to='/login'>Login</Link>
            </motion.div>
            <motion.div
              className="bg-green-500 text-white rounded-2xl px-4 py-2 cursor-pointer"
              whileHover={{ scale: 1.05, backgroundColor: "#22c55e" }}
            >
              <Link to='/signup'>Signup</Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </nav>
  );
};

export default Navbar;

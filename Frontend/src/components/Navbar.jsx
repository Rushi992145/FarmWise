import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [user, setuser] = useState({ name: "Anuj" });
    const [navBg, setNavBg] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setNavBg(true);
            } else {
                setNavBg(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: "AI Sathi", path: "/aisathi", highlight: true },
        { name: "Discussion", path: "/discussion" },
        { name: "News", path: "/news" },
        { name: "About Us", path: "/about-us" }
    ];

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
        },
        active: {
            width: "100%",
            left: "0%",
            opacity: 1
        }
    };

    return (
        <motion.nav
            className='fixed top-0 w-full flex items-center justify-between p-4 transition-all duration-300 z-50 shadow-md backdrop-blur'
        >
            <Link to="/">
                <motion.div
                    className="text-2xl font-bold text-green-600"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Farmwise
                </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
                {navItems.map((item, index) => (
                    <motion.div
                        key={index}
                        className="relative"
                        initial="initial"
                        whileHover="hover"
                    >
                        <Link to={item.path}>
                            <motion.div
                                className={`px-4 py-2 rounded-lg block transition-colors duration-200
                                    ${item.highlight ? 'text-green-600 font-semibold' : 'text-gray-800'}
                                    ${location.pathname === item.path ? 'bg-green-50' : 'hover:bg-green-50'}`}
                                variants={navItemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={index}
                            >
                                {item.name}
                            </motion.div>
                        </Link>
                        <motion.div
                            variants={underlineVariants}
                            initial="initial"
                            animate={location.pathname === item.path ? "active" : "initial"}
                            className={`absolute bottom-0 h-[2px] ${item.highlight ? 'bg-green-600' : 'bg-green-500'}`}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
                className="md:hidden text-gray-700 p-2"
            >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white shadow-lg mt-2 py-4 rounded-b-2xl md:hidden"
                    >
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <motion.div
                                    className={`block px-6 py-3 ${item.highlight ? 'text-green-600 font-semibold' : 'text-gray-800'
                                        } ${location.pathname === item.path ? 'bg-green-50' : 'hover:bg-green-50'}`}
                                    variants={navItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={index}
                                >
                                    {item.name}
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Buttons */}
            <motion.div
                className="relative"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                {isLoggedIn ? (
                    <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                        <span className="material-symbols-outlined text-green-600 text-3xl">account_circle</span>
                        <span className="text-gray-800 ml-2 hidden md:inline">{user.name}</span>
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
                                    <Link to="/profile">
                                        <motion.div
                                            className="block px-4 py-2 text-gray-800 hover:bg-green-50 rounded-t-lg"
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                                        >
                                            Profile
                                        </motion.div>
                                    </Link>
                                    <Link to="/logout">
                                        <motion.div
                                            className="block px-4 py-2 text-gray-800 hover:bg-green-50 rounded-b-lg"
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                                        >
                                            Logout
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <motion.div
                            className="text-black rounded-2xl px-4 py-2 cursor-pointer"
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
        </motion.nav>
    );
};

export default Navbar;

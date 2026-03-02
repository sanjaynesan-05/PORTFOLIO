import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.webp";
import { styles } from "../styles";
import { menu, close } from "../assets";
import { navLinks } from "../constants";
import PillNav from "./PillNav";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);

      if (currentScrollY < 100 && location.pathname === "/") {
        setActive("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, location.pathname]);

  useEffect(() => {
    if (location.pathname === "/" && active !== "") {
      setActive("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sectionIds = navLinks.map((nav) => nav.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -50% 0px", threshold: 0.3 }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.unobserve(section);
      });
    };
  }, [location.pathname]);

  const handleNavClick = (title, id) => {
    setActive(title);
    setToggle(false);

    if (id === "projects" || id === "designs") {
      navigate(`/${id}`);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } else {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`
        ${styles.paddingX}
        w-full flex items-center py-4 fixed top-0 z-[100]
        transition-all duration-300 ease-in-out
        ${showNavbar ? "translate-y-0" : "-translate-y-[120%]"}
        ${lastScrollY > 100 ? "bg-primary/80 backdrop-blur-md shadow-lg" : "bg-transparent"}
      `}
    >
      <div className="w-full flex justify-center items-center max-w-7xl mx-auto">
        <PillNav
          logo={logo}
          logoAlt="Sanjay Nesan Logo"
          items={navLinks.map((nav) => ({
            href: (nav.id === "projects" || nav.id === "designs") ? `/${nav.id}` : `/#${nav.id}`,
            label: nav.title,
            onClick: (e) => {
              if (nav.id !== "projects" && nav.id !== "designs") {
                e.preventDefault();
              }
              handleNavClick(nav.title, nav.id);
            }
          }))}
          activeHref={
            (active === "projects" || active === "designs")
              ? `/${active}`
              : `/#${active}`
          }
          baseColor="#e2e8f0"
          pillColor="#090325"
          hoveredPillTextColor="#000000"
          pillTextColor="#aaa6c3"
          className="border border-white/10 shadow-xl"
        />
      </div>
    </nav>
  );
};

export default Navbar;

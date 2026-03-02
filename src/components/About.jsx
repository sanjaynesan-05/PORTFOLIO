import React from "react";
import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import ScrollReveal from "./ScrollReveal";
import DecryptedText from "./DecryptedText";
import { motion } from "framer-motion";

// 🎴 Service Card
const ServiceCard = ({ index, title, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      className="w-full sm:w-[240px] cursor-pointer"
    >
      <div className="green-pink-gradient p-[1px] rounded-[20px] shadow-card transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(191,97,255,0.4)]">
        <div className="bg-tertiary rounded-[20px] py-6 px-8 min-h-[260px] flex flex-col items-center justify-center text-center">
          <img src={icon} alt={title} className="w-16 h-16 object-contain mb-4 drop-shadow-lg" />
          <h3 className="text-white text-[18px] font-semibold">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

// 🧑‍💻 About Section
const About = () => {
  return (
    <div className="w-full relative isolate p-4">
      {/* 🌌 Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#8e44ec]/20 blur-[120px] -z-10 rounded-full pointer-events-none mix-blend-screen" />

      <div>
        <h2 className={`${styles.sectionHeadText} text-center tracking-wide`}>
          <DecryptedText
            text="About Me"
            animateOn="view"
            revealDirection="center"
            sequential
            useOriginalCharsOnly={false}
            speed={40}
            maxIterations={15}
          />
        </h2>
      </div>

      <div className="mt-6 flex justify-center w-full">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={2}
          blurStrength={4}
          containerClassName="w-full flex justify-center"
          textClassName="text-secondary text-[17px] max-w-3xl leading-[28px] text-center font-bold justify-center"
        >
          {`I’m a creative technologist blending design aesthetics with full-stack precision. With 3+ years of experience, I build seamless digital products from concept to deployment. I specialize in React, Node.js, and design tools like Figma & Adobe Suite. I love exploring new technologies, contributing to open source, and sharing knowledge. I believe the best digital work happens where logic meets imagination.`}
        </ScrollReveal>
      </div>

      {/* Cards */}
      <div className="mt-16 flex flex-wrap justify-center gap-10 relative z-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");

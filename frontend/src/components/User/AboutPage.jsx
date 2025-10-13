/* eslint-disable no-unused-vars */
import { motion, useMotionValue, useTransform } from "framer-motion";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  const imageRef = useRef(null);

  // Mouse-based rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X within image
    const y = e.clientY - rect.top; // Mouse Y within image
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateAmountX = ((y - centerY) / centerY) * -5;
    const rotateAmountY = ((x - centerX) / centerX) * 5;

    rotateX.set(rotateAmountX);
    rotateY.set(rotateAmountY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white text-black font-sans">
        {/* Hero Section */}
        <section className="text-center py-10">
          <p className="text-lg tracking-wide font-michroma">
            YOUR NEXT&nbsp;
            <TypeAnimation
              sequence={[
                "FOOTBALL",
                1000,
                "VOLLEYBALL",
                1000,
                "BASKETBALL",
                1000,
                "RUGBY",
                1000,
                // Final one stays
                "CRICKET",
                2000,
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              className="text-blue-700 font-bold animate-pulse transition-all duration-500"
            />
            &nbsp;UNIFORM...
          </p>

          {/* Model Image */}
          <div className="flex justify-center items-end my-8">
            <motion.div
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 bottom-0 left-0 right-0 -translate-y-1/2 h-[3.2cm] bg-black z-4"
            ></motion.div>

            <motion.img
              ref={imageRef}
              src="/assets/image.png"
              alt="Jersey Models"
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative max-w-full h-[600px] object-contain"
            />
          </div>

          <button
            onClick={() => navigate("/select-sport")}
            className="border border-black px-6 py-2 hover:bg-black hover:text-white transition"
          >
            Enter Our Design Studio
          </button>
        </section>

        {/* Story Section */}
        {/* Story Section */}
        <motion.section
          className="py-20 bg-gradient-to-r from-gray-50 to-blue-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Our Story
              </h2>
              <div className="text-left max-w-3xl mx-auto space-y-6">
                <p className="text-lg text-gray-700">
                  Founded in 2024 by former professional athletes and tech
                  innovators, Lambada Sports was born from a simple frustration:
                  why was it so difficult to create custom sports jerseys that
                  truly represented team identity?
                </p>
                <p className="text-lg text-gray-700">
                  We revolutionized the industry by introducing the first-ever
                  real-time 3D jersey customization platform, allowing teams and
                  individuals to visualize their designs instantly and make
                  informed decisions.
                </p>
                <p className="text-lg text-gray-700">
                  Today, we're proud to serve various teams worldwide, from
                  local clubs to professional organizations, helping them
                  express their unique identity through premium quality sports
                  apparel.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
}

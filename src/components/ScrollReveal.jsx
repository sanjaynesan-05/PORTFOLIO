import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
    children,
    scrollContainerRef,
    enableBlur = true,
    baseOpacity = 0.1,
    baseRotation = 3,
    blurStrength = 4,
    containerClassName = '',
    textClassName = '',
    rotationEnd = 'bottom bottom',
    wordAnimationEnd = 'bottom bottom'
}) => {
    const containerRef = useRef(null);

    const splitText = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        return text.split(/(\s+)/).map((word, index) => {
            if (word.match(/^\s+$/)) return word;
            return (
                <span className="word" key={index}>
                    {word}
                </span>
            );
        });
    }, [children]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

        gsap.fromTo(
            el,
            { transformOrigin: '0% 50%', rotate: baseRotation, opacity: 0 },
            {
                ease: 'power3.out',
                rotate: 0,
                opacity: 1,
                duration: 1.2,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        const wordElements = el.querySelectorAll('.word');

        gsap.fromTo(
            wordElements,
            { opacity: baseOpacity, filter: enableBlur ? `blur(${blurStrength}px)` : 'none', y: 10, willChange: 'opacity, filter, transform' },
            {
                ease: 'power2.out',
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                stagger: 0.015,
                duration: 0.8,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, blurStrength]);

    return (
        <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
            <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
        </h2>
    );
};

export default ScrollReveal;

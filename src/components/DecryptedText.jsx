import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * DecryptedText
 *
 * Effect that scrambles text before revealing it.
 */
export default function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
    ...props
}) {
    const [displayText, setDisplayText] = useState(animateOn === 'view' ? text.replace(/[^\s]/g, characters[0]) : text);
    const [isHovering, setIsHovering] = useState(false);
    const [isScrambling, setIsScrambling] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    const containerRef = useRef(null);
    const intervalRef = useRef(null);

    const startScramble = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        let currentIteration = 0;
        setIsScrambling(true);

        const getNextChar = () => {
            if (useOriginalCharsOnly) {
                return text[Math.floor(Math.random() * text.length)];
            }
            return characters[Math.floor(Math.random() * characters.length)];
        };

        intervalRef.current = setInterval(() => {
            let isDone = true;

            const newText = text.split('').map((char, index) => {
                if (char === ' ') return ' ';

                const progress = currentIteration / maxIterations;
                const totalLength = text.length;

                // Determine if this character should be revealed
                let revealCond = false;
                if (sequential) {
                    if (revealDirection === 'start') {
                        revealCond = index <= progress * totalLength;
                    } else if (revealDirection === 'end') {
                        revealCond = index >= totalLength - progress * totalLength;
                    } else if (revealDirection === 'center') {
                        const center = totalLength / 2;
                        const distance = Math.abs(index - center);
                        revealCond = distance <= (progress * totalLength) / 2;
                    }
                } else {
                    revealCond = currentIteration >= maxIterations;
                }

                if (revealCond) {
                    return char;
                }

                isDone = false;
                return getNextChar();
            });

            setDisplayText(newText.join(''));
            currentIteration++;

            if (isDone || currentIteration > maxIterations * 2) { // safety bounds
                clearInterval(intervalRef.current);
                setIsScrambling(false);
                setDisplayText(text); // Ensure final text is fully correct
            }
        }, speed);
    };

    useEffect(() => {
        if (animateOn === 'view') {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !hasAnimated) {
                            setHasAnimated(true);
                            startScramble();
                        }
                    });
                },
                { threshold: 0.1 }
            );

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => {
                if (containerRef.current) observer.unobserve(containerRef.current);
            };
        }
    }, [animateOn, hasAnimated, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

    useEffect(() => {
        if (animateOn === 'hover') {
            if (isHovering) {
                startScramble();
            } else {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setDisplayText(text);
                setIsScrambling(false);
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, [animateOn, isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

    return (
        <motion.span
            ref={containerRef}
            className={`inline-block ${parentClassName}`}
            onMouseEnter={() => animateOn === 'hover' && setIsHovering(true)}
            onMouseLeave={() => animateOn === 'hover' && setIsHovering(false)}
            {...props}
        >
            <span
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: '0',
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0,0,0,0)',
                    whiteSpace: 'nowrap',
                    border: '0',
                }}
            >
                {text}
            </span>
            <span aria-hidden="true">
                {displayText.split('').map((char, index) => {
                    const isRevealed = char === text[index] && !isScrambling;
                    return (
                        <span
                            key={index}
                            className={isRevealed ? className : encryptedClassName}
                        >
                            {char}
                        </span>
                    );
                })}
            </span>
        </motion.span>
    );
}

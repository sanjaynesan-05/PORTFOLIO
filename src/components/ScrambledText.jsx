import { useEffect, useRef, useState } from 'react';
import './ScrambledText.css';

const ScrambledText = ({
    radius = 100,
    speed = 0.5,
    scrambleChars = '.:!@#$%^&*()_+',
    className = '',
    style = {},
    children
}) => {
    const rootRef = useRef(null);
    const [chars, setChars] = useState([]);

    useEffect(() => {
        const text = typeof children === 'string' ? children : '';
        setChars(text.split('').map((char, index) => ({
            original: char,
            current: char,
            id: index
        })));
    }, [children]);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const charElements = el.querySelectorAll('.char');

            setChars(prevChars => prevChars.map((char, i) => {
                const charEl = charElements[i];
                if (!charEl) return char;

                const charRect = charEl.getBoundingClientRect();
                const charX = charRect.left + charRect.width / 2;
                const charY = charRect.top + charRect.height / 2;

                const dist = Math.hypot(mouseX - charX, mouseY - charY);

                if (dist < radius && char.original !== ' ') {
                    // Scramble
                    if (Math.random() < speed) {
                        return {
                            ...char,
                            current: scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
                        };
                    }
                    return char;
                } else {
                    // Reset
                    if (char.current !== char.original) {
                        return {
                            ...char,
                            current: char.original
                        };
                    }
                    return char;
                }
            }));
        };

        window.addEventListener('pointermove', handleMove);
        return () => window.removeEventListener('pointermove', handleMove);
    }, [radius, speed, scrambleChars]);

    return (
        <div ref={rootRef} className={`text-block ${className}`} style={style}>
            <p>
                {chars.map((char) => (
                    <span key={char.id} className="char">
                        {char.current}
                    </span>
                ))}
            </p>
        </div>
    );
};

export default ScrambledText;

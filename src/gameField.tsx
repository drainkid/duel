import { FC, useEffect, useRef, useState } from "react";
import MenuSettings from "./menuSettings.tsx";
import './styles/gamefield.css';
import './styles/settings.css'

const GameField: FC = () => {

    const y1Ref = useRef(250);
    const y2Ref = useRef(270);
    const dy1Ref = useRef(2);
    const dy2Ref = useRef(-2);


    const [points1, setPoints1] = useState(0);
    const [points2, setPoints2] = useState(0);
    const [play, setPlay] = useState(false);

    const [spellColor1, setSpellColor1] = useState("black");
    const [spellColor2, setSpellColor2] = useState("black");
    const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

    const bulletSpeed = 3;

    let bullets: { x: number, y: number, direction: 'left' | 'right' }[] = [];

    const canvasRef = useRef<HTMLCanvasElement>(null);

    //id animframe
    const requestRef = useRef<number | null>(null);


    const cursorPosition = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 800;
            canvas.height = 550;
            const context = canvas.getContext('2d');
            if (context) {
              makePlayers(context)
                canvas.addEventListener('click', handlePlayerSelect)
            }
        }
    }, []);

    useEffect(() => {
        if (play) {
            startGame();
            const shootingTimer = setInterval(makeShots, 500);
            setPoints1(0);
            setPoints2(0);


            return () => {
                clearInterval(shootingTimer);
                if (requestRef.current) {
                    cancelAnimationFrame(requestRef.current);
                }
            };
        }
    }, [play]);

    const makePlayers = (context: CanvasRenderingContext2D) => {
        if (context) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            // Рисуем игрока 1
            context.beginPath();
            context.arc(100, y1Ref.current, 35, 0, 2 * Math.PI);
            context.fillStyle = 'blue';
            context.fill();

            // Рисуем игрока 2
            context.beginPath();
            context.arc(700, y2Ref.current, 35, 0, 2 * Math.PI);
            context.fillStyle = 'red';
            context.fill();

            bullets.forEach(bullet => {
                context.beginPath();
                context.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI);
                context.fillStyle = bullet.direction === 'right' ? spellColor1 : spellColor2;
                context.fill();
            });
        }
    };

    const updateBulletPos = () => {
        const canvas = canvasRef.current;
        if (canvas){
            const context = canvas.getContext('2d');
            if (context) {
                bullets = bullets.map(bullet => ({
                    ...bullet,
                    x: bullet.direction === 'left' ? bullet.x - bulletSpeed : bullet.x + bulletSpeed
                })).filter(bullet => bullet.x > 0 && bullet.x < canvas.width);
            }
        }
    }

    const animate = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                if (y1Ref.current + 35 > context.canvas.height || y1Ref.current - 35 < 0) {
                    dy1Ref.current = -dy1Ref.current;
                }
                if (y2Ref.current + 35 > context.canvas.height || y2Ref.current - 35 < 0) {
                    dy2Ref.current = -dy2Ref.current;
                }

                y1Ref.current += dy1Ref.current;
                y2Ref.current += dy2Ref.current;

                updateBulletPos()
                makePlayers(context);
                checkCollision();
                checkCollisionWithCursor();
                requestRef.current = requestAnimationFrame(animate);
            }
        }
    };

    const handleMouseMove = (event: MouseEvent) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            cursorPosition.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        }
    };

    const checkCollisionWithCursor = () => {
        const { x, y } = cursorPosition.current;

        // Проверка столкновения с первым мячом
        if (Math.sqrt((x - 100) ** 2 + (y - y1Ref.current) ** 2) < 35) {
            dy1Ref.current = -dy1Ref.current;
        }

        // Проверка столкновения со вторым мячом
        if (Math.sqrt((x - 700) ** 2 + (y - y2Ref.current) ** 2) < 35) {
            dy2Ref.current = -dy2Ref.current;
        }
    };



    const startGame = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 800;
            canvas.height = 550;
            const context = canvas.getContext('2d');
            if (context) {

                animate();
                canvas.addEventListener('mousemove', handleMouseMove);
                canvas.addEventListener('click', handlePlayerSelect)

            }
        }
    };

    const makeShots = () => {
        // Игрок 1 стреляет
        bullets.push({ x: 135, y: y1Ref.current, direction: 'right' });
        // Игрок 2 стреляет
        bullets.push({ x: 665, y: y2Ref.current, direction: 'left' });

        if (bullets.length > 20) {
            bullets = bullets.slice(bullets.length - 20);
        }
    };

    const checkCollision = () => {
        bullets.forEach((bullet, index) => {
            if (bullet.direction === 'right' && Math.abs(bullet.x - 700) < 40 && Math.abs(bullet.y - y2Ref.current) < 35) {
                setPoints1(val => val + 1);
                bullets.splice(index, 1); // Удаляем пулю при попадании
            } else if (bullet.direction === 'left' && Math.abs(bullet.x - 100) < 40 && Math.abs(bullet.y - y1Ref.current) < 35) {
                setPoints2(val => val + 1);
                bullets.splice(index, 1); // Удаляем пулю при попадании
            }
        });
    };

    const changeSpellColor = (color:string) => {
        if (selectedPlayer === 1) {
            setSpellColor1(color);
        } else if (selectedPlayer === 2) {
            setSpellColor2(color);
        }
        setSelectedPlayer(null);
    };

    const handlePlayerSelect = (event: MouseEvent) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (Math.sqrt((x - 100) ** 2 + (y - y1Ref.current) ** 2) < 35) {
                setSelectedPlayer(1);
            } else if (Math.sqrt((x - 700) ** 2 + (y - y2Ref.current) ** 2) < 35) {
                setSelectedPlayer(2);
            } else {
                setSelectedPlayer(null);
            }
        }
    };


    return (
        <div className='field-container'>

            <div className="player_points">
                {points1}
            </div>

            <div className="player_points2">
                {points2}
            </div>

            <div className={(!play) ? 'control play' : 'control pause'}
                 onClick={() => setPlay(val => !val)}>
                <span className="left"></span>
                <span className="right"></span>
            </div>

            <canvas className='gamefield' ref={canvasRef} ></canvas>

            <MenuSettings
                selectedPlayer={selectedPlayer}
                changeSpellColor={changeSpellColor} play={play}

            />

        </div>
    );
};

export default GameField;

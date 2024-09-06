import {FC, useRef} from "react";

interface SpellColorMenuProps {
    selectedPlayer: number | null;
    changeSpellColor: (color: string) => void;
    play : boolean
    onClose: () => void;
    onApplySettings: (playerSpeed: number, bulletSpeed: number) => void;
}

const MenuSettings:FC <SpellColorMenuProps> = ({selectedPlayer, changeSpellColor, play,
 onApplySettings, onClose}) => {


    const playerSpeedRef = useRef<HTMLInputElement>(null);
    const bulletSpeedRef = useRef<HTMLInputElement>(null);

    const handleApply = () => {
        const playerSpeed = playerSpeedRef.current ? parseInt(playerSpeedRef.current.value, 10) : 2;
        const bulletSpeed = bulletSpeedRef.current ? parseInt(bulletSpeedRef.current.value, 10) : 3;
        onApplySettings(playerSpeed, bulletSpeed);
        onClose();
    };


    return (
        <>


            {!play && selectedPlayer &&

                <div className="spell-menu">
                    <p>Выберите цвет пуль для <strong> игрока {selectedPlayer}: </strong> </p>
                    <br/>
                    <button onClick={() => changeSpellColor("black")}>Черный</button>
                    <button onClick={() => changeSpellColor("green")}>Зеленый</button>
                    <button onClick={() => changeSpellColor("purple")}>Фиолетовый</button>
                    <button onClick={() => changeSpellColor("orange")}>Оранжевый</button>
                    <br/>
                    <label> Выберите скорость игроков: </label>
                    <input className={'speed-range'} type={"range"} min={2} max={10} ref={playerSpeedRef}/>
                    <label> Cкорость пуль: </label>
                    <input className={'bulletspeed'} type={"range"} min={2} max={10} ref={bulletSpeedRef}/>
                    <br/>
                    <button onClick={handleApply}>Подтвердить настройки </button>
                </div>


            }


        </>
    );
};

export default MenuSettings;




import {FC} from "react";

interface SpellColorMenuProps {
    selectedPlayer: number | null;
    changeSpellColor: (color: string) => void;
    play : boolean
}

const MenuSettings:FC <SpellColorMenuProps> = ({selectedPlayer, changeSpellColor, play}) => {


// TODO ползунки и ревью кода и баг с меню
// TODO typescrit и useRef повторить

    return (
        <>
            { !play && selectedPlayer   &&

            <div className="menu">
                <p>Select Spell Color for player {selectedPlayer}:</p>
                <button onClick={() => changeSpellColor("black")}>Black</button>
                <button onClick={() => changeSpellColor("green")}>Green</button>
                <button onClick={() => changeSpellColor("purple")}>Purple</button>
                <button onClick={() => changeSpellColor("orange")}>Оrange</button>
            </div>

            }

        </>
    );
};

export default MenuSettings;




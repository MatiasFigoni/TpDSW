import { Computer } from "../types/computer.class.ts";
import { BriefcaseBusiness, Gamepad2, } from 'lucide-react';

export interface StylesItem {
    bg: string,
    toolItem: React.JSX.Element,
}

export const getStylesComponent = (c: Computer) => {
    let styles: StylesItem;
    switch (c.category.name.toLocaleLowerCase()) {
        case 'gamer':
            styles = { bg: 'bg-blue-500/10 border-blue-500/40 text-blue-500 hover:bg-blue-500/20', toolItem: <Gamepad2 /> };
            break;
        case 'oficina':
            styles = { bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/20', toolItem: <BriefcaseBusiness /> }
            break;
        default:
            styles = { bg: '', toolItem: <></> };
            break;
    }
    return styles;
}

export const getStylesDescription = (c: Computer) => {
        let styles: StylesItem;
        switch (c.category.name.toLocaleLowerCase()) {
            case 'gamer':
                styles = { bg: 'bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider', toolItem: <Gamepad2 /> };
                break;
            case 'oficina':
                styles = { bg: 'bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider', toolItem: <BriefcaseBusiness /> }
                break;
            default:
                styles = { bg: '', toolItem: <></> };
                break;
        }
        return styles;
    }
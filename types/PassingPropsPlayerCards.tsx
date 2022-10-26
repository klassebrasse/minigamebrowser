import {IPlayer} from "./IPlayer";
import React from "react";

export interface PassingPropsPlayerCards {
    "player": IPlayer,
    "beforeButton": any,
    "afterButton": any,
    "isPlayersTurn": boolean
}
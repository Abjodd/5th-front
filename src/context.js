// src/context.js — Shared theme palettes and app context
// This file imports nothing from App.jsx or any page, breaking all circular refs.

import { createContext, useContext } from "react";

export const DARK = {
  bg:"#050A18", surface:"#0A1224", card:"#0D1630", hover:"#111D3E",
  border:"rgba(255,255,255,0.05)", text:"#EAEEF6", sub:"#7B8DB0", mute:"#3D4F6F",
  accent:"#5B9BFF", white:"#FFFFFF", done:"#1A2238", doneTxt:"#5A6A88",
  green:"#4ADE80", red:"#F87171", amber:"#FBBF24", pink:"#F472B6", purple:"#A78BFA",
  barBg:"rgba(255,255,255,0.04)",
};

export const LIGHT = {
  bg:"#F5F7FA", surface:"#FFFFFF", card:"#FFFFFF", hover:"#F0F4FF",
  border:"rgba(0,0,0,0.07)", text:"#1A2238", sub:"#5A6A88", mute:"#9CAABB",
  accent:"#3B7FE8", white:"#1A2238", done:"#F0F2F5", doneTxt:"#9CAABB",
  green:"#16A34A", red:"#DC2626", amber:"#D97706", pink:"#DB2777", purple:"#8B5CF6",
  barBg:"rgba(0,0,0,0.04)",
};

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

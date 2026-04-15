import React from 'react'

export function HoodieSVG() {
  return (
    <svg viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M55 90 L40 220 L160 220 L145 90" />
      <path d="M55 90 C55 90 60 50 100 45 C140 50 145 90 145 90" />
      <path d="M72 88 C72 88 76 60 100 56 C124 60 128 88 128 88" />
      <path d="M55 90 L25 130 L35 160 L60 125" />
      <path d="M145 90 L175 130 L165 160 L140 125" />
      <rect x="72" y="155" width="56" height="38" rx="4" />
      <line x1="40" y1="212" x2="160" y2="212" />
      <line x1="27" y1="148" x2="35" y2="155" />
      <line x1="165" y1="148" x2="173" y2="155" />
    </svg>
  )
}

export function CrewneckSVG() {
  return (
    <svg viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M58 80 L42 218 L158 218 L142 80" />
      <path d="M58 80 C58 80 68 58 100 55 C132 58 142 80 142 80" />
      <path d="M72 78 C72 78 78 65 100 63 C122 65 128 78 128 78" />
      <path d="M58 80 L22 128 L34 158 L62 120" />
      <path d="M142 80 L178 128 L166 158 L138 120" />
      <line x1="42" y1="210" x2="158" y2="210" />
      <line x1="23" y1="146" x2="33" y2="153" />
      <line x1="177" y1="146" x2="167" y2="153" />
    </svg>
  )
}

export function ZipHoodieSVG() {
  return (
    <svg viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M55 90 L40 220 L160 220 L145 90" />
      <path d="M55 90 C55 90 60 50 100 45 C140 50 145 90 145 90" />
      <path d="M72 88 C72 88 76 60 100 56 C124 60 128 88 128 88" />
      <path d="M55 90 L25 130 L35 160 L60 125" />
      <path d="M145 90 L175 130 L165 160 L140 125" />
      <line x1="100" y1="88" x2="100" y2="220" />
      <rect x="94" y="110" width="12" height="8" rx="2" />
      <line x1="40" y1="212" x2="160" y2="212" />
      <line x1="27" y1="148" x2="35" y2="155" />
      <line x1="165" y1="148" x2="173" y2="155" />
    </svg>
  )
}

export function TShirtSVG() {
  return (
    <svg viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M62 75 L45 215 L155 215 L138 75" />
      <path d="M62 75 C62 75 72 55 100 52 C128 55 138 75 138 75" />
      <path d="M75 74 C75 74 80 62 100 60 C120 62 125 74 125 74" />
      <path d="M62 75 L28 112 L42 128 L68 100" />
      <path d="M138 75 L172 112 L158 128 L132 100" />
      <line x1="29" y1="120" x2="41" y2="126" />
      <line x1="171" y1="120" x2="159" y2="126" />
    </svg>
  )
}

export function ToteBagSVG() {
  return (
    <svg viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <rect x="38" y="88" width="124" height="138" rx="6" />
      <path d="M68 88 C68 88 65 50 82 45 C90 43 94 55 94 70 L94 88" />
      <path d="M132 88 C132 88 135 50 118 45 C110 43 106 55 106 70 L106 88" />
      <rect x="60" y="115" width="80" height="55" rx="3" opacity="0.5" />
      <line x1="38" y1="200" x2="162" y2="200" />
    </svg>
  )
}

export const SILHOUETTE_MAP: Record<string, React.FC> = {
  hoodie:       HoodieSVG,
  crewneck:     CrewneckSVG,
  'zip-hoodie': ZipHoodieSVG,
  't-shirt':    TShirtSVG,
  'tote-bag':   ToteBagSVG,
}

import streamGif from './patterns/stream.gif';
import jumpstreamGif from './patterns/jumpstream.gif';
import chordjackGif from './patterns/chordjack.gif';
import handstreamGif from './patterns/handstream.gif';
import jackspeedGif from './patterns/jackspeed.gif';
import staminaGif from './patterns/stamina.gif';
import technicalGif from './patterns/technical.gif';

export const patternGifs = {
  stream: streamGif,
  jumpstream: jumpstreamGif,
  chordjack: chordjackGif,
  handstream: handstreamGif,
  jackspeed: jackspeedGif,
  stamina: staminaGif,
  technical: technicalGif,
} as const;

export type PatternGifKey = keyof typeof patternGifs;

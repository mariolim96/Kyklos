const kcoToTonne = (kco: number) => kco / 1e18;
const tonneToKco = (tonne: number) => tonne * 1e18;
const kcoToKg = (kco: number) => kco / 1e15;

export { kcoToTonne, tonneToKco, kcoToKg };

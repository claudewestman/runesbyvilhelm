import './Hero.css'

export const RUNES_TOP = 'ᚠ ᚢ ᚦ ᚬ ᚱ ᚴ ᚼ ᚾ ᛁ ᛅ ᛋ ᛏ ᛒ ᛘ ᛚ ᛦ'

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero__inner">
        <p className="hero__runes">{RUNES_TOP}</p>
        <h1 className="hero__title">Runes by Vilhelm</h1>
        <p className="hero__name">Vilhelm Westman</p>
        <Separator />
        <p className="hero__bio">
          Handcrafted rune carvings on wood – rooted in the Younger Futhark, the Eddic myths,
          and authentic Viking Age inscriptions. Every piece is unique and carries its own runic text.
        </p>
        <p className="hero__runes hero__runes--bottom">
          ᚢᛁᛚᚼᛁᛅᛚᛘᛦ · ᚴᛁᛅᚱᚦᛁ · ᚱᚢᚾᛅᛦ ᚦᛁᛋᛅᛦ
        </p>
      </div>
    </header>
  )
}

function Separator() {
  return (
    <div className="sep">
      <span className="sep__line" />
      <span className="sep__diamond" />
      <span className="sep__line" />
    </div>
  )
}

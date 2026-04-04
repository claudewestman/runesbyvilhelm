import './Hero.css'

const RUNES_TOP = 'ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ · ᚼ ᚾ ᛁ ᛅ ᛋ ᛏ ᛒ ᛘ ᛚ ᛦ'

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero__inner">
        <p className="hero__runes">{RUNES_TOP}</p>
        <h1 className="hero__title">Runor av Vilhelm</h1>
        <p className="hero__name">Vilhelm Westman</p>
        <Separator />
        <p className="hero__bio">
          Handgjorda runristningar på trä – skapade med yngre futharken, eddans berättelser
          och äkta vikingatida skrifter som grund. Varje verk är unikt och bär sin egen runtext.
        </p>
        <p className="hero__runes hero__runes--bottom">
          ᛏᚢᛚᚴᚢᚦᚱ · ᚠᚢᚦᚨᚱᚲ · ᚼᚾᛁᛅᛋᛏᛒᛘᛚᛦ
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

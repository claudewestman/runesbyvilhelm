import './About.css'

export default function About() {
  return (
    <section className="about">
      <div className="about__inner">
        <h2 className="about__title">Om konstnären</h2>
        <p className="about__text">
          Vilhelm Westman har sedan barnsben haft ett djupt intresse för historia, och i synnerhet
          vikingatiden. Under åren har han besökt otaliga fornlämningar och studerat runor och
          runskrift på nära håll – vid de verkliga stenarna.
        </p>
        <p className="about__text">
          Hans verk utgår från yngre futharken och autentiska vikingatida skrifter ur eddan.
          Varje runband är noggrant utformat och bär en meningsbärande text – inte dekorativa
          pseudo-runor. Materialet är trä, och tekniken kombinerar brännteknik med akryl.
        </p>
        <div className="about__sep">
          <span className="about__sep-line" />
          <span className="about__sep-diamond" />
          <span className="about__sep-line" />
        </div>
        <p className="about__runes">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ · ᚼ ᚾ ᛁ ᛅ ᛋ ᛏ ᛒ ᛘ ᛚ ᛦ</p>
      </div>
    </section>
  )
}

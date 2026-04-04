import './About.css'

export default function About() {
  return (
    <section className="about">
      <div className="about__inner">
        <h2 className="about__title">About the artist</h2>
        <p className="about__text">
          Vilhelm Westman has had a deep passion for history since childhood, with a particular
          fascination for the Viking Age. Over the years he has visited countless ancient sites
          and studied runes and runic inscriptions up close – at the actual stones.
        </p>
        <p className="about__text">
          His work is grounded in the Younger Futhark and authentic Viking Age texts from the Eddas.
          Every runic band is carefully composed to carry genuine meaning – not decorative
          pseudo-runes. The medium is wood, and the technique combines pyrography with acrylic paint.
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

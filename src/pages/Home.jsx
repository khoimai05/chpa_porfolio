import { Link } from "react-router-dom";
import { EXPERIENCE, SKILLS, MAIL, LINKEDIN, PORTRAIT, CERTS } from "../data.js";

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div>
            <p className="eyebrow">Purdue University · Class of 2027</p>
            <h1>Anh Cao</h1>

            <p className="lede">
              Senior at Purdue double majoring in Finance &amp; Business Analytics.
            </p>
            <div className="cta">
              <a className="solid" href={MAIL}>
                Mail
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <img src={PORTRAIT} alt="Anh Cao" />
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="home-board">
          {EXPERIENCE.map((e) => (
            <Link className="home-card" to="/experience" key={e.id}>
              <div className={`xp-shot${e.logo ? " logo" : ""}`}>
                <img src={e.img} alt="" />
              </div>
              <h3>{e.role}</h3>
              <p className="meta">{e.dates}</p>
              <p className="home-firm">{e.firm}</p>
            </Link>
          ))}
        </div>

        <section>
          <h2 className="section">Skills</h2>
          <ul className="skills-grid">
            {SKILLS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="certs">
            {CERTS.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </section>

        <section className="contact">
          <h2 className="section">Contact</h2>
          <a className="big" href={MAIL}>
            fuonganh103@gmail.com
          </a>
          <a className="big" href={LINKEDIN} target="_blank" rel="noopener">
            linkedin.com/in/anhpcao
          </a>
        </section>
      </main>
    </>
  );
}

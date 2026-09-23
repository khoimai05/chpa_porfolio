import { CERTS, EDUCATION, EXPERIENCE, LINKEDIN, MAIL, SKILLS } from "../data.js";

export default function Experience() {
  return (
    <main className="cv">
      <header className="cv-head">
        <h1>Anh Cao</h1>
        <p className="cv-line">Finance &amp; Business Analytics · Purdue University · Class of 2027</p>
        <p className="cv-contact">
          <a href={MAIL}>fuonganh103@gmail.com</a>
          <span aria-hidden="true"> · </span>
          <a href={LINKEDIN} target="_blank" rel="noopener">
            linkedin.com/in/anhpcao
          </a>
          <span aria-hidden="true"> · </span>
          West Lafayette, IN
        </p>
      </header>

      <section>
        <h2>Education</h2>
        {EDUCATION.map((ed) => (
          <article className="cv-item" key={ed.school}>
            <div className="cv-row">
              <h3>{ed.school}</h3>
              <span className="cv-dates">{ed.dates}</span>
            </div>
            <div className="cv-row">
              <p className="cv-sub">{ed.degree}</p>
              <span className="cv-place">{ed.place}</span>
            </div>
            {ed.note && <p className="cv-note">{ed.note}</p>}
          </article>
        ))}
      </section>

      <section>
        <h2>Experience</h2>
        {EXPERIENCE.map((e) => (
          <article className="cv-item" key={e.id}>
            <div className="cv-row">
              <h3>{e.firm}</h3>
              <span className="cv-dates">{e.dates}</span>
            </div>
            <div className="cv-row">
              <p className="cv-sub">{e.role}</p>
              <span className="cv-place">{e.place}</span>
            </div>
            <ul>
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        <p className="cv-skills">{SKILLS.join(" · ")}</p>
      </section>

      <section>
        <h2>Certifications</h2>
        <ul className="cv-plain">
          {CERTS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

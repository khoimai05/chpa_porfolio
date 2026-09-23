import { RESUME } from "../data.js";

export default function Resume() {
  return (
    <main className="wrap">
      <h2 className="section">Resume</h2>
      <p className="resume-intro">Finance &amp; Business Analytics at Purdue. Preview below or download the PDF.</p>
      <div className="resume-actions">
        <a href={RESUME} download>
          Download PDF →
        </a>
        <a href={RESUME} target="_blank" rel="noopener">
          Open in new tab
        </a>
      </div>
      <iframe className="resume-frame" title="Anh Cao resume" src={RESUME} />
    </main>
  );
}

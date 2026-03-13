import { BrandSeal } from "./components/brand-seal";
import { JoinForm } from "./components/join-form";
import { SocialIcon } from "./components/social-icon";
import {
  benefits,
  conditions,
  contactOptions,
  dietFeatures,
  faqs,
  footerDetails,
  footerLegal,
  footerNavigation,
  footerPrograms,
  footerSocials,
  instructors,
  liveClassHighlights,
  problems,
  programs,
  proofItems,
  stats,
  steps,
  storeProducts,
  stories,
  therapies,
  trustPoints,
  zoomBatches
} from "./content/site-data";

export default function Home() {
  const organizationName = "Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan";
  const hindiName = "ध्यान योग केंद्र एवं प्राकृतिक चिकित्सा शोध संस्थान";

  return (
    <main>
      <header className="site-header">
        <a className="brand brand-lockup" href="#top">
          <BrandSeal className="nav-seal" />
          <span>
            <strong>Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan</strong>
            <small>ध्यान योग केंद्र एवं प्राकृतिक चिकित्सा शोध संस्थान</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#conditions">Conditions</a>
          <a href="#batches">Batches</a>
          <a href="#store">Store</a>
          <a href="#join">Join</a>
        </nav>
        <a className="button button-small" href="#join">
          Start Your Wellness Journey
        </a>
      </header>

      <section className="hero section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Restore balance in your body and mind</p>
          <div className="hero-pills">
            <span>Live Zoom classes</span>
            <span>Condition-based wellness</span>
            <span>Diet and lifestyle support</span>
          </div>
          <div className="hero-brand-row">
            <BrandSeal className="hero-seal" />
            <div className="hero-brand-copy">
              <p className="hero-kicker">Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan</p>
              <p className="hero-kicker-sub">ध्यान योग केंद्र एवं प्राकृतिक चिकित्सा शोध संस्थान</p>
            </div>
          </div>
          <h1>Join personalized yoga and meditation sessions designed around your body, your condition, and your lifestyle.</h1>
          <p className="lead">
            Whether you are dealing with stress, hormone imbalance, pregnancy wellness, low energy, or a body that
            just feels out of rhythm, this platform helps you start with calm guidance and a plan that actually feels
            doable from home.
          </p>
          <div className="hero-actions">
            <a className="button" href="#join">
              Start Your Wellness Journey
            </a>
            <a className="button button-secondary" href="#programs">
              Explore Programs
            </a>
          </div>
          <p className="microcopy">Live on Zoom. Condition-based batches. Gentle support you can stay consistent with.</p>
        </div>

        <aside className="hero-card" aria-label="Member benefits">
          <div className="card-topline">This is for you if</div>
          <ul className="check-list">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
          <div className="hero-note">
            <strong>Imagine this:</strong> you start feeling calmer, lighter, and more in control because your wellness
            routine finally fits your life.
          </div>
        </aside>
      </section>

      <section className="section proof-strip" aria-label="Quick trust points">
        <div className="proof-row">
          {proofItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="section-heading narrow">
          <p className="eyebrow">About the platform</p>
          <h2>A calmer, more complete wellness platform built around classes, guidance, and everyday support.</h2>
        </div>
        <div className="about-grid">
          <div className="about-copy">
            <p>
              This is more than a yoga website. It is a guided wellness platform where students join live Zoom classes,
              follow condition-based programs, receive practical lifestyle support, and move at a pace that feels
              gentle and realistic.
            </p>
            <p>
              The goal is simple: help people feel better in their body, quieter in their mind, and more supported in
              daily life.
            </p>
          </div>
          <div className="therapy-grid">
            {therapies.map((therapy) => (
              <article className="therapy-card" key={therapy.title}>
                <h3>{therapy.title}</h3>
                <p>{therapy.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section stats-strip" aria-label="Quick highlights">
        <div className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <p className="stat-value">{stat.value}</p>
              <h2 className="stat-label">{stat.label}</h2>
              <p>{stat.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section steps-section">
        <div className="section-heading narrow">
          <p className="eyebrow">How classes work</p>
          <h2>Choose your program, tell us about your condition, and get placed into the right Zoom batch.</h2>
        </div>
        <div className="step-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <p className="step-number">{step.number}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="programs">
        <div className="section-heading">
          <p className="eyebrow">Courses and programs</p>
          <h2>Clear programs people can join right away, each built around a real wellness need.</h2>
        </div>
        <div className="program-grid">
          {programs.map((program) => (
            <article className="program-card" key={program.title}>
              <p className="program-accent">{program.accent}</p>
              <h3>{program.title}</h3>
              <p className="program-short">{program.shortDescription}</p>
              <p>{program.description}</p>
              <p className="program-for">
                <strong>Who it is for:</strong> {program.for}
              </p>
              <div className="mini-benefits">
                {program.benefits.map((benefit) => (
                  <span key={benefit}>{benefit}</span>
                ))}
              </div>
              <a className="card-cta" href="#join">
                {program.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section conditions-section" id="conditions">
        <div className="section-heading">
          <p className="eyebrow">Health conditions</p>
          <h2>Select the condition you want support with and start from there.</h2>
        </div>
        <div className="condition-grid">
          {conditions.map((condition) => (
            <article className="condition-card" key={condition.title}>
              <h3>{condition.title}</h3>
              <p>
                <strong>Symptoms:</strong> {condition.symptoms}
              </p>
              <p>
                <strong>How yoga helps:</strong> {condition.help}
              </p>
              <p>
                <strong>Available classes:</strong> {condition.classes}
              </p>
              <a className="card-cta" href="#join">
                Explore {condition.title}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section support-grid-section">
        <div className="support-grid">
          <article className="support-panel">
            <p className="eyebrow">Blood-group diet plans</p>
            <h2>Your food guidance should support your body in a simple, practical way.</h2>
            <p>
              Students also receive food support based on their blood group and health condition. The goal is not to
              make meals complicated. It is to help daily choices feel clearer and more supportive.
            </p>
            <ul className="check-list">
              {dietFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>

          <article className="support-panel">
            <p className="eyebrow">Live Zoom classes</p>
            <h2>Practice from home while still feeling guided, structured, and supported.</h2>
            <p>
              All classes are conducted live through Zoom. Students are placed into condition-based batches so the
              classes feel relevant and more focused from the beginning.
            </p>
            <ul className="check-list">
              {liveClassHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section benefits" id="benefits">
        <div className="section-heading">
          <p className="eyebrow">Why it works</p>
          <h2>Small, steady steps can change how you feel every day.</h2>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section plans-section" id="batches">
        <div className="section-heading">
          <p className="eyebrow">Zoom batches and guidance</p>
          <h2>Choose from disease-specific, common, and merged wellness batches designed around how people actually join.</h2>
        </div>
        <div className="plan-grid">
          {zoomBatches.map((batch) => (
            <article className="plan-card batch-card" key={batch.title}>
              <p className="plan-name">{batch.title}</p>
              <h3 className="batch-intro">{batch.intro}</h3>
              <p>{batch.description}</p>
              <p className="program-for">
                <strong>Who it is for:</strong> {batch.for}
              </p>
              <ul className="check-list">
                {batch.includes.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a className="button button-secondary" href="#join">
                {batch.cta}
              </a>
            </article>
          ))}
        </div>
        <div className="feature-ribbon">
          <span>Blood-group diet chart after intake</span>
          <span>Batch placement based on your condition</span>
          <span>Common wellness batches also available</span>
          <span>Live support from home on Zoom</span>
        </div>
      </section>

      <section className="section store-section" id="store">
        <div className="section-heading">
          <p className="eyebrow">Wellness store</p>
          <h2>Natural products that feel like an extension of the wellness journey, not a random shop.</h2>
        </div>
        <div className="store-grid">
          {storeProducts.map((product) => (
            <article className="store-card" key={product.title}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <a className="card-cta" href="#join">
                Shop wellness products
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section trust-section" id="trust">
        <div className="section-heading">
          <p className="eyebrow">Instructor and trust</p>
          <h2>Trust matters when someone is looking for health support. This platform is designed to feel reassuring.</h2>
        </div>
        <div className="about-grid">
          <div className="therapy-grid">
            {instructors.map((item) => (
              <article className="therapy-card" key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="trust-panel">
            <p>
              The teaching approach stays simple, caring, and condition-aware so people do not feel lost after joining.
              Every part of the journey is designed to answer the same question: does this feel trustworthy enough to
              begin with confidence?
            </p>
            <ul className="check-list">
              {trustPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section stories" id="stories">
        <div className="section-heading">
          <p className="eyebrow">What people love</p>
          <h2>Transformation stories help people feel the platform is real, supportive, and worth joining.</h2>
        </div>
        <div className="story-grid">
          {stories.map((story) => (
            <blockquote key={story}>
              <span className="quote-mark">“</span>
              {story}
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section faq-section">
        <div className="section-heading narrow">
          <p className="eyebrow">Questions you may have</p>
          <h2>You can begin gently, even if your routine has not worked before.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section join" id="join">
        <div className="join-panel">
          <div>
            <p className="eyebrow">Start today</p>
            <h2>Your body already has the power to heal. Sometimes it just needs the right guidance.</h2>
            <p>
              Fill in your details, tell us your condition, and share your blood group so we can place you into the
              right Zoom batch and guide your diet chart in a more relevant way from the beginning.
            </p>
            <div className="join-points">
              <span>Live on Zoom</span>
              <span>Condition-based batches</span>
              <span>Common and merged batches</span>
              <span>Diet chart by blood group</span>
            </div>
          </div>

          <JoinForm conditions={conditions.map((condition) => condition.title)} />
        </div>
      </section>

      <section className="section contact-section">
        <div className="section-heading narrow">
          <p className="eyebrow">Need help before joining?</p>
          <h2>You do not have to figure everything out on your own before you start.</h2>
        </div>
        <div className="contact-grid">
          {contactOptions.map((option) => (
            <article className="store-card" key={option.title}>
              <h3>{option.title}</h3>
              <p>{option.detail}</p>
              <a className="card-cta" href="#join">
                Get guidance
              </a>
            </article>
          ))}
        </div>
      </section>

      <div className="mobile-cta">
        <a className="button" href="#join">
          Join a Zoom Batch
        </a>
      </div>

      <footer className="site-footer footer-shell">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand brand-lockup">
              <BrandSeal className="footer-seal" />
              <span>
                <strong>{footerDetails.organizationName}</strong>
                <small>{footerDetails.hindiName}</small>
              </span>
            </div>
            <p className="footer-entity">{footerDetails.brandLine}</p>
            <div className="entity-chip">Registered Entity: {footerDetails.entityName}</div>
            <div className="footer-contact-list">
              <a className="footer-contact-item" href={`tel:${footerDetails.phone}`}>
                <span className="footer-item-label">Phone</span>
                <span className="footer-item-value">{footerDetails.phone}</span>
              </a>
              <a className="footer-contact-item" href={`mailto:${footerDetails.email}`}>
                <span className="footer-item-label">Email</span>
                <span className="footer-item-value">{footerDetails.email}</span>
              </a>
              <div className="footer-contact-item">
                <span className="footer-item-label">Address</span>
                <span className="footer-item-value footer-address">{footerDetails.address}</span>
              </div>
            </div>
          </div>

          <div className="footer-utility">
            <div className="footer-map">
              <p className="footer-title">Visit the center</p>
              <div className="map-card" aria-label="Organization map placeholder">
                <div className="map-grid" />
                <div className="map-pin">
                  <span className="map-pin-dot" />
                </div>
                <div className="map-label">
                  <strong>{footerDetails.organizationName}</strong>
                  <span>{footerDetails.address}</span>
                </div>
              </div>
            </div>

            <div className="footer-side">
              <div className="footer-column">
                <p className="footer-title">Programs</p>
                {footerPrograms.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="footer-column">
                <p className="footer-title">Legal</p>
                {footerLegal.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="footer-column">
                <p className="footer-title">Social</p>
                <div className="social-grid">
                  {footerSocials.map((item) => (
                    <a key={item.label} href={item.href} className="social-link">
                      <span className="social-badge">
                        <SocialIcon className="social-icon" label={item.label} />
                      </span>
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>(c) 2026 {footerDetails.organizationName}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

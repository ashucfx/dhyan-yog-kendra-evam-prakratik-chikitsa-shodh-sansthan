import Image from "next/image";
import { BrandSeal } from "./components/brand-seal";
import { JoinForm } from "./components/join-form";
import { ProgramExplorer } from "./components/program-explorer";
import { Reveal, StaggerItem, StaggerList } from "./components/reveal";
import { ScheduleView } from "./components/schedule-view";
import { SocialIcon } from "./components/social-icon";
import {
  aboutStory,
  benefits,
  brand,
  conditions,
  contactOptions,
  dietFeatures,
  faqs,
  footerDetails,
  footerLegal,
  footerPrograms,
  footerSocials,
  heroHighlights,
  heroProblems,
  instructors,
  liveClassHighlights,
  programFilters,
  programs,
  proofItems,
  schedules,
  stats,
  steps,
  storeProducts,
  stories,
  therapies,
  trustPoints,
  zoomBatches
} from "./content/site-data";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand brand-lockup" href="#top">
          <BrandSeal className="nav-seal" />
          <span>
            <strong>{brand.organizationName}</strong>
            <small>{brand.hindiName}</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#batches">Batches</a>
          <a href="#stories">Stories</a>
          <a href="#store">Store</a>
          <a href="#join">Join</a>
        </nav>
        <a className="button button-small" href="#join">
          Start Your Wellness Journey
        </a>
      </header>

      <section className="hero visual-hero" id="top">
        <div className="hero-backdrop">
          <Image src="/media/hero-yoga.jpg" alt="Woman practicing yoga at home in soft sunlight" fill priority className="hero-background-image" />
          <div className="hero-background-overlay" />
        </div>

        <div className="section hero-shell">
          <Reveal className="hero-story">
            <div className="hero-pills">
              {heroHighlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="hero-brand-row">
              <BrandSeal className="hero-seal" />
              <div className="hero-brand-copy">
                <p className="hero-kicker">{brand.organizationName}</p>
                <p className="hero-kicker-sub">{brand.hindiName}</p>
              </div>
            </div>

            <p className="eyebrow hero-eyebrow">Restore balance in your body and mind</p>
            <h1>Live yoga and meditation batches that feel personal, calming, and easy to stay with.</h1>
            <p className="lead hero-lead">
              Imagine practicing from home with a batch that actually fits your condition, your energy, and your daily
              life. From hormones and pregnancy wellness to stress, sleep, and flexibility, this platform helps you
              feel guided from day one.
            </p>

            <div className="hero-actions">
              <a className="button" href="#join">
                Join My First Batch
              </a>
              <a className="button button-ghost" href="#programs">
                Explore Programs
              </a>
            </div>

            <div className="hero-proof-strip">
              {proofItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </Reveal>

          <Reveal className="hero-side-panel" delay={0.1}>
            <div className="hero-side-card glass-card">
              <p className="card-topline">This is for you if</p>
              <ul className="check-list">
                {heroProblems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
              <div className="hero-note">
                <strong>Imagine this:</strong> you feel calmer, lighter, and more supported because your wellness
                routine finally fits real life.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section visual-proof">
        <StaggerList className="stats-grid">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <article className="stat-card">
                <p className="stat-value">{stat.value}</p>
                <h2 className="stat-label">{stat.label}</h2>
                <p>{stat.detail}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      <section className="section alternating-section" id="about">
        <div className="split-layout">
          <Reveal className="split-media">
            <div className="image-panel">
              <Image src={aboutStory.image} alt="Calm lifestyle wellness portrait" fill className="section-image" />
            </div>
          </Reveal>

          <Reveal className="split-copy" delay={0.08}>
            <p className="eyebrow">About the platform</p>
            <h2>{aboutStory.title}</h2>
            {aboutStory.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="therapy-grid compact-therapy-grid">
              {therapies.map((therapy) => (
                <article className="therapy-card" key={therapy.title}>
                  <h3>{therapy.title}</h3>
                  <p>{therapy.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section process-section">
        <div className="section-heading narrow">
          <p className="eyebrow">How your journey flows</p>
          <h2>Simple, human steps that make the whole experience feel guided instead of confusing.</h2>
        </div>
        <StaggerList className="step-grid visual-step-grid">
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <article className="step-card visual-card">
                <p className="step-number">{step.number}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      <section className="section" id="programs">
        <div className="section-heading">
          <p className="eyebrow">Programs that feel real</p>
          <h2>Every program now shows the life behind it, not just a block of text.</h2>
        </div>
        <ProgramExplorer filters={programFilters} programs={programs} />
      </section>

      <section className="section alternating-section">
        <div className="split-layout reverse-on-desktop">
          <Reveal className="split-copy">
            <p className="eyebrow">Condition support + diet guidance</p>
            <h2>Choose your concern, then get guidance that feels more relevant to your body and routine.</h2>
            <div className="condition-grid">
              {conditions.map((condition) => (
                <article className="condition-card visual-card" key={condition.title}>
                  <h3>{condition.title}</h3>
                  <p>
                    <strong>Symptoms:</strong> {condition.symptoms}
                  </p>
                  <p>
                    <strong>How yoga helps:</strong> {condition.help}
                  </p>
                  <p>
                    <strong>Classes:</strong> {condition.classes}
                  </p>
                  <a className="card-cta" href="#join">
                    Explore {condition.title}
                  </a>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className="split-media" delay={0.08}>
            <div className="stacked-panels">
              <article className="support-panel media-panel">
                <div className="panel-image-shell">
                  <Image src="/media/program-home-yoga.jpg" alt="Woman practicing yoga at home" fill className="section-image" />
                </div>
                <div className="panel-copy">
                  <p className="eyebrow">Blood-group diet plans</p>
                  <h3>Your food guidance should feel practical, not overwhelming.</h3>
                  <ul className="check-list">
                    {dietFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="support-panel media-panel">
                <div className="panel-image-shell">
                  <Image src="/media/program-meditation.jpg" alt="Meditation scene in warm natural light" fill className="section-image" />
                </div>
                <div className="panel-copy">
                  <p className="eyebrow">Live Zoom classes</p>
                  <h3>Practice from home while still feeling structured, guided, and seen.</h3>
                  <ul className="check-list">
                    {liveClassHighlights.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="batches">
        <div className="section-heading">
          <p className="eyebrow">Zoom batches that feel organized</p>
          <h2>Choose the kind of batch that matches how your life and health actually look right now.</h2>
        </div>

        <StaggerList className="plan-grid">
          {zoomBatches.map((batch) => (
            <StaggerItem key={batch.title}>
              <article className="plan-card batch-card visual-card">
                <p className="plan-name">{batch.mood}</p>
                <h3 className="batch-intro">{batch.title}</h3>
                <p className="program-short">{batch.intro}</p>
                <p>{batch.description}</p>
                <ul className="check-list">
                  {batch.includes.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a className="button button-secondary" href="#join">
                  {batch.title}
                </a>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>

        <Reveal className="schedule-strip" delay={0.08}>
          <div className="section-heading narrow">
            <p className="eyebrow">Interactive class rhythm</p>
            <h2>Preview how different Zoom schedules can feel before you even join.</h2>
          </div>
          <ScheduleView schedules={schedules} />
        </Reveal>
      </section>

      <section className="section benefits">
        <div className="section-heading narrow">
          <p className="eyebrow">Why people stay</p>
          <h2>Because it feels human, calming, and much easier to trust.</h2>
        </div>
        <StaggerList className="benefit-grid">
          {benefits.map((benefit) => (
            <StaggerItem key={benefit.title}>
              <div className="benefit-card">
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      <section className="section trust-section">
        <div className="section-heading">
          <p className="eyebrow">Instructors and trust</p>
          <h2>People trust people. Show the faces, energy, and teaching approach behind the wellness journey.</h2>
        </div>

        <StaggerList className="instructor-grid">
          {instructors.map((instructor) => (
            <StaggerItem key={instructor.name}>
              <article className="instructor-card visual-card">
                <div className="instructor-photo-shell">
                  <Image src={instructor.image} alt={instructor.name} fill className="section-image" />
                </div>
                <div className="instructor-copy">
                  <h3>{instructor.name}</h3>
                  <p>{instructor.detail}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>

        <Reveal className="trust-panel expanded-trust-panel" delay={0.1}>
          <p>
            The teaching style is designed to feel gentle, grounded, and supportive. People should not feel like they
            are entering a cold system. They should feel like they are stepping into a space where someone will guide
            them well.
          </p>
          <ul className="check-list">
            {trustPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="section stories" id="stories">
        <div className="section-heading">
          <p className="eyebrow">Real voices</p>
          <h2>Faces and names make the platform feel lived-in, trustworthy, and much more real.</h2>
        </div>
        <StaggerList className="story-grid visual-story-grid">
          {stories.map((story) => (
            <StaggerItem key={story.name}>
              <article className="story-card">
                <div className="story-avatar-shell">
                  <Image src={story.image} alt={story.name} fill className="story-avatar" />
                </div>
                <div className="story-copy">
                  <span className="quote-mark">“</span>
                  <p>{story.quote}</p>
                  <strong>{story.name}</strong>
                  <small>{story.role}</small>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      <section className="section store-section" id="store">
        <div className="section-heading">
          <p className="eyebrow">Wellness store</p>
          <h2>Products now feel like part of the brand experience, not an afterthought.</h2>
        </div>
        <StaggerList className="store-grid">
          {storeProducts.map((product) => (
            <StaggerItem key={product.title}>
              <article className="store-card visual-card product-card">
                <div className="product-image-shell">
                  <Image src={product.image} alt={product.title} fill className="product-image" />
                </div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <a className="card-cta" href="#join">
                  Explore wellness products
                </a>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      <section className="section faq-section">
        <div className="section-heading narrow">
          <p className="eyebrow">Questions people often ask</p>
          <h2>You can begin gently, even if wellness routines have felt hard to maintain before.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <Reveal key={faq.question}>
              <details className="faq-item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section join" id="join">
        <div className="join-panel join-visual-panel">
          <Reveal>
            <p className="eyebrow">Begin with your real life</p>
            <h2>Your next step should feel inviting, not heavy.</h2>
            <p>
              Fill in your concern, your blood group, and your wellness goal. We use that to guide your batch
              placement, diet chart direction, and first steps after signup.
            </p>
            <div className="join-points">
              <span>Live on Zoom</span>
              <span>Condition-aware batches</span>
              <span>Common and merged groups</span>
              <span>Diet chart by blood group</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <JoinForm conditions={conditions.map((condition) => condition.title)} />
          </Reveal>
        </div>
      </section>

      <section className="section contact-section">
        <div className="section-heading narrow">
          <p className="eyebrow">Need help before joining?</p>
          <h2>You do not have to figure out everything before taking the first step.</h2>
        </div>
        <StaggerList className="contact-grid">
          {contactOptions.map((option) => (
            <StaggerItem key={option.title}>
              <article className="store-card visual-card contact-card">
                <h3>{option.title}</h3>
                <p>{option.detail}</p>
                <a className="card-cta" href="#join">
                  Let&apos;s begin
                </a>
              </article>
            </StaggerItem>
          ))}
        </StaggerList>
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
                <a href="/admin/submissions">Admin login</a>
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

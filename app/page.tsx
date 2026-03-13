import { BrandSeal } from "./components/brand-seal";

const stats = [
  {
    value: "12+",
    label: "guided programs",
    detail: "From hormone support to better sleep and steady daily energy."
  },
  {
    value: "20 min",
    label: "simple daily practice",
    detail: "Short enough to fit real life and powerful enough to feel the shift."
  },
  {
    value: "1:1 feel",
    label: "personal guidance",
    detail: "A calm and supportive experience that feels warm from day one."
  }
];

const problems = [
  "You feel tired even after resting.",
  "Stress keeps showing up in your body.",
  "Your routine starts strong and fades out fast.",
  "You want guidance that feels personal, not generic."
];

const therapies = [
  {
    title: "Yoga therapy",
    body: "Gentle, goal-based movement that helps you improve flexibility, strength, posture, and body awareness."
  },
  {
    title: "Meditation and breathwork",
    body: "Simple practices that help quiet overthinking, regulate stress, and bring more calm into your day."
  },
  {
    title: "Naturopathy support",
    body: "A natural wellness approach that helps you build healthier habits and feel more balanced from the inside out."
  }
];

const programs = [
  {
    title: "Yoga for PCOS and PCOD",
    description:
      "Discover a supportive yoga routine that helps you work with your body, not against it. These classes help support hormone balance, ease bloating, improve energy, and make healthy weight management feel more achievable.",
    cta: "Start Feeling Better",
    accent: "Hormone support"
  },
  {
    title: "Meditation for Beginners",
    description:
      "If your mind feels busy all day, this is a simple place to begin. You will learn easy meditation practices that help you slow down, feel calmer, and stay focused without overcomplicating your routine.",
    cta: "Find My Calm",
    accent: "Calm and focus"
  },
  {
    title: "Yoga for Better Sleep",
    description:
      "When your body is tired but your mind will not switch off, these soothing sessions help you unwind. Gentle movement and breathwork help you relax deeply, sleep more peacefully, and wake up feeling refreshed.",
    cta: "Sleep More Deeply",
    accent: "Night routine"
  },
  {
    title: "Stress Relief and Emotional Balance",
    description:
      "Some days feel heavy before they even begin. This practice helps you release pressure, steady your emotions, and move through the day with more patience, clarity, and peace.",
    cta: "Release the Stress",
    accent: "Daily reset"
  },
  {
    title: "Strength and Flexibility Flow",
    description:
      "Build strength, improve posture, and loosen up stiffness in a way that feels encouraging instead of intense. You will feel more open, more capable, and more confident in your body.",
    cta: "Build My Strength",
    accent: "Move with ease"
  },
  {
    title: "Personalized Wellness Yoga",
    description:
      "Looking for something that feels made for you? This guided path helps you choose sessions around your body, your goals, and how you want to feel so it is easier to stay consistent and see progress.",
    cta: "Get My Plan",
    accent: "Made for you"
  }
];

const benefits = [
  {
    title: "Feel lighter",
    body: "Release stiffness, improve mobility, and move through the day with more ease."
  },
  {
    title: "Feel calmer",
    body: "Quiet mental overload, slow your breath, and create more peace in your routine."
  },
  {
    title: "Feel stronger",
    body: "Build flexibility, posture, and confidence with guided movement that meets you where you are."
  },
  {
    title: "Feel supported",
    body: "Follow a practice that feels warm, personal, and realistic for your life."
  }
];

const steps = [
  {
    number: "01",
    title: "Tell us what you want to change",
    body: "Better sleep, lighter periods, less stress, more strength, or steadier energy. Start with the goal that matters most to you."
  },
  {
    number: "02",
    title: "Get a practice that fits your life",
    body: "Choose simple guided sessions you can actually keep up with. No pressure, no complicated setup, no guesswork."
  },
  {
    number: "03",
    title: "Feel the shift week by week",
    body: "As your body opens up and your mind calms down, everyday life starts feeling easier, steadier, and more in your control."
  }
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    intro: "A simple first step if you want to explore before committing.",
    features: ["1 guided intro session", "Beginner breathing practice", "Goal-based class recommendations"],
    cta: "Try a Free Session"
  },
  {
    name: "Monthly Flow",
    price: "Rs 999",
    intro: "Best for building a steady habit and feeling real progress.",
    features: ["Full program access", "Live and recorded sessions", "Personalized practice suggestions"],
    cta: "Start My Monthly Plan",
    featured: true
  },
  {
    name: "Deep Support",
    price: "Rs 2499",
    intro: "For a more personal journey with closer guidance and structure.",
    features: ["Everything in Monthly Flow", "Priority support", "Progress check-ins and routine guidance"],
    cta: "Get Full Support"
  }
];

const stories = [
  "I joined because I felt tired all the time. Within a few weeks, my body felt lighter and my mornings felt easier.",
  "The meditation sessions helped me relax at night. I sleep better now and I feel more steady during the day.",
  "What I love most is how approachable everything feels. It never feels intimidating, just genuinely helpful."
];

const faqs = [
  {
    question: "Do I need any yoga experience?",
    answer: "No. The sessions are beginner-friendly and easy to follow, even if you are starting from zero."
  },
  {
    question: "What if I am not flexible?",
    answer: "That is completely fine. These classes are built to help you become more comfortable in your body, not to test how flexible you already are."
  },
  {
    question: "How much time do I need each day?",
    answer: "Most people start with about 20 minutes. Short, steady practice works far better than waiting for the perfect long session."
  },
  {
    question: "Can I choose a program for a specific health goal?",
    answer: "Yes. You can begin with hormone support, stress relief, better sleep, meditation, or strength and flexibility depending on what you need most."
  }
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand brand-lockup" href="#top">
          <BrandSeal className="nav-seal" />
          <span>
            <strong>Dhyan Yog Kendra Sansthan</strong>
            <small>Yoga, meditation and natural wellness</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#why">Why Us</a>
          <a href="#programs">Programs</a>
          <a href="#plans">Plans</a>
          <a href="#benefits">Benefits</a>
          <a href="#stories">Results</a>
          <a href="#join">Join</a>
        </nav>
        <a className="button button-small" href="#join">
          Start Your First Session
        </a>
      </header>

      <section className="hero section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Yoga. Meditation. Natural wellness.</p>
          <div className="hero-brand-row">
            <BrandSeal className="hero-seal" />
            <div className="hero-brand-copy">
              <p className="hero-kicker">ध्यान योग केन्द्र एवं प्राकृतिक चिकित्सा शोध संस्थान</p>
              <p className="hero-kicker-sub">
                A calmer mind, a stronger body, and a more natural path to feeling well.
              </p>
            </div>
          </div>
          <h1>Build a daily practice that helps you feel lighter, calmer, and more like yourself again.</h1>
          <p className="lead">
            If stress, low energy, hormone imbalance, sleep trouble, or daily tension has been wearing you down, you
            are in the right place. These guided online yoga and meditation sessions help you feel more balanced,
            more supported, and more in control of your health one gentle step at a time.
          </p>
          <div className="hero-actions">
            <a className="button" href="#programs">
              Get My Personalized Plan
            </a>
            <a className="button button-ghost" href="#plans">
              View Plans
            </a>
            <a className="button button-secondary" href="#stories">
              See Real Results
            </a>
          </div>
          <p className="microcopy">Easy to start. Gentle on your body. Designed for real life.</p>
        </div>

        <aside className="hero-card" aria-label="Member benefits">
          <div className="card-topline">This is for you if</div>
          <ul className="check-list">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
          <div className="hero-note">
            <strong>Imagine this:</strong> you finish your session feeling calmer in your head, lighter in your body,
            and more hopeful about your routine.
          </div>
        </aside>
      </section>

      <section className="section about-section" id="about">
        <div className="section-heading narrow">
          <p className="eyebrow">About the center</p>
          <h2>A warm, natural approach to better health through yoga, meditation, and mindful living.</h2>
        </div>
        <div className="about-grid">
          <div className="about-copy">
            <p>
              The logo direction sets the tone for the whole experience: stillness, growth, healing, and connection
              with nature. The website now follows that same feeling with softer colors, calmer movement, and copy that
              speaks directly to someone who wants help right now.
            </p>
            <p>
              Whether someone is coming in for hormone support, better sleep, emotional balance, or a stronger body,
              the journey should feel personal from the very first scroll.
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

      <section className="section intro" id="why">
        <div className="section-heading">
          <p className="eyebrow">A journey that fits you</p>
          <h2>You do not need to be flexible, experienced, or perfectly consistent to begin.</h2>
        </div>
        <p>
          Imagine starting your day with a calmer mind, a body that feels open instead of heavy, and a routine you
          actually look forward to. That is what these sessions are built for. Simple guidance. Real support. Results
          you can feel in your mood, your sleep, your posture, and your confidence.
        </p>
        <div className="feature-ribbon">
          <span>Live classes</span>
          <span>Recorded sessions</span>
          <span>Breathwork</span>
          <span>Meditation</span>
          <span>Goal-based plans</span>
        </div>
      </section>

      <section className="section steps-section">
        <div className="section-heading narrow">
          <p className="eyebrow">How it works</p>
          <h2>Start simply. Stay consistent. Feel the difference in everyday life.</h2>
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
          <p className="eyebrow">Popular programs</p>
          <h2>Choose the practice that matches what your body needs right now.</h2>
        </div>
        <div className="program-grid">
          {programs.map((program) => (
            <article className="program-card" key={program.title}>
              <p className="program-accent">{program.accent}</p>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <a href="#join">{program.cta}</a>
            </article>
          ))}
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

      <section className="section plans-section" id="plans">
        <div className="section-heading">
          <p className="eyebrow">Choose your pace</p>
          <h2>Pick the level of support that feels right for you.</h2>
        </div>
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className={`plan-card${plan.featured ? " featured-plan" : ""}`} key={plan.name}>
              <p className="plan-name">{plan.name}</p>
              <h3 className="plan-price">{plan.price}</h3>
              <p>{plan.intro}</p>
              <ul className="check-list">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a className={`button${plan.featured ? "" : " button-secondary"}`} href="#join">
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section stories" id="stories">
        <div className="section-heading">
          <p className="eyebrow">What people love</p>
          <h2>Simple classes. Real relief. Noticeable change.</h2>
        </div>
        <div className="story-grid">
          {stories.map((story) => (
            <blockquote key={story}>{story}</blockquote>
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
            <h2>Your first yoga session is closer than you think.</h2>
            <p>
              Choose your goal, begin with a guided practice, and enjoy a routine that helps you feel calmer,
              stronger, and more in control of your health.
            </p>
            <div className="join-points">
              <span>No experience needed</span>
              <span>Join from home</span>
              <span>Short and guided</span>
            </div>
          </div>

          <form className="signup-form">
            <label htmlFor="name">
              Your name
              <input id="name" type="text" placeholder="Enter your name" />
            </label>
            <label htmlFor="email">
              Email address
              <input id="email" type="email" placeholder="you@example.com" />
            </label>
            <label htmlFor="goal">
              Your main goal
              <select id="goal" defaultValue="Balance hormones">
                <option>Balance hormones</option>
                <option>Reduce stress</option>
                <option>Sleep better</option>
                <option>Build strength</option>
                <option>Improve focus</option>
              </select>
            </label>
            <label htmlFor="message">
              Anything you want help with?
              <input id="message" type="text" placeholder="Stress, periods, sleep, stiffness, low energy..." />
            </label>
            <button className="button" type="button">
              Let&apos;s Begin
            </button>
            <p className="microcopy">Friendly guidance, easy sessions, and a plan you can actually follow.</p>
          </form>
        </div>
      </section>

      <section className="section final-cta">
        <div className="final-cta-panel">
          <p className="eyebrow">Ready when you are</p>
          <h2>Give yourself one calm, supportive step forward today.</h2>
          <p>
            You do not need to change everything at once. Start with one session, feel the difference, and let your
            routine grow from there.
          </p>
          <div className="hero-actions">
            <a className="button" href="#join">
              Start My Free Session
            </a>
            <a className="button button-secondary" href="#programs">
              Explore Programs
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <p>Dhyan Yog Kendra Sansthan</p>
          <small>Yoga, meditation and natural wellness</small>
        </div>
        <div className="footer-links">
          <a href="#top">Back to top</a>
          <a href="#plans">Plans</a>
          <a href="#join">Join now</a>
        </div>
      </footer>
    </main>
  );
}

/**
 * program-modal.js — NutriNest Premium Program Detail Modal
 *
 * Provides a rich, accessible popup modal for program details when users click "Read More".
 * Includes:
 *  - Title & ✕ close button
 *  - Scrollable body with larger description, target audience, included features,
 *    consultation frequency, duration, expected outcomes & FAQs
 *  - Fixed bottom "Book Consultation" primary CTA
 *  - Closes on ✕ tap, backdrop click, or Escape key
 */

import { qs, qsa, on } from './utils.js';

const PROGRAM_DATA = {
  'one-on-one nutrition coaching': {
    title: 'One-on-One Nutrition Coaching',
    photos: [
      { src: '/assets/images/programs/one-on-one-1.jpg', position: 'center top' },
      { src: '/assets/images/programs/one-on-one-2.jpg', position: 'center top' }
    ],
    lead: 'The flagship 3-to-6 month personalised transformation journey, led directly by senior clinical nutritionist Megha Kiran.',
    forWho: 'Individuals dealing with PCOS, thyroid imbalances, stubborn weight stalls, pre-diabetes, digestive issues, or anyone seeking a sustainable lifetime nutrition reset.',
    duration: '3 Months / 6 Months options',
    frequency: 'Weekly 45-minute direct 1-on-1 video consultations',
    whatsIncluded: [
      'Comprehensive diagnostic bloodwork review & root-cause mapping',
      'Personalised, culture-specific meal plans updated weekly',
      'Weekly 45-minute 1-on-1 video consultations directly with Megha',
      'Continuous 6-day/week WhatsApp support for real-time guidance',
      'Dining-out survival guides & festive meal strategies',
      'Personalised supplement protocol based on verified deficiencies'
    ],
    outcomes: 'Sustained energy throughout the day, balanced blood sugar markers (HbA1c/insulin), reduced inflammation, and total nutrition independence for life.',
    faq: [
      { q: 'Will I have to eat separate meals from my family?', a: 'No. Every plan is adapted to your existing household kitchen meals and regional preferences.' },
      { q: 'Are consultations held online?', a: 'Yes. All consultations take place via secure video calls, serving clients across 10+ countries.' }
    ]
  },

  'women\'s health program': {
    title: 'Women\'s Health Program',
    lead: 'Hormone-aware nutrition designed around female physiology across every life stage.',
    forWho: 'Women navigating PCOS, irregular cycles, thyroid dysfunction, endometriosis, fertility prep, pregnancy, postpartum recovery, or perimenopause.',
    duration: '3 Months / 6 Months options',
    frequency: 'Weekly 1-on-1 consultations + cycle-phase tracking',
    whatsIncluded: [
      'Cycle-synced nutritional protocols & glycemic stabilization',
      'Thyroid & adrenal stress support meal planning',
      'Fertility preparation & trimester-specific pregnancy nutrition',
      'Postpartum recovery & lactation nutrition guidance',
      'Perimenopause metabolic rate & bone density protocols'
    ],
    outcomes: 'Regularised cycles, reduced hormonal acne & PMS symptoms, improved fertility markers, and optimal metabolic health.',
    faq: [
      { q: 'Is this suitable alongside medical treatment for PCOS?', a: 'Yes. We work in tandem with your gynaecologist or endocrinologist.' }
    ]
  },

  'child nutrition program': {
    title: 'Child Nutrition Program',
    photos: [
      '/assets/images/programs/child-nutrition-1.jpg',
      '/assets/images/programs/child-nutrition-2.jpg'
    ],
    lead: 'Building a child\'s healthy relationship with real food early, without mealtime battles.',
    forWho: 'Parents of picky eaters, children with sensory food aversion, growth lag, low immunity, or school lunchbox stress.',
    duration: '2 Months / 4 Months options',
    frequency: 'Bi-weekly parent strategy consultations + recipe swaps',
    whatsIncluded: [
      'Sensory-tolerant food expansion protocols',
      'Micronutrient-dense meal & snack ideas for growing kids',
      'Stress-free family dining strategies & boundary setting',
      'School lunchbox templates that kids actually finish'
    ],
    outcomes: 'Expanded food variety, steady growth velocity, and calm, enjoyable family mealtimes.',
    faq: [
      { q: 'Do you force children to eat vegetables?', a: 'Never. We use gentle exposure and texture-friendly combinations that feel natural.' }
    ]
  },

  'preventive care program': {
    title: 'Preventive Care Program',
    lead: 'Catching metabolic shifts in blood reports early, long before symptoms arrive.',
    forWho: 'Individuals with family history of diabetes, hypertension, or heart disease, or those noticing early biomarker drift.',
    duration: '3 Months',
    frequency: 'Weekly 1-on-1 consultations + monthly lab tracking',
    whatsIncluded: [
      'Early biomarker trend analysis (HbA1c, lipid panel, liver enzymes)',
      'Anti-inflammatory & antioxidant-rich dietary protocols',
      'Cardiovascular & liver health nutrition strategies',
      'Sustainable daily movement & sleep integration'
    ],
    outcomes: 'Normalised lab values, lower long-term disease risk, and a clear preventative roadmap.',
    faq: [
      { q: 'Can I join if my blood reports are currently normal?', a: 'Absolutely. Prevention is easiest when your body is healthy.' }
    ]
  },

  'group & cohort coaching': {
    title: 'Group & Cohort Coaching',
    lead: 'The NutriNest method, shared with a motivated group — structured, guided, and deeply accountable.',
    forWho: 'People who thrive in community settings, prefer an affordable entry point into Megha\'s coaching style, or want peer accountability alongside expert guidance.',
    duration: '6 Weeks / 12 Weeks cohort options',
    frequency: 'Weekly live group coaching sessions + shared WhatsApp support',
    whatsIncluded: [
      'Structured weekly group sessions led directly by Megha',
      'Cohort-specific meal guides & grocery shopping templates',
      'Community accountability challenges & recipe swaps',
      'Monthly Q&A open sessions and progress reviews',
      'Access to a private member resource library'
    ],
    outcomes: 'Sustainable healthy eating habits, stronger community accountability, improved energy, and measurable dietary changes at a fraction of 1-on-1 cost.',
    faq: [
      { q: 'Is the content personalised for me?', a: 'The framework is group-based, but Megha adjusts recommendations live based on participant questions and conditions.' },
      { q: 'How many people are in a cohort?', a: 'Groups are capped at 15–20 participants to ensure meaningful engagement.' }
    ]
  },

  'membership program': {
    title: 'Membership Program',
    lead: 'For the part nobody talks about — everything that happens after a program ends.',
    forWho: 'Past NutriNest clients who have completed a primary program and want ongoing structured maintenance, accountability, and seasonal updates.',
    duration: 'Monthly rolling membership',
    frequency: 'Monthly 1-on-1 check-in + continuous WhatsApp access',
    whatsIncluded: [
      'Monthly 1-on-1 video check-in with Megha',
      'Seasonal meal plan refreshes aligned with produce & lifestyle',
      'Ongoing biomarker tracking & result interpretation support',
      'Priority booking for consultations & program upgrades',
      'Exclusive member recipes, guides & course content'
    ],
    outcomes: 'Long-term weight maintenance, sustained lab markers, and a permanent healthy eating identity — supported rather than self-managed.',
    faq: [
      { q: 'Can I join without completing a prior program?', a: 'The membership is designed for clients who have already completed a NutriNest program. Reach out to discuss eligibility.' }
    ]
  },

  'corporate wellness program': {
    title: 'Corporate Wellness Program',
    lead: 'An annual wellness partnership, not a one-day health camp that gets forgotten by Monday.',
    forWho: 'HR managers, wellness leads, and leadership teams at mid-to-large companies seeking measurable workforce health improvements.',
    duration: '6-month / 12-month partnership',
    frequency: 'Monthly workshops + quarterly strategy reviews',
    whatsIncluded: [
      'Executive health assessments & individual consultations',
      'Cafeteria menu audit & healthier vending machine guidance',
      'Company-wide nutrition workshops & cooking demonstrations',
      'Quarterly employee health analytics dashboard for HR',
      'Personalised plans for high-priority or high-risk employees'
    ],
    outcomes: 'Reduced sick days, improved employee focus and energy, healthier canteen choices, and measurable wellness ROI reported quarterly.',
    faq: [
      { q: 'How many employees can participate?', a: 'Programs scale from 50 to 5,000+ employees. Delivery format is customised based on headcount and budget.' }
    ]
  },

  'institution wellness program': {
    title: 'Institution Wellness Program',
    photos: [
      { src: '/assets/images/programs/institution-wellness-1.jpg', position: 'center top' },
      { src: '/assets/images/programs/institution-wellness-2.jpg', position: 'center top' }
    ],
    lead: 'Healthier students, healthier campuses — from the hostel canteen to the classroom.',
    forWho: 'Schools, colleges, universities, and coaching institutes seeking structured nutrition programs for students, faculty, and campus dining teams.',
    duration: 'Academic year partnership (6–12 months)',
    frequency: 'Monthly on-campus sessions + canteen audit reviews',
    whatsIncluded: [
      'Hostel canteen & school dining menu transformation',
      'Student nutrition workshops & sports performance plans',
      'Faculty wellness & energy optimization sessions',
      'Parent education modules on home nutrition',
      'Exam-season brain nutrition & stress-eating guides'
    ],
    outcomes: 'Improved student energy and focus, reduced absenteeism, healthier campus food culture, and stronger faculty wellbeing.',
    faq: [
      { q: 'Do you work with private schools or government institutions?', a: 'Both. Delivery scope and budget structures are adjusted based on institution type and funding model.' }
    ]
  },

  'community wellness program': {
    title: 'Community Wellness Program',
    photos: [
      { src: '/assets/images/programs/community-wellness-1.jpg', position: 'center top' },
      { src: '/assets/images/programs/community-wellness-2.jpg', position: 'center top' }
    ],
    lead: 'Nutrition education delivered where people already gather — apartments, clubs, temples, and town halls.',
    forWho: 'Resident welfare associations, gated communities, cultural clubs, or civic groups who want accessible, practical wellness programming for their members.',
    duration: 'Single event or 3–6 month rolling program',
    frequency: 'Monthly events, cooking demos & community challenges',
    whatsIncluded: [
      'Interactive cooking demos & hands-on nutrition workshops',
      'Community health challenges & group accountability activities',
      'Family meal planning guides & seasonal recipe packs',
      'Nutrition myth-busting sessions in local language',
      'Dedicated WhatsApp community group with Megha'
    ],
    outcomes: 'Stronger community health culture, practical day-to-day dietary changes, and reduced reliance on processed convenience food.',
    faq: [
      { q: 'Can this be done in Kannada or other regional languages?', a: 'Yes. Workshops can be delivered in English, Kannada, or Hindi depending on community preference.' }
    ]
  },

  'b2b nutrition solutions': {
    title: 'B2B Nutrition Solutions',
    photos: [
      { src: '/assets/images/programs/b2b-nutrition-1.jpg', position: 'center 30%' },
      { src: '/assets/images/programs/b2b-nutrition-2.jpg', position: 'center top' }
    ],
    lead: 'Nutrition science applied to food products, digital platforms, catalogues, and health data systems.',
    forWho: 'Food brands, health-tech startups, meal kit services, and food delivery platforms needing clinical nutritionist expertise for product development or data validation.',
    duration: 'Project-based or monthly retainer',
    frequency: 'Weekly working sessions + deliverable reviews',
    whatsIncluded: [
      'Product formulation review & clinical nutritional labelling audit',
      'Health score algorithm design for food platform catalogues',
      'Recipe nutrition database curation & macro calculation',
      'Regulatory compliance guidance (FSSAI standards)',
      'Content strategy & health claim verification for marketing teams'
    ],
    outcomes: 'Credible, clinically validated nutrition data, compliant product labels, and trustworthy health claims that stand up to consumer and regulatory scrutiny.',
    faq: [
      { q: 'Do you sign NDAs for proprietary product work?', a: 'Yes, all B2B engagements are covered by a mutual NDA before any data or formulation details are shared.' }
    ]
  },

  'ngo & community health program': {
    title: 'NGO & Community Health Program',
    photos: [
      { src: '/assets/images/programs/ngo-community-1.jpg', position: 'center top' },
      { src: '/assets/images/programs/ngo-community-2.jpg', position: 'center 20%' }
    ],
    lead: 'Nutrition science applied where the need is greatest and the budget is smallest.',
    forWho: 'Non-profits, government health bodies, and grassroots organisations working on maternal nutrition, child malnutrition, or rural community wellness.',
    duration: 'Flexible — project or program based',
    frequency: 'Scheduled field visits + remote health worker training',
    whatsIncluded: [
      'Maternal & child malnutrition screening & intervention models',
      'Low-cost, locally available nutritious meal plan development',
      'Grassroots health worker training modules (ASHA/Anganwadi)',
      'Community nutrition awareness campaigns in local languages',
      'Impact measurement frameworks for donor reporting'
    ],
    outcomes: 'Improved nutritional status in target communities, trained local health workers, and measurable outcomes tied to program goals.',
    faq: [
      { q: 'Do you work pro-bono for certain NGOs?', a: 'Selective pro-bono and discounted partnerships are available for verified non-profits with documented impact goals. Reach out to discuss.' }
    ]
  },

  'special needs & neurodiverse nutrition': {
    title: 'Special Needs & Neurodiverse Nutrition',
    lead: 'Nutrition support that starts with the child in front of us — not the diagnosis.',
    forWho: 'Families of children with autism, ADHD, sensory processing disorder, cerebral palsy, or developmental delays who face significant feeding challenges.',
    duration: '3 Months / 6 Months options',
    frequency: 'Bi-weekly 1-on-1 consultations + parent guidance sessions',
    whatsIncluded: [
      'Individualised sensory food aversion & texture-progression plans',
      'Gut-brain axis & gut microbiome balancing protocols',
      'ABA-compatible mealtime behaviour strategies',
      'Micronutrient supplementation based on specific diagnostic needs',
      'Family training on adaptive feeding techniques'
    ],
    outcomes: 'Expanded safe food range, improved gut health markers, calmer mealtimes, and better nutrition supporting cognitive and behavioural development.',
    faq: [
      { q: 'Do you coordinate with our child\'s occupational therapist or paediatrician?', a: 'Yes. Collaborative care with your existing therapy team is standard practice for special needs clients.' }
    ]
  },

  'sports nutrition program': {
    title: 'Sports Nutrition Program',
    lead: 'Fuelling performance, recovery and longevity — built by a national-level athlete who understands what competition really demands.',
    forWho: 'Amateur and competitive athletes, recreational gym-goers, or active individuals who want data-backed fuelling strategies matched to their sport and training cycle.',
    duration: '3 Months / 6 Months options',
    frequency: 'Weekly 1-on-1 consultations + training-day check-ins',
    whatsIncluded: [
      'Training-phase specific periodized nutrition planning',
      'Event prep, intra-workout fuel & post-event recovery protocols',
      'Body composition & lean muscle optimisation strategies',
      'Hydration, electrolyte & endurance performance plans',
      'Supplement review — what works, what is waste, what is risk'
    ],
    outcomes: 'Improved power output, faster recovery, optimised body composition, and a nutrition system that scales with training load.',
    faq: [
      { q: 'Do you work with non-competitive athletes?', a: 'Absolutely. Whether you are training for a marathon, a local league, or just want to perform better at the gym, the framework applies.' }
    ]
  },

  'healthy recipe library': {
    title: 'Healthy Recipe Library',
    lead: 'The front door to better nutrition — 100+ whole-food recipes designed to taste good and work for your body.',
    forWho: 'Anyone looking to cook healthier without sacrificing taste, cultural identity, or family mealtimes.',
    duration: 'Always-available self-paced resource',
    frequency: 'New recipes added monthly',
    whatsIncluded: [
      '100+ Indian & global whole-food recipes with full macros',
      'Blood-sugar friendly, anti-inflammatory meal options',
      'Quick 20-minute meal ideas for busy weekdays',
      'Condition-tagged recipes (PCOS, diabetic-friendly, gut health)',
      'Festive & dining-out healthy swap guides'
    ],
    outcomes: 'A practical, delicious toolkit for eating well every day — without needing a nutrition degree or expensive ingredients.',
    faq: [
      { q: 'Are these Indian recipes?', a: 'Yes, the majority are rooted in Indian cuisine — South Indian, North Indian, and regional specialties — with some global whole-food options.' }
    ]
  }
};

let slideshowTimer = null;

export function initProgramModal() {
  ensureModalMarkup();

  const backdrop  = qs('#pmodal-backdrop');

  if (!backdrop) return;

  // Delegate click for all "Read More" buttons across the page
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-read-more, [data-program-modal]');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    // Extract title
    const card = btn.closest('.card, .card-acc, article');
    let title = btn.getAttribute('data-program-title') || btn.getAttribute('data-program');
    if (!title && card) {
      const titleEl = qs('.card-acc__title, h3, h2', card);
      if (titleEl) title = titleEl.textContent.trim();
    }

    openModal(title || 'Nutrition Program');
  });

  function openModal(titleText) {
    const normalized = (titleText || '').toLowerCase().replace(/\s+/g, ' ').trim();
    let data = PROGRAM_DATA[normalized];
    if (!data) {
      const foundKey = Object.keys(PROGRAM_DATA).find(k => normalized.includes(k) || k.includes(normalized));
      if (foundKey) data = PROGRAM_DATA[foundKey];
    }
    if (!data) data = getFallbackData(titleText);

    // Guaranteed photo fallback for Child Nutrition Program & One-on-One Coaching
    if (normalized.includes('child') && (!data.photos || !data.photos.length)) {
      data.photos = [
        '/assets/images/programs/child-nutrition-1.jpg',
        '/assets/images/programs/child-nutrition-2.jpg'
      ];
    }
    if ((normalized.includes('one') || normalized.includes('1-on-1') || normalized.includes('coaching')) && (!data.photos || !data.photos.length)) {
      data.photos = [
        { src: '/assets/images/programs/one-on-one-1.jpg', position: 'center top' },
        { src: '/assets/images/programs/one-on-one-2.jpg', position: 'center top' }
      ];
    }
    if (normalized.includes('community') && (!data.photos || !data.photos.length)) {
      data.photos = [
        { src: '/assets/images/programs/community-wellness-1.jpg', position: 'center top' },
        { src: '/assets/images/programs/community-wellness-2.jpg', position: 'center top' }
      ];
    }
    if (normalized.includes('institution') && (!data.photos || !data.photos.length)) {
      data.photos = [
        { src: '/assets/images/programs/institution-wellness-1.jpg', position: 'center top' },
        { src: '/assets/images/programs/institution-wellness-2.jpg', position: 'center top' }
      ];
    }
    if (normalized.includes('ngo') && (!data.photos || !data.photos.length)) {
      data.photos = [
        { src: '/assets/images/programs/ngo-community-1.jpg', position: 'center top' },
        { src: '/assets/images/programs/ngo-community-2.jpg', position: 'center 20%' }
      ];
    }
    if (normalized.includes('b2b') && (!data.photos || !data.photos.length)) {
      data.photos = [
        { src: '/assets/images/programs/b2b-nutrition-1.jpg', position: 'center 30%' },
        { src: '/assets/images/programs/b2b-nutrition-2.jpg', position: 'center top' }
      ];
    }

    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }

    updateModalContent(data);

    backdrop.removeAttribute('hidden');
    // Force reflow for transition
    void backdrop.offsetWidth;
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = qs('#pmodal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      backdrop.setAttribute('hidden', '');
    }, 300);
  }

  const initialCloseBtn = qs('#pmodal-close');
  if (initialCloseBtn) {
    on(initialCloseBtn, 'click', closeModal);
  }

  on(backdrop, 'click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  function updateModalContent(data) {
    const photos = data.photos || data.images || (data.photo ? [data.photo] : []);
    const headerEl = qs('.pmodal__header', backdrop);

    if (headerEl) {
      const slidesHTML = photos.length ? `
        <div class="pmodal__slideshow" aria-hidden="true">
          ${photos.map((item, idx) => {
            const src = typeof item === 'string' ? item : item.src;
            const pos = (typeof item === 'object' && item.position) ? item.position : 'center top';
            return `<div class="pmodal__slide ${idx === 0 ? 'is-active' : ''}" style="background-image: url('${src}'); background-position: ${pos};"></div>`;
          }).join('')}
          <div class="pmodal__slideshow-overlay"></div>
        </div>
      ` : '';

      headerEl.innerHTML = `
        ${slidesHTML}
        <div class="pmodal__header-content">
          <div class="pmodal__header-top">
            <h2 class="pmodal__title" id="pmodal-title">${data.title}</h2>
            <button type="button" class="pmodal__close" id="pmodal-close" aria-label="Close modal">&times;</button>
          </div>
          <p class="pmodal__lead">${data.lead}</p>
        </div>
      `;

      const closeBtn = qs('#pmodal-close', headerEl);
      if (closeBtn) {
        on(closeBtn, 'click', closeModal);
      }
    }

    if (photos.length > 1 && headerEl) {
      let currentSlide = 0;
      slideshowTimer = setInterval(() => {
        const slides = qsa('.pmodal__slide', headerEl);
        if (!slides.length) return;
        slides[currentSlide].classList.remove('is-active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('is-active');
      }, 3000);
    }

    const bodyEl = qs('#pmodal-body', backdrop);
    if (bodyEl) {
      bodyEl.innerHTML = buildModalBodyHTML(data);
    }
  }
}

function ensureModalMarkup() {
  if (qs('#pmodal-backdrop')) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'pmodal-backdrop';
  backdrop.id = 'pmodal-backdrop';
  backdrop.setAttribute('hidden', '');
  backdrop.setAttribute('aria-hidden', 'true');

  backdrop.innerHTML = `
    <div class="pmodal" role="dialog" aria-modal="true" aria-labelledby="pmodal-title">
      <div class="pmodal__header">
        <div class="pmodal__header-content">
          <div class="pmodal__header-top">
            <h2 class="pmodal__title" id="pmodal-title">Program Details</h2>
            <button type="button" class="pmodal__close" id="pmodal-close" aria-label="Close modal">&times;</button>
          </div>
        </div>
      </div>
      <div class="pmodal__body" id="pmodal-body"></div>
      <div class="pmodal__footer">
        <a class="btn btn--primary" style="width:100%; border-radius: 999px; font-weight:700;" href="/contact.html">Book Consultation</a>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
}

function buildModalBodyHTML(data) {
  return `
    <div class="pmodal__badge-grid">
      <div class="pmodal__badge">
        <strong>Duration</strong>
        <span>${data.duration}</span>
      </div>
      <div class="pmodal__badge">
        <strong>Frequency</strong>
        <span>${data.frequency}</span>
      </div>
    </div>

    <div class="pmodal__section">
      <h3 class="pmodal__section-title">Who This Program Is For</h3>
      <p style="margin:0; color:var(--ink-soft);">${data.forWho}</p>
    </div>

    <div class="pmodal__section">
      <h3 class="pmodal__section-title">What's Included</h3>
      <ul class="pmodal__list">
        ${data.whatsIncluded.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>

    <div class="pmodal__section">
      <h3 class="pmodal__section-title">Expected Outcomes & Benefits</h3>
      <p style="margin:0; color:var(--ink-soft);">${data.outcomes}</p>
    </div>

    ${data.faq && data.faq.length ? `
      <div class="pmodal__section">
        <h3 class="pmodal__section-title">Frequently Asked Questions</h3>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${data.faq.map(item => `
            <div class="pmodal__faq-item">
              <div class="pmodal__faq-q">${item.q}</div>
              <p class="pmodal__faq-a">${item.a}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function getFallbackData(titleText) {
  return {
    title: titleText,
    lead: `Comprehensive, evidence-based nutrition coaching tailored specifically for ${titleText}.`,
    forWho: 'Individuals seeking clinical guidance, sustained energy, and long-term health improvements through personalized dietary protocols.',
    duration: '3 Months / 6 Months options',
    frequency: 'Weekly 1-on-1 video consultations with Megha',
    whatsIncluded: [
      'Diagnostic biomarker & root-cause evaluation',
      'Personalised, culture-specific weekly meal plans',
      'Direct 1-on-1 consultations with Megha Kiran',
      'Continuous WhatsApp support & real-time guidance'
    ],
    outcomes: 'Improved metabolic health markers, balanced energy levels, and permanent healthy eating habits.',
    faq: [
      { q: 'How do I get started?', a: 'Book a 45-minute consultation call to discuss your goals and choose the right program structure.' }
    ]
  };
}


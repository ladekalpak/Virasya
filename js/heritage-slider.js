/**
 * VIRASYA — Digital Gateway to India's Heritage
 * Interactive Historical Eras Slider Engine
 */

// Resolve the shared asset folder relative to this script (js/ -> assets/images/),
// so the slider works from any page depth (root, newproto/, newproto/Prototype/).
const scriptUrl = (document.currentScript && document.currentScript.src) ||
    Array.from(document.getElementsByTagName('script'))
        .map(s => s.src)
        .find(src => src.includes('heritage-slider.js')) || '';
const ASSET_PREFIX = scriptUrl
    ? new URL('../assets/images/', scriptUrl).href
    : 'assets/images/';

// The built Three.js cultural atlas, copied to frontend/experience-3d/.
// Resolved the same way so it works from any page depth. The explicit
// index.html matters: the static server has no directory-index lookup, so
// a bare ".../experience-3d/" would 500.
const EXPERIENCE_3D_BASE = scriptUrl
    ? new URL('../experience-3d/index.html', scriptUrl).href
    : 'experience-3d/index.html';

/**
 * Every festival world built into the 3D atlas, in the atlas' own order.
 * `id` must match a festival id the atlas recognises — it reads it from the
 * `?festival=` query string and falls back to Diwali on anything unknown.
 * `eyebrow` and `hint` mirror the labels the atlas shows in its own world
 * switcher so the nav menu and the atlas never disagree.
 */
const FESTIVAL_WORLDS_3D = [
    { id: "diwali", name: "Diwali", eyebrow: "Festival of lights", hint: "Mandir • Ghats • Diyas" },
    { id: "holi", name: "Holi", eyebrow: "Festival of colours", hint: "Holika • Gulal • Dance" },
    { id: "eid", name: "Eid", eyebrow: "A gathering of grace", hint: "Mosque • Bazaar • Domes" },
    { id: "pongal", name: "Pongal", eyebrow: "Harvest thanksgiving", hint: "Hearth • Cattle • Kolam" },
    { id: "kumbh", name: "Kumbh Mela", eyebrow: "The sacred confluence", hint: "Sangam • Sadhus • Akhara" },
    { id: "vasant", name: "Vasant Panchami", eyebrow: "Spring radiance", hint: "Saraswati • Kites • Lotus" },
    { id: "nanda_devi", name: "Nanda Devi Yatra", eyebrow: "Himalayan pilgrimage", hint: "Mountain Shrine • Chhatri • Alpine" }
];

// Complete 8 Historical Eras Data
const ERAS_DATA = [
    {
        id: "indus-valley",
        num: "01",
        total: "08",
        title: "INDUS VALLEY CIVILIZATION",
        shortName: "Indus Valley\nCivilization",
        timelineLabel: "Indus Valley<br>Civilization",
        period: "c. 3300 – 1300 BCE",
        image: "indus_valley_ruins_1790250294801.jpg",
        alt: "Mohenjo-daro brick structures, terracotta urn, and Harappan seal",
        iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C10.5 2 9.5 3 9.5 4.5V6H7C5.9 6 5 6.9 5 8V10C5 11.5 6 12.8 7.3 13.5L8.5 20C8.7 21.1 9.6 22 10.7 22H13.3C14.4 22 15.3 21.1 15.5 20L16.7 13.5C18 12.8 19 11.5 19 10V8C19 6.9 18.1 6 17 6H14.5V4.5C14.5 3 13.5 2 12 2ZM7 8H17V10C17 11.1 16.1 12 15 12H9C7.9 12 7 11.1 7 10V8ZM9.2 14H14.8L13.7 20H10.3L9.2 14Z"/></svg>`,
        highlights: [
            {
                icon: "fa-solid fa-city",
                title: "Planned Cities",
                desc: "Advanced urban infrastructure"
            },
            {
                icon: "fa-solid fa-ring",
                title: "Trade & Craft",
                desc: "Long-distance trade and fine craftsmanship"
            },
            {
                icon: "fa-solid fa-scroll",
                title: "Ancient Script",
                desc: "Undeciphered yet fascinating"
            }
        ],
        story: "Flourishing along the Indus and Saraswati river basins, this Bronze Age civilization was celebrated for its grid-based town planning, subterranean drainage systems, standardized burnt brick architecture, and maritime docks at Lothal.",
        keySites: ["Mohenjo-daro (The Great Bath)", "Harappa (Granaries & Citadel)", "Dholavira (Water Conservation Reservoirs)", "Lothal (World's Oldest Tidal Dockyard)", "Rakhigarhi (Largest Harappan Metropolis)"],
        artifacts: ["Pashupati Seal (Proto-Shiva)", "The Dancing Girl (Lost-wax bronze statuette)", "Priest-King (Steatite sculpture)", "Terracotta Toy Carts & Beaded Carnelian Jewelry"]
    },
    {
        id: "vedic-age",
        num: "02",
        total: "08",
        title: "VEDIC AGE",
        shortName: "Vedic Age",
        timelineLabel: "Vedic Age",
        period: "c. 1500 – 600 BCE",
        image: "vedic_age_era_1790250487410.jpg",
        alt: "Vedic sages seated around sacred havan fire chanting hymns along river bank",
        iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C11.5 3.5 10 5.5 8 7C6.5 8.2 5 10 5 12.5C5 16.6 8.1 20 12 20C15.9 20 19 16.6 19 12.5C19 9.5 17 7 15 5C14.8 6.5 13.8 8 12.5 8.5C12.8 6.5 12.5 4 12 2ZM12 11C13.1 11 14 11.9 14 13C14 14.5 12.5 16 12 17C11.5 16 10 14.5 10 13C10 11.9 10.9 11 12 11Z"/></svg>`,
        highlights: [
            {
                icon: "fa-solid fa-book-open",
                title: "Sacred Vedas",
                desc: "Rig, Sama, Yajur & Atharva Veda compositions"
            },
            {
                icon: "fa-solid fa-fire-flame-curved",
                title: "Yajna & Philosophy",
                desc: "Foundations of Dharma, Karma & Upanishads"
            },
            {
                icon: "fa-solid fa-users-rays",
                title: "Sabha & Samiti",
                desc: "Early democratic village assemblies"
            }
        ],
        story: "The foundation of India's intellectual and spiritual soul. Rishis and Rishikas composed profound philosophical and astronomical hymns in archaic Sanskrit. The later Vedic epoch birthed the Upanishads, pioneering inward metaphysical inquiry into Brahman and Atman.",
        keySites: ["Brahmavarta (Saraswati River Basin)", "Kurukshetra (Battleground of Ideas)", "Hastinapur", "Kashi (Varanasi — Eternal Seat of Learning)"],
        artifacts: ["Vedic Oral Chanting Tradition (UNESCO Intangible Heritage)", "Painted Grey Ware (PGW) Pottery", "Ritual Copper Alters & Implements", "Early Upanishadic Palm Manuscripts"]
    },
    {
        id: "mauryan-era",
        num: "03",
        total: "08",
        title: "MAURYAN ERA",
        shortName: "Mauryan Era",
        timelineLabel: "Mauryan Era",
        period: "c. 322 – 185 BCE",
        image: "mauryan_era_art_1790250622358.jpg",
        alt: "Emperor Ashoka's lion capital pillar, the Great Stupa of Sanchi, royal court",
        iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 7H9L12 2ZM12 8C13.7 8 15 9.3 15 11V19H17V21H7V19H9V11C9 9.3 10.3 8 12 8ZM11 11V19H13V11C13 10.4 12.6 10 12 10C11.4 10 11 10.4 11 11ZM4 13H6V19H4V13ZM18 13H20V19H18V13Z"/></svg>`,
        highlights: [
            {
                icon: "fa-solid fa-shield-halved",
                title: "Unified Realm",
                desc: "First subcontinental empire under Chandragupta"
            },
            {
                icon: "fa-solid fa-monument",
                title: "Dhamma Edicts",
                desc: "Ashoka's moral decrees engraved on pillars"
            },
            {
                icon: "fa-solid fa-crown",
                title: "National Emblem",
                desc: "The Lion Capital of Sarnath"
            }
        ],
        story: "Guided by the statecraft master Chanakya (Kautilya), Chandragupta Maurya consolidated a vast empire. His grandson, Ashoka the Great, renounced warfare following the Kalinga War, embracing compassion, animal welfare, and global envoys of Buddhist peace.",
        keySites: ["Pataliputra (Imperial Capital, Modern Patna)", "Sanchi (The Great Stupa)", "Sarnath (Deer Park)", "Taxila (Ancient International University)"],
        artifacts: ["Lion Capital of Ashoka (Preserved at Sarnath Museum)", "Major Rock Edicts of Girnar", "Didarganj Yakshi (Polished Chunar Sandstone)", "Punch-Marked Silver Karshapana Coins"]
    },
    {
        id: "gupta-age",
        num: "04",
        total: "08",
        title: "GUPTA AGE",
        shortName: "Gupta Age",
        timelineLabel: "Gupta Age",
        period: "c. 320 – 550 CE",
        image: "gupta_golden_age_1790250763632.jpg",
        alt: "Classical Indian scholars, Aryabhata observing armillary sphere, Ajanta murals, gold coins",
        iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.2 8.3L20.8 6.2L17.5 12L22 15.5L15.6 16.5L15 23L12 17.5L9 23L8.4 16.5L2 15.5L6.5 12L3.2 6.2L9.8 8.3L12 2Z"/></svg>`,
        highlights: [
            {
                icon: "fa-solid fa-atom",
                title: "Science & Math",
                desc: "Aryabhata's discovery of Zero & solar orbits"
            },
            {
                icon: "fa-solid fa-palette",
                title: "Ajanta Murals",
                desc: "Zenith of Indian classical fresco painting"
            },
            {
                icon: "fa-solid fa-coins",
                title: "Golden Dinars",
                desc: "Peerless gold metallurgy and coin minting"
            }
        ],
        story: "Universally hailed as India's Classical Golden Age. Under Chandragupta II (Vikramaditya) and Samudragupta, peace fostered unprecedented peaks in literature (Kalidasa's Shakuntala), mathematics, astronomy, metallurgy (rustless Delhi iron pillar), and Nalanda University's rise.",
        keySites: ["Nalanda Mahavihara (World's Premier Residential University)", "Ajanta Caves (Padmapani Bodhisattva)", "Udayagiri Cave Sanctuaries", "Mehrauli Iron Pillar (Delhi)"],
        artifacts: ["Aryabhatiya Sanskrit Treatises", "Ajanta Cave 1 Fresco Paintings", "Archer-type & Lyrist-type Pure Gold Dinars", "Deogarh Dashavatara Relief Panels"]
    },
    {
        id: "medieval-india",
        num: "05",
        total: "08",
        title: "MEDIEVAL INDIA",
        shortName: "Medieval India",
        timelineLabel: "Medieval India",
        period: "c. 600 – 1526 CE",
        image: "medieval_india_era_1790250826991.jpg",
        alt: "Brihadeeswarar Temple in Thanjavur with bronze Nataraja and temple musicians",
        iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L8 8H16L12 1ZM6 9L4 15H20L18 9H6ZM3 16V22H21V16H3ZM10 18H14V22H10V18Z"/></svg>`,
        highlights: [
            {
                icon: "fa-solid fa-gopuram",
                title: "Granite Temples",
                desc: "Brihadeeswarar, Khajuraho & Konark Sun Temple"
            },
            {
                icon: "fa-solid fa-ship",
                title: "Maritime Kings",
                desc: "Chola naval expeditions across the Indian Ocean"
            },
            {
                icon: "fa-solid fa-music",
                title: "Bhakti Waves",
                desc: "Soulful poetry of Kabir, Mirabai & Alvars"
            }
        ],
        story: "An era of magnificent architectural triumphs and maritime dominion. The Imperial Cholas, Chalukyas, Rashtrakutas, and Vijayanagara Empire sculpted monolithic masterpieces from granite, forged lost-wax bronze icons like the cosmic Nataraja, and connected spice trade from Rome to China.",
        keySites: ["Brihadeeswarar Temple (Thanjavur)", "Hampi (Vijayanagara Imperial City)", "Konark Sun Temple (Odisha)", "Khajuraho Monument Complex"],
        artifacts: ["Chola Bronze Nataraja (Lord of the Cosmic Dance)", "Brihadeeswarar Vimana 80-tonne Granite Capstone", "Hampi Stone Chariot (Garuda Shrine)", "Vijayanagara Gold Varaha Coins"]
    },
    {
        id: "mughal-era",
        num: "06",
        total: "08",
        title: "MUGHAL ERA",
        shortName: "Mughal Era",
        timelineLabel: "Mughal Era",
        period: "c. 1526 – 1761 CE",
        image: "mughal_era.jpg",
        alt: "Taj Mahal in Agra, red sandstone fortresses, intricate marble jali screens",
        iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C10.5 4 8 5.5 8 8C8 10 9.5 11 10 12V21H14V12C14.5 11 16 10 16 8C16 5.5 13.5 4 12 2ZM5 14H7V21H5V14ZM17 14H19V21H17V14Z"/></svg>`,
        highlights: [
            {
                icon: "fa-solid fa-landmark-dome",
                title: "Marble Marvels",
                desc: "Taj Mahal, Red Fort, Fatehpur Sikri & Humayun's Tomb"
            },
            {
                icon: "fa-solid fa-feather-pointed",
                title: "Miniature Art",
                desc: "Imperial ateliers synthesizing Persian & Indian palettes"
            },
            {
                icon: "fa-solid fa-guitar",
                title: "Cultural Fusion",
                desc: "Ganga-Jamuni Tehzeeb, Hindustani classical ragas & Kathak"
            }
        ],
        story: "Noted for grand Indo-Islamic monumental architecture, geometric Charbagh gardens, and rich courtly arts. Emperors like Akbar, Jahangir, and Shah Jahan fostered poets, master builders, and jewelers, giving rise to sublime wonders of world heritage.",
        keySites: ["Taj Mahal & Agra Fort", "Red Fort & Chandni Chowk (Delhi)", "Fatehpur Sikri (City of Victory)", "Shalimar Gardens (Kashmir)"],
        artifacts: ["Pietra Dura Floral Marble Inlays", "Illustrated Akbarnama Manuscripts", "Kashmir Pashmina & Jamawar Shawls", "Inlaid Jade Daggers & Royal Jewelry"]
    },
    {
        id: "colonial-era",
        num: "07",
        total: "08",
        title: "COLONIAL ERA & FREEDOM STRUGGLE",
        shortName: "Colonial Era",
        timelineLabel: "Colonial Era",
        period: "c. 1757 – 1947 CE",
        image: "colonial_era.jpg",
        alt: "Victoria Memorial Kolkata, historic colonial architecture, Indian freedom movement",
        iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 8V10H22V8L12 3ZM4 11V18H6V11H4ZM9 11V18H11V11H9ZM13 11V18H15V11H13ZM18 11V18H20V11H18ZM2 19V21H22V19H2Z"/></svg>`,
        highlights: [
            {
                icon: "fa-solid fa-hand-fist",
                title: "Freedom Movement",
                desc: "Satyagraha, Ahimsa, Dandi Salt March & INA bravery"
            },
            {
                icon: "fa-solid fa-sun",
                title: "Renaissance",
                desc: "Tagore, Swami Vivekananda & national resurgence"
            },
            {
                icon: "fa-solid fa-building-columns",
                title: "Heritage Relics",
                desc: "Victoria Memorial, Gateway of India & historic railways"
            }
        ],
        story: "Two centuries of foreign rule countered by the world's most heroic mass non-violent resistance and revolutionary valour. Leaders like Mahatma Gandhi, Subhas Chandra Bose, Bhagat Singh, and Sardar Patel galvanized hundreds of millions, culminating in India's independence on August 15, 1947.",
        keySites: ["Sabarmati Ashram (Ahmedabad)", "Cellular Jail (Andaman & Nicobar Islands)", "Victoria Memorial (Kolkata)", "Gateway of India (Mumbai)"],
        artifacts: ["Khadi Charkha (Spinning Wheel of Self-Reliance)", "Rabindranath Tagore's Gitanjali Nobel Manuscript", "Original Calligraphed Constitution of India", "Dandi March Salt Relics"]
    },
    {
        id: "present-india",
        num: "08",
        total: "08",
        title: "PRESENT INDIA",
        shortName: "Present India",
        timelineLabel: "Present India",
        period: "1947 – Present",
        image: "present_india.jpg",
        alt: "India Gate illuminated with national tricolour, modern Indian culture and tech achievement",
        iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4" stroke="currentColor" stroke-width="1.5"/><line x1="5.6" y1="18.4" x2="18.4" y2="5.6" stroke="currentColor" stroke-width="1.5"/></svg>`,
        highlights: [
            {
                icon: "fa-solid fa-monument",
                title: "Living Heritage",
                desc: "42+ UNESCO World Heritage Sites preserved with reverence"
            },
            {
                icon: "fa-solid fa-rocket",
                title: "Space & Tech",
                desc: "ISRO Chandrayaan lunar landing & digital public stack"
            },
            {
                icon: "fa-solid fa-earth-asia",
                title: "Vibrant Democracy",
                desc: "1.4 billion people celebrating unity in diverse cultures"
            }
        ],
        story: "A thriving civilizational powerhouse bridging 5,000 years of timeless philosophy with 21st-century technological leadership. From deep space voyages to rural artisan revival, modern India honors its roots while shaping humanity's future.",
        keySites: ["India Gate & Kartavya Path (New Delhi)", "Varanasi Ghats (Living Continuous Civilization)", "Statue of Unity (World's Tallest Monument, Gujarat)", "Bengaluru Digital & Aerospace Hub"],
        artifacts: ["Handcrafted Indian Constitution (Nandalal Bose Illumination)", "Chandrayaan-3 Pragyan Rover Telemetry", "GI-Certified Handloom Silks (Kanchipuram & Varanasi)", "UPI Digital Ecosystem Infrastructure"]
    }
];

// Search suggestions dataset
const SEARCH_DATABASE = [
    { label: "Indus Valley Civilization", type: "Era", eraIndex: 0, icon: "fa-landmark" },
    { label: "Vedic Age & Upanishads", type: "Era", eraIndex: 1, icon: "fa-fire" },
    { label: "Mauryan Era & Ashoka", type: "Era", eraIndex: 2, icon: "fa-shield-halved" },
    { label: "Gupta Golden Age & Aryabhata", type: "Era", eraIndex: 3, icon: "fa-atom" },
    { label: "Medieval India & Chola Temples", type: "Era", eraIndex: 4, icon: "fa-gopuram" },
    { label: "Mughal Architecture & Taj Mahal", type: "Era", eraIndex: 5, icon: "fa-monument" },
    { label: "Colonial Era & Freedom Struggle", type: "Era", eraIndex: 6, icon: "fa-building-columns" },
    { label: "Present India & ISRO Milestones", type: "Era", eraIndex: 7, icon: "fa-rocket" },
    { label: "Uttarakhand — Land of the Gods", type: "State", eraIndex: 1, icon: "fa-mountain" },
    { label: "Rajasthan — Forts & Palaces", type: "State", eraIndex: 4, icon: "fa-chess-rook" },
    { label: "Gujarat — Harappan Ports & Dholavira", type: "State", eraIndex: 0, icon: "fa-compass" },
    { label: "West Bengal — Terracotta & Art", type: "State", eraIndex: 6, icon: "fa-palette" },
    { label: "Tamil Nadu — Chola Living Temples", type: "State", eraIndex: 4, icon: "fa-sun" }
];

// App State
let currentEraIndex = 0;

// DOM Elements
const timelineTrack = document.getElementById('timelineTrack');
const sliderCardsWrapper = document.getElementById('sliderCardsWrapper');
const prevBtn = document.getElementById('prevSlideBtn');
const nextBtn = document.getElementById('nextSlideBtn');
const stepperPrevBtn = document.getElementById('stepperPrevBtn');
const stepperNextBtn = document.getElementById('stepperNextBtn');
const paginationCounter = document.getElementById('paginationCounter');
const progressDotsTrack = document.getElementById('progressDotsTrack');
const searchInput = document.getElementById('heroSearchInput');
const searchSuggestions = document.getElementById('searchSuggestions');

// Modal Elements
const eraModal = document.getElementById('eraModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalHeroImg = document.getElementById('modalHeroImg');
const modalPeriod = document.getElementById('modalPeriod');
const modalTitle = document.getElementById('modalTitle');
const modalStory = document.getElementById('modalStory');
const modalSitesGrid = document.getElementById('modalSitesGrid');
const modalArtifactsGrid = document.getElementById('modalArtifactsGrid');

/**
 * 1. Initialize the Timeline Stepper Nodes
 */
function initTimelineNodes() {
    if (!timelineTrack) return;
    timelineTrack.innerHTML = '';

    // Golden connecting line
    const line = document.createElement('div');
    line.className = 'timeline-line';
    timelineTrack.appendChild(line);

    ERAS_DATA.forEach((era, index) => {
        const node = document.createElement('button');
        node.className = `timeline-node ${index === 0 ? 'active' : ''}`;
        node.setAttribute('aria-label', `Navigate to ${era.title}`);
        node.dataset.index = index;

        node.innerHTML = `
            <div class="node-circle">
                ${era.iconSvg}
            </div>
            <div class="node-label">${era.timelineLabel}</div>
        `;

        node.addEventListener('click', () => {
            goToSlide(index);
        });

        timelineTrack.appendChild(node);
    });
}

/**
 * 2. Render Cards in the 3D Slider
 */
function renderSliderCards() {
    if (!sliderCardsWrapper) return;
    sliderCardsWrapper.innerHTML = '';

    ERAS_DATA.forEach((era, index) => {
        const card = document.createElement('div');
        card.className = 'era-card';
        card.dataset.index = index;

        const highlightsHtml = era.highlights.map(h => `
            <div class="highlight-item">
                <div class="highlight-icon-wrap">
                    <i class="${h.icon}"></i>
                </div>
                <div class="highlight-title">${h.title}</div>
                <div class="highlight-desc">${h.desc}</div>
            </div>
        `).join('');

        card.innerHTML = `
            <!-- Left Media Photo -->
            <div class="card-media-col">
                <img src="${ASSET_PREFIX}${era.image}" alt="${era.alt}" class="card-media-img" loading="lazy">
                <div class="card-media-vignette"></div>
            </div>

            <!-- Right Ancient Parchment Card -->
            <div class="card-parchment-col">
                <!-- Top Corner Mandala Watermark -->
                <svg class="parchment-watermark" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
                    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="1"/>
                    <path d="M50 5 Q55 30 50 50 Q45 30 50 5 Z M50 95 Q55 70 50 50 Q45 70 50 95 Z M5 50 Q30 55 50 50 Q30 45 5 50 Z M95 50 Q70 55 50 50 Q70 45 95 50 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M18 18 Q35 35 50 50 Q35 35 18 18 Z M82 18 Q65 35 50 50 Q65 35 82 18 Z M18 82 Q35 65 50 50 Q35 65 18 82 Z M82 82 Q65 65 50 50 Q65 65 82 82 Z" fill="none" stroke="currentColor" stroke-width="0.8"/>
                </svg>

                <div class="parchment-inner-border"></div>

                <div class="parchment-top">
                    <div class="era-kicker">ERA ${era.num} / ${era.total}</div>
                    <h3 class="era-title">${era.title}</h3>
                    <div class="era-ornament-divider">
                        <div class="ornament-line"></div>
                        <span class="ornament-diamond">❖</span>
                        <div class="ornament-line"></div>
                    </div>
                    <div class="era-period">${era.period}</div>
                </div>

                <div class="era-highlights-grid">
                    ${highlightsHtml}
                </div>

                <button class="explore-era-btn" data-index="${index}" aria-label="Explore details for ${era.title}">
                    Explore Era <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `;

        // Click on preview card to make it active
        card.addEventListener('click', (e) => {
            if (e.target.closest('.explore-era-btn')) {
                openEraModal(index);
                return;
            }
            if (index !== currentEraIndex) {
                goToSlide(index);
            }
        });

        sliderCardsWrapper.appendChild(card);
    });

    updateCardPositions();
}

/**
 * 3. Update 3D Positions of Slider Cards
 */
function updateCardPositions() {
    const cards = document.querySelectorAll('.era-card');
    const total = ERAS_DATA.length;

    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next', 'hidden-left', 'hidden-right');

        if (index === currentEraIndex) {
            card.classList.add('active');
        } else if (index === (currentEraIndex - 1 + total) % total) {
            card.classList.add('prev');
        } else if (index === (currentEraIndex + 1) % total) {
            card.classList.add('next');
        } else if (index < currentEraIndex) {
            card.classList.add('hidden-left');
        } else {
            card.classList.add('hidden-right');
        }
    });

    // Update Stepper Nodes
    const nodes = document.querySelectorAll('.timeline-node');
    nodes.forEach((node, idx) => {
        if (idx === currentEraIndex) {
            node.classList.add('active');
            // Auto scroll active node into view on mobile
            node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            node.classList.remove('active');
        }
    });

    // Update Pagination & Progress Dots
    updatePagination();
}

/**
 * 4. Progress Dots & Counter
 */
function initProgressDots() {
    if (!progressDotsTrack) return;
    progressDotsTrack.innerHTML = '';

    ERAS_DATA.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `progress-dot ${idx === 0 ? 'active' : ''}`;
        dot.dataset.index = idx;
        dot.setAttribute('title', `Go to Era ${idx + 1}`);

        dot.addEventListener('click', () => {
            goToSlide(idx);
        });

        progressDotsTrack.appendChild(dot);
    });
}

function updatePagination() {
    const cur = ERAS_DATA[currentEraIndex];
    if (paginationCounter) {
        paginationCounter.textContent = `${cur.num} / ${cur.total}`;
    }

    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
        if (idx === currentEraIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * 5. Slide Navigation Handlers
 */
function goToSlide(index) {
    const total = ERAS_DATA.length;
    currentEraIndex = (index + total) % total;
    updateCardPositions();
}

function nextSlide() {
    goToSlide(currentEraIndex + 1);
}

function prevSlide() {
    goToSlide(currentEraIndex - 1);
}

if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (stepperPrevBtn) stepperPrevBtn.addEventListener('click', prevSlide);
if (stepperNextBtn) stepperNextBtn.addEventListener('click', nextSlide);

// Keyboard arrow navigation
window.addEventListener('keydown', (e) => {
    if (eraModal && eraModal.classList.contains('open')) {
        if (e.key === 'Escape') closeEraModal();
        return;
    }
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Touch swipe gestures on mobile
let touchStartX = 0;
let touchEndX = 0;

if (sliderCardsWrapper) {
    sliderCardsWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderCardsWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const threshold = 40;
    if (touchEndX < touchStartX - threshold) {
        nextSlide();
    } else if (touchEndX > touchStartX + threshold) {
        prevSlide();
    }
}

/**
 * 6. Interactive Modal Popup
 */
function openEraModal(index) {
    const era = ERAS_DATA[index];
    if (!era || !eraModal) return;

    modalHeroImg.src = `${ASSET_PREFIX}${era.image}`;
    modalHeroImg.alt = era.alt;
    modalPeriod.textContent = era.period;
    modalTitle.textContent = era.title;
    modalStory.textContent = era.story;

    modalSitesGrid.innerHTML = era.keySites.map(site => `
        <div class="modal-tag"><i class="fa-solid fa-map-pin"></i> ${site}</div>
    `).join('');

    modalArtifactsGrid.innerHTML = era.artifacts.map(art => `
        <div class="modal-tag"><i class="fa-solid fa-gem"></i> ${art}</div>
    `).join('');

    eraModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeEraModal() {
    if (!eraModal) return;
    eraModal.classList.remove('open');
    document.body.style.overflow = '';
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeEraModal);
if (eraModal) {
    eraModal.addEventListener('click', (e) => {
        if (e.target === eraModal) closeEraModal();
    });
}

/**
 * 7. Search Bar Autocomplete & Filter
 */
if (searchInput && searchSuggestions) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            searchSuggestions.classList.remove('visible');
            searchSuggestions.innerHTML = '';
            return;
        }

        const matches = SEARCH_DATABASE.filter(item =>
            item.label.toLowerCase().includes(query) || item.type.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            searchSuggestions.innerHTML = matches.map(m => `
                <div class="suggestion-item" data-era="${m.eraIndex}">
                    <i class="fa-solid ${m.icon}"></i>
                    <span><strong>${m.label}</strong> &bull; <small style="opacity:0.7">${m.type}</small></span>
                </div>
            `).join('');
            searchSuggestions.classList.add('visible');

            // Click suggestion
            searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const eraIdx = parseInt(item.dataset.era, 10);
                    goToSlide(eraIdx);
                    searchSuggestions.classList.remove('visible');
                    searchInput.value = '';

                    // Smooth scroll to timeline
                    const journeySection = document.getElementById('journey');
                    if (journeySection) {
                        journeySection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        } else {
            searchSuggestions.innerHTML = `
                <div class="suggestion-item" style="opacity:0.6; cursor:default;">
                    <span>No heritage items found for "${e.target.value}"</span>
                </div>
            `;
            searchSuggestions.classList.add('visible');
        }
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero-search-container')) {
            searchSuggestions.classList.remove('visible');
        }
    });
}

/**
 * 8. Golden Dust Particle Canvas for Ambient Indian Sunset Atmosphere
 */
function initSparksCanvas() {
    const canvas = document.getElementById('heroSparksCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    });

    const particles = [];
    const count = 45;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.8,
            speedY: -Math.random() * 0.45 - 0.15,
            speedX: (Math.random() - 0.5) * 0.35,
            alpha: Math.random() * 0.7 + 0.2,
            fadeSpeed: Math.random() * 0.008 + 0.002
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.alpha += Math.sin(Date.now() * 0.002) * 0.005;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 215, 130, ${Math.max(0.1, Math.min(0.85, p.alpha))})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * 9. State Category Pills Handlers
 */
function initStatePills() {
    const pills = document.querySelectorAll('.state-pill');
    if (!pills.length) return;

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const stateName = pill.dataset.state;
            const searchInput = document.getElementById('heroSearchInput');
            if (searchInput && stateName !== 'All') {
                searchInput.value = stateName;
                searchInput.dispatchEvent(new Event('input'));
            } else if (searchInput && stateName === 'All') {
                searchInput.value = '';
                const searchSuggestions = document.getElementById('searchSuggestions');
                if (searchSuggestions) searchSuggestions.classList.remove('visible');
            }
        });
    });
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
    initTimelineNodes();
    initProgressDots();
    renderSliderCards();
    initSparksCanvas();
    initStatePills();
});

/**
 * VIRASYA — The Mahabharata Chronicles section
 * Book light that cycles through important moments + complete-text reader
 */
(function () {
    const MOMENTS = [
        {
            chip: "The Dice Game", parva: "SABHA PARVA", title: "The Game of Dice",
            text: "Shakuni's rigged dice win Yudhishthira's kingdom, his brothers, himself and finally Draupadi. Her humiliation in the royal court becomes the wound that only war can heal."
        },
        {
            chip: "Krishna's Peace Mission", parva: "UDYOGA PARVA", title: "Five Villages for Peace",
            text: "Krishna travels to Hastinapura and asks for just five villages for the Pandavas. Duryodhana refuses even land the size of a needle's point, and war becomes certain."
        },
        {
            chip: "The Bhagavad Gita", parva: "BHISHMA PARVA", title: "The Song of the Lord",
            text: "On the eve of battle Arjuna lowers his bow. Krishna answers with 700 verses on duty, action and devotion, the spiritual heart of the entire epic."
        },
        {
            chip: "Bhishma's Bed of Arrows", parva: "BHISHMA PARVA", title: "The Grandsire Falls",
            text: "On the tenth day Bhishma is pierced by countless arrows and lies upon them, unbowed, choosing the moment of his own passing."
        },
        {
            chip: "Abhimanyu & the Chakravyuha", parva: "DRONA PARVA", title: "The Boy in the Circle of Spears",
            text: "Young Abhimanyu knows how to break into the Chakravyuha but not how to leave it. He fights alone against great warriors and falls, and the war turns merciless."
        },
        {
            chip: "Karna's Fall", parva: "KARNA PARVA", title: "The Wheel Sinks",
            text: "When his chariot wheel sinks into the earth, Karna, the war's most tragic warrior, is struck down by Arjuna."
        },
        {
            chip: "The Final Journey", parva: "MAHAPRASTHANIKA PARVA", title: "The Walk to the Himalayas",
            text: "The Pandavas and Draupadi walk north, falling one by one, until Yudhishthira and a faithful dog reach the gates of heaven."
        }
    ];

    // Ganguli translation (public domain), one page per Parva
    const READER_BASE = "https://www.ibiblio.org/sripedia/ebooks/mb/";
    const PARVAS = [
        ["Adi Parva", "The Book of the Beginning: the Kuru line, the Pandavas and Kauravas"],
        ["Sabha Parva", "The Assembly Hall: Indraprastha and the dice game"],
        ["Vana Parva", "The Forest: twelve years of exile"],
        ["Virata Parva", "A year in disguise at King Virata's court"],
        ["Udyoga Parva", "Preparations for war and Krishna's peace mission"],
        ["Bhishma Parva", "The first ten days of war and the Bhagavad Gita"],
        ["Drona Parva", "Drona's command and the fall of Abhimanyu"],
        ["Karna Parva", "Karna leads the army and meets Arjuna"],
        ["Shalya Parva", "The last day of the Kurukshetra war"],
        ["Sauptika Parva", "The night raid on the Pandava camp"],
        ["Stri Parva", "The lament of the women of the Kuru house"],
        ["Shanti Parva", "Bhishma's teachings on dharma and kingship"],
        ["Anushasana Parva", "Further teachings and Bhishma's passing"],
        ["Ashvamedhika Parva", "Yudhishthira's horse sacrifice"],
        ["Ashramavasika Parva", "Dhritarashtra and Gandhari retire to the forest"],
        ["Mausala Parva", "The end of the Yadava clan"],
        ["Mahaprasthanika Parva", "The Pandavas' great journey"],
        ["Svargarohanika Parva", "The ascent to heaven"]
    ];

    const zone = document.querySelector('.maha-beam-zone');
    const card = document.getElementById('mahaVisionCard');
    const chipsBox = document.getElementById('mahaMoments');
    if (!zone || !card || !chipsBox) return;

    const elParva = document.getElementById('visionParva');
    const elTitle = document.getElementById('visionTitle');
    const elText = document.getElementById('visionText');

    // Rising golden motes inside the light beam
    const motes = document.getElementById('mahaMotes');
    for (let i = 0; i < 22; i++) {
        const m = document.createElement('span');
        const size = 2 + Math.random() * 3;
        m.className = 'mote';
        m.style.cssText = `left:${35 + Math.random() * 30}%;width:${size}px;height:${size}px;` +
            `animation-duration:${4 + Math.random() * 4}s;animation-delay:${-Math.random() * 8}s;` +
            `--drift:${(Math.random() - 0.5) * 120}px`;
        motes.appendChild(m);
    }

    // Moment chips
    let current = 0, timer = null, paused = false;
    MOMENTS.forEach((mo, i) => {
        const b = document.createElement('button');
        b.className = 'moment-chip';
        b.setAttribute('role', 'tab');
        b.textContent = mo.chip;
        b.addEventListener('click', () => { show(i); restart(); });
        chipsBox.appendChild(b);
    });
    const chips = chipsBox.querySelectorAll('.moment-chip');

    function show(i, instant) {
        current = i;
        chips.forEach((c, k) => {
            c.classList.toggle('active', k === i);
            c.setAttribute('aria-selected', k === i);
        });
        const apply = () => {
            elParva.textContent = MOMENTS[i].parva;
            elTitle.textContent = MOMENTS[i].title;
            elText.textContent = MOMENTS[i].text;
            card.classList.remove('swapping');
        };
        zone.classList.remove('flare'); void zone.offsetWidth; zone.classList.add('flare');
        if (instant) return apply();
        card.classList.add('swapping');
        setTimeout(apply, 300);
    }

    function restart() {
        clearInterval(timer);
        timer = setInterval(() => { if (!paused) show((current + 1) % MOMENTS.length); }, 7000);
    }

    show(0, true);

    // Cycle only while the section is on screen; pause while hovering the book area
    const section = document.getElementById('mahaSection') || document.getElementById('mahabharata');
    if ('IntersectionObserver' in window && section) {
        new IntersectionObserver(([e]) => {
            if (e.isIntersecting) restart(); else clearInterval(timer);
        }, { threshold: 0.25 }).observe(section);
    } else {
        restart();
    }
    zone.parentElement.addEventListener('mouseenter', () => paused = true);
    zone.parentElement.addEventListener('mouseleave', () => paused = false);

    // Reader modal
    const modal = document.getElementById('mahaModal');
    const grid = document.getElementById('parvaGrid');
    const openBtn = document.getElementById('mahaReadBtn');
    const closeBtn = document.getElementById('mahaModalClose');

    grid.innerHTML = PARVAS.map(([name, desc], i) => {
        const n = String(i + 1).padStart(2, '0');
        return `<a class="parva-card" href="${READER_BASE}m${n}/m${n}000.htm" target="_blank" rel="noopener noreferrer">
            <span class="parva-num">${i + 1}</span>
            <span><span class="parva-name">${name}</span><span class="parva-desc">${desc}</span></span>
        </a>`;
    }).join('');

    function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }
    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        openBtn.focus();
    }
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
})();

/**
 * FESTIVALS OF INDIA — Cultural Hub
 * Category filter, search, and a right panel that shows a
 * plain festival list by default and full details on selection.
 */
(function () {
    const FESTIVALS = [
        {
            id: "diwali", name: "Diwali", tagline: "Festival of Lights", region: "Pan India", months: "Oct – Nov",
            tags: ["religious"], img: "fest_diwali.jpg", detailImg: "fest_diwali_ghats.jpg",
            desc: "Diwali marks the victory of light over darkness, good over evil. Homes, streets and temples are decorated with lamps, and people come together to celebrate hope, prosperity and new beginnings.",
            story: "Diwali is celebrated over five days, each with its own ritual, and traces back to several tales — among them Lord Rama's return to Ayodhya after fourteen years of exile.",
            highlights: ["Diyas and rangoli at every doorstep", "Lakshmi Puja for prosperity", "Fireworks and family feasts"]
        },
        {
            id: "holi", name: "Holi", tagline: "Festival of Colours", region: "Uttar Pradesh", months: "Mar",
            tags: ["seasonal"], img: "fest_holi.jpg", detailImg: "fest_holi.jpg",
            desc: "Holi welcomes spring with clouds of colour, water games and music, rooted in the story of Holika and the triumph of devotion over arrogance.",
            story: "The night before, bonfires called Holika Dahan are lit to mark the burning of the demoness Holika, before the streets erupt in colour the next morning.",
            highlights: ["Gulal colour play at sunrise", "Holika Dahan bonfires", "Thandai and festive sweets"]
        },
        {
            id: "durga-puja", name: "Durga Puja", tagline: "Homecoming of the Goddess", region: "West Bengal", months: "Sep – Oct",
            tags: ["religious", "regional"], img: "fest_durga.jpg", detailImg: "fest_durga.jpg",
            desc: "Durga Puja honours the goddess Durga's victory over the demon Mahishasura, filling Bengal with elaborate pandals, artistry and processions for ten days.",
            story: "Artisans spend months sculpting clay idols of the goddess, unveiled on Panchami and immersed in the river on Dashami amid music and celebration.",
            highlights: ["Hand-sculpted pandal art", "Dhak drums and dance", "Sindoor Khela on the final day"]
        },
        {
            id: "pongal", name: "Pongal", tagline: "Harvest of Gratitude", region: "Tamil Nadu", months: "Jan",
            tags: ["harvest", "regional"], img: "fest_pongal.jpg", detailImg: "fest_pongal.jpg",
            desc: "Pongal is a four-day harvest festival thanking the Sun, cattle and nature for a bountiful season, marked by the ritual boiling over of sweet rice.",
            story: "On Mattu Pongal, cattle are washed, decorated and honoured for their role in the harvest, in a festival that predates most Hindu deity worship.",
            highlights: ["Sweet Pongal boiled at sunrise", "Mattu Pongal cattle decoration", "Kolam patterns at every home"]
        },
        {
            id: "ganesh-chaturthi", name: "Ganesh Chaturthi", tagline: "Welcoming Lord Ganesha", region: "Maharashtra", months: "Aug – Sep",
            tags: ["religious", "regional"], img: "fest_ganesh.jpg", detailImg: "fest_ganesh.jpg",
            desc: "Ganesh Chaturthi welcomes the elephant-headed deity into homes and public pandals for ten days of prayer, music and community.",
            story: "Public celebrations were popularised by freedom fighter Bal Gangadhar Tilak, turning household worship into the citywide festival seen today.",
            highlights: ["Clay idols in every neighbourhood", "Modak offerings", "Visarjan immersion processions"]
        },
        {
            id: "navratri", name: "Navratri", tagline: "Nine Nights of the Goddess", region: "Gujarat", months: "Sep – Oct",
            tags: ["seasonal", "religious"], img: "fest_navratri.jpg", detailImg: "fest_navratri.jpg",
            desc: "Navratri honours nine forms of the goddess over nine nights, celebrated through fasting, prayer and garba and dandiya dance circles across Gujarat.",
            story: "Each of the nine nights is dedicated to a different form of the goddess, ending with Vijayadashami — the same day Durga Puja and Dussehra conclude.",
            highlights: ["Garba and dandiya raas circles", "Nine days of fasting and prayer", "Colour-coded outfits per night"]
        }
    ];

    const CATEGORIES = [
        { id: "all", label: "All National Festivals", icon: "🕉️" },
        { id: "religious", label: "Religious Festivals", icon: "🛕" },
        { id: "seasonal", label: "Seasonal Festivals", icon: "🍃" },
        { id: "harvest", label: "Harvest Festivals", icon: "🌾" },
        { id: "regional", label: "Regional Festivals", icon: "🌿" }
    ];

    /**
     * Festivals on the grid that have a real-time 3D world, keyed by the
     * festival id used in FESTIVALS. `world` is an id from
     * FESTIVAL_WORLDS_3D. Worlds with no festival card of their own (Eid,
     * Kumbh Mela, Vasant Panchami, Nanda Devi Yatra) are still reachable
     * from the "Festivals in 3D" nav menu.
     */
    const MODELS_3D = {
        "diwali": {
            world: "diwali", name: "Diwali",
            blurb: "Walk the ghats at night among lit diyas, a temple mandir and drifting fireworks. Orbit the world, then double-click a structure to read its story."
        },
        "holi": {
            world: "holi", name: "Holi",
            blurb: "Enter a courtyard of dancing colours around the Holika pyre at bright morning. Drag to orbit and double-click the bonfire, drums or dancers to explore."
        },
        "pongal": {
            world: "pongal", name: "Pongal",
            blurb: "Step into a Tamil harvest home at dawn, where Pongal boils in an earthen pot, cattle are garlanded and kolam patterns frame the threshold."
        }
    };

    const grid = document.getElementById('festGrid');
    const empty = document.getElementById('festEmpty');
    const catsBox = document.getElementById('festCats');
    const panel = document.getElementById('festPanel');
    const festBody = document.querySelector('.fest-body');
    const searchInput = document.getElementById('festSearch');

    let activeCat = 'all';
    let activeFestivalId = null;

    // ---- Category buttons ----
    catsBox.innerHTML = CATEGORIES.map(c =>
        `<button class="cat-btn ${c.id === 'all' ? 'active' : ''}" data-cat="${c.id}" role="tab" aria-selected="${c.id === 'all'}">
            <span class="cat-icon">${c.icon}</span> ${c.label}
        </button>`
    ).join('');

    catsBox.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeCat = btn.dataset.cat;
            catsBox.querySelectorAll('.cat-btn').forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', b === btn);
            });
            renderGrid();
        });
    });

    // ---- 3D Experience overlay ----
    // Hosts the WebGL atlas in an iframe. The iframe is torn down on close so
    // the render loop, WebGL context and audio all stop while it is hidden.
    const m3dModal = document.getElementById('m3dModal');
    const m3dFrame = document.getElementById('m3dFrame');
    const m3dClose = document.getElementById('m3dModalClose');
    const m3dSub = document.getElementById('m3dModalSub');
    const m3dLoading = document.getElementById('m3dModalLoading');
    let m3dReturnFocus = null;

    function open3DExperience(worldId, subtitle, trigger) {
        if (!m3dModal || !m3dFrame) return;
        m3dReturnFocus = trigger || null;
        if (m3dLoading) m3dLoading.hidden = false;
        if (m3dSub) m3dSub.textContent = subtitle || 'Enter the living world';
        m3dFrame.src = `${EXPERIENCE_3D_BASE}?festival=${encodeURIComponent(worldId)}`;
        m3dModal.classList.add('open');
        m3dModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('m3d-open');
        document.body.style.overflow = 'hidden';
        if (m3dClose) m3dClose.focus();
    }

    function close3DExperience() {
        if (!m3dModal || !m3dFrame) return;
        m3dModal.classList.remove('open');
        m3dModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('m3d-open');
        document.body.style.overflow = '';
        m3dFrame.src = 'about:blank';
        if (m3dLoading) m3dLoading.hidden = false;
        if (m3dReturnFocus && document.contains(m3dReturnFocus)) m3dReturnFocus.focus();
        m3dReturnFocus = null;
    }

    if (m3dModal && m3dFrame) {
        m3dFrame.addEventListener('load', () => { if (m3dLoading) m3dLoading.hidden = true; });

        if (m3dClose) m3dClose.addEventListener('click', close3DExperience);
        m3dModal.addEventListener('click', e => { if (e.target === m3dModal) close3DExperience(); });
        document.addEventListener('keydown', e => {
            if (!m3dModal.classList.contains('open')) return;
            if (e.key === 'Escape') { close3DExperience(); return; }
            // Keep Tab inside the dialog: close button, then the canvas frame.
            if (e.key === 'Tab') {
                const stops = [m3dClose, m3dFrame].filter(Boolean);
                if (!stops.length) return;
                const first = stops[0], last = stops[stops.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
    }

    // The navbar's "Festivals in 3D" menu opens the same overlay, so the
    // launcher is shared rather than duplicated.
    window.openFestivalWorld = open3DExperience;

    // ---- Grid rendering ----
    function matchesFestival(f, query) {
        const inCat = activeCat === 'all' || f.tags.includes(activeCat);
        if (!inCat) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.region.toLowerCase().includes(q) || f.months.toLowerCase().includes(q);
    }

    function renderGrid() {
        const query = searchInput.value.trim();
        const list = FESTIVALS.filter(f => matchesFestival(f, query));

        grid.innerHTML = list.map(f => `
            <article class="fest-card ${f.id === activeFestivalId ? 'active' : ''}" data-id="${f.id}" tabindex="0">
                <img class="fest-card-img" src="${ASSET_PREFIX}${f.img}" alt="${f.name}" loading="lazy">
                <div class="fest-card-body">
                    <div class="fest-card-name">🪷 ${f.name}</div>
                    <div class="fest-card-meta">${f.region} &nbsp;|&nbsp; ${f.months}</div>
                    <div class="fest-card-link">View Details →</div>
                </div>
            </article>
        `).join('');

        empty.hidden = list.length !== 0;
        grid.style.display = list.length ? 'grid' : 'none';

        grid.querySelectorAll('.fest-card').forEach(card => {
            card.addEventListener('click', () => selectFestival(card.dataset.id));
            card.addEventListener('keydown', e => { if (e.key === 'Enter') selectFestival(card.dataset.id); });
        });
    }

    searchInput.addEventListener('input', renderGrid);

    // ---- Right panel ----
    // No festival selected: the panel is simply not shown, and the grid
    // takes up the freed-up space.
    function renderPanelDefault() {
        activeFestivalId = null;
        panel.innerHTML = '';
        panel.hidden = true;
        festBody.classList.add('no-panel');
        document.querySelectorAll('.fest-card').forEach(c => c.classList.remove('active'));
    }

    function renderPanelDetail(f) {
        const model = MODELS_3D[f.id] || null;
        panel.hidden = false;
        festBody.classList.remove('no-panel');
        panel.innerHTML = `
            <div class="panel-detail-img-wrap">
                <img class="panel-detail-img" src="${ASSET_PREFIX}${f.detailImg}" alt="${f.name}">
                ${model ? `<button class="panel-badge panel-badge-btn" data-3d-launch title="Open the ${model.name} 3D world">✨ 3D EXPERIENCE</button>` : ''}
                <button class="panel-back-btn" id="panelBackBtn" aria-label="Back to festival list">✕</button>
            </div>
            <div class="panel-title-row">🪷 <span class="panel-title">${f.name}</span></div>
            <div class="panel-tagline">${f.tagline}</div>
            <div class="panel-meta-row">
                <span>📍 ${f.region}</span>
                <span>📅 ${f.months}</span>
            </div>
            <p class="panel-desc">${f.desc}</p>
            <div class="panel-actions">
                ${actionRow('story', '📖', 'Festival Story', `<p>${f.story}</p>`)}
                ${model ? modelRow(f, model) : pendingModelRow(f)}
                ${actionRow('highlights', '⭐', 'Key Highlights', `<ul>${f.highlights.map(h => `<li>${h}</li>`).join('')}</ul>`)}
            </div>
            <button class="panel-explore-btn">Explore Festival →</button>
        `;

        document.getElementById('panelBackBtn').addEventListener('click', renderPanelDefault);

        // Any element tagged data-3d-launch opens the atlas at the right world.
        panel.querySelectorAll('[data-3d-launch]').forEach(btn => {
            btn.addEventListener('click', () => {
                const world = btn.dataset.world || (model && model.world);
                if (!world) return;
                open3DExperience(world, btn.dataset.subtitle || `Real-time 3D world · ${f.name}`, btn);
            });
        });

        panel.querySelectorAll('.panel-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const body = document.getElementById(btn.dataset.target);
                const isOpen = body.classList.contains('open');
                panel.querySelectorAll('.panel-action-body').forEach(b => b.classList.remove('open'));
                panel.querySelectorAll('.panel-action-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
                if (!isOpen) {
                    body.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // Festival with a 3D world: describe the scene and offer the launcher.
    function modelRow(f, model) {
        return actionRow('model', '🧊', '3D Experience', `
            <p>${model.blurb}</p>
            <button class="panel-3d-launch" data-3d-launch data-world="${model.world}"
                data-subtitle="Real-time 3D world · ${model.name}">Launch ${model.name} in 3D →</button>
        `);
    }

    // No 3D world yet: say so plainly, and still point at the worlds that do exist.
    function pendingModelRow(f) {
        return actionRow('model', '🧊', '3D Experience', `
            <p class="panel-model-pending">A real-time 3D world for ${f.name} is still being built.
                The atlas currently holds seven cultures — open it to explore them.</p>
            <button class="panel-3d-launch panel-3d-ghost" data-3d-launch data-world="diwali"
                data-subtitle="Seven explorable cultural worlds">Browse the 3D atlas →</button>
        `);
    }

    function actionRow(key, icon, label, bodyHtml) {
        const id = `panelAction_${key}`;
        return `
            <button class="panel-action-btn" data-target="${id}" aria-expanded="false">
                <span class="a-left">${icon} ${label}</span> <span class="chev">›</span>
            </button>
            <div class="panel-action-body" id="${id}">${bodyHtml}</div>
        `;
    }

    function selectFestival(id) {
        const f = FESTIVALS.find(x => x.id === id);
        if (!f) return;
        activeFestivalId = id;
        renderPanelDetail(f);
        document.querySelectorAll('.fest-card').forEach(c => c.classList.toggle('active', c.dataset.id === id));
    }

    // ---- Boot ----
    renderGrid();
    renderPanelDefault();
})();

/**
 * NAVBAR — FESTIVALS IN 3D
 * The nav item lists every world in the 3D atlas and hands the chosen one to
 * the launcher the festivals section above owns, so the modal, iframe
 * teardown and focus handling all stay in one place.
 */
(function () {
    const toggle = document.getElementById('fest3dToggle');
    const menu = document.getElementById('fest3dMenu');
    if (!toggle || !menu) return;

    menu.innerHTML = FESTIVAL_WORLDS_3D.map(w => `
        <button type="button" class="fest3d-item" role="menuitem" data-world="${w.id}">
            <span class="fest3d-item-name">${w.name}</span>
            <span class="fest3d-item-eyebrow">${w.eyebrow}</span>
            <span class="fest3d-item-hint">${w.hint}</span>
        </button>
    `).join('');

    function setOpen(open) {
        menu.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!menu.classList.contains('open'));
    });

    menu.addEventListener('click', (e) => {
        const item = e.target.closest('[data-world]');
        if (!item || !window.openFestivalWorld) return;
        const world = FESTIVAL_WORLDS_3D.find(w => w.id === item.dataset.world);
        setOpen(false);
        window.openFestivalWorld(item.dataset.world, `Real-time 3D world · ${world ? world.name : ''}`, toggle);
    });

    // Clicking anywhere else dismisses the menu.
    document.addEventListener('click', (e) => {
        if (!menu.classList.contains('open')) return;
        if (menu.contains(e.target) || toggle.contains(e.target)) return;
        setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !menu.classList.contains('open')) return;
        setOpen(false);
        toggle.focus();
    });
})();

const STATES = [
    { name: "Jammu & Kashmir", x: 47.0, y: 11.0, href: "" },
    { name: "Ladakh", x: 49.4, y: 8.3, href: "" },
    { name: "Himachal Pradesh", x: 49.9, y: 16.3, href: "" },
    { name: "Punjab", x: 47.8, y: 18.5, href: "" },
    { name: "Uttarakhand", x: 52.7, y: 20.5, href: "" },
    { name: "Haryana", x: 49.2, y: 23.3, href: "" },
    { name: "Delhi", x: 50.0, y: 24.7, href: "" },
    { name: "Rajasthan", x: 46.8, y: 31.3, href: "" },
    { name: "Uttar Pradesh", x: 54.4, y: 29.1, href: "" },
    { name: "Bihar", x: 61.3, y: 32.9, href: "" },
    { name: "Sikkim", x: 64.9, y: 28.0, href: "" },
    { name: "Arunachal Pradesh", x: 73.0, y: 26.8, href: "" },
    { name: "Assam", x: 70.4, y: 31.0, href: "" },
    { name: "Meghalaya", x: 68.5, y: 33.2, href: "" },
    { name: "Nagaland", x: 72.8, y: 31.8, href: "" },
    { name: "Manipur", x: 72.0, y: 35.5, href: "" },
    { name: "Mizoram", x: 70.8, y: 39.4, href: "" },
    { name: "Tripura", x: 69.2, y: 38.0, href: "" },
    { name: "West Bengal", x: 64.4, y: 37.1, href: "" },
    { name: "Jharkhand", x: 61.4, y: 38.1, href: "" },
    { name: "Odisha", x: 59.6, y: 51.0, href: "" },
    { name: "Chhattisgarh", x: 56.4, y: 45.0, href: "" },
    { name: "Madhya Pradesh", x: 51.3, y: 38.4, href: "" },
    { name: "Gujarat", x: 43.5, y: 41.9, href: "" },
    { name: "Maharashtra", x: 48.5, y: 53.9, href: "" },
    { name: "Telangana", x: 52.4, y: 54.4, href: "" },
    { name: "Andhra Pradesh", x: 54.4, y: 59.0, href: "" },
    { name: "Karnataka", x: 48.9, y: 63.8, href: "" },
    { name: "Goa", x: 45.9, y: 61.1, href: "" },
    { name: "Tamil Nadu", x: 51.9, y: 76.8, href: "" },
    { name: "Kerala", x: 49.0, y: 74.7, href: "" },
    { name: "Lakshadweep", x: 44.6, y: 80.6, href: "" },
    { name: "Andaman & Nicobar Islands", x: 67.5, y: 82.5, href: "" }
];

(function () {
    const container = document.getElementById('stateMarkers');
    if (!container) return;

    container.innerHTML = STATES.map(s => `
        <a class="state-marker" style="left:${s.x}%; top:${s.y}%;" href="${s.href || '#'}" data-state="${s.name}">
            <span class="marker-dot"></span>
            <span class="marker-tip">${s.name} →</span>
        </a>
    `).join('');
})();
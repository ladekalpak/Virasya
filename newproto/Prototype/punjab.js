const places = [
  {
    name:"Golden Temple", city:"Amritsar", type:"spiritual",
    typeLabel:"Spiritual Heritage",
    image:"https://images.unsplash.com/photo-1588096344356-0b7a8a9f7b4b?auto=format&fit=crop&w=1000&q=85",
    desc:"Sri Harmandir Sahib, popularly known as the Golden Temple, is the most recognised Sikh shrine and a major spiritual and cultural landmark of Punjab. Its sacred pool, community kitchen and distinctive architecture attract visitors from around the world.",
    facts:["Amritsar","Sikh Heritage","Amrit Sarovar"]
  },
  {
    name:"Jallianwala Bagh", city:"Amritsar", type:"history",
    typeLabel:"Historical Memorial",
    image:"https://images.unsplash.com/photo-1609947017136-9daf32a1c2b7?auto=format&fit=crop&w=1000&q=85",
    desc:"Jallianwala Bagh is a national memorial connected with the tragic events of 13 April 1919. The site preserves memories of the victims and forms an important part of India's freedom movement history.",
    facts:["Amritsar","Freedom Struggle","Memorial"]
  },
  {
    name:"Attari–Wagah Border", city:"Amritsar district", type:"culture",
    typeLabel:"Cultural Experience",
    image:"https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&w=1000&q=85",
    desc:"The Attari–Wagah border is known for the daily Beating Retreat ceremony. The ceremonial display has become a well-known visitor experience in Punjab.",
    facts:["Attari","Border Ceremony","Patriotism"]
  },
  {
    name:"Qila Mubarak", city:"Patiala", type:"history",
    typeLabel:"Royal Heritage",
    image:"https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=85",
    desc:"Qila Mubarak is a major heritage complex associated with the royal history of Patiala. Its architecture and collections reflect the region's princely past.",
    facts:["Patiala","Royal History","Fort Complex"]
  },
  {
    name:"Anandpur Sahib", city:"Rupnagar", type:"spiritual",
    typeLabel:"Sikh Heritage",
    image:"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85",
    desc:"Anandpur Sahib is one of Punjab's most important Sikh heritage towns. It is associated with Takht Sri Kesgarh Sahib and the annual Hola Mohalla celebration.",
    facts:["Rupnagar","Takht Sahib","Hola Mohalla"]
  },
  {
    name:"Gobindgarh Fort", city:"Amritsar", type:"history",
    typeLabel:"Fort & Heritage",
    image:"https://images.unsplash.com/photo-1532664189809-02133fee698d?auto=format&fit=crop&w=1000&q=85",
    desc:"Gobindgarh Fort is a historic fort in Amritsar connected with Punjab's military and royal past. It now functions as a heritage attraction with cultural experiences.",
    facts:["Amritsar","Fort","Military Heritage"]
  },
  {
    name:"Sheesh Mahal", city:"Patiala", type:"history",
    typeLabel:"Royal Architecture",
    image:"https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=85",
    desc:"Sheesh Mahal, or the Palace of Mirrors, is a celebrated part of Patiala's royal heritage. It is noted for decorative mirror work, paintings and artistic interiors.",
    facts:["Patiala","Palace","Mirror Work"]
  },
  {
    name:"Virasat-e-Khalsa", city:"Anandpur Sahib", type:"museum",
    typeLabel:"Museum",
    image:"https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=85",
    desc:"Virasat-e-Khalsa is a museum dedicated to the history and heritage of the Sikh community and the Khalsa tradition, presented through architecture and exhibitions.",
    facts:["Anandpur Sahib","Museum","Sikh Heritage"]
  },
  {
    name:"Maharaja Ranjit Singh Museum", city:"Amritsar", type:"museum",
    typeLabel:"History Museum",
    image:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=85",
    desc:"The museum preserves objects and stories associated with Maharaja Ranjit Singh and the history of the Sikh Empire, offering a window into Punjab's nineteenth-century past.",
    facts:["Amritsar","Sikh Empire","Museum"]
  },
  {
    name:"Durgiana Temple", city:"Amritsar", type:"spiritual",
    typeLabel:"Temple Heritage",
    image:"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85",
    desc:"Durgiana Temple is a historic Hindu temple complex in Amritsar, known for its sacred setting and architecture surrounded by a water body.",
    facts:["Amritsar","Temple","Heritage"]
  },
  {
    name:"Khalsa College", city:"Amritsar", type:"culture",
    typeLabel:"Architecture & Education",
    image:"https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=85",
    desc:"Khalsa College is known for its distinctive Indo-Saracenic architecture and its long educational history in Punjab.",
    facts:["Amritsar","Architecture","Education"]
  },
  {
    name:"Rangla Punjab Haveli", city:"Jalandhar", type:"culture",
    typeLabel:"Living Culture",
    image:"https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=85",
    desc:"Rangla Punjab-style cultural spaces recreate village life through traditional food, music, crafts and performances, giving visitors an accessible introduction to Punjabi folk culture.",
    facts:["Jalandhar","Folk Culture","Food & Crafts"]
  }
];

const grid = document.getElementById("placeGrid");
const search = document.getElementById("placeSearch");
const noResults = document.getElementById("noResults");
const filters = document.querySelectorAll(".filter");

let currentFilter = "all";

function escapeHTML(value){
  return value.replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function renderPlaces(){
  const query = search.value.toLowerCase().trim();

  const filtered = places.filter(p => {
    const matchesFilter = currentFilter === "all" || p.type === currentFilter;
    const haystack = `${p.name} ${p.city} ${p.typeLabel} ${p.desc}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });

  grid.innerHTML = filtered.map((p,i) => `
    <article class="place-card" tabindex="0" data-index="${places.indexOf(p)}">
      <div class="place-image" style="background-image:url('${p.image}')"></div>
      <div class="place-body">
        <h3>${escapeHTML(p.name)}</h3>
        <div class="place-location">📍 ${escapeHTML(p.city)}</div>
        <p>${escapeHTML(p.desc)}</p>
        <span class="place-type">${escapeHTML(p.typeLabel)}</span>
      </div>
    </article>
  `).join("");

  noResults.style.display = filtered.length ? "none" : "block";
}

renderPlaces();

search.addEventListener("input", renderPlaces);

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderPlaces();
  });
});

const modal = document.getElementById("placeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalType = document.getElementById("modalType");
const modalLocation = document.getElementById("modalLocation");
const modalDescription = document.getElementById("modalDescription");
const modalFacts = document.getElementById("modalFacts");

function openPlace(index){
  const p = places[index];
  modalImage.style.backgroundImage = `url('${p.image}')`;
  modalTitle.textContent = p.name;
  modalType.textContent = p.typeLabel;
  modalLocation.textContent = `📍 ${p.city}`;
  modalDescription.textContent = p.desc;
  modalFacts.innerHTML = p.facts.map(f => `<span>${escapeHTML(f)}</span>`).join("");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

grid.addEventListener("click", e => {
  const card = e.target.closest(".place-card");
  if(card) openPlace(Number(card.dataset.index));
});

grid.addEventListener("keydown", e => {
  if(e.key === "Enter" || e.key === " "){
    const card = e.target.closest(".place-card");
    if(card){
      e.preventDefault();
      openPlace(Number(card.dataset.index));
    }
  }
});

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", e => {
  if(e.key === "Escape") closeModal();
});

const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector(".main-nav");

menuBtn.addEventListener("click", () => nav.classList.toggle("open"));

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.classList.toggle(
        "active",
        a.getAttribute("href") === `#${entry.target.id}`
      ));
    }
  });
},{rootMargin:"-35% 0px -55% 0px"});

sections.forEach(s => observer.observe(s));

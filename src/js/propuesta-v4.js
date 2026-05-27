(async function () {
  "use strict";

  const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  // ---------- STATIC FALLBACK DATA ----------
  const STATIC_DATA = {
    brand: { name:"Bárbaros Burguer", shortName:"Bárbaros", slogan:"Come como un bárbaro", since:"2014", address:"cll 7a #9-69 barrio palmarito", phone:"3124872685", instagram:"@barbarosburguertau", whatsappNumber:"573124872685", fallbackImage:"./assets/brand/logo-vertical-fondo-naranja.jpg" },
    theme: { primary:"#FFA301", secondary:"#051B39", light:"#FBFBFA", white:"#FFFFFF", accent:"#FFB98D" },
    categories: [
      { id:"bases", label:"Bases", description:"Arma la tuya o pide directo" },
      { id:"especialidades", label:"Especialidades", description:"Platos destacados de la casa" },
      { id:"entradas", label:"Entradas", description:"Para compartir o abrir apetito" },
      { id:"bebidas", label:"Bebidas", description:"Refresca tu pedido" }
    ],
    builderRules: { comboLabel:"Base + proteína + topping", allowAnyAddon:true, maxAddons:null },
    addons: {
      proteins: [
        { id:"prot-carne-burguer", name:"Carne burguer", price:5500 },
        { id:"prot-filete-pollo", name:"Filete de pollo", price:8000 },
        { id:"prot-desmechado-pollo", name:"Desmechado pollo", price:2000 },
        { id:"prot-desmechado-carne", name:"Desmechado carne", price:4000 },
        { id:"prot-salch-americana", name:"Salchicha americana", price:5000 },
        { id:"prot-salch-ranchera", name:"Salchicha ranchera", price:2200 },
        { id:"prot-chorizo", name:"Chorizo", price:5000 },
        { id:"prot-huevo-codorniz", name:"Huevo codorniz x4", price:2000 },
        { id:"prot-huevo-frito", name:"Huevo frito", price:2000 }
      ],
      toppings: [
        { id:"top-tocineta", name:"Tocineta x2", price:3000 },
        { id:"top-maiz", name:"Maíz tierno", price:2000 },
        { id:"top-jalapeno", name:"Jalapeño x6", price:3000 },
        { id:"top-aritos", name:"Aritos x2", price:3000 },
        { id:"top-queso-crunch", name:"Queso crunch", price:1500 },
        { id:"top-arepa-frita", name:"Arepa frita", price:2000 },
        { id:"top-aguacate", name:"Aguacate porción", price:4600 },
        { id:"top-jamon", name:"Jamón", price:1000 },
        { id:"top-patacona", name:"Patacona madura", price:4500 }
      ],
      freeSauces: [
        { id:"salsa-tomate", name:"Tomate", price:0 },
        { id:"salsa-rosada", name:"Rosada", price:0 },
        { id:"salsa-tartara", name:"Tártara", price:0 }
      ],
      premiumSauces: [
        { id:"salsa-barbara", name:"Bárbara", price:2000 },
        { id:"salsa-big-mac", name:"Big Mac", price:2000 },
        { id:"salsa-mermelada-tocineta", name:"Mermelada de tocineta", price:2000 }
      ]
    },
    products: [
      { id:"base-pan-brioche", categoryId:"bases", name:"Burguer en pan brioche", description:"Incluye proteína 131g, vegetales, queso crunch, papas a la francesa y huevo de codorniz.", image:"./assets/products/imagen-1779853277356.png", action:"builder", variants:[{id:"res",label:"Res",price:17700},{id:"pollo",label:"Pollo",price:21000}] },
      { id:"base-arepa-maiz-peto", categoryId:"bases", name:"Burguer en arepa de maíz peto", description:"Base crocante de maíz peto con el combo clásico de la casa.", image:"./assets/products/burger-pan-brioche-02.jpg", action:"builder", variants:[{id:"res",label:"Res",price:19000},{id:"pollo",label:"Pollo",price:20500}] },
      { id:"base-patacona-madura", categoryId:"bases", name:"Burguer patacona madura", description:"Versión patacona madura con proteína, vegetales, queso crunch y papas.", image:"./assets/products/patacona-madura-01.jpg", action:"builder", variants:[{id:"res",label:"Res",price:21000},{id:"pollo",label:"Pollo",price:22000}] },
      { id:"base-aguacate", categoryId:"bases", name:"Burguer aguacate", description:"Base premium con aguacate, combo completo y papas francesas.", image:"./assets/products/burger-pan-brioche-02.jpg", action:"builder", variants:[{id:"res",label:"Res",price:31000},{id:"pollo",label:"Pollo",price:33000}] },
      { id:"perro-barbaro-clasico", categoryId:"bases", name:"Perro Bárbaro clásico", description:"Pan artesanal, salchicha americana, queso, papa ripio, salsa de la casa y huevo de codorniz.", image:"./assets/products/perro-artesanal-mixto-01.jpg", price:11000, action:"add" },
      { id:"perro-barbaro-loco", categoryId:"bases", name:"Perro Bárbaro loco", description:"Versión loco del perro bárbaro.", image:"./assets/products/perro-artesanal-mixto-01.jpg", price:18000, action:"add" },
      { id:"perro-barbaro-vaquero", categoryId:"bases", name:"Perro Bárbaro vaquero", description:"Versión vaquero del perro bárbaro.", image:"./assets/products/perro-artesanal-mixto-01.jpg", price:14500, action:"add" },
      { id:"perro-barbaro-americano", categoryId:"bases", name:"Perro Bárbaro americano", description:"Versión americano del perro bárbaro.", image:"./assets/products/perro-artesanal-mixto-01.jpg", price:15800, action:"add" },
      { id:"perro-barbaro-pollo-maiz", categoryId:"bases", name:"Perro Bárbaro pollo y maíz", description:"Versión pollo y maíz del perro bárbaro.", image:"./assets/products/perro-artesanal-mixto-01.jpg", price:14800, action:"add" },
      { id:"salchi-fritos", categoryId:"bases", name:"Salchi-fritos", description:"Papa francesa 200g, queso y huevos de codorniz.", image:"./assets/products/burger-salchifritos-01.jpg", price:10800, action:"add" },
      { id:"esp-mazorcada", categoryId:"especialidades", name:"Mazorcada", description:"Especialidad de la casa.", image:"./assets/brand/logo-horizontal-naranja.jpg", price:28000, action:"add" },
      { id:"esp-costillitas-bbq", categoryId:"especialidades", name:"Costillitas BBQ", description:"Costillas BBQ con acompañamiento de la casa.", image:"./assets/products/costillitas-bbq-01.jpg", price:38000, action:"add" },
      { id:"esp-ensalada", categoryId:"especialidades", name:"Ensalada", description:"Ensalada fresca con proteína y aderezo.", image:"./assets/products/ensalada-pollo-01.jpg", price:21000, action:"add" },
      { id:"esp-arepa-rellena-mixta", categoryId:"especialidades", name:"Arepa rellena mixta", description:"Arepa maíz peto asada rellena con proteína, salsa de la casa, queso y huevos de codorniz.", image:"./assets/brand/logo-horizontal-naranja.jpg", price:13000, action:"add" },
      { id:"esp-arepa-rellena-carne", categoryId:"especialidades", name:"Arepa rellena carne", description:"Arepa maíz peto asada rellena con carne desmechada.", image:"./assets/brand/logo-horizontal-naranja.jpg", price:14500, action:"add" },
      { id:"esp-arepa-rellena-pollo", categoryId:"especialidades", name:"Arepa rellena pollo", description:"Arepa maíz peto asada rellena con pollo desmechado.", image:"./assets/brand/logo-horizontal-naranja.jpg", price:11500, action:"add" },
      { id:"ent-arepitas-fritas", categoryId:"entradas", name:"Arepitas fritas", description:"Arepitas crocantes, perfectas para picar.", image:"./assets/brand/logo-horizontal-naranja.jpg", price:5500, action:"add" },
      { id:"ent-chorizo-arepa", categoryId:"entradas", name:"Chorizo y arepa", description:"Chorizo artesanal con arepa asada.", image:"./assets/brand/logo-horizontal-naranja.jpg", price:6500, action:"add" },
      { id:"ent-aritos-cebolla", categoryId:"entradas", name:"Aritos de cebolla", description:"Aritos de cebolla apanados y crocantes.", image:"./assets/brand/logo-horizontal-naranja.jpg", price:6000, action:"add" },
      { id:"ent-papas-barbaras", categoryId:"entradas", name:"Papas Bárbaras", description:"Papas a la francesa estilo Bárbaros con queso y salsa.", image:"./assets/brand/logo-horizontal-naranja.jpg", price:8000, action:"add" },
      { id:"ent-arepa-quesuda", categoryId:"entradas", name:"Arepa quesuda", description:"Arepa maíz peto asada con mucho queso.", image:"./assets/products/imagen-1779852527584.png", price:5500, action:"add" },
      { id:"beb-limonadas", categoryId:"bebidas", name:"Limonadas (clásica, coco, bárbara)", description:"Limonada natural fresca en tres sabores.", image:"./assets/products/imagen-1779852475148.png", price:9000, action:"add" },
      { id:"beb-jugos-naturales", categoryId:"bebidas", name:"Jugos naturales en agua", description:"Fresa, mora, uva, mango, guanábana, maracuyá, lulo, chamba.", image:"./assets/products/imagen-1779852398707.png", price:8000, action:"add" },
      { id:"beb-postobon", categoryId:"bebidas", name:"Postobón 400ml", description:"Gaseosa Postobón personal 400ml.", image:"./assets/products/imagen-1779852182575.png", price:4000, action:"add" },
      { id:"beb-cocacola", categoryId:"bebidas", name:"Coca-Cola 400ml", description:"Gaseosa Coca-Cola personal 400ml.", image:"./assets/products/imagen-1779851839925.png", price:5000, action:"add" },
      { id:"beb-cerveza-corona", categoryId:"bebidas", name:"Cerveza Corona 355ml", description:"Cerveza Corona bien fría.", image:"./assets/products/imagen-1779851372805.png", price:9000, action:"add" }
    ]
  };

  // ---------- LOAD DATA ----------
  let data = STATIC_DATA;
  try {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 3000);
    var resp = await fetch("/api/menu?_=" + Date.now(), { cache: "no-store", signal: ctrl.signal }).catch(function () { return null; });
    clearTimeout(timer);
    if (resp && resp.ok) data = await resp.json();
  } catch (_) { /* use static fallback */ }

  const brand = data.brand || STATIC_DATA.brand;
  const categories = data.categories || STATIC_DATA.categories;
  const products = data.products || STATIC_DATA.products;
  const addons = data.addons || STATIC_DATA.addons || {};
  const byId = Object.fromEntries(products.map(p => [p.id, p]));

  // ---------- DOM REFS ----------
  const $ = id => document.getElementById(id);
  const app = $("app");
  const skel = $("skeleton");
  const sectionsEl = $("v4Sections");
  const extrasSection = $("v4ExtrasSection");
  const cartInline = $("v4CartInline");
  const cartInlineItems = $("cartInlineItems");
  const cartInlineCount = $("cartInlineCount");
  const cartInlineTotal = $("cartInlineTotal");
  const cartInlineWA = $("cartInlineWA");
  const cartInlineServer = $("cartInlineServer");
  const cartInlineClear = $("cartInlineClear");
  const cartInlineBack = $("cartInlineBack");
  const bnav = $("v4BottomNav");
  const cartBar = $("v4CartBar");
  const cartBarCount = $("cartBarCount");
  const cartBarTotal = $("cartBarTotal");
  const cartBarBtn = $("cartBarBtn");
  const wizard = $("v4Wizard");
  const wizBody = $("wizBody");
  const wizFoot = $("wizFoot");
  const wizTotal = $("wizTotal");
  const wizNext = $("wizNext");
  const wizSteps = $("wizSteps");
  const wizBack = $("wizBack");
  const wizClose = $("wizClose");
  const ticketOverlay = $("v4TicketOverlay");
  const ticketBody = $("ticketBody");
  const ticketClose = $("ticketClose");
  const ticketWhatsApp = $("ticketWhatsApp");
  const ticketShowServer = $("ticketShowServer");
  const serverMode = $("v4ServerMode");
  const serverOrder = $("serverOrder");
  const serverBack = $("serverBack");
  const toastEl = $("v4Toast");
  const toastMsg = $("toastMsg");
  const deliveryOverlay = $("v4DeliveryOverlay");
  const deliveryClose = $("deliveryClose");
  const deliveryPickup = $("deliveryPickup");
  const deliveryAddrBtn = $("deliveryAddrBtn");
  const deliveryAddrBox = $("deliveryAddrBox");
  const deliveryAddrInput = $("deliveryAddrInput");
  const deliverySend = $("deliverySend");

  // ---------- STATE ----------
  const state = { cart:[], wizard:{ product:null, step:1, variant:null, selectedAddons:new Set() }, activeTab:"bases" };

  // ---------- RENDER ----------
  let catIndex = {};

  const addonGroups = [
    { key:"proteins", icon:"🥩", label:"Proteínas extra" },
    { key:"toppings", icon:"🧀", label:"Toppings" },
    { key:"premiumSauces", icon:"🔥", label:"Salsas premium" },
    { key:"freeSauces", icon:"🆓", label:"Salsas gratis" }
  ];

  const addonsHTML = `
    <section class="v4-section" id="v4sec-extras">
      <div class="v4-section__head">
        <h2>🧀 Extras disponibles</h2>
        <p>Lo que le puedes agregar</p>
      </div>
      <div class="v4-extras-grid">
        ${addonGroups.map(g => {
          const items = addons[g.key] || [];
          if (!items.length) return "";
          return `<div class="v4-extras-group">
            <div class="v4-extras-group__title">${g.icon} ${g.label}</div>
            ${items.map(a => `<div class="v4-extras-row">
              <span>${esc(a.name)}</span>
              <strong class="${a.price ? '' : 'v4-extras--free'}">${a.price ? money.format(Number(a.price)) : 'Gratis'}</strong>
            </div>`).join('')}
          </div>`;
        }).join('')}
      </div>
    </section>`;

  sectionsEl.innerHTML = categories.map((c, i) => {
    catIndex[c.id] = i;
    const list = products.filter(p => p.categoryId === c.id);
    const cards = list.map(p => {
      const price = getPriceLabel(p);
      const actionLabel = p.action === "builder" ? "Armar" : p.action === "add" ? "Agregar" : "Consultar";
      const isFallback = !p.image || p.image.includes("logo-horizontal-naranja");
      return `<article class="v4-card ${isFallback ? 'v4-card--placeholder' : ''}" data-id="${p.id}">
        <div class="v4-card__media" ${isFallback ? `style="background-image:url(${p.image || brand.fallbackImage || ''})"` : ''} data-emoji="${getProductEmoji(p)}">
          ${isFallback ? '' : `<img src="${p.image || brand.fallbackImage || ''}" alt="${esc(p.name)}" loading="lazy">`}
        </div>
        <div class="v4-card__body">
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.description)}</p>
          <div class="v4-card__footer">
            <span class="v4-card__price">${price}</span>
            <button class="v4-card__action" type="button">${actionLabel}</button>
          </div>
        </div>
      </article>`;
    }).join('');
    return `<section class="v4-section" id="v4sec-${c.id}">
      <div class="v4-section__head">
        <h2>${esc(c.label)}</h2>
        <p>${esc(c.description)}</p>
      </div>
      <div class="v4-grid">${cards}</div>
    </section>`;
  }).join('');

  // Render extras in dedicated container
  if (extrasSection) {
    try {
      extrasSection.innerHTML = addonsHTML;
    } catch (_) {
      extrasSection.innerHTML = "";
    }
  }

  // ---------- SHOW APP ----------
  skel.style.display = "none";
  app.style.display = "block";
  app.style.opacity = "1";

  // ---------- BOTTOM NAV ----------
  function showTab(tabId) {
    state.activeTab = tabId;
    bnav.querySelectorAll(".v4-bnav__item").forEach(b => b.classList.remove("is-active"));
    const tabBtn = bnav.querySelector(`[data-nav="${tabId}"]`);
    if (tabBtn) tabBtn.classList.add("is-active");
    sectionsEl.style.display = "";
    if (extrasSection) extrasSection.style.display = "";
    cartInline.style.display = "none";
    document.getElementById("v4sec-" + tabId)?.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  function showCart() {
    sectionsEl.style.display = "none";
    if (extrasSection) extrasSection.style.display = "none";
    cartInline.style.display = "block";
    renderCartInline();
  }

  function hideCart() {
    sectionsEl.style.display = "";
    if (extrasSection) extrasSection.style.display = "";
    cartInline.style.display = "none";
  }

  bnav.onclick = e => {
    const btn = e.target.closest("[data-nav]");
    if (!btn) return;
    showTab(btn.dataset.nav);
  };

  // ---------- SCROLL OBSERVER for bottom nav active ----------
  const secIds = categories.map(c => "v4sec-" + c.id).concat("v4sec-extras");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const cid = entry.target.id.replace("v4sec-", "");
      state.activeTab = cid;
      bnav.querySelectorAll(".v4-bnav__item").forEach(b => {
        b.classList.toggle("is-active", b.dataset.nav === cid);
      });
    });
  }, { threshold:0.3 });
  secIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // ---------- PRODUCT CLICK ----------
  sectionsEl.onclick = e => {
    const card = e.target.closest("[data-id]");
    if (!card) return;
    const p = byId[card.dataset.id];
    if (!p) return;
    if (p.action === "builder") openWizard(p);
    else if (p.action === "add") { addToCart({ name:p.name, unitPrice:Number(p.price||0), qty:1, details:[] }); showToast("¡Agregado!"); }
    else if (p.action === "inquiry") {
      const wa = brand.whatsappNumber || "";
      openWA(`https://wa.me/${wa}?text=${encodeURIComponent("Hola, quiero info de " + (p.name||"este producto"))}`);
    }
  };

  // ---------- CART ----------
  function addToCart(item) {
    state.cart.push(item);
    updateCartUI();
  }
  function removeFromCart(idx) {
    state.cart.splice(idx, 1);
    updateCartUI();
    if (state.cart.length === 0) {
      hideCart();
    } else {
      renderCartInline();
    }
  }
  function clearCart() {
    state.cart.length = 0;
    updateCartUI();
    hideCart();
    showToast("Carrito vaciado");
  }
  function updateCartUI() {
    const qty = state.cart.reduce((s,i) => s + i.qty, 0);
    const total = state.cart.reduce((s,i) => s + i.qty * i.unitPrice, 0);
    if (qty > 0) {
      cartBar.classList.add("is-visible");
      cartBarCount.textContent = String(qty);
      cartBarTotal.textContent = money.format(total);
    } else {
      cartBar.classList.remove("is-visible");
    }
    cartInlineCount.textContent = qty + " items";
    cartInlineTotal.textContent = money.format(total);
  }
  cartBarBtn.onclick = () => {
    showCart();
  };

  function renderCartInline() {
    cartInlineItems.innerHTML = state.cart.length
      ? state.cart.map((item, i) => `
          <div class="v4-cart-item">
            <div class="v4-cart-item__info">
              <h4>${esc(item.name)}</h4>
              ${item.details && item.details.length ? `<ul>${item.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
            </div>
            <div class="v4-cart-item__right">
              <span class="v4-cart-item__price">${money.format(Number(item.unitPrice||0))}</span>
              <button class="v4-cart-item__del" data-ri="${i}">&times;</button>
            </div>
          </div>
        `).join('')
      : `<div class="v4-empty"><div class="v4-empty__icon">🛒</div><p>Aún no tienes productos. Explora el menú y arma tu pedido.</p></div>`;
  }

  cartInlineItems.onclick = e => {
    const btn = e.target.closest("[data-ri]");
    if (!btn) return;
    removeFromCart(Number(btn.dataset.ri));
  };

  // ---------- WHATSAPP + DELIVERY ----------
  function openWA(url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 100);
  }

  function buildWhatsAppMsg(type, address) {
    const total = state.cart.reduce((s,i) => s + i.qty * i.unitPrice, 0);
    const lines = ["Hola, quiero pedir:"]
      .concat(state.cart.map((i,n) => `${n+1}. ${i.name}${i.details&&i.details.length?"\n   + "+i.details.join("\n   + "):""} - ${money.format(i.unitPrice)}`))
      .concat([`Total: ${money.format(total)}`]);
    if (type === "pickup") {
      lines.push("", "Voy a recoger en el restaurante");
    } else {
      lines.push("", "A domicilio");
      if (address) lines.push(`Direccion: ${address}`);
    }
    return lines.join("\n");
  }

  function openDeliveryModal() {
    if (!state.cart.length) return;
    deliveryAddrBox.style.display = "none";
    deliveryAddrInput.value = "";
    deliveryOverlay.classList.add("is-open");
  }

  function closeDeliveryModal() {
    deliveryOverlay.classList.remove("is-open");
    deliveryAddrBox.style.display = "none";
  }

  function sendToWhatsApp(type) {
    const address = type === "delivery" ? deliveryAddrInput.value.trim() : "";
    const msg = buildWhatsAppMsg(type, address);
    openWA(`https://wa.me/${brand.whatsappNumber||""}?text=${encodeURIComponent(msg)}`);
    closeDeliveryModal();
  }

  deliveryClose.onclick = closeDeliveryModal;
  deliveryOverlay.onclick = e => { if (e.target === deliveryOverlay) closeDeliveryModal(); };

  deliveryPickup.onclick = () => sendToWhatsApp("pickup");

  deliveryAddrBtn.onclick = () => {
    deliveryAddrBox.style.display = "block";
    setTimeout(() => deliveryAddrInput.focus(), 100);
  };

  deliverySend.onclick = () => sendToWhatsApp("delivery");

  deliveryAddrInput.onkeydown = e => {
    if (e.key === "Enter") { e.preventDefault(); sendToWhatsApp("delivery"); }
  };

  cartInlineWA.onclick = () => openDeliveryModal();
  ticketWhatsApp.onclick = () => openDeliveryModal();

  cartInlineServer.onclick = () => {
    if (!state.cart.length) return;
    serverOrder.innerHTML = state.cart.map(item => `
      <div class="v4-server-item">
        <h4>${esc(item.name)}</h4>
        ${item.details && item.details.length ? `<ul>${item.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('') + `
      <div class="v4-server-total">
        <span>Total</span>
        <strong>${money.format(state.cart.reduce((s,i) => s + i.qty * i.unitPrice, 0))}</strong>
      </div>`;
    serverMode.classList.add("is-open");
  };

  cartInlineClear.onclick = () => {
    if (!state.cart.length) return;
    clearCart();
  };

  cartInlineBack.onclick = () => hideCart();

  // ---------- WIZARD ----------
  function openWizard(p) {
    state.wizard = { product:p, step:1, variant:null, selectedAddons:new Set() };
    wizard.classList.add("is-open");
    renderWizardStep();
  }
  function closeWizard() {
    wizard.classList.remove("is-open");
    state.wizard = { product:null, step:1, variant:null, selectedAddons:new Set() };
  }

  wizClose.onclick = closeWizard;
  wizBack.onclick = () => {
    if (state.wizard.step <= 1) { closeWizard(); return; }
    state.wizard.step--;
    renderWizardStep();
  };
  wizard.onclick = e => { if (e.target === wizard) closeWizard(); };

  wizNext.onclick = () => {
    const w = state.wizard;
    if (w.step === 1) {
      if (!w.variant) { showToast("Elige una proteína"); return; }
      w.step = 2;
    } else if (w.step === 2) {
      w.step = 3;
    } else if (w.step === 3) {
      finishWizard();
      return;
    }
    renderWizardStep();
  };

  function renderWizardStep() {
    const w = state.wizard;
    const p = w.product;
    const variants = Array.isArray(p.variants) ? p.variants : [];
    const allAddons = [].concat(addons.proteins||[], addons.toppings||[], addons.premiumSauces||[], addons.freeSauces||[]);
    const allAddonsById = Object.fromEntries(allAddons.map(a => [a.id, a]));

    // Update step indicators
    wizSteps.querySelectorAll(".wiz-step").forEach((s, i) => {
      s.classList.remove("is-active","is-done");
      if (i+1 < w.step) s.classList.add("is-done");
      if (i+1 === w.step) s.classList.add("is-active");
    });
    wizSteps.querySelectorAll(".wiz-connector").forEach((c, i) => {
      c.classList.toggle("is-done", i+1 < w.step);
    });

    // Calculate running total
    const variantObj = variants.find(v => v.id === w.variant) || { price:0 };
    let total = Number(variantObj.price || 0);
    w.selectedAddons.forEach(aid => {
      const a = allAddonsById[aid];
      if (a) total += Number(a.price || 0);
    });
    wizTotal.textContent = money.format(total);

    // Render body
    if (w.step === 1) {
      wizNext.textContent = "Siguiente →";
      wizNext.disabled = !w.variant;
      wizBody.innerHTML = `
        <h3 class="wiz-title">${esc(p.name)}</h3>
        <p class="wiz-hint">Paso 1 de 3 — Elige tu proteína base</p>
        <div class="wiz-options">
          ${variants.map(v => `
            <div class="wiz-option ${w.variant === v.id ? 'is-selected' : ''}" data-vid="${v.id}">
              <div class="wiz-option__icon">${v.id === 'res' ? '🥩' : '🍗'}</div>
              <div class="wiz-option__info">
                <strong>${esc(v.label)}</strong>
                <span>Proteína principal</span>
              </div>
              <span class="wiz-option__price">${money.format(Number(v.price||0))}</span>
            </div>
          `).join('')}
        </div>`;
      wizBody.querySelectorAll(".wiz-option").forEach(el => {
        el.onclick = () => {
          w.variant = el.dataset.vid;
          renderWizardStep();
        };
      });
    }
    else if (w.step === 2) {
      wizNext.disabled = false;
      wizNext.textContent = w.selectedAddons.size ? "Siguiente →" : "Saltar →";
      const proteins = addons.proteins || [];
      wizBody.innerHTML = `
        <h3 class="wiz-title">Proteínas extra</h3>
        <p class="wiz-hint">Paso 2 de 3 — Agrega más proteína (opcional)</p>
        <div class="wiz-options">
          ${proteins.map(a => `
            <div class="wiz-checkbox ${w.selectedAddons.has(a.id) ? 'is-checked' : ''}" data-aid="${a.id}">
              <div class="wiz-checkbox__check">${w.selectedAddons.has(a.id) ? '✓' : ''}</div>
              <div class="wiz-checkbox__info">
                <strong>${esc(a.name)}</strong>
              </div>
              <span class="wiz-checkbox__price">+ ${money.format(Number(a.price||0))}</span>
            </div>
          `).join('')}
        </div>
        <p class="wiz-skip-hint">Si no quieres proteína extra, toca <strong>Saltar</strong></p>`;
      wizBody.querySelectorAll(".wiz-checkbox").forEach(el => {
        el.onclick = () => {
          const aid = el.dataset.aid;
          if (w.selectedAddons.has(aid)) w.selectedAddons.delete(aid);
          else w.selectedAddons.add(aid);
          renderWizardStep();
        };
      });
    }
    else if (w.step === 3) {
      wizNext.disabled = false;
      wizNext.textContent = w.selectedAddons.size ? "Agregar al pedido ✓" : "Agregar sin extras";
      const toppings = addons.toppings || [];
      const freeSauces = addons.freeSauces || [];
      const premiumSauces = addons.premiumSauces || [];
      wizBody.innerHTML = `
        <h3 class="wiz-title">Toppings & Salsas</h3>
        <p class="wiz-hint">Paso 3 de 3 — Elige toppings y salsas (opcional)</p>
        <div class="wiz-group-label">🧀 Toppings</div>
        ${toppings.map(a => `
          <div class="wiz-checkbox ${w.selectedAddons.has(a.id) ? 'is-checked' : ''}" data-aid="${a.id}">
            <div class="wiz-checkbox__check">${w.selectedAddons.has(a.id) ? '✓' : ''}</div>
            <div class="wiz-checkbox__info"><strong>${esc(a.name)}</strong></div>
            <span class="wiz-checkbox__price">+ ${money.format(Number(a.price||0))}</span>
          </div>
        `).join('')}
        <div class="wiz-group-label">🔥 Salsas Premium</div>
        ${premiumSauces.map(a => `
          <div class="wiz-checkbox ${w.selectedAddons.has(a.id) ? 'is-checked' : ''}" data-aid="${a.id}">
            <div class="wiz-checkbox__check">${w.selectedAddons.has(a.id) ? '✓' : ''}</div>
            <div class="wiz-checkbox__info"><strong>${esc(a.name)}</strong></div>
            <span class="wiz-checkbox__price">+ ${money.format(Number(a.price||0))}</span>
          </div>
        `).join('')}
        <div class="wiz-group-label">🆓 Salsas Gratis</div>
        ${freeSauces.map(a => `
          <div class="wiz-checkbox ${w.selectedAddons.has(a.id) ? 'is-checked' : ''}" data-aid="${a.id}">
            <div class="wiz-checkbox__check">${w.selectedAddons.has(a.id) ? '✓' : ''}</div>
            <div class="wiz-checkbox__info"><strong>${esc(a.name)}</strong></div>
            <span class="wiz-checkbox__price wiz-checkbox__price--free">Gratis</span>
          </div>
        `).join('')}
        <p class="wiz-skip-hint">Si no quieres extras, toca <strong>Agregar sin extras</strong></p>`;
      wizBody.querySelectorAll(".wiz-checkbox").forEach(el => {
        el.onclick = () => {
          const aid = el.dataset.aid;
          if (w.selectedAddons.has(aid)) w.selectedAddons.delete(aid);
          else w.selectedAddons.add(aid);
          renderWizardStep();
        };
      });
    }

    wizFoot.style.display = "flex";
  }

  function finishWizard() {
    const w = state.wizard;
    const p = w.product;
    const variants = Array.isArray(p.variants) ? p.variants : [];
    const allAddons = [].concat(addons.proteins||[], addons.toppings||[], addons.premiumSauces||[], addons.freeSauces||[]);
    const allAddonsById = Object.fromEntries(allAddons.map(a => [a.id, a]));
    const variantObj = variants.find(v => v.id === w.variant) || { label:"", price:0 };

    const chosen = [];
    w.selectedAddons.forEach(aid => {
      const a = allAddonsById[aid];
      if (a) chosen.push(a);
    });

    const price = Number(variantObj.price || 0) + chosen.reduce((s,a) => s + Number(a.price||0), 0);
    const name = `${p.name||""}${variantObj.label ? " · " + variantObj.label : ""}`;

    addToCart({ name, unitPrice:price, qty:1, details:chosen.map(x => x.name) });
    closeWizard();
    showToast("¡Agregado al pedido!");
    cartBar.classList.add("v4-cartbar--pulse");
    setTimeout(() => cartBar.classList.remove("v4-cartbar--pulse"), 400);
  }

  // ---------- TICKET VIEW ----------
  function renderTicket() {
    ticketBody.innerHTML = state.cart.length
      ? state.cart.map((item, i) => `
          <div class="v4-ticket__item">
            <div class="v4-ticket__item-info">
              <h4>${esc(item.name)}</h4>
              ${item.details && item.details.length ? `<ul>${item.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
            </div>
            <span class="v4-ticket__item-price">${money.format(Number(item.unitPrice||0))}</span>
          </div>
        `).join('') + `
          <div class="v4-ticket__total-row">
            <span>Total</span>
            <strong>${money.format(state.cart.reduce((s,i) => s + i.qty * i.unitPrice, 0))}</strong>
          </div>`
      : `<div class="v4-empty"><div class="v4-empty__icon">🛒</div><p>Aún no tienes productos</p></div>`;
  }

  ticketClose.onclick = () => ticketOverlay.classList.remove("is-open");
  ticketOverlay.onclick = e => { if (e.target === ticketOverlay) ticketOverlay.classList.remove("is-open"); };

  ticketShowServer.onclick = () => {
    if (!state.cart.length) return;
    serverOrder.innerHTML = state.cart.map(item => `
      <div class="v4-server-item">
        <h4>${esc(item.name)}</h4>
        ${item.details && item.details.length ? `<ul>${item.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('') + `
      <div class="v4-server-total">
        <span>Total</span>
        <strong>${money.format(state.cart.reduce((s,i) => s + i.qty * i.unitPrice, 0))}</strong>
      </div>`;
    ticketOverlay.classList.remove("is-open");
    serverMode.classList.add("is-open");
  };

  serverBack.onclick = () => serverMode.classList.remove("is-open");
  serverMode.onclick = e => { if (e.target === serverMode) serverMode.classList.remove("is-open"); };

  // ---------- TOAST ----------
  let toastTimer;
  function showToast(msg) {
    toastMsg.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  }

  // ---------- HELPERS ----------
  function getPriceLabel(p) {
    if (p.action === "builder") {
      const variants = Array.isArray(p.variants) ? p.variants : [];
      if (variants.length) { const min = Math.min(...variants.map(v => Number(v.price||0))); return `Desde ${money.format(min)}`; }
      return "Consultar";
    }
    if (p.action === "add") return typeof p.price === "number" ? money.format(Number(p.price||0)) : "Consultar";
    return "Consultar";
  }
  function esc(t) { return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function getProductEmoji(p) {
    const id = p.id || "";
    if (id.startsWith("base-pan") || id.startsWith("base-arepa") || id.startsWith("base-patacona") || id.startsWith("base-aguacate")) return "🍔";
    if (id.startsWith("perro")) return "🌭";
    if (id.startsWith("salchi")) return "🍟";
    if (id.startsWith("esp-mazorcada")) return "🌽";
    if (id.startsWith("esp-costillitas")) return "🍖";
    if (id.startsWith("esp-ensalada")) return "🥗";
    if (id.startsWith("esp-arepa")) return "🫓";
    if (id.startsWith("ent-arepitas") || id.startsWith("ent-arepa")) return "🫓";
    if (id.startsWith("ent-chorizo")) return "🌭";
    if (id.startsWith("ent-aritos")) return "🧅";
    if (id.startsWith("ent-papas")) return "🍟";
    if (id.startsWith("beb-limonadas")) return "🍋";
    if (id.startsWith("beb-jugos")) return "🧃";
    if (id.startsWith("beb-postobon") || id.startsWith("beb-cocacola")) return "🥤";
    if (id.startsWith("beb-cerveza")) return "🍺";
    return "🍽️";
  }

  // ---------- SERVICE WORKER ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }

  updateCartUI();
})();

(function () {
  let menu = null;
  let selectedId = null;
  let search = "";
  let isSaving = false;
  let isDirty = false;

  const $ = (id) => document.getElementById(id);
  const els = {
    loginPanel: $("loginPanel"),
    appPanel: $("appPanel"),
    loginUser: $("loginUser"),
    loginPass: $("loginPass"),
    loginBtn: $("loginBtn"),
    loginMsg: $("loginMsg"),
    saveBtn: $("saveBtn"),
    logoutBtn: $("logoutBtn"),
    newProductBtn: $("newProductBtn"),
    brandName: $("brandName"),
    brandWhatsapp: $("brandWhatsapp"),
    productSearch: $("productSearch"),
    productList: $("productList"),
    emptyEditor: $("emptyEditor"),
    productEditor: $("productEditor"),
    duplicateBtn: $("duplicateBtn"),
    deleteBtn: $("deleteBtn"),
    productIdTag: $("productIdTag"),
    fName: $("fName"),
    fCategory: $("fCategory"),
    fDescription: $("fDescription"),
    fAction: $("fAction"),
    fPrice: $("fPrice"),
    fPriceField: $("fPriceField"),
    fPriceHelp: $("fPriceHelp"),
    fUpload: $("fUpload"),
    fImage: $("fImage"),
    previewImg: $("previewImg"),
    imgPreviewWrap: $("imgPreviewWrap"),
    cropOverlay: $("cropOverlay"),
    cropCanvas: $("cropCanvas"),
    cropCanvasWrap: $("cropCanvasWrap"),
    cropBgColor: $("cropBgColor"),
    cropResultPreview: $("cropResultPreview"),
    editImgBtn: $("editImgBtn"),
    cropCloseBtn: $("cropCloseBtn"),
    cropRotateLeft: $("cropRotateLeft"),
    cropRotateRight: $("cropRotateRight"),
    cropZoomIn: $("cropZoomIn"),
    cropZoomOut: $("cropZoomOut"),
    cropReset: $("cropReset"),
    cropConfirmBtn: $("cropConfirmBtn"),
    variantsBox: $("variantsBox"),
    addVariantBtn: $("addVariantBtn"),
    pricePreviewText: $("pricePreviewText"),
    headerUser: $("headerUser"),
    admToast: $("admToast"),
    extrasEdit: $("extrasEdit")
  };

  els.loginBtn.onclick = login;
  els.logoutBtn.onclick = logout;
  els.newProductBtn.onclick = createProduct;
  els.saveBtn.onclick = saveAll;
  els.productSearch.oninput = (e) => {
    search = String(e.target.value || "").trim().toLowerCase();
    renderList();
  };
  els.duplicateBtn.onclick = duplicateCurrent;
  els.deleteBtn.onclick = deleteCurrent;
  els.addVariantBtn.onclick = addVariant;
  els.fUpload.onchange = openCropperOnUpload;

  var cropEditor = {
    canvas: null, ctx: null, image: null,
    scale: 1, minScale: 0.1, maxScale: 3,
    offsetX: 0, offsetY: 0,
    bgColor: "transparent",
    dragging: false, lastX: 0, lastY: 0,
    FRAME_W: 800, FRAME_H: 450
  };

  function openCropperOnUpload(e) {
    var file = e.target.files?.[0];
    if (!file) return;
    abrirEditor(file);
  }

  function abrirEditor(fileOrBlob) {
    cerrarEditorQuiet();
    els.cropOverlay.classList.add("is-open");
    var url = URL.createObjectURL(fileOrBlob);
    var img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(url);
      iniciarCanvasTrans(img);
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      toast("No se pudo cargar la imagen", "err");
      cerrarEditor();
    };
    img.src = url;
  }

  function iniciarCanvasTrans(source) {
    try {
      var e = cropEditor;
      e.image = source;
      e.canvas = els.cropCanvas;
      e.dpr = window.devicePixelRatio || 1;

      e.canvas.width = e.FRAME_W * e.dpr;
      e.canvas.height = e.FRAME_H * e.dpr;
      e.ctx = e.canvas.getContext("2d");

      e.maxScale = Math.min(e.FRAME_W / source.width, e.FRAME_H / source.height) * 1.5;
      e.scale = e.maxScale;
      e.offsetX = (e.FRAME_W - source.width * e.scale) / 2;
      e.offsetY = (e.FRAME_H - source.height * e.scale) / 2;
      e.dragging = false;

      dibujar();
    } catch (_) {
      toast("Error al inicializar el editor", "err");
      cerrarEditor();
    }
  }

  function dibujar() {
    try {
      var e = cropEditor;
      if (!e.ctx || !e.image) return;
      var ctx = e.ctx;
      var dpr = e.dpr || 1;
      var fw = e.FRAME_W * dpr;
      var fh = e.FRAME_H * dpr;
      var w = e.image.width * e.scale * dpr;
      var h = e.image.height * e.scale * dpr;
      var ox = e.offsetX * dpr;
      var oy = e.offsetY * dpr;

      ctx.clearRect(0, 0, fw, fh);

      if (e.bgColor === "transparent") {
        var size = 10 * dpr;
        for (var x = 0; x < fw; x += size) {
          for (var y = 0; y < fh; y += size) {
            ctx.fillStyle = ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) ? "#cccccc" : "#ffffff";
            ctx.fillRect(x, y, size, size);
          }
        }
      } else {
        ctx.fillStyle = e.bgColor;
        ctx.fillRect(0, 0, fw, fh);
      }

      ctx.drawImage(e.image, ox, oy, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1 * dpr;
      ctx.strokeRect(0, 0, fw, fh);

      actualizarPreview();
    } catch (_) {}
  }

  function actualizarPreview() {
    var e = cropEditor;
    if (!e.canvas || !e.image) return;
    var prevCanvas = els.cropResultPreview;
    prevCanvas.width = e.FRAME_W;
    prevCanvas.height = e.FRAME_H;
    var pctx = prevCanvas.getContext("2d");
    pctx.clearRect(0, 0, e.FRAME_W, e.FRAME_H);
    pctx.drawImage(e.canvas, 0, 0, e.FRAME_W, e.FRAME_H);
  }

  function cerrarEditor() {
    cropEditor.image = null; cropEditor.canvas = null; cropEditor.ctx = null;
    cropEditor.dragging = false;
    els.cropCanvas.width = 0; els.cropCanvas.height = 0;
    els.fUpload.value = "";
    els.cropOverlay.classList.remove("is-open");
  }

  function cerrarEditorQuiet() {
    cropEditor.image = null; cropEditor.canvas = null; cropEditor.ctx = null;
    cropEditor.dragging = false;
    els.cropCanvas.width = 0; els.cropCanvas.height = 0;
  }

  function logicalDelta(clientDeltaX, clientDeltaY) {
    var e = cropEditor;
    if (!e.canvas || e.canvas.clientWidth === 0) return { dx: clientDeltaX, dy: clientDeltaY };
    return {
      dx: clientDeltaX * (e.FRAME_W / e.canvas.clientWidth),
      dy: clientDeltaY * (e.FRAME_H / e.canvas.clientHeight)
    };
  }

  // --- MOUSE / TOUCH / WHEEL eventos ---
  var c = els.cropCanvas;

  c.addEventListener("mousedown", function (ev) {
    cropEditor.dragging = true;
    cropEditor.lastX = ev.clientX;
    cropEditor.lastY = ev.clientY;
  });
  window.addEventListener("mousemove", function (ev) {
    if (!cropEditor.dragging || !cropEditor.image) return;
    var d = logicalDelta(ev.clientX - cropEditor.lastX, ev.clientY - cropEditor.lastY);
    cropEditor.offsetX += d.dx;
    cropEditor.offsetY += d.dy;
    cropEditor.lastX = ev.clientX;
    cropEditor.lastY = ev.clientY;
    dibujar();
  });
  window.addEventListener("mouseup", function () { cropEditor.dragging = false; });

  c.addEventListener("touchstart", function (ev) {
    if (ev.touches.length === 1) {
      cropEditor.dragging = true;
      cropEditor.lastX = ev.touches[0].clientX;
      cropEditor.lastY = ev.touches[0].clientY;
    }
  }, { passive: true });
  c.addEventListener("touchmove", function (ev) {
    if (!cropEditor.dragging || ev.touches.length !== 1) return;
    ev.preventDefault();
    var d = logicalDelta(ev.touches[0].clientX - cropEditor.lastX, ev.touches[0].clientY - cropEditor.lastY);
    cropEditor.offsetX += d.dx;
    cropEditor.offsetY += d.dy;
    cropEditor.lastX = ev.touches[0].clientX;
    cropEditor.lastY = ev.touches[0].clientY;
    dibujar();
  }, { passive: false });
  c.addEventListener("touchend", function () { cropEditor.dragging = false; });

  c.addEventListener("wheel", function (ev) {
    if (!cropEditor.image) return;
    ev.preventDefault();
    var delta = ev.deltaY > 0 ? -0.05 : 0.05;
    cropEditor.scale = Math.max(cropEditor.minScale, Math.min(cropEditor.maxScale, cropEditor.scale + delta));
    cropEditor.offsetX = (cropEditor.FRAME_W - cropEditor.image.width * cropEditor.scale) / 2;
    cropEditor.offsetY = (cropEditor.FRAME_H - cropEditor.image.height * cropEditor.scale) / 2;
    dibujar();
  }, { passive: false });

  // --- BOTONES ---
  els.cropCloseBtn.onclick = cerrarEditor;
  els.cropOverlay.onclick = function (ev) { if (ev.target === els.cropOverlay) cerrarEditor(); };

  els.cropRotateLeft.onclick = function () {
    if (!cropEditor.image) return;
    cropEditor.scale = Math.max(cropEditor.minScale, Math.min(cropEditor.maxScale, cropEditor.scale + 0.1));
    cropEditor.offsetX = (cropEditor.FRAME_W - cropEditor.image.width * cropEditor.scale) / 2;
    cropEditor.offsetY = (cropEditor.FRAME_H - cropEditor.image.height * cropEditor.scale) / 2;
    dibujar();
  };
  els.cropRotateRight.onclick = function () {
    if (!cropEditor.image) return;
    cropEditor.scale = Math.max(cropEditor.minScale, Math.min(cropEditor.maxScale, cropEditor.scale - 0.1));
    cropEditor.offsetX = (cropEditor.FRAME_W - cropEditor.image.width * cropEditor.scale) / 2;
    cropEditor.offsetY = (cropEditor.FRAME_H - cropEditor.image.height * cropEditor.scale) / 2;
    dibujar();
  };
  els.cropZoomIn.onclick = function () {
    if (!cropEditor.image) return;
    cropEditor.scale = Math.max(cropEditor.minScale, Math.min(cropEditor.maxScale, cropEditor.scale + 0.15));
    cropEditor.offsetX = (cropEditor.FRAME_W - cropEditor.image.width * cropEditor.scale) / 2;
    cropEditor.offsetY = (cropEditor.FRAME_H - cropEditor.image.height * cropEditor.scale) / 2;
    dibujar();
  };
  els.cropZoomOut.onclick = function () {
    if (!cropEditor.image) return;
    cropEditor.scale = Math.max(cropEditor.minScale, Math.min(cropEditor.maxScale, cropEditor.scale - 0.15));
    cropEditor.offsetX = (cropEditor.FRAME_W - cropEditor.image.width * cropEditor.scale) / 2;
    cropEditor.offsetY = (cropEditor.FRAME_H - cropEditor.image.height * cropEditor.scale) / 2;
    dibujar();
  };
  els.cropReset.onclick = function () {
    if (!cropEditor.image) return;
    cropEditor.scale = Math.min(cropEditor.FRAME_W / cropEditor.image.width, cropEditor.FRAME_H / cropEditor.image.height);
    cropEditor.offsetX = (cropEditor.FRAME_W - cropEditor.image.width * cropEditor.scale) / 2;
    cropEditor.offsetY = (cropEditor.FRAME_H - cropEditor.image.height * cropEditor.scale) / 2;
    dibujar();
  };

  function cambiarFondo(color) {
    cropEditor.bgColor = color;
    if (els.cropBgColor) els.cropBgColor.value = color === "transparent" ? "#cccccc" : color;
    dibujar();
  }

  if (els.cropBgColor) {
    els.cropBgColor.oninput = function () {
      cambiarFondo(this.value);
    };
  }

  window.cambiarFondo = cambiarFondo;

  els.cropConfirmBtn.onclick = function () {
    var e = cropEditor;
    if (!e.image) { return toast("No hay imagen cargada", "err"); }
    var p = current();
    if (!p) { cerrarEditor(); return toast("Producto no encontrado", "err"); }

    var btn = els.cropConfirmBtn;
    btn.disabled = true;
    btn.textContent = "Procesando...";

    var safetyTimer = setTimeout(function () {
      if (btn.disabled) {
        btn.disabled = false;
        btn.textContent = "Confirmar";
        toast("Tiempo agotado. Intenta de nuevo.", "err");
      }
    }, 15000);

    function reEnable() {
      clearTimeout(safetyTimer);
      btn.disabled = false;
      btn.textContent = "Confirmar";
    }

    try {
      var exportCanvas = document.createElement("canvas");
      exportCanvas.width = e.FRAME_W;
      exportCanvas.height = e.FRAME_H;
      var exCtx = exportCanvas.getContext("2d");

      if (e.bgColor !== "transparent") {
        exCtx.fillStyle = e.bgColor;
        exCtx.fillRect(0, 0, e.FRAME_W, e.FRAME_H);
      }

      exCtx.drawImage(e.image, e.offsetX, e.offsetY, e.image.width * e.scale, e.image.height * e.scale);

      var isTransparent = e.bgColor === "transparent";
      var mime = isTransparent ? "image/png" : "image/jpeg";
      var filename = isTransparent ? "imagen.png" : "imagen.jpg";

      var dataUrl = exportCanvas.toDataURL(mime, isTransparent ? undefined : 0.92);
      var parts = dataUrl.split(",");
      var mimeFromUrl = parts[0].match(/:(.*?);/)[1];
      var binaryStr = atob(parts[1]);
      var bytes = new Uint8Array(binaryStr.length);
      for (var i = 0; i < binaryStr.length; i++) { bytes[i] = binaryStr.charCodeAt(i); }
      var blob = new Blob([bytes], { type: mimeFromUrl });

      var fd = new FormData();
      fd.append("image", blob, filename);
      fd.append("bgColor", e.bgColor);
      fd.append("oldImage", p.image || "");

      fetch("/api/admin/upload", { method: "POST", body: fd })
        .then(function (r) {
          return r.json().then(function (data) {
            return { ok: r.ok, status: r.status, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok || !result.data.imagePath) {
            reEnable();
            return toast("Error del servidor: " + (result.data.error || "HTTP " + result.status), "err");
          }
          p.image = result.data.imagePath;
          els.fImage.value = p.image;
          els.previewImg.src = p.image;
          cerrarEditor();
          toast("Imagen guardada. Guarda los cambios.", "ok");
          markDirty();
          renderList();
        })
        .catch(function (err) {
          reEnable();
          toast("Error de conexion: " + (err.message || "sin respuesta"), "err");
        });

    } catch (_e) {
      reEnable();
      toast("Error inesperado al procesar", "err");
    }
  };

  els.editImgBtn.onclick = function () {
    var p = current();
    if (!p || !p.image) return toast("Este producto no tiene imagen propia para editar", "err");
    var fallback = menu.brand?.fallbackImage || "logo-horizontal-naranja";
    if (p.image.includes(fallback)) return toast("Este producto no tiene imagen propia para editar", "err");
    abrirEditorDesdeURL(p.image);
  };

  function abrirEditorDesdeURL(imagePath) {
    if (!imagePath) return;
    cerrarEditorQuiet();
    els.cropOverlay.classList.add("is-open");
    var img = new Image();
    img.onload = function () {
      iniciarCanvasTrans(img);
    };
    img.onerror = function () {
      toast("No se pudo cargar la imagen", "err");
      cerrarEditor();
    };
    img.src = imagePath;
  }

  ["fName","fCategory","fDescription","fAction","fPrice","fImage"].forEach((id) => {
    els[id].addEventListener("input", syncEditorToProduct);
    els[id].addEventListener("change", syncEditorToProduct);
  });

  boot();

  async function boot() {
    if (location.protocol === "file:") {
      toast("Este panel requiere el servidor activo. Abre http://localhost:3000/admin.html", "err");
      return;
    }
    try {
      const s = await fetchJson("/api/admin/session");
      if (s.authenticated) await loadAdmin();
    } catch (_e) {
      setLoginMsg("Servidor no disponible. Ejecuta node server/server.js", "err");
    }
  }

  async function login() {
    setLoginMsg("", "");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: els.loginUser.value.trim(), password: els.loginPass.value })
      });
      if (!r.ok) return setLoginMsg("Credenciales incorrectas.", "err");
      await loadAdmin();
    } catch (_e) {
      setLoginMsg("Sin conexión con el servidor.", "err");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    location.reload();
  }

  async function loadAdmin() {
    try {
      menu = await fetchJson("/api/admin/menu");
    } catch (_e) {
      toast("Error al cargar datos del servidor", "err");
      return;
    }
    if (!menu || typeof menu !== "object") { menu = { products: [] }; }
    menu.products = Array.isArray(menu.products) ? menu.products : [];
    menu.categories = Array.isArray(menu.categories) ? menu.categories : [];
    menu.brand = menu.brand || {};
    els.loginPanel.style.display = "none";
    els.appPanel.style.display = "block";
    els.logoutBtn.style.display = "";
    els.headerUser.textContent = "admin";
    els.brandName && (els.brandName.value = menu.brand?.name || "");
    els.brandWhatsapp && (els.brandWhatsapp.value = menu.brand?.whatsappNumber || "");
    els.brandName?.addEventListener?.("input", markDirty);
    els.brandWhatsapp?.addEventListener?.("input", markDirty);
    selectedId = menu.products?.[0]?.id || null;
    renderList();
    renderEditor();
    renderExtras();
  }

  function renderList() {
    var raw = menu && Array.isArray(menu.products) ? menu.products : [];
    var items = search ? raw.filter(function (p) {
      if (!p || !p.name) return false;
      return (p.name + " " + (p.categoryId || "") + " " + (p.id || "") + " " + (p.description || "")).toLowerCase().includes(search);
    }) : raw;
    els.productList.innerHTML = items
      .map((p) => {
        const active = p.id === selectedId ? "active" : "";
        const priceText = displayPriceText(p);
        const badge = p.action === "builder" ? `<span class="adm-badge adm-badge--builder">Armable</span>`
          : p.action === "add" ? `<span class="adm-badge adm-badge--add">Directo</span>`
          : `<span class="adm-badge adm-badge--inquiry">Consulta</span>`;
        return `<button class="adm-list-item ${active}" data-id="${esc(p.id)}">
          <span class="adm-list-item__name">${esc(p.name || "(sin nombre)")}</span>
          <span class="adm-list-item__meta">${badge} ${esc(p.categoryId)} · ${esc(priceText)}</span>
        </button>`;
      })
      .join("");
    els.productList.querySelectorAll("[data-id]").forEach((btn) => {
      btn.onclick = () => {
        selectedId = btn.dataset.id;
        renderList();
        renderEditor();
      };
    });
  }

  function renderEditor() {
    const p = current();
    if (!p) {
      els.emptyEditor.style.display = "block";
      els.productEditor.style.display = "none";
      els.duplicateBtn.style.display = "none";
      els.deleteBtn.style.display = "none";
      return;
    }
    els.emptyEditor.style.display = "none";
    els.productEditor.style.display = "block";
    els.duplicateBtn.style.display = "";
    els.deleteBtn.style.display = "";

    els.productIdTag.textContent = `ID: ${p.id}`;
    els.previewImg.src = p.image || "";
    els.fName.value = p.name || "";
    els.fDescription.value = p.description || "";
    els.fAction.value = p.action || "add";
    els.fPrice.value = typeof p.price === "number" ? p.price : 0;
    els.fImage.value = p.image || "";

    els.fCategory.innerHTML = ((menu && menu.categories) || [])
      .map((c) => `<option value="${esc(c.id)}" ${c.id === p.categoryId ? "selected" : ""}>${esc(c.label)}</option>`)
      .join("");

    renderVariants(p);
    applyPriceModeUI(p);
    updatePricePreview(p);
  }

  function renderVariants(p) {
    const variants = Array.isArray(p.variants) ? p.variants : [];
    const locked = p.action !== "builder";
    const disabledAttr = locked ? "disabled" : "";
    els.variantsBox.innerHTML = variants
      .map((v, i) => `
        <div class="adm-var-row">
          <input data-v-label="${i}" value="${esc(v.label || "")}" placeholder="Nombre" ${disabledAttr}>
          <input data-v-price="${i}" type="number" min="0" value="${typeof v.price === "number" ? v.price : 0}" placeholder="Precio" ${disabledAttr}>
          <button type="button" class="adm-btn adm-btn--danger adm-btn--sm" data-v-del="${i}" ${disabledAttr}>Quitar</button>
        </div>`)
      .join("");

    els.variantsBox.querySelectorAll("[data-v-label]").forEach((x) => {
      x.oninput = () => {
        const idx = Number(x.dataset.vLabel);
        const c = current(); if (!c || !Array.isArray(c.variants) || !c.variants[idx]) return;
        c.variants[idx].label = x.value; markDirty(); renderList(); updatePricePreview(c);
      };
    });
    els.variantsBox.querySelectorAll("[data-v-price]").forEach((x) => {
      x.oninput = () => {
        const idx = Number(x.dataset.vPrice);
        const c = current(); if (!c || !Array.isArray(c.variants) || !c.variants[idx]) return;
        c.variants[idx].price = Number(x.value || 0); markDirty(); renderList(); updatePricePreview(c);
      };
    });
    els.variantsBox.querySelectorAll("[data-v-del]").forEach((x) => {
      x.onclick = () => {
        const idx = Number(x.dataset.vDel);
        const c = current(); if (!c || !Array.isArray(c.variants)) return;
        c.variants.splice(idx, 1); markDirty(); renderVariants(c); renderList(); updatePricePreview(c);
      };
    });
  }

  function addVariant() {
    const p = current(); if (!p || p.action !== "builder") return;
    if (!Array.isArray(p.variants)) p.variants = [];
    p.variants.push({ id: `var-${Date.now()}`, label: `Variante ${p.variants.length + 1}`, price: 0 });
    markDirty(); renderVariants(p); renderList(); updatePricePreview(p);
  }

  function syncEditorToProduct() {
    const p = current(); if (!p) return;
    p.name = els.fName.value.trim();
    p.categoryId = els.fCategory.value;
    p.description = els.fDescription.value;
    p.action = els.fAction.value;
    p.price = Number(els.fPrice.value || 0);
    const prevImage = p.image;
    p.image = els.fImage.value.trim();
    if (p.image !== prevImage && p.image) {
      els.previewImg.src = p.image;
    }

    if (p.action === "builder") {
      if (!Array.isArray(p.variants) || p.variants.length === 0) {
        p.variants = [
          { id: "var-1", label: "Variante 1", price: p.price || 0 },
          { id: "var-2", label: "Variante 2", price: p.price || 0 }
        ];
        renderVariants(p);
      }
    }
    markDirty();
    applyPriceModeUI(p);
    updatePricePreview(p);
  }

  function applyPriceModeUI(p) {
    const mode = p.action || "add";
    if (mode === "builder") {
      els.fPrice.disabled = true; els.fPriceField.classList.add("field-is-disabled");
      els.fPriceHelp.textContent = "No aplica. El menú usa precios por variante.";
      els.addVariantBtn.disabled = false; return;
    }
    if (mode === "inquiry") {
      els.fPrice.disabled = true; els.fPriceField.classList.add("field-is-disabled");
      els.fPriceHelp.textContent = "No aplica. El menú muestra \"Consultar\".";
      els.addVariantBtn.disabled = true; return;
    }
    els.fPrice.disabled = false; els.fPriceField.classList.remove("field-is-disabled");
    els.fPriceHelp.textContent = "Precio visible en el menú público.";
    els.addVariantBtn.disabled = true;
  }

  function updatePricePreview(p) {
    if (p.action === "builder") {
      const variants = Array.isArray(p.variants) ? p.variants : [];
      if (!variants.length) { els.pricePreviewText.textContent = "Agrega al menos una variante."; return; }
      const min = Math.min(...variants.map((v) => Number(v.price || 0)));
      els.pricePreviewText.textContent = `Vista previa: Desde ${fmt(min)}`;
      return;
    }
    if (p.action === "inquiry") { els.pricePreviewText.textContent = "Vista previa: Consultar"; return; }
    els.pricePreviewText.textContent = `Vista previa: ${fmt(Number(p.price || 0))}`;
  }

  function createProduct() {
    const p = {
      id: `prod-${Date.now()}`, categoryId: menu.categories?.[0]?.id || "bases",
      name: "Nuevo producto", description: "Descripción del producto",
      image: "./assets/brand/logo-horizontal-naranja.jpg", price: 0, action: "add"
    };
    menu.products.unshift(p); selectedId = p.id;
    renderList(); renderEditor(); toast("Producto creado. Guarda para confirmar.", "ok"); markDirty();
  }

  function duplicateCurrent() {
    const p = current(); if (!p) return;
    const copy = JSON.parse(JSON.stringify(p));
    copy.id = `prod-${Date.now()}`; copy.name = `${copy.name} (copia)`;
    menu.products.unshift(copy); selectedId = copy.id;
    renderList(); renderEditor(); toast("Producto duplicado. Guarda para confirmar.", "ok"); markDirty();
  }

  function deleteCurrent() {
    const p = current(); if (!p) return;
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    menu.products = menu.products.filter((x) => x.id !== p.id);
    selectedId = menu.products?.[0]?.id || null;
    renderList(); renderEditor(); toast("Producto eliminado. Guarda para confirmar.", "ok"); markDirty();
  }

  // ---------- EXTRAS / ADDONS EDITOR ----------
  const extrasGroups = [
    { key:"proteins", icon:"🥩", label:"Proteínas extra", hint:"Carnes y proteínas adicionales que el cliente puede agregar a su pedido" },
    { key:"toppings", icon:"🧀", label:"Toppings", hint:"Ingredientes y acompañamientos extra" },
    { key:"premiumSauces", icon:"🔥", label:"Salsas premium", hint:"Salsas especiales con costo adicional" },
    { key:"freeSauces", icon:"🆓", label:"Salsas gratis", hint:"Salsas sin costo incluidas" }
  ];

  function renderExtras() {
    if (!els.extrasEdit || !menu) return;
    menu.addons = menu.addons || {};
    els.extrasEdit.innerHTML = extrasGroups.map(g => {
      menu.addons[g.key] = menu.addons[g.key] || [];
      const items = menu.addons[g.key];
      return `<div class="adm-extras-group">
        <div class="adm-extras-group__head">
          <div>
            <strong>${g.icon} ${g.label}</strong>
            <span>${g.hint}</span>
          </div>
          <button class="adm-btn adm-btn--pri adm-btn--sm" data-addon-add="${g.key}">+ Agregar</button>
        </div>
        ${items.length ? items.map((a,i) => `
          <div class="adm-extras-row">
            <input class="adm-extras-input" data-ak="${g.key}" data-ai="${i}" data-field="name" value="${esc(a.name||'')}" placeholder="Nombre del extra">
            <input class="adm-extras-input adm-extras-input--price" data-ak="${g.key}" data-ai="${i}" data-field="price" type="number" min="0" value="${typeof a.price==='number'?a.price:0}" placeholder="0">
            <button class="adm-extras-del" data-addon-del="${g.key}" data-di="${i}" title="Eliminar">✕</button>
          </div>
        `).join('') : `<p class="adm-extras-empty">Sin items. Agrega el primero con el botón "+ Agregar".</p>`}
      </div>`;
    }).join('');

    els.extrasEdit.querySelectorAll("[data-addon-add]").forEach(btn => {
      btn.onclick = () => {
        const key = btn.dataset.addonAdd;
        menu.addons[key] = menu.addons[key] || [];
        menu.addons[key].push({ id: `addon-${Date.now()}`, name:"Nuevo extra", price:0 });
        markDirty(); renderExtras();
      };
    });
    els.extrasEdit.querySelectorAll("[data-addon-del]").forEach(btn => {
      btn.onclick = () => {
        const key = btn.dataset.addonDel;
        const i = Number(btn.dataset.di);
        menu.addons[key].splice(i, 1);
        markDirty(); renderExtras();
      };
    });
    els.extrasEdit.querySelectorAll("[data-ak]").forEach(input => {
      input.oninput = () => {
        const key = input.dataset.ak;
        const i = Number(input.dataset.ai);
        const field = input.dataset.field;
        const item = menu.addons[key]?.[i];
        if (!item) return;
        if (field === "name") item.name = input.value;
        if (field === "price") item.price = Number(input.value||0);
        markDirty();
      };
    });
  }

  async function saveAll() {
    if (isSaving) return; isSaving = true;
    setSaveButtonState(true);
    if (els.brandName) menu.brand.name = els.brandName.value.trim();
    if (els.brandWhatsapp) menu.brand.whatsappNumber = els.brandWhatsapp.value.trim();

    menu.products = (menu.products || []).filter(function (p) {
      return p && typeof p.id === "string" && p.id.length > 0;
    });

    try {
      const session = await fetchJson("/api/admin/session");
      if (!session.authenticated) { isSaving = false; setSaveButtonState(false); return toast("Sesión expirada. Vuelve a ingresar.", "err"); }
      const r = await fetch("/api/admin/menu", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(menu) });
      const payload = await r.json().catch(() => ({}));
      if (!r.ok) { isSaving = false; setSaveButtonState(false); return toast(`Error: ${payload.error || "No se pudo guardar"}.`, "err"); }
      toast("Cambios guardados.", "ok");
      isDirty = false; isSaving = false; setSaveButtonState(false);
    } catch (_e) {
      isSaving = false; setSaveButtonState(false); toast("Error de conexión.", "err");
    }
  }

  function markDirty() { isDirty = true; if (!isSaving) setSaveButtonState(false); }
  function setSaveButtonState(loading) {
    els.saveBtn.disabled = loading;
    els.saveBtn.textContent = loading ? "Guardando..." : isDirty ? "Guardar *" : "Guardar";
  }
  function current() {
    var prods = menu && Array.isArray(menu.products) ? menu.products : [];
    return prods.find(function (p) { return p && p.id === selectedId; }) || null;
  }
  function displayPriceText(p) {
    if (p.action === "builder" && Array.isArray(p.variants) && p.variants.length) {
      return `Desde ${fmt(Math.min(...p.variants.map((v) => Number(v.price || 0))))}`;
    }
    return typeof p.price === "number" ? fmt(p.price) : "Consultar";
  }
  async function fetchJson(url) { const r = await fetch(url, { cache: "no-store" }); return r.json(); }
  function fmt(value) {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value || 0));
  }
  function setLoginMsg(text, cls) { els.loginMsg.textContent = text; els.loginMsg.className = `adm-msg adm-msg--${cls || ""}`.trim(); }
  function esc(text) { return String(text||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  function toast(msg, type) {
    const el = els.admToast;
    el.textContent = (type === "err" ? "❌ " : "✅ ") + msg;
    el.className = "adm-toast show";
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => el.classList.remove("show"), 2500);
  }
})();

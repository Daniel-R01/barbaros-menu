const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(__dirname, "data", "menu.json");
const UPLOAD_DIR = path.join(ROOT, "assets", "products");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || require("crypto").randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }
  })
);

app.use("/assets", express.static(path.join(ROOT, "assets")));
app.use("/src", express.static(path.join(ROOT, "src")));
app.use("/manifest.webmanifest", express.static(path.join(ROOT, "manifest.webmanifest")));
app.use("/sw.js", express.static(path.join(ROOT, "sw.js")));
app.use("/index.html", express.static(path.join(ROOT, "index.html")));
app.use("/admin.html", express.static(path.join(ROOT, "src", "admin", "admin.html")));

function readMenu() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeMenu(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function ensureSeed() {
  if (fs.existsSync(DATA_FILE)) return;
  const seed = require("./seed-menu.json");
  writeMenu(seed);
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.adminUser) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

ensureSeed();

app.get("/api/menu", (_req, res) => {
  res.json(readMenu());
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body || {};
  const menu = readMenu();
  const admin = menu.admin;
  if (!admin || !username || !password) return res.status(400).json({ error: "Credenciales inválidas" });
  if (username !== admin.username) return res.status(401).json({ error: "Usuario o clave incorrectos" });
  let hash = admin.passwordHash;
  if (!String(hash).startsWith("$2")) {
    hash = await bcrypt.hash(String(hash), 10);
    menu.admin.passwordHash = hash;
    writeMenu(menu);
  }
  const ok = await bcrypt.compare(password, hash);
  if (!ok) return res.status(401).json({ error: "Usuario o clave incorrectos" });
  req.session.adminUser = username;
  return res.json({ ok: true, username });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/admin/session", (req, res) => {
  res.json({ authenticated: Boolean(req.session && req.session.adminUser), username: req.session?.adminUser || null });
});

app.get("/api/admin/menu", requireAdmin, (_req, res) => {
  const data = readMenu();
  const safe = { ...data };
  delete safe.admin;
  res.json(safe);
});

app.put("/api/admin/menu", requireAdmin, (req, res) => {
  try {
    const current = readMenu();
    const payload = req.body || {};
    const next = {
      ...payload,
      admin: current.admin
    };
    writeMenu(next);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Error interno guardando menu" });
  }
});

app.post("/api/admin/upload", requireAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Archivo faltante" });
  try {
    var bgColor = (req.body && req.body.bgColor) || "";
    var isTransparent = bgColor === "transparent";
    var ext = isTransparent ? ".png" : ".jpg";

    var origName = req.file.originalname || "producto";
    var dotIdx = origName.lastIndexOf(".");
    var base = dotIdx > 0 ? origName.substring(0, dotIdx) : origName;
    base = base.toLowerCase().replace(/[^a-z0-9\-]+/g, "-");
    var filename = base + "-" + Date.now() + ext;
    var outputPath = path.join(UPLOAD_DIR, filename);

    var pipeline = sharp(req.file.buffer).resize(800, 450, {
      fit: "contain",
      background: isTransparent
        ? { r: 0, g: 0, b: 0, alpha: 0 }
        : parseHexColor(bgColor)
    });

    if (isTransparent) {
      await pipeline.png().toFile(outputPath);
    } else {
      await pipeline.jpeg({ quality: 92 }).toFile(outputPath);
    }

    res.json({ ok: true, imagePath: "./assets/products/" + filename });

    var oldImage = (req.body && req.body.oldImage) || "";
    if (oldImage && oldImage !== "./assets/products/" + filename && !oldImage.includes("logo-horizontal-naranja")) {
      var oldPath = path.join(ROOT, oldImage.replace(/^\.\//, ""));
      try { fs.unlinkSync(oldPath); } catch (_) {}
    }
  } catch (err) {
    res.status(500).json({ error: err?.message || "Error procesando imagen" });
  }
});

function parseHexColor(hex) {
  hex = String(hex || "").replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return { r: 0, g: 0, b: 0, alpha: 1 };
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
    alpha: 1
  };
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Menu server running on http://localhost:${PORT}`);
});

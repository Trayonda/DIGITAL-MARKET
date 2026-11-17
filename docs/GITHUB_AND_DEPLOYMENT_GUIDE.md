# DIGITAL MARKET - Step-by-Step GitHub & Free Hosting Guide
*(Aasan Hindi Guide - Zero Errors Guaranteed)*

---

## 1. Pehle Samajhiye: GitHub aur Hosting me kya farq hai?

1. **GitHub Kya Hai?**
   - GitHub aapki website ke pure code ka **Cloud Locker / Backup** hai.
   - Yahan aapka code safely store hota hai taaki kabhi delete na ho.

2. **Kya Akela GitHub Website Live Kar Sakta Hai?**
   - GitHub ka ek feature hai *GitHub Pages*, lekin woh sirf static HTML chalata hai.
   - Aapki website **Full-Stack** hai (React Frontend + Node.js Backend + Database).
   - Isliye industry standard aur **100% Free Tarika** yeh hai:
     - **Code:** GitHub par rahega.
     - **Frontend (Website):** Vercel par 1-click me Free live hogi.
     - **Backend & Database:** Render.com par Free live hoga.

---

## 2. STEP 1: GitHub Website + GitHub Desktop (Clone Method - Sabse Best Tarika)

Aapne jo tarika pucha hai (Website par ja kar repository banana -> Link copy karna -> GitHub Desktop me daalna), woh sabse safe aur beginner-friendly tarika hai. Niche bilkul aasan steps hain:

### Step 1.1: GitHub Website Par Nayi Repository Banayein
1. Browser me jayein: **https://github.com/** aur apne account me Login karein.
2. Upar right corner me **`+` (Plus icon)** par click karein aur **"New repository"** chunein.
3. Form me:
   - **Repository name:** `digital-market` (ya koi bhi naam jo aap chahein).
   - **Public** ya **Private** me se jo aapko pasand ho chunein.
   - ⭐ **Zaroori:** **"Add a README file"** par tick (check) zaroor lagayein (taaki repo me turant code button aa jaye).
4. Neeche green button par click karein: **"Create repository"**.

### Step 1.2: Repository Ka Link Copy Karein
1. Ab aapki new repository ka page khulega.
2. Wahan ek green color ka button dikhega: **`<> Code`**.
3. Us par click karein:
   - Wahan do option milenge:
     - **Option 1 (Direct 1-Click):** **"Open with GitHub Desktop"** par click karein. (Isse GitHub Desktop app apne aap open ho jayega aur link bhi automatically dal jayega!)
     - **Option 2 (Manual Link Copy):** `HTTPS` ke neeche jo URL hai (jaise `https://github.com/YourName/digital-market.git`), uske bagal wale copy icon par click karke link copy kar lein.

### Step 1.3: GitHub Desktop App Me Clone Karein
1. Apne computer me **GitHub Desktop** app kholein.
2. Agar aapne "Open with GitHub Desktop" click kiya tha, toh sidha popup khul jayega.
3. Agar manual copy kiya hai:
   - Menu me jayein: `File` -> `Clone Repository...`
   - Wahan teesra tab chunein: **"URL"**.
   - **Repository URL or GitHub username and repository:** Me apna copied link paste karein.
   - **Local Path:** Yahan choose karein ki yeh folder aapke computer me kahan save ho (jaise `C:\Users\mmmm\Desktop\digital-market-github`).
   - Neeche blue button dabayein: **"Clone"**.
4. 2 second me aapka folder ready ho jayega!

### Step 1.4: Apne Files Ko Naye Cloned Folder Me Copy Karein
1. Ab aapke Desktop par do folder hain:
   - Folder 1 (Purana kaam): `C:\Users\mmmm\Desktop\LAPTOP sell website`
   - Folder 2 (Naya GitHub Cloned): `C:\Users\mmmm\Desktop\digital-market-github` (ya jo naam aapne rakha).
2. Purane folder (`LAPTOP sell website`) se yeh saari cheezein **Copy** karein:
   - `backend` folder
   - `frontend` folder
   - `my note` folder
   - `docs` folder
   - `start-all.bat` aur `start-all.ps1`
   - `.gitignore`
   - `package.json`
   *(Dhayan rahe: `node_modules` copy karne ki zaroorat nahi hai, kyunki woh internet se auto-download hota hai).*
3. In sabko naye cloned folder (`digital-market-github`) me **Paste** kar dein.

### Step 1.5: GitHub Desktop Se 1-Click Push Karein
1. GitHub Desktop app par wapas aayein.
2. Aap dekhenge ki left side me saari nayi files green color me dikhai dengi ("Changes").
3. Niche left corner me ek chhota box hoga **Summary**:
   - Wahan likhein: `Initial commit - Digital Market Platform`
4. Neeche blue button dabayein: **"Commit to main"**.
5. Upar top bar par ek button aayega: **"Push origin"** (Blue color).
6. Us par click karein!
7. **Badhai ho! 🎉** Aapka pura project GitHub website par upload ho chuka hai! Ab aap GitHub.com par page refresh karenge toh aapki saari files wahan live dikhengi.

---

## 3. STEP 2: Frontend Ko Internet Par LIVE Karna (Vercel Par - 100% Free)

Vercel par aapka frontend 2 minute me live ho jayega aur aapko ek link milegi (jaise: `https://digital-market.vercel.app`):

1. **Vercel Par Account Banayein:**
   - Website par jayein: https://vercel.com/
   - **Sign Up with GitHub** par click karein (Direct login ho jayega).
2. **Project Import Karein:**
   - Dashboard par **"Add New..."** -> **"Project"** par click karein.
   - Wahan aapki `digital-market` wali repository dikhegi. Uske aage **"Import"** button dabayein.
3. **Settings Configure Karein:**
   - **Root Directory:** Edit par click karein aur `frontend` select karein.
   - **Framework Preset:** Vite (Auto-detect ho jayega).
   - **Build Command:** `npm run build` (Auto).
   - **Output Directory:** `dist` (Auto).
4. **Deploy:**
   - **"Deploy"** button par click karein.
   - 1 minute me building complete ho jayegi aur aapki website pure internet par live ho jayegi!

---

## 4. STEP 3: Backend & Database Ko LIVE Karna (Render.com Par - 100% Free)

Backend API aur PostgreSQL Database live karne ke liye:

1. **Render.com Par Jayein:**
   - Website: https://render.com/
   - **Get Started** -> **Sign in with GitHub**.
2. **Free PostgreSQL Database Banayein:**
   - Dashboard par **"New +"** -> **"PostgreSQL"** chunein.
   - Name: `digitalmarket-db`
   - Region: Singapore / Frankfurt (koi bhi)
   - Plan: **Free**
   - Click **Create Database**.
   - Ban jaane ke baad wahan **"Internal Database URL"** copy kar lein.
3. **Backend Web Service Banayein:**
   - Dashboard par **"New +"** -> **"Web Service"** chunein.
   - Apni GitHub repo `digital-market` select karein.
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start`
   - **Environment Variables** add karein:
     - `DATABASE_URL` = (Jo database URL upar copy ki thi)
     - `JWT_SECRET` = `digital_market_production_secret_key_123`
     - `FRONTEND_URL` = (Aapki Vercel wali live link)
   - Click **Create Web Service**.
4. **Prisma DB Push / Seed:**
   - Render ke Shell tab me ja kar `npx prisma db push && npx prisma db seed` run karein.
   - Aapka pura backend aur 10 products database live ho jayenge!

---

## 5. Tips & Safety (Koi Error Na Aaye Iske Liye)

- ✅ **`.gitignore` Pehle Se Set Hai:** Aapke folder me `node_modules` aur private `.env` GitHub par upload nahi honge, isliye upload bahut fast hoga (kuch hi MBs me).
- ✅ **WhatsApp Number:** Store settings se dynamic connected hai (`+91 96506 24535`).
- ✅ **Single-Click Local Run:** Jab bhi apne computer par chalana ho, `start-all.bat` double-click karein.

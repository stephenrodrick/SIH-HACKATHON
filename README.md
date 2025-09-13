# 🌍 Microplastic Detection System  

An AI-powered platform developed for **Smart India Hackathon (SIH)** to detect and classify microplastics in various sources such as water bodies, packaging, and textiles. This solution integrates **spectral data analysis, polymer identification, and visualization tools** to support research, environmental monitoring, and waste management.  

---

## 🚀 Features  

- 📊 **Microplastic Detection** – Analyze uploaded images/spectral data for polymer and pigment identification.  
- 🌈 **Color & Pigment Mapping** – Uses absorbance wavelength ranges to classify pigments in plastics.  
- 🧪 **Polymer Carrier Identification** – Detects common polymers like PET, PE, PP, PVC.  
- 🗺️ **Source Tracing** – Links detected plastics to possible source items (e.g., textiles, bottles, packaging).  
- ☁️ **Web Deployment** – Runs on **Next.js + Vercel** for fast, scalable deployment.  

---

## 🛠️ Tech Stack  

- **Frontend**: Next.js (TypeScript, React, TailwindCSS)  
- **Backend**: Node.js (API routes)  
- **ML/Detection Logic**: Python (planned integration), spectral dataset mapping  
- **Deployment**: Vercel  
- **Other Tools**: GitHub Actions (CI/CD), ESLint, Prettier  

---

## 📂 Project Structure  

SIH-HACKATHON/
│── app/                # Next.js app router pages
│── components/         # UI components
│── lib/                # Helper functions / utilities
│── public/             # Static assets
│── styles/             # Global styles
│── package.json        # Dependencies & scripts
│── tsconfig.json       # TypeScript config
│── next.config.mjs     # Next.js configuration
│── README.md           # Project documentation


## ⚙️ Installation  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/stephenrodrick/SIH-HACKATHON.git
   cd SIH-HACKATHON


2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

This project is deployed on **Vercel**. Every push to `main` branch auto-deploys via GitHub → Vercel integration.

---

## 🧩 Future Enhancements

* 🔬 Integration of **spectral analysis + ML models** for accurate detection.
* 📷 Support for **image uploads** to classify polymer microplastics visually.
* 📡 Real-time **IoT sensor integration** for water quality monitoring.
* 📈 Dashboard with **analytics & reporting** for environmental agencies.

---

## 👥 Team

Developed as part of **SIH Hackathon** by:

* **Stephen Rodrick** (Lead Developer & Project Coordinator)
* Hackathon Team Members (add names here)

---

## 📜 License

This project is licensed under the **MIT License** – feel free to use, modify, and contribute.

## Website Link 
https://v0-microplastic-detection-system.vercel.app/

Do you also want me to **add a workflow diagram (PNG/SVG)** in the repo and link it inside this README (like `![Workflow](public/workflow.png)`)? That would make it more visually appealing on GitHub.
```

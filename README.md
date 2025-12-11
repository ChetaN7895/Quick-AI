FullStack Live Code : https://quickai-techoptrack.vercel.app/

## 🚀 Quick AI SaaS Web App: Your All-in-One Content Powerhouse

Buy Me A Coffee : https://buymeacoffee.com/chetansolanki

Quick AI is a cutting-edge, full-stack Software as a Service (SaaS) application designed to eliminate **tool fragmentation** and **creative block** for content creators, marketers, and developers. [cite_start]By consolidating multiple premium Generative AI capabilities (text, image, and editing) into a single, intuitive platform, Quick AI cuts content creation time and cost by up to 70%[cite: 55].

[cite_start]This project was developed for the partial fulfillment of the Degree of Bachelor of Technology in Computer Science & Engineering[cite: 6, 8].

-----

### ✨ Core Features & AI Capabilities

[cite_start]Quick AI provides a unified suite of six intelligent tools, accessible via a seamless, no-code interface[cite: 54, 92].

| Feature | Technology/AI Model | Description |
| :--- | :--- | :--- |
| **AI Article Writer** | GPT-4/Gemini 2.0-Flash | [cite_start]Generates high-quality, structured, long-form articles based on topic and tone inputs[cite: 52, 169, 2223, 2457]. |
| **Smart Blog Title Generator** | GPT-4/Gemini 2.0-Flash (NLP) | [cite_start]Analyzes keywords to generate high-CTR (Click-Through Rate), SEO-friendly headlines[cite: 54, 174, 2457]. |
| **AI Image Generator** | DALL-E 3 / ClipDrop API | [cite_start]Converts text prompts into stunning, high-resolution visuals with various style options (e.g., Realistic, 3D Style)[cite: 53, 178, 2458]. |
| **Intelligent Editing Suite** | ClipDrop API (via Cloudinary) | \* [cite_start]**Background Removal:** Effortlessly removes image backgrounds for professional product shots [cite: 53, 2458][cite_start].<br>\* **Object Removal (Inpainting):** Eliminates unwanted objects from photos with precision[cite: 53, 181, 2458]. |
| **AI Resume Reviewer** | GPT-4/Gemini 2.0-Flash | [cite_start]Scans PDF resumes, calculates a "Hireability Score," and suggests improvements on ATS keywords and action verbs[cite: 54, 176, 2459]. |
| **Community Showcase** | PostgreSQL/Clerk | [cite_start]Allows users to publish their generated images and interact with others' creations (like/dislike)[cite: 787, 865]. |

-----

### 💻 Technology Stack (PERN Stack)

[cite_start]The application is built on a robust, scalable, and modern full-stack architecture[cite: 50].

| Component | Technology | Role in the System |
| :--- | :--- | :--- |
| **Frontend (Client)** | **React.js** + **Tailwind CSS** | [cite_start]Provides a responsive, mobile-first UI with a modern glassmorphism design[cite: 136, 202, 403]. |
| **Backend (Server)** | **Node.js** + **Express.js** | [cite_start]Acts as the RESTful API orchestrator, handling client requests and managing API calls to AI services[cite: 137]. |
| **Database** | **PostgreSQL** (via NeonDB) | [cite_start]ACID-compliant secure storage for user data, content history, and community interactions (likes)[cite: 50, 138, 2450]. |
| **Authentication** | **Clerk Auth** | [cite_start]Enterprise-grade security handling user registration, login (Google/GitHub), and session/plan management (RBAC)[cite: 140, 901]. |
| **Deployment** | **Vercel** | [cite_start]Used for CI/CD pipelines and serverless deployment of both the frontend and backend API endpoints[cite: 141, 2071]. |

-----

### 💾 Installation & Setup

[cite_start]To run Quick AI locally, you must have Node.js (v18.0+) and npm (v9.0+) installed[cite: 1023, 1024].

#### 1\. Clone the Repository

```bash
git clone https://github.com/ChetaN7895/Quick-AI
cd Quick-AI
```

#### 2\. Install Dependencies

Run the installation command in the root directory:

```bash
npm install
# Note: This will install dependencies for both client and server directories if configured in the main package.json
```

#### 3\. Environment Configuration

Create a `.env` file in the `server/` directory and add the necessary API keys. [cite_start]Replace the placeholders with your actual keys[cite: 1035]:

```env
# Database Connection
DATABASE_URL="postgresql://neondb_owner:********@ep-sparkling-forest.aws.neon.tech/neondb?sslmode=require"

# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI Models
GEMINI_API_KEY=AIzaSy****
CLIPDROP_API_KEY=d74fae****

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=dex******
CLOUDINARY_API_KEY=4269***********
CLOUDINARY_API_SECRET=kJSX*********
```

#### 4\. Run the Application

The application needs both the client and server to be running.

```bash
# Start the server (using nodemon for development)
npm run server 

# Start the frontend client (e.g., in a separate terminal)
npm run dev 
```

[cite_start]The application should now be accessible at `http://localhost:5173` (or similar, depending on your Vite setup)[cite: 983].

-----

### 🗺️ System Architecture

The system follows a typical microservice-oriented design where the Node/Express backend acts as an API Gateway and orchestrator between the React frontend and external AI services.

#### Data Flow Diagram (Level 1 - Detailed Flow)

1.  [cite_start]**User** interacts with the UI (e.g., clicks "Generate Title")[cite: 157].
2.  [cite_start]Request goes through the **Auth Service** (Clerk) for verification[cite: 158, 2113].
3.  [cite_start]The **Dashboard** (Frontend) routes the validated request[cite: 159].
4.  [cite_start]The request hits the **API Gateway** (Express Backend)[cite: 160, 137].
5.  [cite_start]The Gateway orchestrates calls to the **AI Model** (e.g., Gemini/GPT-4) for processing[cite: 156, 139].
6.  [cite_start]The result is logged/saved to the **Database** (PostgreSQL)[cite: 161, 2336].
7.  [cite_start]The final processed **Content is Returned** to the User's UI[cite: 162].

-----

### 🛣️ Future Roadmap

The Quick AI platform is designed for continuous evolution, with the following phases planned[cite: 307]:

| Phase | Target Q | Focus | Key Feature |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Completed | Foundation & Core Features | Current core tools (Article, Image, Reviewer) and stability testing[cite: 308]. |
| **Phase 2** | Q2 2026 | Monetization | Integration of Stripe Payment Gateway for tiered pricing plans[cite: 309]. |
| **Phase 3** | Q3 2026 | Global Reach | Implementation of multi-language support (Hindi, Spanish, French)[cite: 310]. |
| **Phase 4** | Q4 2026 | Voice AI | Adding Speech-to-Text capabilities for hands-free voice-activated commands[cite: 311]. |

-----

### 👤 Project Contributor

**Chetan Solanki** 

<a href="[https://www.buymeacoffee.com/gbraad](https://buymeacoffee.com/chetansolanki)" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a> 


**Live Demo:** 🌐 [https://quickai-techoptrack.vercel.app](https://quickai-techoptrack.vercel.app) 

[cite_start]**GitHub Repository:** 📂 [https://github.com/ChetaN7895/Quick-AI](https://github.com/ChetaN7895/Quick-AI) [cite: 2462]

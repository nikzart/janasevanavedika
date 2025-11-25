# **Master Project Specification: B Ravi Janaseva Vedika**

Version: 2.0  
Target Audience: Developers, AI Coding Assistants (Claude Code/Cursor)  
Client: Ravi Ulsoor (Congress)  
Platform: Progressive Web App (PWA) \+ Responsive Admin Dashboard

## **1\. Executive Summary & Architecture**

The **B Ravi Janaseva Vedika** is a dual-interface application designed to streamline the lead generation process for the 5 Karnataka Guarantee Schemes during an election campaign.

### **Core Philosophy**

1. **Citizen-Facing (PWA):** A lightweight, installable web app where voters select a scheme, fill basic details, and are redirected to WhatsApp to send a pre-formatted message to the campaign team.  
2. **Admin-Facing (Dashboard):** A centralized "War Room" for the campaign team to view incoming leads, track demographics (Ward-wise), and mark requests as processed.

### **Technology Stack**

* **Frontend:** React 18 (Vite), Tailwind CSS.  
* **PWA Engine:** vite-plugin-pwa (Manifest, Service Worker for "Add to Home Screen").  
* **Backend/Database:** **Supabase** (PostgreSQL, Auth, Row Level Security).  
* **Icons:** Lucide React.  
* **Language:** Bilingual Support (English & Kannada).

## **2\. PWA User Flow (Citizen Journey)**

### **A. Installation Strategy**

The app must leverage the PWA beforeinstallprompt event.

1. **First Visit:** User opens the link.  
2. **Trigger:** If the app is not installed, a sticky bottom banner appears:  
   * *Text:* "Install App for Faster Service / ವೇಗವಾಗಿ ಸೇವೆ ಪಡೆಯಲು ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ"  
   * *Action:* Clicking "Install" triggers the native browser install prompt.

### **B. Landing Page (Home)**

* **Header:**  
  * Left: Congress Hand Logo.  
  * Right: Ravi Ulsoor Circular Avatar.  
  * Center: "B Ravi Janaseva Vedika".  
* **Hero Section:**  
  * Background: Subtle Congress/Tricolor gradient overlay or clean white.  
  * Text: "Namaskara, I am Ravi. Here to serve you. / ನಮಸ್ಕಾರ, ನಾನು ರವಿ. ನಿಮ್ಮ ಸೇವೆಗಾಗಿ."  
* **Scheme Grid:**  
  * Layout: 1 Column (Mobile), 3 Columns (Desktop).  
  * Cards: 5 large cards, each representing a scheme with a unique icon and color accent.

### **C. Application Process (The "Bottom Sheet")**

* Interaction: Clicking a card opens a **Slide-up Drawer (Bottom Sheet)** covering 85% of the screen.  
* **Tab 1: Scheme Info (ಮಾಹಿತಿ):** Displays benefits and eligibility in Kannada.  
* **Tab 2: Apply (ಅರ್ಜಿ):** A simplified form.  
  * *Auto-Focus:* First input field focuses automatically.  
  * *Submit Button:* Green background, WhatsApp Icon, Text: **"Send to Ravi / ರವಿಗೆ ಕಳುಹಿಸಿ"**.

### **D. The "Magic" Redirect**

* **Action:** On Submit \-\> Save data to Supabase \-\> Construct WhatsApp URL.  
* **Outcome:** Opens WhatsApp with a pre-filled message addressed to the campaign's centralized number.

## **3\. Detailed Scheme Dictionary (Bilingual)**

*Note to Developer: Use these exact strings for the UI and WhatsApp templates.*

### **1\. Gruha Lakshmi (ಗೃಹ ಲಕ್ಷ್ಮಿ)**

*Focus: ₹2,000/month for the woman head of the family.*

* **Color Accent:** \#C026D3 (Magenta/Pink)  
* **UI Description (Eng):** Financial assistance for the woman head of the family.  
* **UI Description (Kan):** ಕುಟುಂಬದ ಯಜಮಾನಿಗೆ ಮಾಸಿಕ ₹2,000 ಆರ್ಥಿಕ ನೆರವು.  
* **Eligibility (Kan):**  
  * ಮಹಿಳೆ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರಾಗಿರಬೇಕು (ರೇಷನ್ ಕಾರ್ಡ್ ನಲ್ಲಿ).  
  * ಕುಟುಂಬದವರು ಆದಾಯ ತೆರಿಗೆ (IT/GST) ಪಾವತಿದಾರರಾಗಿರಬಾರದು.  
* **Form Fields:**  
  1. **Name (ಹೆಸರು):** Text (Required).  
  2. **Ration Card No (ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ):** Alphanumeric (Required).  
  3. **Mobile (ಮೊಬೈಲ್ ಸಂಖ್ಯೆ):** Number (10 digits).  
  4. **Head of Family? (ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರೇ?):** Radio (Yes/ಹೌದು, No/ಇಲ್ಲ).  
* **WhatsApp Template:**  
  \#GL \- New Request  
  ನಮಸ್ಕಾರ, ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆಗೆ ನನ್ನ ವಿವರಗಳು:  
  * **ಹೆಸರು:** {name}  
  * **ರೇಷನ್ ಕಾರ್ಡ್:** {rc\_number}  
  * **ಮೊಬೈಲ್:** {mobile}  
  * **ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರೇ?:** {is\_head}

### **2\. Gruha Jyothi (ಗೃಹ ಜ್ಯೋತಿ)**

*Focus: Free Electricity (200 Units).*

* **Color Accent:** \#FACC15 (Yellow/Saffron)  
* **UI Description (Eng):** Free electricity up to 200 units for every household.  
* **UI Description (Kan):** ಪ್ರತಿ ಮನೆಗೆ 200 ಯೂನಿಟ್ ವರೆಗೆ ಉಚಿತ ವಿದ್ಯುತ್.  
* **Eligibility (Kan):**  
  * ಮಾಸಿಕ ಬಳಕೆ 200 ಯೂನಿಟ್‌ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.  
  * ಬಾಡಿಗೆದಾರರು ಕೂಡ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.  
* **Form Fields:**  
  1. **Account Holder Name (ಗ್ರಾಹಕರ ಹೆಸರು):** Text.  
  2. **BESCOM Account ID (ಬೆಸ್ಕಾಂ ಖಾತೆ ಸಂಖ್ಯೆ):** Number (10 digits).  
  3. **Occupancy (ಬಗೆ):** Dropdown (Owner/ಮಾಲೀಕರು, Tenant/ಬಾಡಿಗೆದಾರರು).  
  4. **Mobile (ಮೊಬೈಲ್):** Number.  
* **WhatsApp Template:**  
  \#GJ \- New Request  
  ನಮಸ್ಕಾರ, ಗೃಹ ಜ್ಯೋತಿ ಯೋಜನೆಗೆ ವಿವರಗಳು:  
  * **ಗ್ರಾಹಕರ ಹೆಸರು:** {name}  
  * **ಬೆಸ್ಕಾಂ ಖಾತೆ ID:** {bescom\_id}  
  * **ಬಗೆ:** {occupancy}  
  * **ಮೊಬೈಲ್:** {mobile}

### **3\. Yuva Nidhi (ಯುವ ನಿಧಿ)**

*Focus: Unemployment Allowance.*

* **Color Accent:** \#3B82F6 (Blue)  
* **UI Description (Eng):** Unemployment allowance for Graduates and Diploma holders.  
* **UI Description (Kan):** ಪದವೀಧರರಿಗೆ ₹3,000 ಮತ್ತು ಡಿಪ್ಲೊಮಾ ಆದವರಿಗೆ ₹1,500 ನಿರುದ್ಯೋಗ ಭತ್ಯೆ.  
* **Eligibility (Kan):**  
  * 2023/2024/2025 ರಲ್ಲಿ ತೇರ್ಗಡೆಯಾಗಿರಬೇಕು.  
  * ಕಳೆದ 6 ತಿಂಗಳಿಂದ ಉದ್ಯೋಗವಿಲ್ಲದೆ ಇರಬೇಕು.  
* **Form Fields:**  
  1. **Student Name (ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು):** Text.  
  2. **Qualification (ವಿದ್ಯಾರ್ಹತೆ):** Dropdown (Degree/ಪದವಿ, Diploma/ಡಿಪ್ಲೊಮಾ).  
  3. **Year of Passing (ತೇರ್ಗಡೆಯಾದ ವರ್ಷ):** Dropdown (2023, 2024, 2025).  
  4. **USN/Reg No (ನೋಂದಣಿ ಸಂಖ್ಯೆ USN):** Alphanumeric.  
* **WhatsApp Template:**  
  \#YN \- New Request  
  ನಮಸ್ಕಾರ, ಯುವ ನಿಧಿ ಭತ್ಯೆಗೆ ವಿವರಗಳು:  
  * **ಹೆಸರು:** {name}  
  * **ವಿದ್ಯಾರ್ಹತೆ:** {qualification} ({year})  
  * **USN:** {usn}

### **4\. Shakti Scheme (ಶಕ್ತಿ ಯೋಜನೆ)**

*Focus: Smart Card Registration.*

* **Color Accent:** \#EC4899 (Pink)  
* **UI Description (Eng):** Free bus travel for women. Apply for Smart Card.  
* **UI Description (Kan):** ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಬಸ್ ಪ್ರಯಾಣ. ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ.  
* **Eligibility (Kan):**  
  * ಕರ್ನಾಟಕದ ಮಹಿಳೆಯರಿಗೆ ಮಾತ್ರ.  
  * ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಕಡ್ಡಾಯ.  
* **Form Fields:**  
  1. **Name (ಹೆಸರು):** Text.  
  2. **Address/Ward (ವಿಳಾಸ/ವಾರ್ಡ್):** Textarea.  
  3. **ID Available (ಗುರುತಿನ ಚೀಟಿ ಇದೆಯೇ?):** Checkbox (Aadhaar/Voter ID).  
* **WhatsApp Template:**  
  \#SH \- Smart Card  
  ನಮಸ್ಕಾರ, ಶಕ್ತಿ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಪಡೆಯಲು ವಿವರಗಳು:  
  * **ಹೆಸರು:** {name}  
  * **ವಿಳಾಸ:** {address}  
  * **ಗುರುತಿನ ಚೀಟಿ:** {id\_proof}

### **5\. Anna Bhagya (ಅನ್ನ ಭಾಗ್ಯ)**

*Focus: Grievance (Money not received).*

* **Color Accent:** \#22C55E (Green)  
* **UI Description (Eng):** Grievance redressal for Rice/Cash transfer issues.  
* **UI Description (Kan):** ಅಕ್ಕಿ/ಹಣ ಬರದಿದ್ದರೆ ಇಲ್ಲಿ ದೂರು ನೀಡಿ.  
* **Eligibility (Kan):**  
  * BPL ಅಥವಾ ಅಂತ್ಯೋದಯ ಕಾರ್ಡ್ ಹೊಂದಿರಬೇಕು.  
* **Form Fields:**  
  1. **Ration Card No (ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ):** Alphanumeric.  
  2. **Issue (ಸಮಸ್ಯೆ):** Dropdown (Money Not Received/ಹಣ ಬಂದಿಲ್ಲ, Card Issue/ಕಾರ್ಡ್ ಸಮಸ್ಯೆ, Add Member/ಹೆಸರು ಸೇರ್ಪಡೆ).  
  3. **Bank Linked? (ಬ್ಯಾಂಕ್ ಲಿಂಕ್ ಆಗಿದೆಯೇ?):** Radio (Yes/ಹೌದು, No/ಇಲ್ಲ).  
* **WhatsApp Template:**  
  \#AB \- Grievance  
  ನಮಸ್ಕಾರ, ಅನ್ನ ಭಾಗ್ಯ ಯೋಜನೆಯ ಸಮಸ್ಯೆ:  
  * **ರೇಷನ್ ಕಾರ್ಡ್:** {rc\_number}  
  * **ಸಮಸ್ಯೆ:** {issue}  
  * **ಬ್ಯಾಂಕ್ ಲಿಂಕ್:** {bank\_linked}

## **4\. Supabase Database Schema**

### **Table: leads**

This single table captures all submissions. The form\_data JSONB column allows flexibility for different schemes.

create table leads (  
  id uuid default gen\_random\_uuid() primary key,  
  created\_at timestamptz default now(),  
    
  \-- Core Data  
  scheme\_type text not null, \-- 'GL', 'GJ', 'YN', 'SH', 'AB'  
  applicant\_name text not null,  
  mobile\_number text not null,  
  ward\_no text, \-- Optional, for future filtering  
    
  \-- Dynamic Data (Stores scheme-specific fields like Bescom ID, RC No)  
  form\_data jsonb not null,   
    
  \-- Status Tracking  
  status text default 'pending', \-- 'pending', 'processed', 'rejected'  
  admin\_notes text,  
    
  \-- WhatsApp Sync Check  
  is\_whatsapp\_clicked boolean default false  
);

\-- Row Level Security (RLS)  
\-- 1\. Enable RLS  
alter table leads enable row level security;

\-- 2\. Policy: Allow ANYONE (Anon) to INSERT (Submit form)  
create policy "Enable insert for everyone" on leads for insert with check (true);

\-- 3\. Policy: Allow ONLY AUTHENTICATED (Admins) to VIEW/EDIT  
create policy "Enable read/write for admins" on leads for all using (auth.role() \= 'authenticated');

## **5\. Admin Dashboard Specifications**

**Route:** /admin (Protected by Supabase Auth Login)

### **A. Dashboard Layout**

* **Responsive Sidebar:**  
  * **Desktop:** Fixed sidebar with logo and menu items (Dashboard, Leads, Settings).  
  * **Mobile:** Hamburger menu opening a drawer.  
* **Theme:** Professional, data-heavy, clean lines.

### **B. "War Room" (Home View)**

* **KPI Cards (Key Performance Indicators):**  
  1. **Total Leads:** Big bold number.  
  2. **Today's Inflow:** Number with a green "up" arrow.  
  3. **Pending:** Number in Red (Needs attention).  
  4. **Processed:** Number in Green.  
* **Chart:** A simple Bar Chart showing Lead Count vs. Scheme Type (e.g., "Which scheme is most popular today?").

### **C. Lead Management (Data Table)**

* **Filter Bar:**  
  * *Scheme Filter:* (All / Gruha Lakshmi / Yuva Nidhi...).  
  * *Status Filter:* (Pending / Processed).  
  * *Search:* By Name or Mobile.  
* **The Table Columns:**  
  1. **Date:** Format DD/MM HH:mm.  
  2. **Name:** Bold text.  
  3. **Scheme:** Colored Badge (e.g., Pink for Shakti).  
  4. **Details:** A summary of key fields (e.g., "RC: 123...").  
  5. **Status:** Select/Dropdown to change status.  
  6. **Actions:**  
     * *WhatsApp Icon:* Opens Web WhatsApp to chat with the voter.  
     * *Trash Icon:* Delete spam.

## **6\. Visual Design Guidelines (The "Ravi Ulsoor" Brand)**

### **Color Palette**

* **Primary (Trust):** Royal Blue (\#1E40AF) \- Used for headers, primary buttons.  
* **Action (Campaign):** Saffron (\#FF9933) \- Used for "Apply" buttons and highlights.  
* **Success:** India Green (\#138808) \- Used for confirmation messages and WhatsApp buttons.  
* **Background:** Slate 50 (\#F8FAFC) \- Clean, modern background.

### **Typography**

* **English:** Inter (Google Font) \- Professional and legible.  
* **Kannada:** Noto Sans Kannada (Google Font) \- Essential for local language readability.

### **UI Components (Tailwind Classes Reference)**

* **Cards:** bg-white rounded-xl shadow-sm border border-slate-100 p-4  
* **Inputs:** w-full rounded-lg border-slate-300 focus:ring-blue-600 focus:border-blue-600  
* **Primary Button:** bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all  
* **WhatsApp Button:** bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2
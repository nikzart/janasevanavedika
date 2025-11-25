import { Scheme } from '../types';

export const schemes: Scheme[] = [
  {
    id: 'GL',
    name: {
      en: 'Gruha Lakshmi',
      kn: 'ಗೃಹ ಲಕ್ಷ್ಮಿ',
    },
    tagline: {
      en: 'Financial Independence for Women',
      kn: 'ಮಹಿಳೆಯರಿಗೆ ಆರ್ಥಿಕ ಸ್ವಾತಂತ್ರ್ಯ',
    },
    description: {
      en: 'Financial assistance for the woman head of the family.',
      kn: 'ಕುಟುಂಬದ ಯಜಮಾನಿಗೆ ಮಾಸಿಕ ₹2,000 ಆರ್ಥಿಕ ನೆರವು.',
    },
    benefit: {
      en: '₹2,000 monthly assistance transferred directly to the bank account of the woman head of the household.',
      kn: 'ಕುಟುಂಬದ ಯಜಮಾನಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹2,000 ಆರ್ಥಿಕ ನೆರವು (ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ).',
    },
    eligibility: {
      en: [
        'Woman must be listed as the Head of Family in the Ration Card (BPL/APL/Antyodaya).',
        'She or her husband must NOT be paying Income Tax.',
        'She or her husband must NOT be GST payers.',
      ],
      kn: [
        'ಮಹಿಳೆ ರೇಷನ್ ಕಾರ್ಡ್‌ನಲ್ಲಿ \'ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥೆ\' (Head of Family) ಆಗಿರಬೇಕು.',
        'ಅರ್ಜಿದಾರರು ಅಥವಾ ಅವರ ಪತಿ ಆದಾಯ ತೆರಿಗೆ (Income Tax) ಪಾವತಿದಾರರಾಗಿರಬಾರದು.',
        'ಅರ್ಜಿದಾರರು ಅಥವಾ ಅವರ ಪತಿ ಜಿಎಸ್‌ಟಿ (GST) ರಿಟರ್ನ್ಸ್ ಸಲ್ಲಿಸುವವರಾಗಿರಬಾರದು.',
      ],
    },
    requiredDocuments: [
      { en: 'Aadhaar Card (Wife & Husband)', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್ (ಪತಿ ಮತ್ತು ಪತ್ನಿ)' },
      { en: 'Ration Card', kn: 'ರೇಷನ್ ಕಾರ್ಡ್' },
      { en: 'Bank Passbook (if Aadhaar is not linked)', kn: 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ (ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿಲ್ಲದಿದ್ದರೆ)' },
      { en: 'Mobile Number linked to Aadhaar', kn: 'ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿರುವ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' },
    ],
    colorAccent: '#C026D3',
    icon: 'Home',
    benefitBadge: '₹2,000/month',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: { en: 'Name', kn: 'ಹೆಸರು' },
        placeholder: { en: 'Enter your name', kn: 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ' },
        required: true,
      },
      {
        id: 'ration_card',
        type: 'text',
        label: { en: 'Ration Card No', kn: 'ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ' },
        placeholder: { en: 'Enter ration card number', kn: 'ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' },
        required: true,
      },
      {
        id: 'mobile',
        type: 'number',
        label: { en: 'Mobile', kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' },
        placeholder: { en: '10-digit mobile number', kn: '10 ಅಂಕಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' },
        required: true,
        validation: { minLength: 10, maxLength: 10 },
      },
      {
        id: 'is_head',
        type: 'radio',
        label: { en: 'Head of Family?', kn: 'ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರೇ?' },
        required: true,
        options: [
          { value: 'yes', label: { en: 'Yes', kn: 'ಹೌದು' } },
          { value: 'no', label: { en: 'No', kn: 'ಇಲ್ಲ' } },
        ],
      },
      {
        id: 'doc_aadhaar_wife',
        type: 'image',
        label: { en: 'Aadhaar Card (Wife)', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್ (ಪತ್ನಿ)' },
        required: true,
      },
      {
        id: 'doc_aadhaar_husband',
        type: 'image',
        label: { en: 'Aadhaar Card (Husband)', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್ (ಪತಿ)' },
        required: true,
      },
      {
        id: 'doc_ration_card',
        type: 'image',
        label: { en: 'Ration Card', kn: 'ರೇಷನ್ ಕಾರ್ಡ್' },
        required: true,
      },
      {
        id: 'doc_bank_passbook',
        type: 'image',
        label: { en: 'Bank Passbook', kn: 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್' },
        required: true,
      },
    ],
    whatsappTemplate: `#GL - New Request
ನಮಸ್ಕಾರ, ಗೃಹ ಲಕ್ಷ್ಮಿ ಯೋಜನೆಗೆ ನನ್ನ ವಿವರಗಳು:
• *ಹೆಸರು:* {name}
• *ರೇಷನ್ ಕಾರ್ಡ್:* {ration_card}
• *ಮೊಬೈಲ್:* {mobile}
• *ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರೇ?:* {is_head}`,
  },
  {
    id: 'GJ',
    name: {
      en: 'Gruha Jyothi',
      kn: 'ಗೃಹ ಜ್ಯೋತಿ',
    },
    tagline: {
      en: 'Light for Every Home',
      kn: 'ಪ್ರತಿ ಮನೆಗೆ ಬೆಳಕು',
    },
    description: {
      en: 'Free electricity up to 200 units for every household.',
      kn: 'ಪ್ರತಿ ಮನೆಗೆ 200 ಯೂನಿಟ್ ವರೆಗೆ ಉಚಿತ ವಿದ್ಯುತ್.',
    },
    benefit: {
      en: 'Free electricity for residential households up to 200 units/month. If you use less than your average + 10% extra, bill is Zero. Households using <90 units get 10 extra free units.',
      kn: 'ಪ್ರತಿ ಮನೆಗೆ 200 ಯೂನಿಟ್ ವರೆಗೆ ಉಚಿತ ವಿದ್ಯುತ್. ಕಳೆದ ವರ್ಷದ ಸರಾಸರಿ ಬಳಕೆ + 10% ಹೆಚ್ಚುವರಿ ಯುನಿಟ್ ಉಚಿತ. 200 ಯೂನಿಟ್ ಮೀರಿದರೆ, ಸಂಪೂರ್ಣ ಬಿಲ್ ಪಾವತಿಸಬೇಕು.',
    },
    eligibility: {
      en: [
        'Applicable only for Residential connections (Owners & Tenants).',
        'If consumption exceeds 200 units, full bill must be paid.',
        'Not applicable for Commercial connections.',
      ],
      kn: [
        'ಇದು ಮನೆಗಳಿಗೆ (Residential) ಮಾತ್ರ ಅನ್ವಯ. ವಾಣಿಜ್ಯ (Commercial) ಸಂಪರ್ಕಗಳಿಗೆ ಅನ್ವಯಿಸುವುದಿಲ್ಲ.',
        'ಮನೆ ಮಾಲೀಕರು ಮತ್ತು ಬಾಡಿಗೆದಾರರು ಇಬ್ಬರೂ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.',
        '200 ಯೂನಿಟ್ ಮೀರಿದರೆ ಪೂರ್ಣ ಬಿಲ್ ಪಾವತಿಸಬೇಕು.',
      ],
    },
    requiredDocuments: [
      { en: 'Electricity Bill (for Account ID)', kn: 'ವಿದ್ಯುತ್ ಬಿಲ್ (Account ID ಗಾಗಿ)' },
      { en: 'Aadhaar Card', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್' },
      { en: 'Tenancy Agreement (if applying as Tenant)', kn: 'ಬಾಡಿಗೆ ಕರಾರು ಪತ್ರ (ಬಾಡಿಗೆದಾರರಾಗಿದ್ದರೆ)' },
    ],
    colorAccent: '#FACC15',
    icon: 'Lightbulb',
    benefitBadge: '200 Units Free',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: { en: 'Account Holder Name', kn: 'ಗ್ರಾಹಕರ ಹೆಸರು' },
        placeholder: { en: 'Enter account holder name', kn: 'ಗ್ರಾಹಕರ ಹೆಸರು ನಮೂದಿಸಿ' },
        required: true,
      },
      {
        id: 'bescom_id',
        type: 'text',
        label: { en: 'BESCOM Account ID', kn: 'ಬೆಸ್ಕಾಂ ಖಾತೆ ಸಂಖ್ಯೆ' },
        placeholder: { en: '10-digit account ID', kn: '10 ಅಂಕಿ ಖಾತೆ ಸಂಖ್ಯೆ' },
        required: true,
        validation: { minLength: 10, maxLength: 10 },
      },
      {
        id: 'occupancy',
        type: 'select',
        label: { en: 'Occupancy', kn: 'ಬಗೆ' },
        required: true,
        options: [
          { value: 'owner', label: { en: 'Owner', kn: 'ಮಾಲೀಕರು' } },
          { value: 'tenant', label: { en: 'Tenant', kn: 'ಬಾಡಿಗೆದಾರರು' } },
        ],
      },
      {
        id: 'mobile',
        type: 'number',
        label: { en: 'Mobile', kn: 'ಮೊಬೈಲ್' },
        placeholder: { en: '10-digit mobile number', kn: '10 ಅಂಕಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' },
        required: true,
        validation: { minLength: 10, maxLength: 10 },
      },
      {
        id: 'doc_electricity_bill',
        type: 'image',
        label: { en: 'Electricity Bill', kn: 'ವಿದ್ಯುತ್ ಬಿಲ್' },
        required: true,
      },
      {
        id: 'doc_aadhaar',
        type: 'image',
        label: { en: 'Aadhaar Card', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್' },
        required: true,
      },
      {
        id: 'doc_tenancy_agreement',
        type: 'image',
        label: { en: 'Tenancy Agreement (if Tenant)', kn: 'ಬಾಡಿಗೆ ಕರಾರು ಪತ್ರ (ಬಾಡಿಗೆದಾರರಾಗಿದ್ದರೆ)' },
        required: false,
      },
    ],
    whatsappTemplate: `#GJ - New Request
ನಮಸ್ಕಾರ, ಗೃಹ ಜ್ಯೋತಿ ಯೋಜನೆಗೆ ವಿವರಗಳು:
• *ಗ್ರಾಹಕರ ಹೆಸರು:* {name}
• *ಬೆಸ್ಕಾಂ ಖಾತೆ ID:* {bescom_id}
• *ಬಗೆ:* {occupancy}
• *ಮೊಬೈಲ್:* {mobile}`,
  },
  {
    id: 'YN',
    name: {
      en: 'Yuva Nidhi',
      kn: 'ಯುವ ನಿಧಿ',
    },
    tagline: {
      en: 'Support for Youth',
      kn: 'ಯುವಕರಿಗೆ ಬೆಂಬಲ',
    },
    description: {
      en: 'Unemployment allowance for Graduates and Diploma holders.',
      kn: 'ಪದವೀಧರರಿಗೆ ₹3,000 ಮತ್ತು ಡಿಪ್ಲೊಮಾ ಆದವರಿಗೆ ₹1,500 ನಿರುದ್ಯೋಗ ಭತ್ಯೆ.',
    },
    benefit: {
      en: 'Unemployment allowance for 2 years. Graduates: ₹3,000/month. Diploma Holders: ₹1,500/month.',
      kn: 'ನಿರುದ್ಯೋಗಿ ಯುವಕರಿಗೆ 2 ವರ್ಷಗಳ ವರೆಗೆ ಮಾಸಿಕ ಭತ್ಯೆ. ಪದವೀಧರರಿಗೆ: ₹3,000. ಡಿಪ್ಲೊಮಾ: ₹1,500.',
    },
    eligibility: {
      en: [
        'Must have passed Degree/Diploma in 2023, 2024, or 2025.',
        'Must be unemployed for at least 6 months after passing.',
        'Must be a resident of Karnataka for at least 6 years.',
        'Not available if pursuing higher education (PG) or have a job.',
      ],
      kn: [
        '2023, 2024 ಅಥವಾ 2025 ರಲ್ಲಿ ತೇರ್ಗಡೆಯಾಗಿರಬೇಕು.',
        'ಪದವಿ ಮುಗಿದ ನಂತರ 6 ತಿಂಗಳು ಉದ್ಯೋಗವಿಲ್ಲದೆ ಇರಬೇಕು.',
        'ಕರ್ನಾಟಕದಲ್ಲಿ ಕನಿಷ್ಠ 6 ವರ್ಷ ವಾಸವಿರಬೇಕು.',
        'ಉನ್ನತ ವ್ಯಾಸಂಗ ಮಾಡುತ್ತಿದ್ದರೆ ಅಥವಾ ಉದ್ಯೋಗವಿದ್ದರೆ ಅರ್ಹರಲ್ಲ.',
      ],
    },
    requiredDocuments: [
      { en: 'Degree/Diploma Certificate or Marks Card', kn: 'ಅಂಕಪಟ್ಟಿ ಅಥವಾ ಪದವಿ ಪ್ರಮಾಣಪತ್ರ' },
      { en: 'Transfer Certificate (TC)', kn: 'ವರ್ಗಾವಣೆ ಪತ್ರ (TC)' },
      { en: 'Aadhaar Card', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್' },
      { en: 'Bank Passbook', kn: 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್' },
    ],
    colorAccent: '#3B82F6',
    icon: 'GraduationCap',
    benefitBadge: '₹3,000/month',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: { en: 'Student Name', kn: 'ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು' },
        placeholder: { en: 'Enter student name', kn: 'ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು ನಮೂದಿಸಿ' },
        required: true,
      },
      {
        id: 'qualification',
        type: 'select',
        label: { en: 'Qualification', kn: 'ವಿದ್ಯಾರ್ಹತೆ' },
        required: true,
        options: [
          { value: 'degree', label: { en: 'Degree (₹3,000)', kn: 'ಪದವಿ (₹3,000)' } },
          { value: 'diploma', label: { en: 'Diploma (₹1,500)', kn: 'ಡಿಪ್ಲೊಮಾ (₹1,500)' } },
        ],
      },
      {
        id: 'year',
        type: 'select',
        label: { en: 'Year of Passing', kn: 'ತೇರ್ಗಡೆಯಾದ ವರ್ಷ' },
        required: true,
        options: [
          { value: '2023', label: { en: '2023', kn: '2023' } },
          { value: '2024', label: { en: '2024', kn: '2024' } },
          { value: '2025', label: { en: '2025', kn: '2025' } },
        ],
      },
      {
        id: 'usn',
        type: 'text',
        label: { en: 'USN/Reg No', kn: 'ನೋಂದಣಿ ಸಂಖ್ಯೆ USN' },
        placeholder: { en: 'Enter USN or registration number', kn: 'USN ಅಥವಾ ನೋಂದಣಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' },
        required: true,
      },
      {
        id: 'doc_degree_certificate',
        type: 'image',
        label: { en: 'Degree/Diploma Certificate', kn: 'ಪದವಿ/ಡಿಪ್ಲೊಮಾ ಪ್ರಮಾಣಪತ್ರ' },
        required: true,
      },
      {
        id: 'doc_tc',
        type: 'image',
        label: { en: 'Transfer Certificate (TC)', kn: 'ವರ್ಗಾವಣೆ ಪತ್ರ (TC)' },
        required: true,
      },
      {
        id: 'doc_aadhaar',
        type: 'image',
        label: { en: 'Aadhaar Card', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್' },
        required: true,
      },
      {
        id: 'doc_bank_passbook',
        type: 'image',
        label: { en: 'Bank Passbook', kn: 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್' },
        required: true,
      },
    ],
    whatsappTemplate: `#YN - New Request
ನಮಸ್ಕಾರ, ಯುವ ನಿಧಿ ಭತ್ಯೆಗೆ ವಿವರಗಳು:
• *ಹೆಸರು:* {name}
• *ವಿದ್ಯಾರ್ಹತೆ:* {qualification} ({year})
• *USN:* {usn}`,
  },
  {
    id: 'SH',
    name: {
      en: 'Shakti Scheme',
      kn: 'ಶಕ್ತಿ ಯೋಜನೆ',
    },
    tagline: {
      en: 'Free Travel for Women',
      kn: 'ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಪ್ರಯಾಣ',
    },
    description: {
      en: 'Free bus travel for women. Apply for Smart Card.',
      kn: 'ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಬಸ್ ಪ್ರಯಾಣ. ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅರ್ಜಿ.',
    },
    benefit: {
      en: 'Free bus travel for women across Karnataka in Govt buses (KSRTC, BMTC, NWKRTC, KKRTC). Available on Ordinary, Urban, Express (Non-AC) buses. Smart Card mandatory for long-term use.',
      kn: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಸರ್ಕಾರಿ ಬಸ್‌ಗಳಲ್ಲಿ ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಪ್ರಯಾಣ (KSRTC, BMTC). ಸಾಮಾನ್ಯ, ನಗರ ಸಾರಿಗೆ ಮತ್ತು ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಬಸ್‌ಗಳು (AC ಬಸ್ ಇಲ್ಲ).',
    },
    eligibility: {
      en: [
        'All women residents of Karnataka (including Transgender community).',
        'Smart Card is mandatory for availing the benefit.',
      ],
      kn: [
        'ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಮಹಿಳೆಯರು ಮತ್ತು ಲಿಂಗತ್ವ ಅಲ್ಪಸಂಖ್ಯಾತರು.',
        'ಉಚಿತ ಪ್ರಯಾಣಕ್ಕಾಗಿ \'ಶಕ್ತಿ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್\' ಮಾಡಿಸುವುದು ಕಡ್ಡಾಯ.',
      ],
    },
    requiredDocuments: [
      { en: 'Aadhaar Card / Voter ID (Identity Proof)', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್ ಅಥವಾ ವೋಟರ್ ಐಡಿ' },
      { en: 'Passport Size Photo (for Smart Card)', kn: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಅಳತೆಯ ಭಾವಚಿತ್ರ' },
    ],
    colorAccent: '#EC4899',
    icon: 'Bus',
    benefitBadge: 'Free Travel',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: { en: 'Name', kn: 'ಹೆಸರು' },
        placeholder: { en: 'Enter your name', kn: 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ' },
        required: true,
      },
      {
        id: 'mobile',
        type: 'number',
        label: { en: 'Mobile', kn: 'ಮೊಬೈಲ್' },
        placeholder: { en: '10-digit mobile number', kn: '10 ಅಂಕಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' },
        required: true,
        validation: { minLength: 10, maxLength: 10 },
      },
      {
        id: 'address',
        type: 'textarea',
        label: { en: 'Address/Ward', kn: 'ವಿಳಾಸ/ವಾರ್ಡ್' },
        placeholder: { en: 'Enter your address and ward', kn: 'ನಿಮ್ಮ ವಿಳಾಸ ಮತ್ತು ವಾರ್ಡ್ ನಮೂದಿಸಿ' },
        required: true,
      },
      {
        id: 'id_proof',
        type: 'checkbox',
        label: { en: 'I have ID proof (Aadhaar/Voter ID)', kn: 'ಗುರುತಿನ ಚೀಟಿ ಇದೆ (ಆಧಾರ್/ಮತದಾರರ ID)' },
        required: false,
      },
      {
        id: 'doc_id_proof',
        type: 'image',
        label: { en: 'Aadhaar Card / Voter ID', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್ / ಮತದಾರರ ID' },
        required: true,
      },
      {
        id: 'doc_passport_photo',
        type: 'image',
        label: { en: 'Passport Size Photo', kn: 'ಪಾಸ್‌ಪೋರ್ಟ್ ಅಳತೆಯ ಭಾವಚಿತ್ರ' },
        required: true,
      },
    ],
    whatsappTemplate: `#SH - Smart Card
ನಮಸ್ಕಾರ, ಶಕ್ತಿ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಪಡೆಯಲು ವಿವರಗಳು:
• *ಹೆಸರು:* {name}
• *ಮೊಬೈಲ್:* {mobile}
• *ವಿಳಾಸ:* {address}
• *ಗುರುತಿನ ಚೀಟಿ:* {id_proof}`,
  },
  {
    id: 'AB',
    name: {
      en: 'Anna Bhagya',
      kn: 'ಅನ್ನ ಭಾಗ್ಯ',
    },
    tagline: {
      en: 'Food Security for All',
      kn: 'ಎಲ್ಲರಿಗೂ ಆಹಾರ ಭದ್ರತೆ',
    },
    description: {
      en: 'Grievance redressal for Rice/Cash transfer issues.',
      kn: 'ಅಕ್ಕಿ/ಹಣ ಬರದಿದ್ದರೆ ಇಲ್ಲಿ ದೂರು ನೀಡಿ.',
    },
    benefit: {
      en: '10 KG free rice per person per month for BPL families. From Feb 2025, full 10 KG rice will be distributed (stopping cash transfer).',
      kn: 'BPL ಕುಟುಂಬದ ಪ್ರತಿ ಸದಸ್ಯರಿಗೆ ತಿಂಗಳಿಗೆ 10 ಕೆ.ಜಿ ಉಚಿತ ಅಕ್ಕಿ. ಹಣದ ಬದಲಾಗಿ ಇನ್ಮುಂದೆ ಪೂರ್ತಿ 10 ಕೆ.ಜಿ ಅಕ್ಕಿಯನ್ನೇ ನೀಡಲಾಗುತ್ತದೆ.',
    },
    eligibility: {
      en: [
        'Must hold a valid BPL or Antyodaya Ration Card.',
        'Card must be linked to Aadhaar.',
      ],
      kn: [
        'ಚಾಲ್ತಿಯಲ್ಲಿರುವ BPL ಅಥವಾ ಅಂತ್ಯೋದಯ ರೇಷನ್ ಕಾರ್ಡ್ ಹೊಂದಿರಬೇಕು.',
        'ರೇಷನ್ ಕಾರ್ಡ್‌ಗೆ ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿರಬೇಕು.',
      ],
    },
    requiredDocuments: [
      { en: 'Ration Card Number', kn: 'ರೇಷನ್ ಕಾರ್ಡ್' },
      { en: 'Aadhaar Card', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್' },
    ],
    colorAccent: '#22C55E',
    icon: 'Wheat',
    benefitBadge: '10 KG Rice/month',
    fields: [
      {
        id: 'ration_card',
        type: 'text',
        label: { en: 'Ration Card No', kn: 'ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ' },
        placeholder: { en: 'Enter ration card number', kn: 'ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' },
        required: true,
      },
      {
        id: 'mobile',
        type: 'number',
        label: { en: 'Mobile', kn: 'ಮೊಬೈಲ್' },
        placeholder: { en: '10-digit mobile number', kn: '10 ಅಂಕಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' },
        required: true,
        validation: { minLength: 10, maxLength: 10 },
      },
      {
        id: 'issue',
        type: 'select',
        label: { en: 'Issue', kn: 'ಸಮಸ್ಯೆ' },
        required: true,
        options: [
          { value: 'money_not_received', label: { en: 'Money Not Received', kn: 'ಹಣ ಬಂದಿಲ್ಲ' } },
          { value: 'rice_not_received', label: { en: 'Rice Not Received', kn: 'ಅಕ್ಕಿ ಬಂದಿಲ್ಲ' } },
          { value: 'card_issue', label: { en: 'Card Issue', kn: 'ಕಾರ್ಡ್ ಸಮಸ್ಯೆ' } },
          { value: 'add_member', label: { en: 'Add Member', kn: 'ಹೆಸರು ಸೇರ್ಪಡೆ' } },
        ],
      },
      {
        id: 'bank_linked',
        type: 'radio',
        label: { en: 'Bank Linked?', kn: 'ಬ್ಯಾಂಕ್ ಲಿಂಕ್ ಆಗಿದೆಯೇ?' },
        required: true,
        options: [
          { value: 'yes', label: { en: 'Yes', kn: 'ಹೌದು' } },
          { value: 'no', label: { en: 'No', kn: 'ಇಲ್ಲ' } },
        ],
      },
      {
        id: 'doc_ration_card',
        type: 'image',
        label: { en: 'Ration Card', kn: 'ರೇಷನ್ ಕಾರ್ಡ್' },
        required: true,
      },
      {
        id: 'doc_aadhaar',
        type: 'image',
        label: { en: 'Aadhaar Card', kn: 'ಆಧಾರ್ ಕಾರ್ಡ್' },
        required: true,
      },
    ],
    whatsappTemplate: `#AB - Grievance
ನಮಸ್ಕಾರ, ಅನ್ನ ಭಾಗ್ಯ ಯೋಜನೆಯ ಸಮಸ್ಯೆ:
• *ರೇಷನ್ ಕಾರ್ಡ್:* {ration_card}
• *ಮೊಬೈಲ್:* {mobile}
• *ಸಮಸ್ಯೆ:* {issue}
• *ಬ್ಯಾಂಕ್ ಲಿಂಕ್:* {bank_linked}`,
  },
];

export function getSchemeById(id: string): Scheme | undefined {
  return schemes.find((s) => s.id === id);
}

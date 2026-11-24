/**
 * Mock Browser Data for FormFlow Browser Workspace Prototype.
 * Separated cleanly from UI components.
 * Contains 4 primary sample portals:
 *  1. Scholarship Application Portal (Reliance Foundation STEM)
 *  2. Government Application Portal (Karnataka SSP / Seva Sindhu)
 *  3. College Admission Portal (MSRIT Central UG Admissions)
 *  4. Job Application Portal (National Career Service Graduate Tech Placements)
 */

import { BrowserPageContext, SearchResultItem } from '../../types/browser';

export const PROTOTYPE_BANNER_TEXT = 'PROTOTYPE SIMULATION · Interactive Local Webpage · No external browser process or live web crawler active';

export const HOME_PORTAL_URL = 'formflow://home';

export const SAMPLE_PORTALS: Record<string, BrowserPageContext> = {
  // 1. SCHOLARSHIP APPLICATION PORTAL
  'https://www.reliancefoundation.org/scholarships/ug-stem-2026': {
    url: 'https://www.reliancefoundation.org/scholarships/ug-stem-2026',
    title: 'Reliance Foundation Undergraduate STEM Scholarship 2026 Portal',
    portalName: 'Reliance Foundation & Jio Institute',
    fieldsDetected: 14,
    deadline: '15 December 2026, 5:00 PM IST',
    summary: 'The Reliance Foundation Undergraduate STEM Scholarship provides up to ₹2,00,000 per year for first-year and second-year undergraduate students enrolled in full-time Computer Science, Information Technology, and related STEM programs in India.',
    eligibilityCriteria: [
      'Enrolled in full-time 1st or 2nd year B.E./B.Tech/B.Sc. in STEM discipline',
      'Minimum 60% aggregate in Class 12th Board examinations',
      'Annual household gross income <= ₹15,00,000 (Preference for <= ₹2,50,000)',
      'Indian citizenship with verified identity document',
      'Active bank account with Direct Benefit Transfer (DBT) enablement'
    ],
    requiredDocs: [
      'Class 10th Secondary School Certificate (DOB proof)',
      'Class 12th Senior Secondary Marksheet',
      'College Bonafide / Student ID Card',
      'Government Revenue Authority Income Certificate (FY 2025-26)',
      'UIDAI Aadhaar Card',
      'Bank Account Passbook / Cancelled Cheque with IFSC'
    ],
    formFields: [
      { name: 'applicant_name', label: 'Full Legal Name', value: 'Darshan Kumar', type: 'text', status: 'mapped', sourceDoc: '10th_CBSE_Board_Marksheet_Darshan.pdf' },
      { name: 'dob', label: 'Date of Birth', value: '14/08/2005', type: 'date', status: 'mapped', sourceDoc: '10th_CBSE_Board_Marksheet_Darshan.pdf' },
      { name: 'twelfth_score', label: 'Class 12 Aggregate', value: '96.0%', type: 'text', status: 'mapped', sourceDoc: '12th_CBSE_Senior_Secondary_Certificate.pdf' },
      { name: 'institution', label: 'College / Institute', value: 'M S Ramaiah Institute of Technology, Bangalore', type: 'text', status: 'mapped', sourceDoc: 'College_ID_Card_MSRIT.pdf' },
      { name: 'degree_branch', label: 'Degree & Program', value: 'B.E. Computer Science & Engineering', type: 'text', status: 'mapped', sourceDoc: 'College_ID_Card_MSRIT.pdf' },
      { name: 'annual_income', label: 'Annual Household Income', value: '₹2,40,000', type: 'text', status: 'mapped', sourceDoc: 'Government_Income_Certificate_2025.pdf' },
      { name: 'bank_account', label: 'DBT Bank Account Number', value: '1049281900234 (IFSC: CNRB0001049)', type: 'text', status: 'mapped', sourceDoc: 'Canara_Bank_Account_Passbook.pdf' },
      { name: 'aadhaar_verification', label: 'Aadhaar Identity Match', value: 'Darshan K (Name variation note)', type: 'text', status: 'warning', sourceDoc: 'Aadhaar_Card_UIDAI_Masked.pdf' }
    ]
  },

  // 2. GOVERNMENT APPLICATION PORTAL
  'https://ssp.postmatric.karnataka.gov.in': {
    url: 'https://ssp.postmatric.karnataka.gov.in',
    title: 'State Scholarship Portal (SSP) Post-Matric | Govt of Karnataka',
    portalName: 'Department of Social Welfare & Backward Classes, Karnataka',
    fieldsDetected: 11,
    deadline: '30 November 2026',
    summary: 'Karnataka State Scholarship Portal (SSP) facilitates unified online fee reimbursement, maintenance allowances, and incentive awards for post-matric undergraduate students residing in Karnataka.',
    eligibilityCriteria: [
      'Karnataka State resident with valid domicile certificate issued by Tahsildar',
      'Enrolled in recognized technical or professional institution in Karnataka',
      'Aadhaar seeded bank account with NPCI mapper verification',
      'Family income within eligible category ceilings (Category 1, 2A, 2B, 3A, 3B, SC/ST)'
    ],
    requiredDocs: [
      'Karnataka Revenue Department Income & Caste Certificate RD number',
      'Aadhaar Card linked to active student mobile number',
      'SSLC / 10th Marks card with Registration Number',
      'Current Academic Year College Fee Receipt (2025-26)',
      'Hostel certificate (if claiming food & accommodation allowance)'
    ],
    formFields: [
      { name: 'ssp_id', label: 'Student SATS / SSP ID', value: 'SSP-KA-2024-88910', type: 'text', status: 'mapped', sourceDoc: 'College_ID_Card_MSRIT.pdf' },
      { name: 'domicile_cert', label: 'Revenue Certificate (RD Number)', value: 'RD00389123490', type: 'text', status: 'mapped', sourceDoc: 'Government_Income_Certificate_2025.pdf' },
      { name: 'income_verified', label: 'Annual Income', value: '₹2,40,000', type: 'text', status: 'mapped', sourceDoc: 'Government_Income_Certificate_2025.pdf' },
      { name: 'college_fee_receipt', label: 'College Fee Receipt (2025-26)', value: 'Fee Receipt Verified (Ref: MSRIT-FEES-25-881)', type: 'text', status: 'mapped', sourceDoc: 'College_Admission_Fee_Receipt_MSRIT.pdf' }
    ]
  },

  // 3. COLLEGE ADMISSION PORTAL
  'https://admissions.msrit.edu/ug-2026': {
    url: 'https://admissions.msrit.edu/ug-2026',
    title: 'MSRIT Central Undergraduate Admissions Portal 2026-27',
    portalName: 'M.S. Ramaiah Institute of Technology – Autonomous Institute',
    fieldsDetected: 12,
    deadline: '31 July 2026, 6:00 PM IST',
    summary: 'Official undergraduate admissions portal for B.E. programs at M.S. Ramaiah Institute of Technology, Bangalore. Supports quota counseling, document validation, seat allocation, and enrollment confirmation.',
    eligibilityCriteria: [
      'Passed 10+2 / 2nd PUC examination with Physics and Mathematics as compulsory subjects',
      'Obtained at least 45% marks in qualifying examination (40% for SC/ST/OBC category candidates)',
      'Valid rank in KCET (Karnataka Common Entrance Test) or COMEDK UGET 2026',
      'Verified Karnataka Domicile Certificate or All India Quota eligibility'
    ],
    requiredDocs: [
      'KCET / COMEDK 2026 Rank Card & Hall Ticket',
      'Class 10th / SSLC Marks Card (DOB Verification)',
      'Class 12th / 2nd PUC Marks Card',
      'Transfer Certificate (TC) & Migration Certificate',
      'Study / Character Certificate for 7 continuous years in Karnataka',
      'Income & Caste Certificate (RD Number)'
    ],
    formFields: [
      { name: 'candidate_name', label: 'Candidate Full Name', value: 'Darshan Kumar', type: 'text', status: 'mapped', sourceDoc: '10th_CBSE_Board_Marksheet_Darshan.pdf' },
      { name: 'entrance_exam_rank', label: 'Entrance Examination Rank (KCET)', value: 'Rank: 1,842 (Category: General Merit)', type: 'text', status: 'mapped', sourceDoc: 'KCET_2024_Scorecard_Darshan.pdf' },
      { name: 'preferred_branch', label: 'First Preference Branch', value: 'B.E. Computer Science and Engineering', type: 'text', status: 'mapped', sourceDoc: 'College_ID_Card_MSRIT.pdf' },
      { name: 'pcm_aggregate', label: 'PCM Aggregate Percentage', value: '97.33% (Physics: 96, Chemistry: 98, Math: 98)', type: 'text', status: 'mapped', sourceDoc: '12th_CBSE_Senior_Secondary_Certificate.pdf' },
      { name: 'category_quota', label: 'Admission Quota / Category', value: 'General Merit (Karnataka Resident)', type: 'text', status: 'mapped', sourceDoc: 'Government_Income_Certificate_2025.pdf' },
      { name: 'parent_phone', label: 'Parent / Guardian Contact', value: '+91 98450 12345', type: 'text', status: 'mapped', sourceDoc: 'Government_Aadhaar_Card_Darshan.pdf' }
    ]
  },

  // 4. JOB APPLICATION PORTAL
  'https://careers.ncs.gov.in/tech-fellowship-2026': {
    url: 'https://careers.ncs.gov.in/tech-fellowship-2026',
    title: 'National Career Service – Graduate Technical Apprenticeship & Placements',
    portalName: 'Ministry of Labour & Employment – National Career Service (NCS)',
    fieldsDetected: 10,
    deadline: '10 January 2027, 11:59 PM IST',
    summary: 'The National Career Service Graduate Technical Fellowship connects pre-final and graduating engineering students to premier public sector units, tech enterprises, and research labs for paid apprenticeships and fast-track career placements.',
    eligibilityCriteria: [
      'Final year B.E. / B.Tech or recent graduate (2025-2027 batch) in CS, IT, ECE or EE',
      'Cumulative CGPA >= 7.5 or aggregate >= 70% with no active backlogs',
      'Demonstrated project experience in software engineering, cloud, or AI workflows',
      'Registered profile on National Career Service (NCS) portal with verified National ID'
    ],
    requiredDocs: [
      'Updated Curriculum Vitae / Resume (PDF)',
      'College Bonafide / Provisional Degree Certificate',
      'Semester Grade Cards (1st to 6th Semesters)',
      'Aadhaar / National Identity Card',
      'GitHub / Portfolio link with project repositories'
    ],
    formFields: [
      { name: 'applicant_name', label: 'Full Name', value: 'Darshan Kumar', type: 'text', status: 'mapped', sourceDoc: '10th_CBSE_Board_Marksheet_Darshan.pdf' },
      { name: 'college_usn', label: 'University Roll / USN', value: '1MS23CS042 (MSRIT Bangalore)', type: 'text', status: 'mapped', sourceDoc: 'College_ID_Card_MSRIT.pdf' },
      { name: 'cgpa_record', label: 'Current CGPA (Semesters 1-3)', value: '9.42 / 10.0', type: 'text', status: 'mapped', sourceDoc: 'MSRIT_Grade_Card_Semester_3.pdf' },
      { name: 'primary_skills', label: 'Core Technical Stack', value: 'Python, TypeScript, React, Tailwind CSS, FastAPI, SQL', type: 'text', status: 'mapped', sourceDoc: 'Darshan_Kumar_Software_Resume.pdf' },
      { name: 'portfolio_url', label: 'Project Portfolio / GitHub', value: 'https://github.com/darshankumar-dev', type: 'text', status: 'mapped', sourceDoc: 'Darshan_Kumar_Software_Resume.pdf' },
      { name: 'preferred_location', label: 'Preferred Work Location', value: 'Bengaluru / Hybrid', type: 'text', status: 'mapped', sourceDoc: 'Candidate Profile Preferences' }
    ]
  }
};

// Realistic mock search database
export const MOCK_SEARCH_DATABASE: SearchResultItem[] = [
  {
    id: 'res-reliance',
    title: 'Reliance Foundation Undergraduate STEM Scholarships 2026',
    url: 'https://www.reliancefoundation.org/scholarships/ug-stem-2026',
    snippet: 'Applications open for first and second year engineering and STEM students. Grant of up to ₹2 Lakhs per annum with mentorship.',
    source: 'reliancefoundation.org',
    category: 'Scholarship Application Portal',
    isMock: true
  },
  {
    id: 'res-ssp',
    title: 'Karnataka State Scholarship Portal (SSP) Post-Matric 2026-27',
    url: 'https://ssp.postmatric.karnataka.gov.in',
    snippet: 'Official Karnataka state portal for fee reimbursement and post-matric social welfare grants. Direct Benefit Transfer enabled.',
    source: 'karnataka.gov.in',
    category: 'Government Application Portal',
    isMock: true
  },
  {
    id: 'res-msrit',
    title: 'MSRIT Central Undergraduate Admissions Portal 2026-27',
    url: 'https://admissions.msrit.edu/ug-2026',
    snippet: 'Engineering admissions at M.S. Ramaiah Institute of Technology. Online seat counseling, PCM aggregate check, and document verification.',
    source: 'msrit.edu',
    category: 'College Admission Portal',
    isMock: true
  },
  {
    id: 'res-ncs',
    title: 'National Career Service – Graduate Technical Apprenticeship & Placements',
    url: 'https://careers.ncs.gov.in/tech-fellowship-2026',
    snippet: 'Ministry of Labour & Employment tech placement drive for engineering undergraduates. Competitive stipends and direct industry hiring.',
    source: 'ncs.gov.in',
    category: 'Job Application Portal',
    isMock: true
  }
];

// Quick navigation bookmarks for toolbar
export const QUICK_BOOKMARKS = [
  { label: 'Scholarship Portal', url: 'https://www.reliancefoundation.org/scholarships/ug-stem-2026', tag: 'Scholarship' },
  { label: 'Govt Portal (SSP)', url: 'https://ssp.postmatric.karnataka.gov.in', tag: 'Government' },
  { label: 'College Admission', url: 'https://admissions.msrit.edu/ug-2026', tag: 'Admission' },
  { label: 'Job Application', url: 'https://careers.ncs.gov.in/tech-fellowship-2026', tag: 'Job' },
];

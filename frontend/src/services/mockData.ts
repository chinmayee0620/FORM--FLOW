import { 
  UserProfile, 
  DriveDocument, 
  Application, 
  Opportunity, 
  CalendarReminder, 
  AuditRecord,
  ChatMessage 
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Darshan Kumar',
  email: 'darshan.student@gmail.com',
  phone: '+91 98450 12345',
  institution: 'M S Ramaiah Institute of Technology, Bangalore',
  usnRollNo: '1MS23CS042',
  degreeBranch: 'B.E. Computer Science & Engineering',
  academicYear: '2nd Year (Semester IV)',
  isDriveConnected: true,
  driveAccountEmail: 'darshan.student@gmail.com',
  connectedFoldersCount: 3,
  lastSyncedAt: 'Just now',
  isCalendarConnected: true,
  calendarEmail: 'darshan.student@gmail.com',
};

export const MOCK_DRIVE_DOCUMENTS: DriveDocument[] = [
  {
    id: 'doc-1',
    name: '10th_CBSE_Board_Marksheet_Darshan.pdf',
    category: 'academic',
    fileType: 'pdf',
    size: '1.4 MB',
    modifiedDate: '2024-06-12',
    folderPath: 'My Drive / Academic / Secondary School',
    contentSummary: 'Class X Secondary School Examination marksheet issued by CBSE. Grade 10 aggregate: 94.2%.',
    previewSnippet: 'ROLL NO: 1145829 | CANDIDATE: DARSHAN KUMAR | MOTHER: SUNITA K | DOB: 14/08/2005 | RESULT: PASS WITH DISTINCTION (94.2%)',
    verificationStatus: 'verified',
    extractedFields: [
      { key: 'full_name', label: 'Full Legal Name', value: 'Darshan Kumar', confidence: 0.99, sourceDocName: '10th_CBSE_Board_Marksheet_Darshan.pdf', sourcePage: 1, verified: true },
      { key: 'dob', label: 'Date of Birth', value: '14/08/2005', confidence: 0.99, sourceDocName: '10th_CBSE_Board_Marksheet_Darshan.pdf', sourcePage: 1, verified: true },
      { key: 'tenth_marks', label: 'Class 10 Percentage', value: '94.2%', confidence: 0.98, sourceDocName: '10th_CBSE_Board_Marksheet_Darshan.pdf', sourcePage: 1, verified: true },
    ],
    validity: {
      status: 'no_expiry_required',
      isUserConfirmed: true,
      note: 'Permanent educational credential',
    }
  },
  {
    id: 'doc-2',
    name: '12th_CBSE_Senior_Secondary_Certificate.pdf',
    category: 'academic',
    fileType: 'pdf',
    size: '1.8 MB',
    modifiedDate: '2024-07-04',
    folderPath: 'My Drive / Academic / Higher Secondary',
    contentSummary: 'Class XII Senior School Certificate Examination marksheet. Science Stream (PCM + CS). Aggregate: 96.0%.',
    previewSnippet: 'CANDIDATE: DARSHAN KUMAR | STREAM: SCIENCE | PHYSICS: 95 | CHEMISTRY: 94 | MATHEMATICS: 98 | CS: 97 | AGGREGATE: 96.0%',
    verificationStatus: 'verified',
    extractedFields: [
      { key: 'twelfth_marks', label: 'Class 12 Percentage', value: '96.0%', confidence: 0.99, sourceDocName: '12th_CBSE_Senior_Secondary_Certificate.pdf', sourcePage: 1, verified: true },
      { key: 'board', label: 'Examining Board', value: 'CBSE New Delhi', confidence: 0.98, sourceDocName: '12th_CBSE_Senior_Secondary_Certificate.pdf', sourcePage: 1, verified: true },
    ],
    validity: {
      status: 'no_expiry_required',
      isUserConfirmed: true,
    }
  },
  {
    id: 'doc-3',
    name: 'College_ID_Card_MSRIT.pdf',
    category: 'identity',
    fileType: 'pdf',
    size: '850 KB',
    modifiedDate: '2024-09-10',
    folderPath: 'My Drive / College / Admissions',
    contentSummary: 'Student Identification Card issued by M.S. Ramaiah Institute of Technology, Bangalore. B.E. Computer Science.',
    previewSnippet: 'M S RAMAIAH INSTITUTE OF TECHNOLOGY | STUDENT ID: 1MS23CS042 | NAME: DARSHAN KUMAR | DEPT: COMPUTER SCIENCE & ENGINEERING | VALID: 2023-2027',
    verificationStatus: 'verified',
    extractedFields: [
      { key: 'institution_name', label: 'College / University', value: 'M S Ramaiah Institute of Technology, Bangalore', confidence: 0.97, sourceDocName: 'College_ID_Card_MSRIT.pdf', sourcePage: 1, verified: true },
      { key: 'usn_roll_no', label: 'USN / Student ID', value: '1MS23CS042', confidence: 0.98, sourceDocName: 'College_ID_Card_MSRIT.pdf', sourcePage: 1, verified: true },
      { key: 'degree_branch', label: 'Course & Branch', value: 'B.E. Computer Science & Engineering', confidence: 0.96, sourceDocName: 'College_ID_Card_MSRIT.pdf', sourcePage: 1, verified: true },
      { key: 'year_of_study', label: 'Current Academic Year', value: '2nd Year (Semester IV)', confidence: 0.95, sourceDocName: 'College_ID_Card_MSRIT.pdf', sourcePage: 1, verified: true },
    ],
    validity: {
      issueDate: '2023-09-01',
      expiryDate: '2027-06-30',
      validityPeriod: '4 Academic Years',
      status: 'valid',
      daysRemaining: 580,
      isUserConfirmed: true,
      note: 'Valid until course completion in June 2027',
    }
  },
  {
    id: 'doc-4',
    name: 'Government_Income_Certificate_2025.pdf',
    category: 'income',
    fileType: 'pdf',
    size: '1.2 MB',
    modifiedDate: '2025-04-02',
    folderPath: 'My Drive / Government Certificates / Revenue',
    contentSummary: 'Revenue Department Government of Karnataka Income Certificate. Certified gross annual family income ₹2,40,000.',
    previewSnippet: 'GOVERNMENT OF KARNATAKA | REVENUE DEPARTMENT | CERTIFICATE NO: RD00389123490 | ANNUAL FAMILY INCOME: RS. 2,40,000/- | ISSUED: 02/04/2025 | VALID TILL: 31/03/2026',
    verificationStatus: 'verified',
    extractedFields: [
      { key: 'annual_income', label: 'Annual Household Income', value: '₹2,40,000', confidence: 0.99, sourceDocName: 'Government_Income_Certificate_2025.pdf', sourcePage: 1, verified: true },
      { key: 'certificate_no', label: 'Revenue Certificate Number', value: 'RD00389123490', confidence: 0.99, sourceDocName: 'Government_Income_Certificate_2025.pdf', sourcePage: 1, verified: true },
      { key: 'issuing_authority', label: 'Issuing Officer', value: 'Tahsildar Bangalore North', confidence: 0.95, sourceDocName: 'Government_Income_Certificate_2025.pdf', sourcePage: 1, verified: true },
    ],
    validity: {
      issueDate: '2025-04-02',
      expiryDate: '2026-03-31',
      validityPeriod: '1 Year Financial Validity',
      status: 'due_soon',
      daysRemaining: 128,
      isUserConfirmed: true,
      renewalGuidance: 'Apply online on Karnataka Nadakacheri portal (nadakacheri.karnataka.gov.in) with Form 16 and ration card 30 days prior to expiry.',
      officialPortalUrl: 'https://nadakacheri.karnataka.gov.in',
      note: 'Requires annual renewal for state & corporate scholarship quotas',
    }
  },
  {
    id: 'doc-5',
    name: 'Aadhaar_Card_UIDAI_Masked.pdf',
    category: 'identity',
    fileType: 'pdf',
    size: '920 KB',
    modifiedDate: '2023-11-15',
    folderPath: 'My Drive / Government Certificates / Identity',
    contentSummary: 'UIDAI e-Aadhaar card with masked number (XXXX-XXXX-8921). Name listed as "Darshan K".',
    previewSnippet: 'GOVERNMENT OF INDIA | UNIQUE IDENTIFICATION AUTHORITY | AADHAAR NO: XXXX XXXX 8921 | NAME: DARSHAN K | DOB: 14/08/2005 | GENDER: MALE',
    verificationStatus: 'discrepancy',
    extractedFields: [
      { key: 'aadhaar_name', label: 'Aadhaar Registered Name', value: 'Darshan K', confidence: 0.98, sourceDocName: 'Aadhaar_Card_UIDAI_Masked.pdf', sourcePage: 1, verified: false },
      { key: 'aadhaar_last4', label: 'Masked Aadhaar Number', value: 'XXXX-XXXX-8921', confidence: 0.99, sourceDocName: 'Aadhaar_Card_UIDAI_Masked.pdf', sourcePage: 1, verified: true },
    ],
    validity: {
      status: 'no_expiry_required',
      isUserConfirmed: true,
      note: 'UIDAI guidance: Aadhaar does not have an expiry date. Users are advised by UIDAI to update biometric details every 10 years.',
      officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
    }
  },
  {
    id: 'doc-6',
    name: 'Canara_Bank_Account_Passbook.pdf',
    category: 'income',
    fileType: 'pdf',
    size: '1.1 MB',
    modifiedDate: '2024-08-20',
    folderPath: 'My Drive / Financial / Bank Passbook',
    contentSummary: 'Canara Bank Savings Account statement first page with IFSC and branch stamp. Direct DBT enabled.',
    previewSnippet: 'CANARA BANK | A/C NO: 1049281900234 | IFSC: CNRB0001049 | BENEFICIARY: DARSHAN KUMAR | BRANCH: MALLESHWARAM BANGALORE | DBT: ACTIVE',
    verificationStatus: 'verified',
    extractedFields: [
      { key: 'bank_account_no', label: 'Bank Account Number', value: '1049281900234', confidence: 0.99, sourceDocName: 'Canara_Bank_Account_Passbook.pdf', sourcePage: 1, verified: true },
      { key: 'bank_ifsc', label: 'IFSC Code', value: 'CNRB0001049', confidence: 0.99, sourceDocName: 'Canara_Bank_Account_Passbook.pdf', sourcePage: 1, verified: true },
      { key: 'bank_name', label: 'Bank & Branch', value: 'Canara Bank, Malleshwaram Bangalore', confidence: 0.97, sourceDocName: 'Canara_Bank_Account_Passbook.pdf', sourcePage: 1, verified: true },
    ],
    validity: {
      status: 'valid',
      isUserConfirmed: true,
    }
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-reliance-2026',
    title: 'Reliance Foundation Undergraduate STEM Scholarship 2026',
    category: 'scholarship',
    provider: 'Reliance Foundation & Jio Institute',
    portalUrl: 'https://www.reliancefoundation.org/scholarships/ug-stem-2026',
    deadline: '2026-12-15',
    status: 'ready_for_review',
    readinessScore: 88,
    description: 'Up to ₹2,00,000 grant per year for meritorious first & second year undergraduate students enrolled in full-time Computer Science, AI, and Engineering degree courses.',
    targetFolder: 'My Drive / Scholarships / Reliance 2026',
    humanApprovalRequired: true,
    isApproved: false,
    createdAt: '2026-11-20',
    updatedAt: '2026-11-23',
    requirements: [
      {
        id: 'req-1',
        title: 'Full-time UG STEM Degree Enrollment',
        type: 'criteria',
        requirement: 'Enrolled in 1st/2nd year B.E./B.Tech in recognized engineering college',
        status: 'verified',
        userValue: 'B.E. Computer Science, MSRIT Bangalore (2nd Year)',
        sourceDocument: 'College_ID_Card_MSRIT.pdf',
        details: 'Meets eligibility criteria with active enrollment verification.'
      },
      {
        id: 'req-2',
        title: 'Minimum 60% in Class 12 Board Exam',
        type: 'criteria',
        requirement: 'Passed Class 12 Senior Secondary Examination with >= 60% marks',
        status: 'verified',
        userValue: '96.0% (CBSE Distinction)',
        sourceDocument: '12th_CBSE_Senior_Secondary_Certificate.pdf',
        details: 'Exceeds minimum cutoff of 60% by 36%.'
      },
      {
        id: 'req-3',
        title: 'Household Income Cap (<= ₹15,00,000 / Preference <= ₹2,50,000)',
        type: 'criteria',
        requirement: 'Family annual gross income must not exceed ₹15 Lakhs; preference bracket <= ₹2.5 Lakhs',
        status: 'verified',
        userValue: '₹2,40,000 per annum',
        sourceDocument: 'Government_Income_Certificate_2025.pdf',
        details: 'Falls squarely within the highest-preference priority category.'
      },
      {
        id: 'req-4',
        title: 'Applicant Name Consistency Check',
        type: 'data_field',
        requirement: 'Identity proof name must match academic marksheet',
        status: 'discrepancy',
        userValue: 'Marksheet: "Darshan Kumar" vs Aadhaar: "Darshan K"',
        sourceDocument: '10th_CBSE_Board_Marksheet_Darshan.pdf',
        details: 'Verification MCP flagged single initial vs full surname. Recommend submitting as "Darshan Kumar" as per CBSE Board certificate.'
      },
      {
        id: 'req-5',
        title: 'Active Bank Account with Direct Benefit Transfer (DBT)',
        type: 'document',
        requirement: 'Bank passbook copy showing IFSC, account number, and student name',
        status: 'verified',
        userValue: 'Canara Bank (CNRB0001049, A/C: 1049281900234)',
        sourceDocument: 'Canara_Bank_Account_Passbook.pdf',
        details: 'Bank account is active and matches student legal name.'
      }
    ],
    tasks: [
      { id: 't-1', title: 'Verify Class 10 & 12 mark sheets in Drive', completed: true, dueDate: '2026-11-21', requiredDoc: '10th_CBSE_Board_Marksheet_Darshan.pdf' },
      { id: 't-2', title: 'Confirm Annual Income details (₹2.40L)', completed: true, dueDate: '2026-11-22', requiredDoc: 'Government_Income_Certificate_2025.pdf' },
      { id: 't-3', title: 'Resolve Aadhaar initial name variation', completed: true, dueDate: '2026-11-23' },
      { id: 't-4', title: 'Human Approval checkpoint authorization', completed: false, dueDate: '2026-12-10' },
      { id: 't-5', title: 'Final portal submission before Dec 15 deadline', completed: false, dueDate: '2026-12-15' },
    ],
    timeline: [
      { date: '2026-11-20', title: 'Portal Analysis Initiated', description: 'Form Analysis MCP parsed Reliance STEM 2026 portal rules & eligibility guidelines.', status: 'completed' },
      { date: '2026-11-21', title: 'Drive Document Indexing', description: 'Document MCP retrieved marksheet, college ID, income cert, and bank passbook.', status: 'completed' },
      { date: '2026-11-23', title: 'Data Cross-Checking', description: 'Verification MCP validated criteria; flagged name variation for review.', status: 'completed' },
      { date: '2026-12-10', title: 'Human Approval Checkpoint', description: 'Student reviews pre-filled values and signs explicit submission consent.', status: 'current' },
      { date: '2026-12-15', title: 'Official Application Deadline', description: 'Portal closes at 5:00 PM IST.', status: 'upcoming' },
    ],
    preparedFields: [
      {
        id: 'f-1',
        fieldKey: 'applicant_full_name',
        fieldName: 'Full Legal Name (as per 10th Certificate)',
        section: 'Personal Details',
        mappedValue: 'Darshan Kumar',
        sourceDocument: '10th_CBSE_Board_Marksheet_Darshan.pdf',
        sourcePage: 1,
        confidence: 0.99,
        status: 'verified',
      },
      {
        id: 'f-2',
        fieldKey: 'date_of_birth',
        fieldName: 'Date of Birth (DD/MM/YYYY)',
        section: 'Personal Details',
        mappedValue: '14/08/2005',
        sourceDocument: '10th_CBSE_Board_Marksheet_Darshan.pdf',
        sourcePage: 1,
        confidence: 0.99,
        status: 'verified',
      },
      {
        id: 'f-3',
        fieldKey: 'parent_income',
        fieldName: 'Gross Annual Household Income',
        section: 'Financial Information',
        mappedValue: '₹2,40,000',
        sourceDocument: 'Government_Income_Certificate_2025.pdf',
        sourcePage: 1,
        confidence: 0.98,
        status: 'verified',
      },
      {
        id: 'f-4',
        fieldKey: 'college_name',
        fieldName: 'Current College / Institute Name',
        section: 'Academic Information',
        mappedValue: 'M S Ramaiah Institute of Technology, Bangalore',
        sourceDocument: 'College_ID_Card_MSRIT.pdf',
        sourcePage: 1,
        confidence: 0.97,
        status: 'verified',
      },
      {
        id: 'f-5',
        fieldKey: 'course_specialization',
        fieldName: 'Program of Study & Degree',
        section: 'Academic Information',
        mappedValue: 'B.E. Computer Science & Engineering',
        sourceDocument: 'College_ID_Card_MSRIT.pdf',
        sourcePage: 1,
        confidence: 0.97,
        status: 'verified',
      },
      {
        id: 'f-6',
        fieldKey: 'bank_account_dbt',
        fieldName: 'Direct Benefit Transfer Bank Account Number',
        section: 'Disbursement Details',
        mappedValue: '1049281900234 (IFSC: CNRB0001049)',
        sourceDocument: 'Canara_Bank_Account_Passbook.pdf',
        sourcePage: 1,
        confidence: 0.99,
        status: 'verified',
      },
      {
        id: 'f-7',
        fieldKey: 'id_match_warning',
        fieldName: 'Identity Document Cross-Check',
        section: 'Verification MCP Discrepancy Note',
        mappedValue: 'Darshan Kumar (Aadhaar has "Darshan K")',
        sourceDocument: 'Aadhaar_Card_UIDAI_Masked.pdf',
        confidence: 0.91,
        status: 'warning',
        discrepancyWarning: 'Portal accepts self-declaration affidavit or using 10th marksheet name.',
      }
    ]
  },
  {
    id: 'app-karnataka-ssp',
    title: 'Karnataka State Scholarship Portal (SSP) Post-Matric 2026',
    category: 'government_scheme',
    provider: 'Department of Social Welfare, Govt of Karnataka',
    portalUrl: 'https://ssp.postmatric.karnataka.gov.in',
    deadline: '2026-11-30',
    status: 'drafting',
    readinessScore: 75,
    description: 'State financial reimbursement for technical degree courses covering college tuition, lab fees, and maintenance allowance.',
    targetFolder: 'My Drive / Scholarships / Karnataka SSP',
    humanApprovalRequired: true,
    isApproved: false,
    createdAt: '2026-11-18',
    updatedAt: '2026-11-22',
    requirements: [
      {
        id: 'ssp-1',
        title: 'Karnataka Domicile Proof',
        type: 'document',
        requirement: 'Valid Karnataka state domicile certificate issued by Tahsildar',
        status: 'matched',
        userValue: 'Verified Resident (Bangalore Urban)',
        sourceDocument: 'Government_Income_Certificate_2025.pdf',
      },
      {
        id: 'ssp-2',
        title: 'Aadhaar Seeded NPCI Bank Account',
        type: 'criteria',
        requirement: 'Bank account linked to Aadhaar on NPCI mapper',
        status: 'verified',
        userValue: 'Canara Bank DBT Linked',
        sourceDocument: 'Canara_Bank_Account_Passbook.pdf',
      },
      {
        id: 'ssp-3',
        title: 'College Admission Fee Receipt',
        type: 'document',
        requirement: 'Official receipt for academic year 2025-26 fee payment',
        status: 'missing',
        details: 'Not found in connected Google Drive folders. Please add receipt to Drive folder "College / Fees".'
      }
    ],
    tasks: [
      { id: 'ssp-t1', title: 'Verify Karnataka Domicile & Income Cert', completed: true, dueDate: '2026-11-19' },
      { id: 'ssp-t2', title: 'Verify NPCI DBT Bank seeding', completed: true, dueDate: '2026-11-20' },
      { id: 'ssp-t3', title: 'Upload College Fee Receipt to Google Drive folder', completed: false, dueDate: '2026-11-28' },
    ],
    timeline: [
      { date: '2026-11-18', title: 'Application Draft Created', description: 'Imported requirements from SSP portal.', status: 'completed' },
      { date: '2026-11-20', title: 'Document Scan & Audit', description: 'Found 3 documents; 1 fee receipt pending in Drive.', status: 'current' },
      { date: '2026-11-30', title: 'Portal Cutoff', description: 'State post-matric portal closes for round 1.', status: 'upcoming' },
    ],
    preparedFields: []
  },
  {
    id: 'app-gsoc-2026',
    title: 'Google Summer of Code & Applied Research Fellowship 2026',
    category: 'internship',
    provider: 'Google Open Source Programs',
    portalUrl: 'https://summerofcode.withgoogle.com',
    deadline: '2027-01-15',
    status: 'submitted',
    readinessScore: 100,
    description: 'Prestigious global software development and research mentorship program paired with open-source organizations.',
    targetFolder: 'My Drive / Internships / GSoC 2026',
    humanApprovalRequired: true,
    isApproved: true,
    createdAt: '2026-11-10',
    updatedAt: '2026-11-20',
    requirements: [
      {
        id: 'gsoc-1',
        title: 'Enrollment Verification Certificate',
        type: 'document',
        requirement: 'Proof of active student enrollment in accredited university',
        status: 'verified',
        userValue: 'MSRIT B.E. Computer Science ID verified',
        sourceDocument: 'College_ID_Card_MSRIT.pdf'
      },
      {
        id: 'gsoc-2',
        title: 'Academic Standing Verification',
        type: 'criteria',
        requirement: 'Good academic standing in undergraduate degree program',
        status: 'verified',
        userValue: '12th CBSE 96.0% Distinction',
        sourceDocument: '12th_CBSE_Senior_Secondary_Certificate.pdf'
      }
    ],
    tasks: [
      { id: 'gsoc-t1', title: 'Project proposal submission', completed: true },
      { id: 'gsoc-t2', title: 'Student enrollment verification', completed: true },
      { id: 'gsoc-t3', title: 'Final application approved and submitted', completed: true },
    ],
    timeline: [
      { date: '2026-11-10', title: 'Proposal Drafted', description: 'Drafted proposal on AI/ML Distributed Systems.', status: 'completed' },
      { date: '2026-11-18', title: 'Human Approval Granted', description: 'Authorized submission of enrollment records.', status: 'completed' },
      { date: '2026-11-20', title: 'Submitted to Google Portal', description: 'Application reference #GSC-2026-8829 received.', status: 'completed' },
    ],
    preparedFields: []
  }
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  // Scholarships
  {
    id: 'opp-1',
    title: 'Siemens Scholarship Program for Engineering Students 2026',
    category: 'scholarship',
    provider: 'Siemens India Foundation',
    awardAmount: '₹1,00,000 / year + Internship + Laptop',
    deadline: '2026-12-28',
    matchScore: 96,
    matchReasons: [
      'Matches your B.E. Computer Science degree at MSRIT Bangalore',
      'Requires Class 12 aggregate >= 60% (Your verified score: 96.0%)',
      'Requires family income <= ₹2.5 Lakhs (Your verified income: ₹2.40 Lakhs)'
    ],
    eligibilitySummary: 'Open to 1st and 2nd year students in government or recognized engineering colleges with high academic merit and annual family income under ₹2.5L.',
    officialUrl: 'https://www.siemens.com/in/en/company/sustainability/corporate-citizenship/scholarship.html',
    status: 'recommended',
    verifiedSource: true,
    postedDate: '2026-11-15',
    type: 'Corporate Merit-cum-Need'
  },
  {
    id: 'opp-2',
    title: 'HDFC Bank Parivartan’s ECS Scholarship 2026',
    category: 'scholarship',
    provider: 'HDFC Bank Social Initiatives',
    awardAmount: '₹75,000 one-time grant',
    deadline: '2026-12-31',
    matchScore: 93,
    matchReasons: [
      'Matches undergraduate technical degree criteria',
      'Income limit <= ₹2,50,000 met by your verified income certificate',
      'All 5 mandatory documents already available in your Google Drive'
    ],
    eligibilitySummary: 'Aimed at supporting meritorious underprivileged students facing financial distress to complete higher education.',
    officialUrl: 'https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility',
    status: 'saved',
    verifiedSource: true,
    postedDate: '2026-11-10',
    type: 'Financial Hardship & Merit'
  },
  {
    id: 'opp-3',
    title: 'Tata Trust Medical & Engineering Meritorious Aid',
    category: 'scholarship',
    provider: 'Tata Trusts',
    awardAmount: '₹50,000 per annum',
    deadline: '2027-01-20',
    matchScore: 85,
    matchReasons: [
      'Supports AICTE accredited engineering college students',
      'Requires Class 10 & 12 distinction (both verified in your Drive)'
    ],
    eligibilitySummary: 'Need-based financial grant for undergraduate students with proven academic discipline.',
    officialUrl: 'https://www.tatatrusts.org/our-work/education/scholarships',
    status: 'recommended',
    verifiedSource: true,
    postedDate: '2026-11-05',
    type: 'Endowment Grant'
  },

  // Internships
  {
    id: 'opp-4',
    title: 'Google Summer Research & Engineering Fellowship 2026',
    category: 'internship',
    provider: 'Google Research India',
    awardAmount: '₹1,20,000 monthly stipend',
    deadline: '2027-01-15',
    matchScore: 88,
    matchReasons: [
      'Matches Computer Science specialization and strong academic transcript',
      'Focus areas: Distributed Systems, ML, and Applied AI algorithms'
    ],
    eligibilitySummary: 'Competitive fellowship for pre-final and sophomore engineering students in India with demonstrable coding skills and high GPA.',
    officialUrl: 'https://research.google/outreach/fellowships/',
    status: 'recommended',
    verifiedSource: true,
    postedDate: '2026-11-12',
    location: 'Bangalore, India (Hybrid)',
    type: 'Research Fellowship'
  },
  {
    id: 'opp-5',
    title: 'Microsoft Research India Summer Research Internship',
    category: 'internship',
    provider: 'Microsoft Research',
    awardAmount: '₹1,00,000 / month + Mentorship',
    deadline: '2027-01-30',
    matchScore: 91,
    matchReasons: [
      'Top-tier undergraduate research track in Systems & AI',
      'Matches B.E. Computer Science enrollment at MSRIT'
    ],
    eligibilitySummary: '10-12 week full-time summer internship collaborating with leading Microsoft researchers in Bangalore.',
    officialUrl: 'https://www.microsoft.com/en-us/research/careers/internships/',
    status: 'saved',
    verifiedSource: true,
    postedDate: '2026-11-14',
    location: 'Bangalore, India',
    type: 'Summer Internship'
  },

  // Government Schemes
  {
    id: 'opp-6',
    title: 'National Scholarship Portal (NSP) Central Sector Scheme',
    category: 'government_scheme',
    provider: 'Ministry of Education, Govt of India',
    awardAmount: '₹20,000 / year for 3 years',
    deadline: '2026-12-20',
    matchScore: 95,
    matchReasons: [
      'Requires > 80th percentile in Class 12 CBSE (Your score: 96.0%)',
      'Annual parental income <= ₹4.5 Lakhs (Your verified income: ₹2.40L)',
      'Direct Benefit Transfer account already active in Canara Bank'
    ],
    eligibilitySummary: 'Centrally sponsored scholarship for college and university students in technical and professional streams based on board merit.',
    officialUrl: 'https://scholarships.gov.in',
    status: 'recommended',
    verifiedSource: true,
    postedDate: '2026-11-01',
    type: 'Central Govt Scheme'
  },
  {
    id: 'opp-7',
    title: 'Karnataka Vidyasiri (Food & Accommodation Assistance)',
    category: 'government_scheme',
    provider: 'Karnataka Backward Classes Welfare Dept',
    awardAmount: '₹1,500 / month student hostel allowance',
    deadline: '2026-12-05',
    matchScore: 90,
    matchReasons: [
      'Karnataka state domicile verified in revenue records',
      'Income certificate under ₹2.5L threshold'
    ],
    eligibilitySummary: 'Monthly financial assistance towards food and accommodation for post-matric students living away from hometown.',
    officialUrl: 'https://bcwd.karnataka.gov.in',
    status: 'recommended',
    verifiedSource: true,
    postedDate: '2026-11-08',
    type: 'State Welfare Scheme'
  },

  // College Admissions
  {
    id: 'opp-8',
    title: 'IISc Bangalore Direct Ph.D. & Integrated M.Tech 2027',
    category: 'admission',
    provider: 'Indian Institute of Science, Bangalore',
    awardAmount: 'Full Ministry Fellowship (₹31,000/mo)',
    deadline: '2027-03-25',
    matchScore: 84,
    matchReasons: [
      'Undergraduate research track in Computer Science & AI',
      'Early pre-registration window for top engineering institutions'
    ],
    eligibilitySummary: 'Early admission pathway for high-achieving undergraduate students with strong mathematics and computing foundations.',
    officialUrl: 'https://admissions.iisc.ac.in',
    status: 'recommended',
    verifiedSource: true,
    postedDate: '2026-11-18',
    type: 'Direct Postgraduate Admission'
  },

  // Jobs / Graduate Trainee
  {
    id: 'opp-9',
    title: 'Cisco Systems Associate Software Engineer (Campus 2027)',
    category: 'job',
    provider: 'Cisco India Campus Hiring',
    awardAmount: '₹18,50,000 CTC + Health & Relocation',
    deadline: '2027-02-15',
    matchScore: 89,
    matchReasons: [
      'Open to 2027 graduating B.E. Computer Science candidates',
      'Requires Class 10 & 12 distinction with no active backlogs'
    ],
    eligibilitySummary: 'Full-time graduate software engineering role in cloud security, networking protocols, and distributed platforms.',
    officialUrl: 'https://jobs.cisco.com',
    status: 'saved',
    verifiedSource: true,
    postedDate: '2026-11-15',
    location: 'Bangalore, India',
    type: 'Campus Graduate Hiring'
  }
];

export const MOCK_REMINDERS: CalendarReminder[] = [
  {
    id: 'rem-1',
    title: 'Reliance STEM Scholarship Application Deadline',
    type: 'deadline',
    dueDate: '2026-12-15',
    daysRemaining: 21,
    priority: 'high',
    relatedEntity: 'Reliance Foundation Undergraduate STEM Scholarship 2026',
    status: 'upcoming',
    notes: 'Portal closes at 5:00 PM IST. Application readiness score is 88%. User approval checkpoint pending.',
    actionUrl: '/applications/app-reliance-2026'
  },
  {
    id: 'rem-2',
    title: 'Karnataka SSP Missing Fee Receipt Upload',
    type: 'followup',
    dueDate: '2026-11-28',
    daysRemaining: 4,
    priority: 'high',
    relatedEntity: 'Karnataka State Scholarship Portal (SSP) Post-Matric 2026',
    status: 'due_soon',
    notes: 'Missing College Admission Fee Receipt. Save file in Drive folder "College / Fees" to enable automatic readiness mapping.',
    actionUrl: '/documents'
  },
  {
    id: 'rem-3',
    title: 'Government Income Certificate Renewal Due Date',
    type: 'document_renewal',
    dueDate: '2026-03-31',
    daysRemaining: 127,
    priority: 'medium',
    relatedEntity: 'Government_Income_Certificate_2025.pdf',
    status: 'upcoming',
    notes: 'Revenue department validity expires end of FY 2025-26. FormFlow 90-day alert scheduled in Calendar MCP.',
    actionUrl: 'https://nadakacheri.karnataka.gov.in'
  },
  {
    id: 'rem-4',
    title: 'College Bonafide Certificate Verification',
    type: 'followup',
    dueDate: '2026-11-22',
    daysRemaining: -2,
    priority: 'medium',
    relatedEntity: 'M S Ramaiah Institute of Technology Academic Office',
    status: 'overdue',
    notes: 'Request signed bonafide certificate from academic section for winter internship applications.',
    actionUrl: '/documents'
  },
  {
    id: 'rem-5',
    title: 'National Scholarship Portal (NSP) Central Sector Deadline',
    type: 'deadline',
    dueDate: '2026-12-20',
    daysRemaining: 26,
    priority: 'high',
    relatedEntity: 'NSP Central Sector Scholarship 2026',
    status: 'upcoming',
    notes: 'Application window for college CBSE students.',
    actionUrl: 'https://scholarships.gov.in'
  }
];

export const MOCK_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'aud-1',
    timestamp: '2026-11-23 23:45:10',
    action: 'Google Drive Read Authorization',
    mcpServer: 'Document MCP',
    details: 'Retrieved metadata and text streams for 6 authorized documents from folder "My Drive / Academic" and "My Drive / Government Certificates"',
    status: 'allowed'
  },
  {
    id: 'aud-2',
    timestamp: '2026-11-23 23:45:14',
    action: 'Portal Specification Parsing',
    mcpServer: 'Form Analysis MCP',
    details: 'Analyzed Reliance Foundation STEM Scholarship 2026 portal requirements (14 form fields, 5 eligibility criteria, 4 required files)',
    status: 'allowed'
  },
  {
    id: 'aud-3',
    timestamp: '2026-11-23 23:45:18',
    action: 'Cross-Document Identity Verification',
    mcpServer: 'Verification MCP',
    details: 'Flagged subtle discrepancy: 10th Marksheet records "Darshan Kumar", Aadhaar records "Darshan K". Confidence: 91%. Prompted user guidance.',
    status: 'allowed'
  },
  {
    id: 'aud-4',
    timestamp: '2026-11-23 23:45:22',
    action: 'Form Pre-Filling & Safety Checkpoint',
    mcpServer: 'Browser MCP',
    details: 'Mapped 6 source-backed fields with 98% average confidence. Halted submission: explicit Human Approval checkpoint invoked.',
    status: 'requires_consent'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    timestamp: '11:40 PM',
    content: `👋 Welcome to **FormFlow – Intelligent Application & Form Assistant**.

I am connected to your authorized **Google Drive** folder (*${INITIAL_USER.driveAccountEmail}*). I search and analyze your existing documents directly—**without creating duplicate uploads** or storing file copies.

### What I can help you with right now:
- **Scholarship & Portal Analysis**: Paste any application portal URL or select a scholarship to evaluate your requirements and calculate an explainable **Readiness Score**.
- **Cross-Document Verification**: Detect inconsistencies in names, dates of birth, marks, and income limits across your official records.
- **Document Renewal Intelligence**: Track certificate validity periods (e.g. Income Certificate expiry or UIDAI update guidance) with proactive alerts.
- **Assisted Form Preparation**: Map source-backed values into supported application fields with explicit **Human Approval Checkpoints** before anything is shared.

How would you like to proceed today?`,
    sourcesCited: [
      { docName: '10th_CBSE_Board_Marksheet_Darshan.pdf', folder: 'My Drive / Academic', snippet: 'Candidate: Darshan Kumar | DOB: 14/08/2005' },
      { docName: 'Government_Income_Certificate_2025.pdf', folder: 'My Drive / Government Certificates', snippet: 'Annual Income: ₹2,40,000 | Valid till 31/03/2026' }
    ]
  },
  {
    id: 'msg-sample-req',
    sender: 'user',
    timestamp: '11:42 PM',
    content: 'Can you check my eligibility and prepare my application for the Reliance Foundation Undergraduate STEM Scholarship 2026? Use my Google Drive documents.'
  },
  {
    id: 'msg-sample-resp',
    sender: 'assistant',
    timestamp: '11:43 PM',
    content: `I have analyzed the **Reliance Foundation Undergraduate STEM Scholarship 2026** against your authorized Google Drive documents.

### Executive Summary:
- **Overall Application Readiness**: **88% Ready**
- **Stated Eligibility Match**: ✅ **Eligible (High Priority Bracket)**
  - Course: B.E. Computer Science at MSRIT Bangalore (Meets STEM criterion)
  - Class 12 Merit: **96.0%** (Exceeds 60% minimum cutoff)
  - Family Income: **₹2,40,000 / year** (Within ₹2.5L preference tier)
- **Attention Required**: ⚠️ **Name variation detected between documents**
  - Your 10th CBSE Marksheet lists: \`Darshan Kumar\`
  - Your UIDAI Aadhaar record lists: \`Darshan K\`
  - *Recommendation*: Use **Darshan Kumar** in the portal form to match your educational awards.

All required fields have been mapped from your Google Drive files. Before any browser portal entry occurs, review the pre-filled values and provide your explicit authorization below.`,
    mcpSteps: [
      {
        server: 'Form Analysis MCP',
        toolName: 'parse_portal_requirements',
        status: 'completed',
        outputSnippet: 'Parsed 14 fields, 5 eligibility criteria, and 4 document requirements for Reliance STEM 2026.',
        timestamp: '11:42:04'
      },
      {
        server: 'Document MCP',
        toolName: 'search_and_extract_drive_files',
        status: 'completed',
        outputSnippet: 'Found 4 matching files in Google Drive: Marksheets, College ID, Income Cert, Aadhaar.',
        timestamp: '11:42:07'
      },
      {
        server: 'Verification MCP',
        toolName: 'cross_check_requirements',
        status: 'warning',
        outputSnippet: 'Academic merit and income verified. 1 name discrepancy flagged between CBSE and Aadhaar.',
        timestamp: '11:42:11'
      },
      {
        server: 'Calendar MCP',
        toolName: 'schedule_deadline_reminder',
        status: 'completed',
        outputSnippet: 'Scheduled application deadline alert for Dec 15, 2026 (22 days remaining).',
        timestamp: '11:42:13'
      },
      {
        server: 'Approval & Audit MCP',
        toolName: 'require_human_consent',
        status: 'completed',
        outputSnippet: 'Human Approval checkpoint generated. Awaiting user signature.',
        timestamp: '11:42:15'
      }
    ],
    readinessCard: {
      applicationId: 'app-reliance-2026',
      applicationTitle: 'Reliance Foundation Undergraduate STEM Scholarship 2026',
      score: 88,
      matched: 4,
      missing: 0,
      issues: 1
    },
    approvalCard: {
      applicationId: 'app-reliance-2026',
      applicationTitle: 'Reliance Foundation Undergraduate STEM Scholarship 2026',
      fieldsCount: 6,
      targetPortal: 'https://www.reliancefoundation.org/scholarships/ug-stem-2026',
      status: 'pending'
    },
    sourcesCited: [
      { docName: '10th_CBSE_Board_Marksheet_Darshan.pdf', folder: 'My Drive / Academic', snippet: 'Candidate: Darshan Kumar | DOB: 14/08/2005' },
      { docName: '12th_CBSE_Senior_Secondary_Certificate.pdf', folder: 'My Drive / Academic', snippet: 'Aggregate: 96.0% (Science Stream)' },
      { docName: 'College_ID_Card_MSRIT.pdf', folder: 'My Drive / College', snippet: 'MSRIT B.E. Computer Science | USN: 1MS23CS042' },
      { docName: 'Government_Income_Certificate_2025.pdf', folder: 'My Drive / Government Certificates', snippet: 'Annual Income: ₹2,40,000 | Tahsildar Bangalore North' }
    ]
  }
];

/**
 * Mock AI Responses Database & Response Generators.
 * Stored separately from UI components.
 * Explicitly indicates mock simulation for all generated assistant answers.
 */

import { AssistantIntent, AIConversationContext, AIResponseResult, ToolStatusMessage } from './types';
import { MCPExecutionStep } from '../../types';

export const SIMULATION_DISCLAIMER = '> ⚠️ **[SIMULATED AI RESPONSE · FORMFLOW PROTOTYPE]**: Generated via modular Mock AI Provider. Responses adapt to your active portal context and Google Drive files without external LLM API calls.\n\n';

export function createStandardToolStatuses(
  intent: AssistantIntent,
  portalName: string,
  nowStr: string
): ToolStatusMessage[] {
  return [
    {
      stage: 'understanding_request',
      label: 'Understanding request',
      detail: `Parsed intent: ${intent.replace(/_/g, ' ')}`,
      status: 'completed',
      timestamp: nowStr,
    },
    {
      stage: 'inspecting_application',
      label: 'Inspecting application',
      detail: `Connected to active portal: ${portalName}`,
      status: 'completed',
      timestamp: nowStr,
    },
    {
      stage: 'checking_documents',
      label: 'Checking documents',
      detail: 'Cross-referencing 7 documents in authorized Google Drive',
      status: 'completed',
      timestamp: nowStr,
    },
    {
      stage: 'preparing_form_fields',
      label: 'Preparing form fields',
      detail: 'Mapped citation-backed fields with confidence scores',
      status: 'completed',
      timestamp: nowStr,
    },
    {
      stage: 'waiting_for_approval',
      label: 'Waiting for approval',
      detail: 'Enforcing human approval safety gate before submission',
      status: intent === 'fill_application_form' ? 'waiting' : 'completed',
      timestamp: nowStr,
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// RESPONSE GENERATORS PER INTENT
// ─────────────────────────────────────────────────────────────

export function generateFillApplicationResponse(
  context: AIConversationContext,
  nowStr: string
): AIResponseResult {
  const portal = context.browserPageContext;
  const isReliance = portal?.url.includes('reliancefoundation.org') || !portal;
  const isSSP = portal?.url.includes('ssp.postmatric.karnataka.gov.in');
  const isMSRIT = portal?.url.includes('msrit.edu');
  const isNCS = portal?.url.includes('ncs.gov.in');

  let portalTitle = 'Reliance Foundation Undergraduate STEM Scholarship 2026';
  let targetUrl = 'https://www.reliancefoundation.org/scholarships/ug-stem-2026';
  let fieldsTable = '';
  let requiredExplanation = '';
  let missingInfo = '';
  let nextStep = '';

  if (isSSP) {
    portalTitle = 'Karnataka State Scholarship Portal (SSP) Post-Matric 2026-27';
    targetUrl = 'https://ssp.postmatric.karnataka.gov.in';
    fieldsTable = `
| Field Name | Mapped Value | Source Drive Document | Confidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Student SATS / SSP ID** | \`SSP-KA-2024-88910\` | \`College_ID_Card_MSRIT.pdf\` | 99% | ✅ Verified |
| **Tahsildar Income RD No.** | \`RD00389123490\` | \`Government_Income_Certificate_2025.pdf\` | 98% | ✅ Verified |
| **Annual Family Income** | \`₹2,40,000\` | \`Government_Income_Certificate_2025.pdf\` | 97% | ✅ Verified |
| **Aadhaar DBT Consent** | \`Yes (Canara Bank NPCI Linked)\` | \`Aadhaar_Card_UIDAI_Masked.pdf\` | 99% | ✅ Verified |
| **College Fee Receipt** | *Missing in Drive* | \`Pending Receipt Upload\` | 0% | ⚠️ Action Needed |
`;
    requiredExplanation = `
- **Required Documents & Credentials**:
  1. Valid Karnataka Revenue Department RD number for income verification (< ₹2.5L).
  2. Aadhaar-linked active mobile number for e-KYC authentication.
  3. Official 2025-26 College Admission Fee Receipt showing tuition paid.`;
    missingInfo = `
- ⚠️ **Missing Information**: **Current Academic Year College Fee Receipt (2025-26)**.
  - *Status*: Not found in your authorized Google Drive folder \`My Drive / Academic\`.
  - *Action*: Upload \`College_Fee_Receipt_2025_26.pdf\` to Google Drive or enter your Challan reference manually.`;
    nextStep = `
1. Check the browser panel on your right; mapped fields are pre-filled with green highlights.
2. Review the pre-filled RD certificate number (\`RD00389123490\`).
3. Click **"Authorize Submission"** to trigger the safety checkpoint when you are ready.`;
  } else if (isMSRIT) {
    portalTitle = 'MSRIT Central Undergraduate Admissions Portal 2026-27';
    targetUrl = 'https://admissions.msrit.edu/ug-2026';
    fieldsTable = `
| Field Name | Mapped Value | Source Drive Document | Confidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Candidate Legal Name** | \`Darshan Kumar\` | \`10th_CBSE_Board_Marksheet_Darshan.pdf\` | 99% | ✅ Verified |
| **Entrance Exam Rank (KCET)** | \`1,842 (Category: GM)\` | \`KCET_2024_Scorecard_Darshan.pdf\` | 99% | ✅ Verified |
| **1st Preference Branch** | \`B.E. Computer Science & Engg\` | \`Candidate Academic Records\` | 98% | ✅ Verified |
| **10+2 PCM Aggregate** | \`97.33% (P:96, C:98, M:98)\` | \`12th_CBSE_Senior_Secondary_Certificate.pdf\` | 99% | ✅ Verified |
| **Quota / Category** | \`General Merit (Karnataka Resident)\` | \`Government_Income_Certificate_2025.pdf\` | 95% | ✅ Verified |
| **Transfer Certificate (TC)** | *Awaiting School Clearance* | \`Pending Document\` | 0% | ⚠️ Due at Admission |
`;
    requiredExplanation = `
- **Required Admission Credentials**:
  1. Valid KCET / COMEDK 2026 rank score card.
  2. 10th and 12th board marks cards showing mandatory PCM subjects.
  3. Transfer Certificate (TC) from your previous junior college.`;
    missingInfo = `
- ⚠️ **Missing Information**: **Original Transfer Certificate (TC)** from your previous institution.
  - *Note*: Provisional admission can proceed with Undertaking Form #4.`;
    nextStep = `
1. Inspect the MSRIT Admission portal displayed in the browser workspace.
2. Verify your B.E. Computer Science preference and KCET rank (\`1,842\`).
3. Authorize FormFlow to stage these values before final counseling lock.`;
  } else if (isNCS) {
    portalTitle = 'National Career Service – Graduate Technical Apprenticeship & Placements';
    targetUrl = 'https://careers.ncs.gov.in/tech-fellowship-2026';
    fieldsTable = `
| Field Name | Mapped Value | Source Drive Document | Confidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Candidate Name** | \`Darshan Kumar\` | \`10th_CBSE_Board_Marksheet_Darshan.pdf\` | 99% | ✅ Verified |
| **University USN / Roll** | \`1MS23CS042 (MSRIT)\` | \`College_ID_Card_MSRIT.pdf\` | 99% | ✅ Verified |
| **Current CGPA (Sem 1-3)** | \`9.42 / 10.0\` | \`MSRIT_Grade_Card_Semester_3.pdf\` | 98% | ✅ Verified |
| **Technical Core Stack** | \`Python, TypeScript, React, SQL\` | \`Darshan_Kumar_Software_Resume.pdf\` | 97% | ✅ Verified |
| **Portfolio / GitHub** | \`https://github.com/darshankumar-dev\` | \`Darshan_Kumar_Software_Resume.pdf\` | 96% | ✅ Verified |
| **Preferred Location** | \`Bengaluru / Hybrid\` | \`Candidate Profile Preferences\` | 95% | ✅ Verified |
`;
    requiredExplanation = `
- **Required Placement Information**:
  1. Accurate cumulative CGPA without active backlogs.
  2. Verified software portfolio or GitHub repository showing recent commits.
  3. Valid National Identity card (Aadhaar / Voter ID).`;
    missingInfo = `
- ✅ **All Essential Information Identified**: No blocking documents missing. All 6 technical profile fields are verified from your Drive resume and grade cards.`;
    nextStep = `
1. Review the NCS Placement application visible in the split browser.
2. Confirm your preferred role (Software Engineer / Cloud Apprenticeship).
3. Click **"Authorize Submission"** to approve the application audit log.`;
  } else {
    // Default: Reliance STEM
    fieldsTable = `
| Form Field | Mapped Value | Source Google Drive File | Confidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Applicant Legal Name** | \`Darshan Kumar\` | \`10th_CBSE_Board_Marksheet_Darshan.pdf\` | 99% | ✅ Verified |
| **Date of Birth** | \`14/08/2005\` | \`10th_CBSE_Board_Marksheet_Darshan.pdf\` | 99% | ✅ Verified |
| **Class 12th Percentage** | \`96.0% (Distinction)\` | \`12th_CBSE_Senior_Secondary_Certificate.pdf\` | 99% | ✅ Verified |
| **College / University** | \`M S Ramaiah Institute of Technology\` | \`College_ID_Card_MSRIT.pdf\` | 97% | ✅ Verified |
| **Degree & Branch** | \`B.E. Computer Science & Engg\` | \`College_ID_Card_MSRIT.pdf\` | 96% | ✅ Verified |
| **Annual Family Income** | \`₹2,40,000\` | \`Government_Income_Certificate_2025.pdf\` | 98% | ✅ Verified |
| **DBT Bank Account** | \`Canara Bank (IFSC: CNRB0001049)\` | \`Canara_Bank_Account_Passbook.pdf\` | 99% | ✅ Verified |
| **Aadhaar Match** | \`Darshan K\` | \`Aadhaar_Card_UIDAI_Masked.pdf\` | 92% | ⚠️ Name Variation |
`;
    requiredExplanation = `
- **Required Information for Reliance STEM**:
  1. Enrolled in 1st/2nd year full-time undergraduate degree in STEM.
  2. Minimum 60% aggregate in Class 12 board examinations (You have **96.0%**).
  3. Household gross income <= ₹15,00,000 (Your documented income is **₹2,40,000**).
  4. Active bank account enabled for Direct Benefit Transfer (DBT).`;
    missingInfo = `
- ⚠️ **Name Discrepancy Note**:
  - Class 10th marksheet: **Darshan Kumar**
  - Aadhaar Card: **Darshan K**
  - *Recommendation*: Use **Darshan Kumar** in the portal to align with CBSE board records and your MSRIT college ID.`;
    nextStep = `
1. Check the browser panel on your right. The 8 fields are pre-filled and highlighted with green source indicators.
2. Review the values against your original Drive documents using the **View** buttons.
3. Click **"Authorize Submission"** to trigger the safety checkpoint when you are ready.`;
  }

  const message = `${SIMULATION_DISCLAIMER}### 📝 Assisted Form Filling: **${portalTitle}**

I have analyzed the current active website in your browser panel:
- **Target Portal**: [${portalTitle}](${targetUrl})
- **Active URL**: \`${targetUrl}\`

### 1. Form Fields Detected & Mapped
${fieldsTable}

### 2. Required Information & Criteria
${requiredExplanation}

### 3. Missing Information & Warnings
${missingInfo}

### 4. Recommended Next Step
${nextStep}`;

  const mcpSteps: MCPExecutionStep[] = [
    {
      server: 'Browser MCP',
      toolName: 'inspect_live_page',
      status: 'completed',
      outputSnippet: `Inspected active portal form at ${targetUrl}.`,
      timestamp: nowStr,
    },
    {
      server: 'Document MCP',
      toolName: 'retrieve_source_values',
      status: 'completed',
      outputSnippet: 'Extracted source-backed values from 10th/12th marksheets, MSRIT ID, and Income cert.',
      timestamp: nowStr,
    },
    {
      server: 'Approval & Audit MCP',
      toolName: 'enforce_human_approval',
      status: 'completed',
      outputSnippet: 'Human Approval checkpoint armed. User authorization required before submission.',
      timestamp: nowStr,
    },
  ];

  return {
    message,
    intent: 'fill_application_form',
    providerId: 'mock-ai',
    modelName: 'formflow-intent-engine-v1',
    isSimulated: true,
    toolStatuses: createStandardToolStatuses('fill_application_form', portalTitle, nowStr),
    mcpSteps,
    shouldOpenBrowser: true,
    browserUrl: targetUrl,
    readinessCard: {
      applicationId: 'app-active-form',
      applicationTitle: portalTitle,
      score: isSSP ? 82 : 94,
      matched: 5,
      missing: isSSP ? 1 : 0,
      issues: 1,
    },
    approvalCard: {
      applicationId: 'app-active-form',
      applicationTitle: portalTitle,
      fieldsCount: 6,
      targetPortal: portalTitle,
      status: 'pending',
    },
    sourcesCited: [
      { docName: '10th_CBSE_Board_Marksheet_Darshan.pdf', folder: 'My Drive / Academic', snippet: 'Candidate: Darshan Kumar | DOB: 14/08/2005' },
      { docName: 'Government_Income_Certificate_2025.pdf', folder: 'My Drive / Government Certificates', snippet: 'Annual Income: ₹2,40,000' },
      { docName: 'College_ID_Card_MSRIT.pdf', folder: 'My Drive / Academic', snippet: 'USN: 1MS23CS042 | Branch: B.E. CSE' },
    ],
  };
}

export function generateRequirementsResponse(
  context: AIConversationContext,
  nowStr: string
): AIResponseResult {
  const portal = context.browserPageContext;
  const portalName = portal?.portalName || 'Reliance Foundation Undergraduate STEM Scholarship 2026';
  const portalUrl = portal?.url || 'https://www.reliancefoundation.org/scholarships/ug-stem-2026';

  const message = `${SIMULATION_DISCLAIMER}### 📋 Requirements Breakdown: **${portalName}**

I inspected the portal currently open in your browser workspace (\`${portalUrl}\`):

#### 1. Core Eligibility Conditions
- **Degree Requirement**: Regular, full-time undergraduate degree in Computer Science, IT, or STEM discipline.
- **Academic Merit Cutoff**: Minimum **60.0%** in Class 12 board examinations (Your record: **96.0%** ✅).
- **Financial Ceiling**: Gross annual household income up to ₹15,00,000 (Preference tier <= ₹2,50,000; Your record: **₹2,40,000** ✅).
- **Nationality**: Indian citizen with verified identity documentation.

#### 2. Cross-Verification Status
- **Class 12 Marks**: Verified via \`12th_CBSE_Senior_Secondary_Certificate.pdf\` (Score: 96.0%).
- **College Enrollment**: Verified via \`College_ID_Card_MSRIT.pdf\` (Enrolled in B.E. CSE, 2nd Year).
- **Income Certificate**: Verified via \`Government_Income_Certificate_2025.pdf\` (RD No. RD00389123490).

Ask me *"Help me fill this application"* to map these verified values directly into the portal form!`;

  const mcpSteps: MCPExecutionStep[] = [
    {
      server: 'Form Analysis MCP',
      toolName: 'synthesize_portal_rules',
      status: 'completed',
      outputSnippet: `Parsed eligibility rules from ${portalUrl}.`,
      timestamp: nowStr,
    },
    {
      server: 'Verification MCP',
      toolName: 'audit_profile_fit',
      status: 'completed',
      outputSnippet: 'Evaluated user credentials against portal thresholds: 100% criteria met.',
      timestamp: nowStr,
    },
  ];

  return {
    message,
    intent: 'understand_requirements',
    providerId: 'mock-ai',
    modelName: 'formflow-intent-engine-v1',
    isSimulated: true,
    toolStatuses: createStandardToolStatuses('understand_requirements', portalName, nowStr),
    mcpSteps,
    readinessCard: {
      applicationId: 'app-active-form',
      applicationTitle: portalName,
      score: 96,
      matched: 4,
      missing: 0,
      issues: 0,
    },
  };
}

export function generateFindDocumentsResponse(
  context: AIConversationContext,
  nowStr: string
): AIResponseResult {
  const portal = context.browserPageContext;
  const portalName = portal?.portalName || 'Application Portals';

  const message = `${SIMULATION_DISCLAIMER}### 📁 Document Verification Audit for **${portalName}**

I scanned your authorized Google Drive repository against the required checklist:

| Required Document | Detected in Drive | Verification Status | Source Document Name |
| :--- | :--- | :--- | :--- |
| **10th Class Marksheet** | ✅ Found | Verified (99% match) | \`10th_CBSE_Board_Marksheet_Darshan.pdf\` |
| **12th Class Marksheet** | ✅ Found | Verified (98% match) | \`12th_CBSE_Senior_Secondary_Certificate.pdf\` |
| **Income Certificate** | ✅ Found | Verified (Valid till 2026) | \`Government_Income_Certificate_2025.pdf\` |
| **College Student ID Card** | ✅ Found | Verified (Enrolled) | \`College_ID_Card_MSRIT.pdf\` |
| **Bank Account Passbook** | ✅ Found | DBT Enabled | \`Canara_Bank_Account_Passbook.pdf\` |
| **UIDAI Aadhaar Card** | ✅ Found | Name Variation Note | \`Aadhaar_Card_UIDAI_Masked.pdf\` |

#### Summary:
- **Verified in Google Drive**: 6 of 6 core documents present.
- **Attention Flag**: Name discrepancy between Aadhaar (\`Darshan K\`) and 10th marksheet (\`Darshan Kumar\`).

Click any document citation chip to preview the file directly.`;

  const mcpSteps: MCPExecutionStep[] = [
    {
      server: 'Document MCP',
      toolName: 'scan_drive_repository',
      status: 'completed',
      outputSnippet: 'Discovered 6 matching files across Academic, Income, and Identity folders.',
      timestamp: nowStr,
    },
    {
      server: 'Verification MCP',
      toolName: 'cross_verify_identities',
      status: 'completed',
      outputSnippet: 'Flagged 1 name variation between Aadhaar and Board certificate.',
      timestamp: nowStr,
    },
  ];

  return {
    message,
    intent: 'find_required_documents',
    providerId: 'mock-ai',
    modelName: 'formflow-intent-engine-v1',
    isSimulated: true,
    toolStatuses: createStandardToolStatuses('find_required_documents', portalName, nowStr),
    mcpSteps,
    sourcesCited: [
      { docName: '10th_CBSE_Board_Marksheet_Darshan.pdf', folder: 'My Drive / Academic', snippet: 'Candidate: Darshan Kumar | DOB: 14/08/2005' },
      { docName: '12th_CBSE_Senior_Secondary_Certificate.pdf', folder: 'My Drive / Academic', snippet: 'Aggregate: 96.0% (Distinction)' },
      { docName: 'Government_Income_Certificate_2025.pdf', folder: 'My Drive / Government Certificates', snippet: 'Annual Income: ₹2,40,000' },
    ],
  };
}

export function generateCheckStatusResponse(
  context: AIConversationContext,
  nowStr: string
): AIResponseResult {
  const message = `${SIMULATION_DISCLAIMER}### 📊 FormFlow Application Pipeline Status

Here is the real-time tracking summary of your tracked applications:

1. **Reliance Foundation STEM Scholarship 2026**
   - *Status*: **Ready for Review** (88% Readiness Score)
   - *Deadline*: 15 December 2026 (21 days remaining)
   - *Checklist*: 4 verified, 1 name discrepancy note, 0 missing.

2. **Karnataka State Post-Matric Scholarship (SSP)**
   - *Status*: **Drafting / Pending Fee Receipt**
   - *Deadline*: 30 November 2026 (6 days remaining)
   - *Action Needed*: Upload College Fee Receipt to complete mapping.

3. **MSRIT Central UG Admissions 2026**
   - *Status*: **Verified Active** (Seat allocated: B.E. CSE)
   - *Next Milestone*: Final verification at Admissions Block, MSRIT.

Ask me *"Open this scholarship website"* or *"Help me fill this application"* to view any portal in the split browser!`;

  const mcpSteps: MCPExecutionStep[] = [
    {
      server: 'Form Analysis MCP',
      toolName: 'query_pipeline_status',
      status: 'completed',
      outputSnippet: 'Retrieved 3 active applications from internal tracking store.',
      timestamp: nowStr,
    },
  ];

  return {
    message,
    intent: 'check_application_status',
    providerId: 'mock-ai',
    modelName: 'formflow-intent-engine-v1',
    isSimulated: true,
    toolStatuses: createStandardToolStatuses('check_application_status', 'Application Pipeline', nowStr),
    mcpSteps,
  };
}

export function generateDeadlinesResponse(
  context: AIConversationContext,
  nowStr: string
): AIResponseResult {
  const portal = context.browserPageContext;
  const currentDeadline = portal?.deadline || '15 December 2026, 5:00 PM IST';
  const portalName = portal?.portalName || 'Reliance STEM Scholarship';

  const message = `${SIMULATION_DISCLAIMER}### ⏰ Deadlines & Submission Timeline

#### Active Portal: **${portalName}**
- **Closing Date**: **${currentDeadline}**
- **Time Remaining**: 21 days remaining
- **Application Portal Status**: Accepting online submissions

#### Upcoming Calendar Milestones:
- **30 Nov 2026**: Karnataka SSP Post-Matric Application Deadline (6 days)
- **15 Dec 2026**: Reliance Foundation STEM Scholarship Portal Closes (21 days)
- **10 Jan 2027**: National Career Service Graduate Technical Fellowship
- **31 Mar 2027**: Revenue Income Certificate Annual Renewal Window

Would you like me to set a calendar reminder 48 hours before the deadline?`;

  const mcpSteps: MCPExecutionStep[] = [
    {
      server: 'Calendar MCP',
      toolName: 'fetch_upcoming_deadlines',
      status: 'completed',
      outputSnippet: `Extracted deadline for ${portalName}: ${currentDeadline}`,
      timestamp: nowStr,
    },
  ];

  return {
    message,
    intent: 'find_deadlines',
    providerId: 'mock-ai',
    modelName: 'formflow-intent-engine-v1',
    isSimulated: true,
    toolStatuses: createStandardToolStatuses('find_deadlines', portalName, nowStr),
    mcpSteps,
  };
}

export function generateSetReminderResponse(
  context: AIConversationContext,
  nowStr: string
): AIResponseResult {
  const portal = context.browserPageContext;
  const portalName = portal?.portalName || 'Reliance Foundation STEM Scholarship';
  const deadlineDate = portal?.deadline?.split(',')[0] || '15 December 2026';

  const message = `${SIMULATION_DISCLAIMER}### 📅 Calendar Reminder Scheduled!

I have created an automated milestone in your synced Google Calendar:

- **Reminder Title**: \`[FormFlow] Submit Application for ${portalName}\`
- **Target Deadline**: ${deadlineDate}
- **Early Warning Alert**: Scheduled **48 hours prior** (13 Dec 2026, 9:00 AM)
- **Connected Calendar**: \`darshan.k@msrit.edu\` (Sub-calendar: *FormFlow Applications*)
- **Notification Type**: Email Notification + Browser Push Alert

You can view and manage all reminders in the **Reminders** tab from the left sidebar.`;

  const mcpSteps: MCPExecutionStep[] = [
    {
      server: 'Calendar MCP',
      toolName: 'create_calendar_event',
      status: 'completed',
      outputSnippet: `Created Google Calendar event for ${portalName} due ${deadlineDate}.`,
      timestamp: nowStr,
    },
  ];

  return {
    message,
    intent: 'set_reminders',
    providerId: 'mock-ai',
    modelName: 'formflow-intent-engine-v1',
    isSimulated: true,
    toolStatuses: createStandardToolStatuses('set_reminders', portalName, nowStr),
    mcpSteps,
  };
}

export function generateFindFormsResponse(
  context: AIConversationContext,
  nowStr: string
): AIResponseResult {
  const message = `${SIMULATION_DISCLAIMER}### 🔍 Available Application Forms

I found 4 verified application portals matching your academic profile (B.E. Computer Science, MSRIT Bangalore):

1. **Reliance Foundation Undergraduate STEM Scholarship 2026**
   - *Type*: Scholarship Application Portal
   - *Award*: Up to ₹2,00,000 / year
   - *Portal*: [https://www.reliancefoundation.org/scholarships/ug-stem-2026](https://www.reliancefoundation.org/scholarships/ug-stem-2026)

2. **Karnataka State Scholarship Portal (SSP) Post-Matric**
   - *Type*: Government Scheme Portal
   - *Benefit*: Full tuition fee reimbursement + maintenance allowance
   - *Portal*: [https://ssp.postmatric.karnataka.gov.in](https://ssp.postmatric.karnataka.gov.in)

3. **MSRIT Central Undergraduate Admissions Portal 2026-27**
   - *Type*: College Admission Portal
   - *Scope*: Autonomous B.E. degree admissions & seat allocation
   - *Portal*: [https://admissions.msrit.edu/ug-2026](https://admissions.msrit.edu/ug-2026)

4. **National Career Service – Graduate Technical Apprenticeship**
   - *Type*: Job & Placement Portal
   - *Eligibility*: Pre-final & Final year engineering undergraduates
   - *Portal*: [https://careers.ncs.gov.in/tech-fellowship-2026](https://careers.ncs.gov.in/tech-fellowship-2026)

Click any link or ask *"Open this scholarship website"* to load it in the split browser!`;

  const mcpSteps: MCPExecutionStep[] = [
    {
      server: 'Browser MCP',
      toolName: 'query_portal_catalog',
      status: 'completed',
      outputSnippet: 'Discovered 4 active portals in local catalog matching STEM undergraduate criteria.',
      timestamp: nowStr,
    },
  ];

  return {
    message,
    intent: 'find_forms',
    providerId: 'mock-ai',
    modelName: 'formflow-intent-engine-v1',
    isSimulated: true,
    toolStatuses: createStandardToolStatuses('find_forms', 'Portal Catalog', nowStr),
    mcpSteps,
  };
}

export function generateGeneralResponse(
  query: string,
  context: AIConversationContext,
  nowStr: string
): AIResponseResult {
  const portal = context.browserPageContext;
  const portalName = portal?.portalName || 'FormFlow Directory';

  const message = `${SIMULATION_DISCLAIMER}I received your request: *"${query}"*

I am FormFlow's AI Assistant, connected to:
- **Active Browser Portal**: **${portalName}**
- **Document Source**: Authorized Google Drive (7 verified files)
- **Safety Gate**: Active Human Approval checkpoint

Here are key tasks I can assist you with right now:
1. *"Help me fill this application"* – Populates form fields with Drive citations.
2. *"What are the application requirements?"* – Breaks down cutoffs and quotas.
3. *"Check my missing documents"* – Identifies files needed for submission.
4. *"What is the application deadline?"* – Checks cutoffs and sets alerts.`;

  const mcpSteps: MCPExecutionStep[] = [
    {
      server: 'Form Analysis MCP',
      toolName: 'process_general_query',
      status: 'completed',
      outputSnippet: 'Synthesized intent against active portal and user Google Drive state.',
      timestamp: nowStr,
    },
  ];

  return {
    message,
    intent: 'general_query',
    providerId: 'mock-ai',
    modelName: 'formflow-intent-engine-v1',
    isSimulated: true,
    toolStatuses: createStandardToolStatuses('general_query', portalName, nowStr),
    mcpSteps,
  };
}

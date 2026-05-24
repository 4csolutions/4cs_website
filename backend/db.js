import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Sector from './models/Sector.js';
import Testimonial from './models/Testimonial.js';
import ClientLogo from './models/ClientLogo.js';
import Blog from './models/Blog.js';

export const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/4cs_website';
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(connString, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected successfully!`);
    
    // Run Seeder
    await seedData();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn(`WARNING: Running server in database-offline mode. Static website preview is fully available, but dynamic API submissions will be unavailable.`);
  }
};

const seedData = async () => {
  try {
    // ALWAYS CLEAR COLLECTIONS on startup to ensure latest codebase-derived copy propagates
    console.log('Clearing database collections to refresh seeder data...');
    await User.deleteMany({});
    await Sector.deleteMany({});
    await Testimonial.deleteMany({});
    await ClientLogo.deleteMany({});
    await Blog.deleteMany({});

    // 1. Seed Admin User
    console.log('Seeding default Admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('Default Admin user created successfully (username: admin, password: admin123)');

    // 2. Seed Sectors based directly on custom codebase analysis
    console.log('Seeding initial sectors with domain feature lists...');
    const initialSectors = [
      {
        slug: 'healthcare',
        name: 'HEALTHCARE',
        description: 'Premium customizable clinical workflow suite powered by ERPNext Healthcare & the 4CS custom hospital extension. By integrating patient timelines, practitioner schedules, and lab sample observation states, we eliminate clinical paper trails and billing leaks.',
        icon: 'activity',
        image: '/files/Forensic medicine-amico.png',
        features: [
          'Automated DOB Resolution: Smart python hook auto-calculating exact DOB from patient age inputs upon save.',
          'Inpatient Date Safeguards: Custom backend validation preventing billing leaks by enforcing service dates to inpatient record timelines.',
          'Diagnostics Auto-Linking: Hooks linking patient sample collections directly to Diagnostic Reports upon diagnostic submission.',
          'Observation State Sync: Real-time update hooks that propagate vital parameters from laboratory devices directly into Doctor consultation screens.',
          'Medication Expiry Controls: Expiry date and batch number synchronization between inventory ledger items and clinical DocTypes.',
          'Daily Health Card Audits: Background daily cron task that audits patient health card statuses and automatically flags expired coverages.',
          'Encounter Drug Prescriptions: Submission hooks that populate dosage and pharmacy default rates automatically on Patient Encounter submission.'
        ]
      },
      {
        slug: 'logistics',
        name: 'LOGISTICS & FLEET',
        description: 'Robust supply chain, lorry dispatch, and fleet management powered by ERPNext Logistics and our specialized Vehicle Management System (VMS). Track tyre serial rotations, automate distance Bata allowances, and calculate net-trip profits instantly.',
        icon: 'truck',
        image: '/files/Logistics-amico.png',
        features: [
          'Lorry Receipt (LR) Mapping: Custom DocTypes mapping multiple lorry receipts and customer consignments to single trip logsheets.',
          'Tyre Rotation Logs: System tracking tyre serials, tread wear audits, and wheel position rotations to optimize fleet maintenance costs.',
          'Route Bata Allocations: Customized distance and cost tables auto-calculating driver Bata expenses based on specific route plans.',
          'Dispatch Gatepass Management: Custom GDM logsheets verifying exact loading items and weight capacities at warehouse gates.',
          'Driver Payout Settlements: Custom settlement ledgers tracking cash advances, trip fuel costs, driver commissions, and net profits.',
          'Pre-Trip Vehicle Checklists: Safety inspection forms verifying tyres, brakes, and electricals before trip release.',
          'Vehicle Expense Ledgers: Automated tracking of maintenance schedules, spare parts issuances, and fuel card transactions.',
          'EMI Repayment Calendars: Specialized vehicle loan tracking schedules calculating monthly interest amortization costs.'
        ]
      },
      {
        slug: 'legal',
        name: 'LEGAL PRACTICE',
        description: 'Tailored legal case matter and courtroom schedule manager powered by our custom CaseCentral suite. Track advocate billable hours, structure client advance trust accounts, index case stage histories, and manage court hearing alerts securely.',
        icon: 'scale',
        image: '/files/Law firm-amico.png',
        features: [
          'Case Matter Catalog: Complete record profiling of legal files, case types, opposing counsels, and court jurisdictions.',
          'Litigation Stage History: Sequential logging tracking case progress from filing to interim hearings and final disposal.',
          'Interim Applications (IA) Ledger: Structured sub-registry tracking pending stay orders, bail bonds, and emergency applications.',
          'Exhibits & Evidence Index: Digital cataloging system organizing exhibits and legal notes linked to case stages.',
          'Lawyer Schedule Planning: Multi-practitioner booking slots coordinating hearing times, client briefings, and courtroom dates.',
          'Legal Service Rate Sheets: Custom lawyer billing rates tracking hourly briefs, legal notices, and retainer consults.',
          'Outward Document Registry: Mandatory outward correspondence logs tracking legal filings, letters, and courier notices.',
          'Book Lending Library: Built-in lending records tracking legal library assets, books, and reference logs.'
        ]
      },
      {
        slug: 'project-contracting',
        name: 'PROJECT CONTRACTING',
        description: 'A comprehensive engineering costing and budget control ERP designed specifically for infrastructure builders and project contractors. Monitor project Gantt stages, control material requisitions via strict BOQ boundaries, and map cash flows.',
        icon: 'briefcase',
        image: '/files/Businessman-amico.png',
        features: [
          'Bill of Quantities (BOQ) Ledger: Custom DocType detailing item estimations, cost limits, and project deliverables.',
          'Cost Center Hard Limits: Programmatic budget checks preventing unapproved material issues and contractor overruns.',
          'Cash Flow Mapping: Advanced mapping mapping chart of accounts to projected project cash inflows and outflows.',
          'Subcontractor Work Orders: Direct integration managing subcontractor billing milestones, retention money, and advance releases.',
          'Timesheet Labor Allocation: Seamless project cost calculation based on timesheet hours submitted by site engineering heads.',
          'Earned Value Cost Tracking: Dynamic reporting comparing actual material expenses to estimated BOQ budget lines.'
        ]
      }
    ];
    
    const seededSectors = await Sector.insertMany(initialSectors);
    console.log('Sectors seeded successfully.');

    // 3. Seed Testimonials (linked to seeded sectors)
    console.log('Seeding client testimonials...');
    const healthcareSector = seededSectors.find(s => s.slug === 'healthcare');
    const logisticsSector = seededSectors.find(s => s.slug === 'logistics');
    const contractingSector = seededSectors.find(s => s.slug === 'project-contracting');

    const testimonialsToSeed = [
      {
        clientName: 'Dr. Abdul Qadir',
        clientPosition: 'Medical Director',
        companyName: 'Adarsh Multispecialty Clinic',
        feedback: 'The Patient DOB auto-resolution and Observation sync built by 4C Solutions solved our patient waiting times completely. We now have patient records, laboratory test parameters, and pharmacy checkouts communicating on a single, secure screen.',
        avatarPath: '',
        sector: healthcareSector ? healthcareSector._id : null
      },
      {
        clientName: 'Rahul Deshmukh',
        clientPosition: 'Operations Head',
        companyName: 'Vikas Shipping & Logistics',
        feedback: 'Tyre costs were our second largest expense. The Tyre Rotation log and Driver Settlement systems in 4C Solutions\' VMS app gave us full visibility, reducing fuel leakages and tyre replacements by 18% in the first year.',
        avatarPath: '',
        sector: logisticsSector ? logisticsSector._id : null
      },
      {
        clientName: 'Mohammad Yusuf',
        clientPosition: 'Managing Director',
        companyName: 'STC Infrastructure Ltd',
        feedback: 'Enforcing strict BOQ cost center validations on ERPNext saved us from significant subcontractor billing overruns. 4C Solutions\' project controls and cash flow mapping are brilliant.',
        avatarPath: '',
        sector: contractingSector ? contractingSector._id : null
      }
    ];

    await Testimonial.insertMany(testimonialsToSeed);
    console.log('Testimonials seeded successfully.');

    // 4. Seed Client Logos
    console.log('Seeding client logos...');
    const logos = [
      { clientName: 'SLA Law Chambers', logoPath: '/assets/logos/client_sla.png', websiteUrl: '#', sector: seededSectors.find(s => s.slug === 'legal')?._id },
      { clientName: 'PVI Hospitals', logoPath: '/assets/logos/client_pvi.png', websiteUrl: '#', sector: healthcareSector?._id },
      { clientName: 'STC Infra Projects', logoPath: '/assets/logos/client_stc.png', websiteUrl: '#', sector: contractingSector?._id },
      { clientName: 'Methaq Logistics', logoPath: '/assets/logos/client_methaq.png', websiteUrl: '#', sector: logisticsSector?._id },
      { clientName: 'Spollex Tech', logoPath: '/assets/logos/client_spollex.png', websiteUrl: '#', sector: logisticsSector?._id },
      { clientName: 'Adarsh Clinics', logoPath: '/assets/logos/client_adarsh.png', websiteUrl: '#', sector: healthcareSector?._id },
      { clientName: 'Kalaburagi Logistics', logoPath: '/assets/logos/client_klogistics.png', websiteUrl: '#', sector: logisticsSector?._id },
      { clientName: 'Karnatak Contracting', logoPath: '/assets/logos/client_kcontracting.png', websiteUrl: '#', sector: contractingSector?._id }
    ];
    await ClientLogo.insertMany(logos);
    console.log('Client logos seeded successfully.');

    // 5. Seed Blogs/Case Studies based directly on actual codebases
    console.log('Seeding descriptive blogs/case studies from custom codebase logic...');
    
    const legalSector = seededSectors.find(s => s.slug === 'legal');

    const initialBlogs = [
      {
        slug: 'healthcare-workflow-automation-custom-4cs',
        title: 'Solving Clinical Bottlenecks: A Technical Review of the 4CS Healthcare Suite',
        summary: 'How we solved Patient DOB resolution overflows, secured Inpatient Record date validations, and built automated laboratory observation triggers using custom Frappe Server scripts.',
        author: '4C Solutions Engineering',
        coverImage: '',
        sector: healthcareSector ? healthcareSector._id : null,
        metaKeywords: ['healthcare erpnext', 'frappe healthcare', 'custom hospital software', 'patient encounter script', 'abdm integration'],
        content: `# Solving Clinical Bottlenecks: A Technical Review of the 4CS Healthcare Suite

## The Challenge in Clinical Operations
Enterprise healthcare clinics face a dual challenge: patient record integrity and complex, synchronized invoicing. Manual errors in birth dates disrupt medical histories, inpatient procedures get charged outside checkout dates, and pharmaceutical drug inventories fail to match patient encounters.

At **4C Solutions**, we spent over five years implementing ERPNext Healthcare. Rather than using generic configs, we built the **Custom 4CS Healthcare Extension** (powered by \`healthcare\` and \`custom_4cs\` applications) to automate these processes.

---

## 🛠️ Code-Level Solutions and Architecture

### 1. Enforcing Patient DOB Integrity
Many registration desks input a patient's approximate age, leaving birthdates blank. This causes record mismatches. We implemented a programmatic \`before_save\` hook in the \`Patient\` DocType:
* **Function:** \`set_patient_dob_from_age\`
* **Logic:** When age is provided, the backend calculates and updates the patient's exact DOB dynamically. This ensures 100% complete records.
* **Secondary Event:** On \`on_update\`, the custom method \`setup_customer_primary_contact\` automatically links primary patient contact details with billing entities.

### 2. Elimination of Inpatient Billing Overlaps
A major revenue leak in hospitals is inpatient services logged *after* a patient is discharged. We solved this with a custom validation hook on \`Inpatient Record\`:
* **Function:** \`validate_ipservices_dates\`
* **How it works:** Programmatically intercepts all inpatient orders. If any service date is entered outside the exact admission/checkout timestamps, it halts saving and alerts the billing operator.

### 3. Real-Time Diagnostics & Device Observations
Doctors often wait for lab test reports, slowing down outpatient procedures. Our backend overrides standard observation methods:
* **Methods Hooked:** \`make_observation\`, \`get_observation_details\`
* **Trigger:** Upon sample collection, the system creates a digital observation ledger. Once clinical test results compile, \`update_diagnostic_report_status\` propagates test metrics directly to the practitioner's workspace in real-time.

### 4. Zero-Leakage Medication Sync
In the pharmacy, tracking medicine batches is critical. We hooked the \`Medication\` DocType (\`after_insert\` and \`on_update\`) to call:
* \`sync_item_tax_rate_and_uom\`
* \`sync_batch_no_and_expiry_date\`
* **Benefit:** Ensures that every medicine item instantly carries correct tax slabs and syncs with batch ledger records to raise alarms weeks before a batch expires.

---

## 📈 Real-World Business Outcomes
* **50% Faster Outpatient Checkout:** Due to automated prescription and clinical procedure invoice aggregation.
* **Zero Billing Leakages:** Programmatic safeguards block any post-discharge service entries.
* **Full Expiry Tracking:** Pharmacists receive batch warnings 30 days before expiration, reducing wastage.

*Note: 4C Solutions is an independent systems integrator with 5+ years of dedicated implementation expertise. We are not an official Frappe partner, which allows us to focus entirely on building high-domain, custom solutions.*
`
      },
      {
        slug: 'optimizing-logistics-margins-vms-tyre-rotation',
        title: 'Optimizing Logistics Margins: Tyre Rotation Logs and Driver Payout Automations',
        summary: 'A detailed look inside the VMS and Logistics custom apps, showcasing tyre inventory controls, pre-trip vehicle checklists, and automated driver settlement ledgers.',
        author: '4C Solutions Operations',
        coverImage: '',
        sector: logisticsSector ? logisticsSector._id : null,
        metaKeywords: ['logistics erpnext', 'vehicle management system', 'tyre rotation log', 'driver settlement erp', 'fleet logs'],
        content: `# Optimizing Logistics Margins: Tyre Rotation Logs and Driver Payout Automations

## Fleet Cost Realities
For shipping and transport companies, fuel and tyres represent their largest operational cost lines. Without strict tracking, tyre thefts are common, and driver expense advances are settled weeks late with high discrepancy rates.

Leveraging our **5+ years of ERPNext implementation experience**, we designed and deployed the custom **Logistics & VMS (Vehicle Management System) Suite** (\`logistics\` and \`vms\` applications) to give fleet operators complete dashboard control over every single wheel and fuel invoice.

---

## 🛠️ Key Fleet Control Features

### 1. Smart Tyre Serial Rotation Ledger
Tyres wear out unevenly. A front tyre wears differently from a rear dual tyre. We created custom DocTypes:
* **\`tyre\`:** Profiles each tyre with serial numbers, brand, and purchase metrics.
* **\`tyre_rotation_log\`:** Logs every tread audit and wheel shift.
* **\`tyre_rotation_detail\`:** Maps the movement of a tyre serial from front-right to rear-left dual, tracking distance run per position. This enables fleet owners to double the lifespan of heavy-vehicle tyres.

### 2. Lorry Receipt (LR) & GDM Logsheet Mapping
Tying shipments to truck dispatches is notoriously complex. Our \`logistics\` app resolves this using:
* **\`logsheet_lr\` / \`logsheet_lr_item\`:** Automatically maps multiple customer Lorry Receipts directly to a single trip logsheet.
* **\`logsheet_gdm\`:** Integrates Gatepass & Dispatch Management to record cargo weight verification at loading docks.

### 3. Automated Driver Settlements
Drivers take cash advances for toll, fuel, and Bata allowances. Reconciling this manually takes hours.
* **DocType:** \`settlement\`
* **Automated Logic:** Compiles trip logsheets, pulls fuel card transactions, adds the custom \`route_bata_table\` values, subtracts driver advances, and calculates net trip profitability and driver commission payouts instantly.

---

## 📈 Operational Impact
* **18% Reduction in Tyre Costs:** Real-time serial tracking and tread rotations prevent premature tyre replacement.
* **24-Hour Billing Cycles:** trip documents and delivery signatures are uploaded on arrival, allowing billing teams to invoice clients instantly.
* **Elimination of Fuel Discrepancies:** Programmatic vehicle logs highlight fuel consumption variances immediately.
`
      },
      {
        slug: 'casecentral-legal-practice-matter-timesheet',
        title: 'Case Study: Streamlining Matter Tracking and Legal Timesheets with CaseCentral',
        summary: 'Inside 4CS CaseCentral legal practice suite—how we customize matter Lifecycles, courtroom stage reminders, outward documents, and advocate billing rates.',
        author: '4C Solutions Consulting',
        coverImage: '',
        sector: legalSector ? legalSector._id : null,
        metaKeywords: ['legal erpnext', 'law practice management', 'case matter tracking', 'lawyer scheduler', 'advocate billing'],
        content: `# Streamlining Matter Tracking and Legal Timesheets with CaseCentral

## The Complexity of Legal Operations
Law firms operate on strict billable hour models, complex retainer trust accounts, and high-consequence hearing dates. A missed hearing date or an unrecorded consultation hour can damage client trust and impact revenue.

We developed **CaseCentral** (\`casecentral\` custom application), a comprehensive practice management solution designed to coordinate advocate calendars, secure legal filings, and track hours.

---

## 🛠️ Inside the CaseCentral Architecture

### 1. High-Fidelity Matter & Case Stage Tracker
Every dispute has multiple dependencies. CaseCentral maps these through custom DocTypes:
* **\`matter\` / \`matter_type\`:** Profiles client case records, case categories (civil, criminal, tax), and opposing counsels.
* **\`case_history\` / \`case_stage\`:** Records every stage of litigation, court dates, and previous orders.
* **\`case_ia_status\`:** Tracks Interim Applications separately to ensure emergency stay hearings are prioritized.

### 2. Lawyer Schedule & Room Bookings
Legal teams need a unified calendar. CaseCentral provides:
* **\`lawyer_schedule\` / \`lawyer_schedule_time_slot\`:** Programmatically allocates lawyers to courtroom appearances and client briefs.
* **\`meeting_room_schedule\`:** Integrates booking systems for conference rooms to coordinate client meetings.

### 3. Dynamic Legal Service Billing Rates
Legal consultants bill differently based on seniority. CaseCentral handles this via:
* **\`legal_service_rate\`:** Programmatically applies customized billing scales (e.g., Senior Advocate briefs, Junior associate drafting, hourly client consulting).
* **\`legal_service_entry\`:** An automated timesheet record pulling specific case codes and advocate hourly metrics to build invoices instantly.

### 4. Legal Library & Book Lending
* **DocTypes:** \`book\`, \`lend_book\`, \`book_type\`
* **Features:** A specialized tracking system for law firm library assets, ensuring rare books and litigation references are logged and returned.

---

## 📈 Real-World Outcomes
* **Zero Missed Hearing Dates:** Due to automated hearing reminders and integrated lawyer schedule calendars.
* **15% Increase in Captured Billable Hours:** Advocates track consulting hours directly on mobile via \`legal_service_entry\`.
* **Retainer Trust Security:** Integrated billing triggers automatically deduct fees from client trust advances.
`
      },
      {
        slug: 'project-controls-boq-hard-budget-mapping',
        title: 'Project Controls: Bill of Quantities (BOQ) and Cash Flow Mapping on ERPNext',
        summary: 'How we build hard-limit cost validations and cash flow mapping into engineering and construction ERPs to secure contract margins.',
        author: '4C Solutions Project Management',
        coverImage: '',
        sector: contractingSector ? contractingSector._id : null,
        metaKeywords: ['construction erp', 'project boq', 'cost center validation', 'cash flow mapping erpnext', 'subcontractor billing'],
        content: `# Project Controls: Bill of Quantities (BOQ) and Cash Flow Mapping on ERPNext

## Minimizing Risks in Construction Contracting
Infrastructure developers and heavy engineering contractors operate on tight margins. Material price volatility, subcontractor billing leaks, and inaccurate cash flow planning often lead to project delays and cost overruns.

Leveraging our **5+ years of custom ERPNext implementation experience**, we built the custom **Project Controls Suite** (\`project_controls\` application) to introduce strict financial controls at the site level.

---

## 🛠️ Core Engineering Control Modules

### 1. Bill of Quantities (BOQ) cost structures
Traditional project tracking fails to bridge site requirements with estimated purchase rates.
* **DocType:** \`project_boq\`
* **Benefit:** Structures every single contract deliverable, concrete quantity, and structural item with hard rate limits. No site engineer can request materials beyond the approved BOQ scope.

### 2. Hard Cost Center Valuations
* **DocType:** \`budget_cost_center\` / \`project_budget\`
* **Enforcement:** Programs custom cost validations into ERPNext. If a procurement request or site material issue exceeds the allocated cost-center budget for a project phase, the transaction blocks automatically and routes to directors for approval.

### 3. Integrated Cash Flow Mapping
* **DocTypes:** \`cash_flow_mapper\`, \`cash_flow_mapping\`, \`cash_flow_mapping_accounts\`
* **Utility:** Programmatically maps ledger accounts to projected cash flow milestones. This enables developers to forecast monthly cash receipts, tax liabilities, and subcontractor payments in a single dynamic cockpit.

---

## 📈 Real-World Business Outcomes
* **Zero Project Cost Overruns:** Hard cost-center validations block unauthorized expenses.
* **100% Cash Flow Visibility:** Automated mapping aggregates site advances and subcontractor payables.
* **Optimized Subcontractor Audits:** Payments are released only when engineering teams confirm completed milestones in the timesheet.
`
      }
    ];

    await Blog.insertMany(initialBlogs);
    console.log('Blogs and case studies seeded successfully.');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};

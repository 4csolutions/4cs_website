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
    // 1. Seed Admin User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default Admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default Admin user created successfully (username: admin, password: admin123)');
    }

    // 2. Seed Sectors
    const sectorCount = await Sector.countDocuments();
    let seededSectors = [];
    if (sectorCount === 0) {
      console.log('Seeding initial sectors...');
      const initialSectors = [
        {
          slug: 'healthcare',
          name: 'HEALTHCARE',
          description: 'Customizable ERPNext hospital and clinic management solutions designed to integrate patient registration, doctor scheduling, EMR, billing, pharmacy, and laboratory management into a seamless digital workspace.',
          icon: 'activity',
          image: '/files/Forensic medicine-amico.png',
          features: [
            'Outpatient & Inpatient Management',
            'Doctor Appointment Scheduling & Queues',
            'Electronic Medical Records (EMR)',
            'Pharmacy Billing & Drug Stock Tracking',
            'Laboratory test ordering and reports',
            'Medical Coding & Healthcare Invoicing'
          ]
        },
        {
          slug: 'legal',
          name: 'LEGAL',
          description: 'Tailored practice management solution for law firms, enabling legal professionals to track case files, schedules, billable hours, client retainers, court appearances, and contract lifecycles with absolute security.',
          icon: 'scale',
          image: '/files/Law firm-amico.png',
          features: [
            'Case Matter Management',
            'Timesheet Recording & Hourly Billing',
            'Client Retainers & Advance Trust Accounts',
            'Hearing Schedules & Court Date Reminders',
            'Legal Document Indexing & OCR Search',
            'Contract Management with Expiry Alerts'
          ]
        },
        {
          slug: 'logistics',
          name: 'LOGISTICS',
          description: 'Robust supply chain and dispatch management powered by ERPNext. Track your fleet maintenance, automate shipping logs, manage multi-location warehouses, optimize route workflows, and verify delivery status in real-time.',
          icon: 'truck',
          image: '/files/Logistics-amico.png',
          features: [
            'Multi-Warehouse Inventory Operations',
            'Vehicle Log & Fleet Maintenance',
            'Real-Time Packing & Shipping Logs',
            'Driver Commission & Trip Expenses Tracking',
            'Delivery Note Verification & Signatures',
            'Barcode & QR Code Integration'
          ]
        },
        {
          slug: 'project-contracting',
          name: 'PROJECT CONTRACTING',
          description: 'A comprehensive ERP workflow designed specifically for manufacturing, infrastructure builders, and project contractors. Monitor project tasks, resource utilization, progress bills, material issues, and keep budgets under strict control.',
          icon: 'briefcase',
          image: '/files/Businessman-amico.png',
          features: [
            'Gantt Charts & Project Task Milestones',
            'Timesheets & Billable Labor Allocations',
            'Progress Billing & Retention Receivables',
            'Material Requisitions & Bill of Quantities',
            'Subcontractor Work Orders & Payments',
            'Earned Value Analysis & Cost Controls'
          ]
        }
      ];
      
      seededSectors = await Sector.insertMany(initialSectors);
      console.log('Initial sectors seeded successfully.');
    } else {
      // Make sure existing seeded sectors are updated with their correct image paths
      console.log('Updating existing seeded sectors with images...');
      await Sector.updateOne({ slug: 'healthcare' }, { $set: { image: '/files/Forensic medicine-amico.png' } });
      await Sector.updateOne({ slug: 'legal' }, { $set: { image: '/files/Law firm-amico.png' } });
      await Sector.updateOne({ slug: 'logistics' }, { $set: { image: '/files/Logistics-amico.png' } });
      await Sector.updateOne({ slug: 'project-contracting' }, { $set: { image: '/files/Businessman-amico.png' } });
      seededSectors = await Sector.find();
    }

    // 3. Seed Testimonials (map to appropriate sector if seeded)
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0 && seededSectors.length > 0) {
      console.log('Seeding testimonials...');
      
      const healthcareSector = seededSectors.find(s => s.slug === 'healthcare');
      const logisticsSector = seededSectors.find(s => s.slug === 'logistics');
      const contractingSector = seededSectors.find(s => s.slug === 'project-contracting');

      const testimonialsToSeed = [
        {
          clientName: 'Dr. Abdul Qadir',
          clientPosition: 'Medical Director',
          companyName: 'Adarsh Multispecialty Clinic',
          feedback: '4C Solutions transformed our clinical operations. By implementing ERPNext, they integrated patient registrations, doctor queues, and pharmacy billing into a unified dashboard. The solution drastically reduced patient wait times.',
          avatarPath: '',
          sector: healthcareSector ? healthcareSector._id : null
        },
        {
          clientName: 'Rahul Deshmukh',
          clientPosition: 'Operations Head',
          companyName: 'Vikas Shipping & Logistics',
          feedback: 'Our logistics processes were fragmented until we engaged 4C Solutions. Their custom ERPNext implementation allowed us to optimize warehouse dispatch logs and track fleet trip expenses in real-time, resulting in a 25% efficiency boost.',
          avatarPath: '',
          sector: logisticsSector ? logisticsSector._id : null
        },
        {
          clientName: 'Mohammad Yusuf',
          clientPosition: 'Managing Director',
          companyName: 'STC Infrastructure Ltd',
          feedback: 'Managing construction progress bills and subcontractor work orders used to be a project nightmare. The ERPNext solution provided by 4C Solutions gives us complete cost control and budget variance tracking on a single dashboard.',
          avatarPath: '',
          sector: contractingSector ? contractingSector._id : null
        }
      ];

      await Testimonial.insertMany(testimonialsToSeed);
      console.log('Testimonials seeded successfully.');
    }

    // 4. Seed Client Logos
    const logoCount = await ClientLogo.countDocuments();
    if (logoCount === 0 && seededSectors.length > 0) {
      console.log('Seeding initial client logos...');
      const healthcareSector = seededSectors.find(s => s.slug === 'healthcare');
      const legalSector = seededSectors.find(s => s.slug === 'legal');
      const logisticsSector = seededSectors.find(s => s.slug === 'logistics');
      const contractingSector = seededSectors.find(s => s.slug === 'project-contracting');

      const logos = [
        { clientName: 'SLA Group', logoPath: '/assets/logos/client_sla.png', websiteUrl: 'https://sla.in', sector: legalSector ? legalSector._id : null },
        { clientName: 'PVI Industries', logoPath: '/assets/logos/client_pvi.png', websiteUrl: 'https://pvi.com', sector: healthcareSector ? healthcareSector._id : null },
        { clientName: 'STC Infra', logoPath: '/assets/logos/client_stc.png', websiteUrl: 'https://stcinfra.com', sector: contractingSector ? contractingSector._id : null },
        { clientName: 'Methaq Co.', logoPath: '/assets/logos/client_methaq.png', websiteUrl: 'https://methaq.sa', sector: logisticsSector ? logisticsSector._id : null },
        { clientName: 'Spollex Tech', logoPath: '/assets/logos/client_spollex.png', websiteUrl: 'https://spollex.com', sector: logisticsSector ? logisticsSector._id : null },
        { clientName: 'Adarsh Clinics', logoPath: '/assets/logos/client_adarsh.png', websiteUrl: 'https://adarshclinics.in', sector: healthcareSector ? healthcareSector._id : null },
        { clientName: 'Kalaburagi Logistics', logoPath: '/assets/logos/client_klogistics.png', websiteUrl: '#', sector: logisticsSector ? logisticsSector._id : null },
        { clientName: 'Karnatak Contracting', logoPath: '/assets/logos/client_kcontracting.png', websiteUrl: '#', sector: contractingSector ? contractingSector._id : null }
      ];
      await ClientLogo.insertMany(logos);
      console.log('Client logos seeded successfully.');
    } else if (seededSectors.length > 0) {
      // In-place updates to map existing seeded logos to sectors!
      console.log('Updating existing seeded client logos with sector associations...');
      const healthcareSector = seededSectors.find(s => s.slug === 'healthcare');
      const legalSector = seededSectors.find(s => s.slug === 'legal');
      const logisticsSector = seededSectors.find(s => s.slug === 'logistics');
      const contractingSector = seededSectors.find(s => s.slug === 'project-contracting');

      if (legalSector) await ClientLogo.updateOne({ clientName: 'SLA Group' }, { $set: { sector: legalSector._id } });
      if (healthcareSector) {
        await ClientLogo.updateOne({ clientName: 'PVI Industries' }, { $set: { sector: healthcareSector._id } });
        await ClientLogo.updateOne({ clientName: 'Adarsh Clinics' }, { $set: { sector: healthcareSector._id } });
      }
      if (contractingSector) {
        await ClientLogo.updateOne({ clientName: 'STC Infra' }, { $set: { sector: contractingSector._id } });
        await ClientLogo.updateOne({ clientName: 'Karnatak Contracting' }, { $set: { sector: contractingSector._id } });
      }
      if (logisticsSector) {
        await ClientLogo.updateOne({ clientName: 'Methaq Co.' }, { $set: { sector: logisticsSector._id } });
        await ClientLogo.updateOne({ clientName: 'Spollex Tech' }, { $set: { sector: logisticsSector._id } });
        await ClientLogo.updateOne({ clientName: 'Kalaburagi Logistics' }, { $set: { sector: logisticsSector._id } });
      }
    }

    // 5. Seed Blogs / Case Studies
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0 && seededSectors.length > 0) {
      console.log('Seeding initial blogs/case studies...');
      const healthcareSector = seededSectors.find(s => s.slug === 'healthcare');
      const logisticsSector = seededSectors.find(s => s.slug === 'logistics');

      const initialBlogs = [
        {
          slug: 'digital-transformation-multispecialty-healthcare',
          title: 'Case Study: Driving Efficiency in Healthcare through ERPNext',
          summary: 'How 4C Solutions digitized a multi-department clinic, streamlining appointment slots, inpatient charts, and real-time inventory.',
          author: 'S. M. Hashmi',
          coverImage: '',
          sector: healthcareSector ? healthcareSector._id : null,
          metaKeywords: ['healthcare erp', 'clinic management', 'hospital database software', 'erpnext healthcare'],
          content: `# Case Study: Driving Efficiency in Healthcare through ERPNext

## Executive Summary
A local multispecialty clinic with 25+ practitioners faced massive bottlenecks due to fragmented systems. Patient wait times averaged 45 minutes, billing errors were frequent, and medical drug stocks were managed manually on paper logs.

**4C Solutions** stepped in to implement a comprehensive **ERPNext Healthcare solution** that digitized clinical flows from registration to recovery.

---

## Key Challenges
1. **Disparate Records**: Patient medical files were stored on paper or inside standalone desktop software that didn't talk to the pharmacy.
2. **Scheduling Chaos**: Double-bookings of doctors were common, leading to patient frustration.
3. **Inventory Leakages**: High-value pharmaceutical stocks were unaccounted for, leading to stockouts or expiry losses.

---

## The ERPNext Solution
We designed and implemented a secure, cloud-hosted ERPNext Healthcare environment:
- **Unified Patient Registration**: Created a single source of truth for patient history using unique Medical Record Numbers (MRN).
- **EMR Integration**: Doctors now write digital prescriptions directly in the clinical workspace, which instantly routes to the pharmacy.
- **FIFO Pharmacy Inventory**: Automated drug stock tracking with batch numbers and expiration alarms.

---

## Results & Impact
- **50% Reduction** in average patient outpatient registration and check-out wait time.
- **100% Elimination** of manual paper logs for pharmacy inventories.
- **Real-Time Revenue Auditing**: Complete financial visibility across dental, diagnostics, and general surgery consultations.
`
        },
        {
          slug: 'streamlining-dispatch-logistics-realtime-tracking',
          title: 'Case Study: Streamlining Fleet Dispatch and Logistics with ERPNext',
          summary: 'A deep-dive into how 4C Solutions optimized warehouse dispatching, trip expenses, and driver records for a regional shipper.',
          author: 'S. M. Hashmi',
          coverImage: '',
          sector: logisticsSector ? logisticsSector._id : null,
          metaKeywords: ['logistics workflow', 'fleet dispatch erp', 'supply chain database', 'erpnext logistics'],
          content: `# Case Study: Streamlining Fleet Dispatch & Logistics

## Executive Summary
A regional logistics provider with a fleet of 50 trucks was struggling with logistics workflow transparency. Trip expense reports were turned in weeks late, fuel leakages were high, and delivery notes were frequently lost, resulting in delayed invoicing.

**4C Solutions** designed a customized **ERPNext Logistics module** to achieve absolute transparency.

---

## The Strategy
1. **Warehouse Operations**: Integrated barcode scanners into multi-location warehouses to quick-pack orders.
2. **Trip Logs**: Created vehicle ledger logs in ERPNext to track fuel purchases, maintenance expenses, and toll fees.
3. **Driver Ledger**: Automatically computed driver commissions based on distance and material weight records.

---

## Impact & Results
- **Fast Billing**: Invoicing cycles dropped from 15 days to **under 24 hours** because delivery notes are captured via photo upload directly on trip completion.
- **15% Fuel Cost Savings**: Strict tracking of vehicle log averages and automated variance alerts eliminated fuel theft.
- **Flawless Fleet Auditing**: Complete dashboard showing maintenance costs per vehicle, helping identify depreciating assets early.
`
        }
      ];

      await Blog.insertMany(initialBlogs);
      console.log('Initial blogs/case studies seeded successfully.');
    }

  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};

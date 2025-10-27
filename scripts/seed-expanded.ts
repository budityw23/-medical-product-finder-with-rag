/**
 * Expanded Seed Script - Add New Categories and Products
 *
 * Adds:
 * - 2 new products per existing category (10 products)
 * - 2 new categories: Radiology, Dental (4 products)
 *
 * Total new products: 14
 * Total after seeding: 34 products
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductData {
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  description: string;
  document: {
    title: string;
    sourceUri: string;
    chunks: string[];
  };
}

const newProductsData: ProductData[] = [
  // Additional Cardiology
  {
    name: 'CardioFlow Balloon Catheter System',
    category: 'Cardiology',
    manufacturer: 'CardioMed Systems',
    price: 1299.99,
    description: 'Advanced balloon angioplasty catheter for coronary interventions with rapid exchange technology.',
    document: {
      title: 'CardioFlow Balloon Catheter Guide',
      sourceUri: 'https://example.com/docs/cardioflow-balloon.pdf',
      chunks: [
        'The CardioFlow Balloon Catheter is a rapid exchange PTCA balloon catheter designed for coronary artery dilation. Features include semi-compliant balloon material that provides controlled expansion from 2.0mm to 4.0mm diameters. The catheter has a low crossing profile of 0.017 inches and a rated burst pressure of 16 ATM.',
        'Available in lengths from 8mm to 30mm to accommodate various lesion morphologies. The hydrophilic coating ensures smooth navigation through tortuous vessels. Guidewire compatibility: 0.014 inch. Catheter shaft length: 138cm. Marker bands: two radiopaque platinum-iridium markers.',
        'Working length: 122cm. Deflation time: less than 30 seconds. The balloon material is proprietary polyamide blend optimized for pushability and trackability. Recommended for treatment of de novo and restenotic lesions in native coronary arteries. Price: $1,299.99',
      ],
    },
  },
  {
    name: 'CardioSync Holter Monitor 48-Hour',
    category: 'Cardiology',
    manufacturer: 'CardioTech Solutions',
    price: 1850.00,
    description: 'Compact 48-hour Holter monitor for continuous ambulatory ECG recording with cloud connectivity.',
    document: {
      title: 'CardioSync Holter User Manual',
      sourceUri: 'https://example.com/docs/cardiosync-holter.pdf',
      chunks: [
        'The CardioSync 48-Hour Holter Monitor is a lightweight (65 grams) 3-channel ECG recorder for ambulatory cardiac monitoring. Features include automatic arrhythmia detection algorithms, ST segment analysis, and heart rate variability assessment. The device records up to 48 hours of continuous ECG data with a sampling rate of 1000 Hz per channel.',
        'Battery life extends to 72 hours for extended monitoring if needed. Cloud-based analysis software provides automated beat classification, arrhythmia detection, and comprehensive reporting. The AI-powered analysis identifies atrial fibrillation, ventricular ectopy, bradycardia, and tachycardia events.',
        'Generates detailed summary reports including total beats, ectopy burden, heart rate trends, and patient-activated event correlation. HIPAA-compliant cloud storage with 256-bit encryption. Price: $1,850.00',
      ],
    },
  },

  // Additional Orthopedic
  {
    name: 'FlexiCast Fiberglass Casting System',
    category: 'Orthopedic',
    manufacturer: 'OrthoSupply Corp',
    price: 89.99,
    description: 'Lightweight fiberglass casting tape system for fracture immobilization with water-resistant properties.',
    document: {
      title: 'FlexiCast Application Guide',
      sourceUri: 'https://example.com/docs/flexicast-guide.pdf',
      chunks: [
        'FlexiCast is a knitted fiberglass casting tape impregnated with water-activated polyurethane resin. The tape is available in 2-inch, 3-inch, and 4-inch widths in multiple colors including white, black, blue, pink, and purple. Application requires dipping in room temperature water for 3-5 seconds.',
        'The cast sets within 3-5 minutes and reaches full strength in 20 minutes. Weight-bearing is permitted after 30 minutes for lower extremity casts. The fiberglass cast is water-resistant but should not be submerged for extended periods. Patients can shower with a waterproof cast protector.',
        'The material is radiolucent, allowing clear X-ray visualization of the underlying fracture. Typical wear duration is 4-8 weeks depending on fracture type and location. Removal requires a cast saw with oscillating blade. Price: $89.99',
      ],
    },
  },
  {
    name: 'OsteoStim Bone Growth Stimulator',
    category: 'Orthopedic',
    manufacturer: 'BioHeal Technologies',
    price: 3499.00,
    description: 'Non-invasive bone growth stimulator using pulsed electromagnetic field therapy for fracture healing.',
    document: {
      title: 'OsteoStim Clinical Guide',
      sourceUri: 'https://example.com/docs/osteostim-clinical.pdf',
      chunks: [
        'The OsteoStim Bone Growth Stimulator uses pulsed electromagnetic field (PEMF) technology to enhance fracture healing and treat non-unions. The device generates a time-varying electromagnetic field at 15 Hz frequency with a peak magnetic field of 20 Gauss. Clinical studies demonstrate a 30-40% reduction in healing time for long bone fractures.',
        'FDA-cleared for treatment of fresh fractures, non-unions, and failed fusions. Treatment protocol requires 30 minutes of daily therapy for 6-9 months for non-unions, or 3-6 months for fresh fractures. The lightweight coil is positioned over the fracture site and secured with an adjustable strap.',
        'The device is battery-powered and portable for convenient home use. Contraindications include pregnancy, pacemakers, and defibrillators. The system includes automatic shut-off and compliance monitoring via smartphone app. Price: $3,499.00',
      ],
    },
  },

  // Additional Neurology
  {
    name: 'NeuroMap TMS Therapy System',
    category: 'Neurology',
    manufacturer: 'NeuroTherapeutics Inc',
    price: 75000.00,
    description: 'Transcranial magnetic stimulation system for treatment of depression and neurological disorders.',
    document: {
      title: 'NeuroMap TMS Clinical Manual',
      sourceUri: 'https://example.com/docs/neuromap-tms.pdf',
      chunks: [
        'The NeuroMap TMS System delivers repetitive transcranial magnetic stimulation (rTMS) for treatment-resistant depression. The figure-8 coil generates focused magnetic pulses with field strength up to 1.5 Tesla at the coil surface. Treatment protocols include high-frequency (10 Hz) stimulation of the left dorsolateral prefrontal cortex.',
        'The system includes neuronavigation with MRI co-registration for precise targeting. FDA-cleared for major depressive disorder and OCD. Standard treatment course consists of 5 sessions per week for 4-6 weeks, with each session lasting 20-40 minutes. Motor threshold determination is performed at the start of therapy using single-pulse TMS.',
        'The system includes real-time head tracking and automatic pause if patient movement exceeds 3mm. Contraindications include metallic implants in the head/neck, history of seizures, and cochlear implants. Side effects are typically limited to mild scalp discomfort and transient headache. Price: $75,000.00',
      ],
    },
  },
  {
    name: 'SleepGuard Home Sleep Apnea Monitor',
    category: 'Neurology',
    manufacturer: 'SleepMed Devices',
    price: 2100.00,
    description: 'Portable home sleep testing device for diagnosis of obstructive sleep apnea with integrated oximetry.',
    document: {
      title: 'SleepGuard Diagnostic Guide',
      sourceUri: 'https://example.com/docs/sleepguard-diagnostic.pdf',
      chunks: [
        'The SleepGuard is a Type 3 home sleep apnea testing device that records respiratory effort, airflow, oxygen saturation, heart rate, body position, and snoring. The nasal pressure cannula measures airflow and snoring vibrations. Dual respiratory effort belts (thoracic and abdominal) detect breathing patterns.',
        'Pulse oximetry with 1-second averaging provides accurate oxygen saturation trending. The device automatically calculates apnea-hypopnea index (AHI) and oxygen desaturation index (ODI). Setup takes less than 5 minutes with color-coded sensors and simplified interface. The device records up to 3 nights on a single charge.',
        'Data downloads via USB or wireless Bluetooth connection to the analysis software. The report includes AHI, ODI, sleep time, position data, and event graphs. Medicare compliant for HST reimbursement. Sensor kit is single-patient use for infection control. Price: $2,100.00',
      ],
    },
  },

  // Additional Imaging
  {
    name: 'OptiScan OCT Retinal Imaging System',
    category: 'Imaging',
    manufacturer: 'OptiVision Systems',
    price: 68000.00,
    description: 'Optical coherence tomography system for high-resolution retinal imaging and glaucoma screening.',
    document: {
      title: 'OptiScan OCT Technical Manual',
      sourceUri: 'https://example.com/docs/optiscan-oct.pdf',
      chunks: [
        'The OptiScan OCT uses spectral-domain technology to capture high-resolution cross-sectional images of the retina with 5-micron axial resolution. Scan speed of 70,000 A-scans per second enables motion-artifact-free imaging. The system includes automated segmentation of retinal layers, nerve fiber layer thickness analysis, and optic nerve head evaluation.',
        'Wide-field scanning mode captures 12mm x 9mm area in a single acquisition. Built-in eye tracking compensates for patient movement during scanning. Clinical applications include macular edema assessment, macular hole evaluation, epiretinal membrane detection, and glaucoma progression monitoring.',
        'The RNFL thickness map compares patient data to normative database with age-matched controls. The system exports DICOM images and integrates with EMR systems. Automated quality assessment ensures reliable measurements. Average scan time is 2-3 minutes per eye. Price: $68,000.00',
      ],
    },
  },
  {
    name: 'DentalScan CBCT Imaging System',
    category: 'Imaging',
    manufacturer: 'DentalImaging Corp',
    price: 89500.00,
    description: 'Cone beam computed tomography system for dental and maxillofacial imaging with low radiation dose.',
    document: {
      title: 'DentalScan CBCT Specifications',
      sourceUri: 'https://example.com/docs/dentalscan-cbct.pdf',
      chunks: [
        'The DentalScan CBCT provides 3D imaging of dental and maxillofacial structures with isotropic voxel size down to 0.075mm. The system offers multiple field of view options: 5x5cm (single tooth), 8x8cm (quadrant), 11x8cm (full arch), and 16x13cm (full head). Scan time ranges from 8 to 24 seconds depending on FOV and resolution.',
        'Total radiation dose is 50-80% lower than conventional CT. The flat-panel detector has 1024x1024 resolution with 14-bit grayscale. Advanced visualization software includes MPR reconstruction, panoramic curve creation, and TMJ bilateral comparison. Automated nerve canal tracing assists in implant planning.',
        'Cephalometric analysis module includes 50+ standard measurements for orthodontic planning. Metal artifact reduction algorithms improve image quality around restorations. Patient positioning is intuitive with laser alignment guides and automatic exposure control. Price: $89,500.00',
      ],
    },
  },

  // Additional Surgical
  {
    name: 'SurgiSeal Electrosurgical Sealer',
    category: 'Surgical',
    manufacturer: 'SurgiTech Systems',
    price: 4200.00,
    description: 'Advanced vessel sealing device for minimally invasive surgery with intelligent tissue sensing.',
    document: {
      title: 'SurgiSeal Technical Guide',
      sourceUri: 'https://example.com/docs/surgiseal-technical.pdf',
      chunks: [
        'The SurgiSeal Electrosurgical Sealer uses radiofrequency energy combined with mechanical pressure to create permanent vessel seals up to 7mm in diameter. The smart tissue sensing technology automatically adjusts energy delivery based on tissue impedance and hydration. Seal cycle time averages 2-4 seconds depending on vessel size.',
        'The system delivers consistent energy through a proprietary feedback algorithm that monitors tissue temperature and resistance in real-time. Thermal spread is limited to less than 2mm. Indicated for laparoscopic and open surgical procedures requiring vessel sealing and tissue division. The device handles arteries and veins up to 7mm, tissue bundles up to 10mm.',
        'Clinical studies demonstrate burst pressure greater than 2.5 times systolic pressure. Compatible instruments include curved and straight jaw configurations, extended length for bariatric surgery, and mini jaws for pediatric procedures. Single-patient use for infection control. Price: $4,200.00',
      ],
    },
  },
  {
    name: 'LaparoVision 4K Imaging Tower',
    category: 'Surgical',
    manufacturer: 'EndoVision Technologies',
    price: 125000.00,
    description: 'Complete 4K ultra-high definition laparoscopic imaging system with advanced light source and recording.',
    document: {
      title: 'LaparoVision System Overview',
      sourceUri: 'https://example.com/docs/laparovision-system.pdf',
      chunks: [
        'The LaparoVision 4K Imaging Tower integrates a 4K ultra-HD camera head, xenon LED hybrid light source, image processor, and 32-inch 4K surgical monitor. The camera system captures true 4K resolution (3840 x 2160 pixels) at 60 frames per second with 12-bit color depth. The light source delivers 300 watts of bright white light with CRI >95 for accurate tissue color reproduction.',
        'Advanced image processing includes dynamic range optimization, edge enhancement, and automatic color balance. Features include Picture-in-Picture for dual camera viewing, digital zoom up to 4x without resolution loss, and snapshot capture in raw format. The system records in H.265 codec for efficient storage with DICOM encapsulation.',
        'Built-in video streaming enables remote consultation and education. The touchscreen interface provides intuitive control of all system parameters. Compatible with 0-degree, 30-degree, and flexible laparoscopes. Integration with OR networks for EMR documentation and PACS connectivity. Autoclavable camera head rated for 500 cycles. Price: $125,000.00',
      ],
    },
  },

  // NEW CATEGORY: Radiology
  {
    name: 'RadMax Digital X-Ray System',
    category: 'Radiology',
    manufacturer: 'RadTech Imaging',
    price: 185000.00,
    description: 'Ceiling-mounted digital radiography system with flat-panel detector and automatic exposure control.',
    document: {
      title: 'RadMax System Specifications',
      sourceUri: 'https://example.com/docs/radmax-specifications.pdf',
      chunks: [
        'The RadMax Digital X-Ray System features a 17x17 inch cesium iodide flat-panel detector with 140-micron pixel pitch and 16-bit grayscale resolution. The ceiling-mounted tube stand provides 185cm longitudinal travel and 45cm lateral travel with electromagnetic brakes. Generator output is 80 kW with high-frequency inverter technology.',
        'The tube has a dual focal spot (0.6mm/1.2mm) and 300,000 heat unit anode. Exposure ranges from 40kV to 150kV with 0.1kV increments. Suitable for all general radiography applications including chest, spine, abdomen, and extremity imaging. Automatic exposure control with 3-field ionization chamber ensures optimal image quality with minimal dose.',
        'The system includes automatic collimation, grid alignment, and source-to-image distance positioning. Stitching software enables long-length imaging for scoliosis and leg-length studies. Images export via DICOM to PACS with automatic anatomical labeling. Price: $185,000.00',
      ],
    },
  },
  {
    name: 'PortaX Mobile X-Ray Unit',
    category: 'Radiology',
    manufacturer: 'MobileMed Systems',
    price: 42000.00,
    description: 'Battery-powered mobile X-ray unit for bedside imaging in ICU and emergency departments.',
    document: {
      title: 'PortaX Mobile Unit Guide',
      sourceUri: 'https://example.com/docs/portax-mobile.pdf',
      chunks: [
        'The PortaX is a compact battery-powered mobile X-ray system designed for bedside imaging. The 32 kW high-frequency generator operates on rechargeable lithium-ion batteries providing 100+ exposures per charge. The collapsible column design allows passage through standard doorways and easy storage. Wireless detector connectivity supports any size flat-panel detector.',
        'The touchscreen interface provides technique selection with anatomical programming for common bedside exams including chest AP, abdomen, and pelvis. Smooth surfaces and sealed electronics enable thorough disinfection between patients. The unit is IP54 rated for moisture and dust resistance. The four-wheel motorized drive system with electronic brakes provides easy positioning in crowded ICU environments.',
        'Collision avoidance sensors prevent damage to equipment and patient beds. Dose area product (DAP) meter tracks cumulative patient exposure. Images transmit via Wi-Fi to PACS with automatic identification from HL7 feed. Price: $42,000.00',
      ],
    },
  },

  // NEW CATEGORY: Dental
  {
    name: 'DentalPro Digital Intraoral Scanner',
    category: 'Dental',
    manufacturer: 'DentalTech Solutions',
    price: 18500.00,
    description: 'High-speed digital impression scanner for crown, bridge, and orthodontic applications with AI-powered margin detection.',
    document: {
      title: 'DentalPro Scanner Guide',
      sourceUri: 'https://example.com/docs/dentalpro-scanner.pdf',
      chunks: [
        'The DentalPro Digital Intraoral Scanner captures full-arch impressions in under 60 seconds with 10-micron accuracy. The lightweight wireless wand (250 grams) eliminates cable drag for comfortable scanning. True-color scanning with photorealistic rendering aids in shade matching and patient communication. The AI-powered software automatically detects margins, undercuts, and scan completion.',
        'Anti-fog technology and heated tip prevent mirror fogging during scanning. Battery life supports 8 hours of continuous scanning. Open STL file format enables compatibility with all major CAD/CAM systems and dental labs. Direct integration with design software for same-day crown fabrication. The cloud platform stores patient scans with HIPAA-compliant encryption.',
        'Supports full-arch implant planning with scan body recognition. Automatic tissue trimming and model base generation streamline laboratory workflow. Easy-to-replace autoclavable scanner tips ensure infection control. Price: $18,500.00',
      ],
    },
  },
  {
    name: 'EndoMaster Rotary Endodontic System',
    category: 'Dental',
    manufacturer: 'EndoDental Corp',
    price: 3400.00,
    description: 'Complete rotary endodontic system with adaptive motion technology and apex locator integration.',
    document: {
      title: 'EndoMaster System Overview',
      sourceUri: 'https://example.com/docs/endomaster-system.pdf',
      chunks: [
        'The EndoMaster Rotary Endodontic System features adaptive motion technology that automatically switches between rotation and reciprocation based on file stress. The cordless handpiece provides 300-rpm continuous rotation and 6 programmable reciprocation patterns. Integrated apex locator displays working length in real-time with audio feedback at apex.',
        'The system automatically reverses and advances when resistance is detected, reducing file separation risk. Torque control ranges from 0.5 to 5.0 Ncm in 0.1 Ncm increments. Compatible with all major file systems including ProTaper, WaveOne, and Reciproc. The auto-stop feature prevents file separation by monitoring torque and apical binding.',
        'File counter tracks number of uses for each file. Color-coded rings identify file size and taper. Single-patient use files reduce cross-contamination risk. The wireless foot pedal enables hands-free operation. Price: $3,400.00',
      ],
    },
  },
];

function chunkText(chunks: string[]): string[] {
  return chunks;
}

async function main() {
  console.log('🌱 Starting Expanded Seed Process\n');
  console.log('================================================\n');

  console.log(`📦 Adding ${newProductsData.length} new products...\n`);

  let successCount = 0;
  let errorCount = 0;
  let totalChunks = 0;

  for (const productData of newProductsData) {
    try {
      console.log(`   Creating: ${productData.name}`);
      console.log(`   Category: ${productData.category}`);
      console.log(`   Price: $${productData.price.toFixed(2)}`);

      const chunks = chunkText(productData.document.chunks);

      await prisma.product.create({
        data: {
          name: productData.name,
          category: productData.category,
          manufacturer: productData.manufacturer,
          price: productData.price,
          description: productData.description,
          documents: {
            create: {
              title: productData.document.title,
              sourceUri: productData.document.sourceUri,
              chunks: {
                create: chunks.map((chunkText, index) => ({
                  chunkIndex: index,
                  text: chunkText,
                  metadata: {
                    length: chunkText.length,
                    category: productData.category,
                    productName: productData.name,
                  },
                })),
              },
            },
          },
        },
      });

      console.log(`   ✓ Created with ${chunks.length} chunks\n`);
      successCount++;
      totalChunks += chunks.length;
    } catch (error: any) {
      console.error(`   ✗ Failed to create product:`, error.message);
      errorCount++;
    }
  }

  console.log('================================================');
  console.log(`   Total processed: ${newProductsData.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${errorCount}`);
  console.log(`   Total chunks: ${totalChunks}`);
  console.log('================================================\n');

  // Show final statistics
  const stats = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  console.log('📊 Updated Product Distribution:\n');
  stats.forEach((stat) => {
    console.log(`   ${stat.category}: ${stat._count} products`);
  });

  const totalProducts = await prisma.product.count();
  console.log(`\n   Total: ${totalProducts} products`);

  console.log('\n✅ Expanded seed complete!');
  console.log('\n💡 Next step: Run embedding generation:');
  console.log('   npm run ingest:force\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Seed Script - Phase 3
 *
 * This script inserts 20 sample medical products with detailed descriptions,
 * documents, and document chunks into the database.
 *
 * Usage:
 *   npm run seed          - Seed the database
 *   npm run seed:clear    - Clear existing data and reseed
 *
 * Features:
 * - Creates 20 medical products across 5 categories
 * - Each product has 1 document with detailed specifications
 * - Each document is chunked into 3-5 meaningful chunks
 * - Chunks do NOT have embeddings (Phase 9 will generate those)
 * - Idempotent: can run multiple times safely
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Parse command line arguments
const args = process.argv.slice(2);
const shouldClear = args.includes('--clear');

/**
 * Product data structure
 */
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

/**
 * Comprehensive medical product data across 5 categories
 */
const productsData: ProductData[] = [
  // ========== CARDIOLOGY (4 products) ==========
  {
    name: 'CardioGuard Pro Drug-Eluting Stent',
    category: 'Cardiology',
    manufacturer: 'MedTech Solutions',
    price: 2499.99,
    description: 'Advanced drug-eluting coronary stent for treating coronary artery disease with biocompatible polymer coating.',
    document: {
      title: 'CardioGuard Pro Technical Specifications',
      sourceUri: 'https://example.com/docs/cardioguard-pro-specs.pdf',
      chunks: [
        'CardioGuard Pro is a next-generation drug-eluting stent designed for the treatment of coronary artery disease. The device features a cobalt-chromium alloy platform with excellent radial strength and deliverability. The stent is available in diameters ranging from 2.25mm to 4.0mm and lengths from 8mm to 38mm, providing comprehensive sizing options for various lesion types.',
        'The stent features a unique biodegradable polymer coating that elutes sirolimus, a potent anti-proliferative agent. The polymer coating is designed to degrade completely within 6-9 months after implantation, leaving only the bare metal stent. Clinical studies have shown a restenosis rate of less than 5% at 12 months, significantly lower than bare metal stents.',
        'The delivery system utilizes a low-profile rapid-exchange catheter with excellent trackability and crossability. The stent is pre-mounted on a semi-compliant balloon with a nominal pressure of 9 ATM and a rated burst pressure of 16 ATM. The proximal shaft is reinforced for enhanced pushability in complex lesions.',
        'Indications for use include de novo lesions in native coronary arteries with reference vessel diameters between 2.25mm and 4.0mm. The device is contraindicated in patients with known hypersensitivity to sirolimus, cobalt, chromium, or polymer components. Dual antiplatelet therapy with aspirin and a P2Y12 inhibitor is recommended for a minimum of 12 months post-implantation.',
      ],
    },
  },
  {
    name: 'HeartSync Dual-Chamber Pacemaker',
    category: 'Cardiology',
    manufacturer: 'Cardiac Innovations Inc',
    price: 8750.00,
    description: 'Dual-chamber pacemaker with MRI compatibility and remote monitoring capabilities for bradycardia treatment.',
    document: {
      title: 'HeartSync Pacemaker System Manual',
      sourceUri: 'https://example.com/docs/heartsync-manual.pdf',
      chunks: [
        'The HeartSync Dual-Chamber Pacemaker is an implantable cardiac rhythm management device designed to treat symptomatic bradycardia. The device weighs 18 grams and has a volume of 9.8 cc, with a titanium hermetic case and a lithium-silver vanadium oxide battery providing an expected longevity of 8-10 years depending on programming and patient usage.',
        'The pacing system supports DDD, VVI, AAI, and DDI modes with automatic mode switching. The device features rate-responsive pacing using a 3-axis accelerometer sensor that adjusts pacing rate based on patient activity levels. Programmable parameters include lower rate limit (30-100 bpm), upper rate limit (90-180 bpm), AV delay (50-300 ms), and output voltage (0.4-7.5V).',
        'HeartSync is MRI-conditional and can be safely scanned under specific conditions in both 1.5T and 3.0T systems. The device includes advanced algorithms for atrial fibrillation detection and prevention, ventricular intrinsic preference, and sleep rate functionality. Remote monitoring via the CardioConnect system allows physicians to review device diagnostics and patient data without requiring in-office visits.',
        'The system includes bipolar steroid-eluting leads with active fixation mechanisms. The atrial lead is 52cm or 58cm in length, while the ventricular lead is available in 46cm, 52cm, or 58cm lengths. Both leads feature iridium oxide-coated electrodes and silicone insulation for enhanced biocompatibility and reduced inflammatory response.',
      ],
    },
  },
  {
    name: 'VitalMonitor Pro 12-Lead ECG System',
    category: 'Cardiology',
    manufacturer: 'Diagnostic Systems Corp',
    price: 4200.00,
    description: 'Portable 12-lead ECG system with advanced interpretation algorithms and cloud connectivity.',
    document: {
      title: 'VitalMonitor Pro User Guide',
      sourceUri: 'https://example.com/docs/vitalmonitor-guide.pdf',
      chunks: [
        'The VitalMonitor Pro is a portable 12-lead electrocardiograph designed for comprehensive cardiac rhythm analysis in clinical and emergency settings. The system features a 10.1-inch high-resolution touchscreen display with real-time waveform visualization across all 12 leads simultaneously. The device weighs 3.2 kg with battery and measures 280mm x 210mm x 75mm, making it highly portable for point-of-care use.',
        'The ECG acquisition system samples at 40,000 samples per second with 24-bit resolution, providing exceptional signal quality and diagnostic accuracy. Built-in interpretation software includes the Glasgow algorithm for automated ECG analysis, detecting over 200 different cardiac conditions including arrhythmias, conduction abnormalities, and myocardial infarction patterns. The system displays interpretation confidence levels and highlights critical findings for physician review.',
        'Data connectivity features include WiFi, Bluetooth, and USB interfaces for seamless integration with electronic medical records systems. The device supports HL7 and DICOM standards for interoperability. Cloud backup functionality automatically uploads ECG recordings to secure servers with end-to-end encryption. The lithium-ion battery provides 6 hours of continuous operation and can be charged via USB-C or AC adapter.',
        'The system includes disposable Ag/AgCl electrodes and reusable lead wires with snap connectors. Limb leads use color-coded alligator clips while precordial leads feature suction bulb electrodes. The device meets IEC 60601-1 and IEC 60601-2-25 safety standards and is cleared for use in the United States, European Union, and other major markets. Calibration verification should be performed annually.',
      ],
    },
  },
  {
    name: 'CardioFlow Ventricular Assist Device',
    category: 'Cardiology',
    manufacturer: 'Advanced Heart Solutions',
    price: 45000.00,
    description: 'Left ventricular assist device for patients with advanced heart failure awaiting transplantation.',
    document: {
      title: 'CardioFlow VAD Clinical Reference',
      sourceUri: 'https://example.com/docs/cardioflow-vad-reference.pdf',
      chunks: [
        'The CardioFlow Left Ventricular Assist Device (LVAD) is a mechanical circulatory support system designed for patients with advanced heart failure (NYHA Class IV or ACC/AHA Stage D). The device utilizes a continuous-flow centrifugal pump with magnetic levitation technology, eliminating mechanical bearings and reducing wear and thrombosis risk. The pump weighs 160 grams and can generate flows up to 10 liters per minute.',
        'The system consists of three main components: the internal blood pump implanted in the pericardial space, a percutaneous driveline that exits the abdominal wall, and an external controller with battery packs. The pump connects to the left ventricular apex via an inflow cannula and to the ascending aorta via an outflow graft. The magnetically levitated impeller rotates at speeds between 2,400 and 3,200 RPM, providing pulsatility that mimics physiologic cardiac output.',
        'The external controller monitors pump speed, flow, power consumption, and pulsatility index in real-time. Integrated alarm systems alert patients and caregivers to potential issues such as low battery, high power consumption (indicating increased afterload or suction events), or controller malfunction. Two lithium-ion battery packs provide 8-12 hours of portable operation, with an AC/DC adapter for home use and overnight charging.',
        'Clinical outcomes data from multi-center trials demonstrate 85% survival at one year and 70% survival at two years for bridge-to-transplant patients. Quality of life improvements include increased 6-minute walk distance, reduced NYHA classification, and ability to perform activities of daily living. Anticoagulation with warfarin (INR 2.0-3.0) and antiplatelet therapy with aspirin is required. Patients require comprehensive training on device operation, battery management, and emergency procedures before hospital discharge.',
      ],
    },
  },

  // ========== ORTHOPEDIC (4 products) ==========
  {
    name: 'TitanJoint Total Knee Replacement System',
    category: 'Orthopedic',
    manufacturer: 'OrthoSolutions International',
    price: 6800.00,
    description: 'Modular total knee arthroplasty system with high-crosslinked polyethylene for enhanced wear resistance.',
    document: {
      title: 'TitanJoint TKA Technical Manual',
      sourceUri: 'https://example.com/docs/titanjoint-tka-manual.pdf',
      chunks: [
        'The TitanJoint Total Knee Replacement System is a comprehensive modular arthroplasty platform designed for the treatment of severe knee osteoarthritis, rheumatoid arthritis, and post-traumatic arthritis. The system includes femoral components made from cobalt-chromium-molybdenum alloy with a multi-radius design that mimics natural knee kinematics. Available sizes range from 1 to 9 in both right and left configurations.',
        'The tibial component features a titanium alloy baseplate with a porous coating for bone ingrowth fixation. The articulating surface is made from highly crosslinked ultra-high molecular weight polyethylene (UHMWPE) that has been irradiated and thermally treated to improve wear resistance by up to 95% compared to conventional polyethylene. The insert is available in thicknesses from 8mm to 18mm in 2mm increments.',
        'The patella component is an all-polyethylene dome design available in three sizes (small, medium, large) with three pegs for cement fixation. The posterior-stabilized (PS) version includes a tibial post and femoral cam mechanism for rollback and stability in PCL-deficient knees. Constrained and hinged options are available for severe bone loss or ligamentous instability requiring additional constraint.',
        'Surgical technique utilizes either measured resection or gap-balancing philosophy with intramedullary or extramedullary alignment guides. The system is compatible with computer-assisted navigation and patient-specific instrumentation. Long-term clinical data demonstrates 95% survivorship at 15 years with excellent functional outcomes and patient satisfaction scores. The device is indicated for cemented, cementless, or hybrid fixation depending on bone quality and surgeon preference.',
      ],
    },
  },
  {
    name: 'SpineCare Lumbar Interbody Fusion Cage',
    category: 'Orthopedic',
    manufacturer: 'Spine Dynamics LLC',
    price: 3200.00,
    description: 'PEEK interbody fusion cage for lumbar spinal fusion procedures with large graft window.',
    document: {
      title: 'SpineCare Fusion Cage Specifications',
      sourceUri: 'https://example.com/docs/spinecare-cage-specs.pdf',
      chunks: [
        'The SpineCare Lumbar Interbody Fusion Cage is manufactured from polyetheretherketone (PEEK), a radiolucent polymer that closely matches the elastic modulus of bone and allows excellent visualization of fusion progression on radiographs. The cage features a lordotic angle of 6 degrees to restore sagittal alignment and is available in footprints ranging from 22mm x 10mm to 26mm x 14mm to accommodate various disc space geometries.',
        'The device incorporates large superior and inferior graft windows covering approximately 65% of the cage surface area, allowing substantial bone graft packing for enhanced fusion rates. The outer surface features pyramid-shaped teeth for immediate fixation and resistance to subsidence and migration. Heights range from 8mm to 16mm in 1mm increments, providing precise restoration of disc space height and indirect neural decompression.',
        'The cage is designed for posterior lumbar interbody fusion (PLIF), transforaminal lumbar interbody fusion (TLIF), or lateral lumbar interbody fusion (LLIF) approaches. A central radiographic marker provides fluoroscopic visibility during placement. The inserter instrument features a threaded connection that locks to the cage and includes a slap-hammer for final seating. Supplemental posterior pedicle screw fixation is recommended in most cases.',
        'Clinical studies demonstrate fusion rates exceeding 90% at one year when used with autograft or allograft bone. The radiolucent properties of PEEK allow clear assessment of bridging bone on CT and plain radiographs. Indications include degenerative disc disease, spondylolisthesis, stenosis, and failed previous fusion. Contraindications include active infection, severe osteoporosis, and tumor involvement at the surgical level.',
      ],
    },
  },
  {
    name: 'FlexiSupport Ankle Brace Pro',
    category: 'Orthopedic',
    manufacturer: 'MedSupport Technologies',
    price: 189.99,
    description: 'Adjustable ankle stabilization brace with gel padding for post-injury rehabilitation and chronic instability.',
    document: {
      title: 'FlexiSupport Ankle Brace Instructions',
      sourceUri: 'https://example.com/docs/flexisupport-instructions.pdf',
      chunks: [
        'The FlexiSupport Ankle Brace Pro is a semi-rigid orthosis designed to provide medial-lateral stability while allowing dorsiflexion and plantarflexion for functional mobility. The brace features bilateral hinged supports made from lightweight aluminum alloy with adjustable range-of-motion stops. The fabric shell is constructed from breathable neoprene-free material to reduce heat buildup and accommodate sensitive skin.',
        'Anatomically contoured gel pads are positioned over the medial and lateral malleoli to provide cushioning and reduce pressure points. The figure-8 strap system provides circumferential compression and can be adjusted to customize support levels. The low-profile design fits in most athletic and casual footwear. Sizes are available in small (shoe size 5-7), medium (8-10), large (11-13), and extra-large (14-16) for both men and women.',
        'The brace is indicated for grade I and II ankle sprains, chronic ankle instability, post-operative protection following ligament reconstruction, peroneal tendonitis, and prophylactic use in high-risk activities. Clinical evidence supports the use of functional bracing in reducing re-injury rates by up to 50% compared to no bracing in athletes with previous ankle sprains. The design allows proprioceptive feedback while limiting inversion and eversion.',
        'Care instructions include hand washing with mild soap and air drying. The gel pads and metal stays can be removed for cleaning. Expected product life is 6-12 months with daily use. Fitting should be performed with the patient wearing the sock they plan to use during activity. The heel should be positioned completely back in the shoe before tightening straps. Medical supervision is recommended for initial fitting and adjustment.',
      ],
    },
  },
  {
    name: 'TraumaLock Intramedullary Nail System',
    category: 'Orthopedic',
    manufacturer: 'Trauma Fixation Systems',
    price: 2850.00,
    description: 'Titanium intramedullary nail for femoral fracture fixation with multiple locking options.',
    document: {
      title: 'TraumaLock IM Nail Surgical Guide',
      sourceUri: 'https://example.com/docs/traumalock-surgical-guide.pdf',
      chunks: [
        'The TraumaLock Intramedullary Nail System is designed for the fixation of diaphyseal, metaphyseal, and some intra-articular fractures of the femur. The nail is manufactured from titanium alloy (Ti-6Al-4V) providing an optimal balance of strength and elastic modulus compatibility with bone. The cannulated design allows insertion over a guide wire and features proximal and distal interlocking screw holes for rotational and axial stability.',
        'Available in diameters from 9mm to 13mm and lengths from 220mm to 460mm in 20mm increments, the system accommodates a wide range of patient anatomies. The nail has a lateral radius of curvature matching the anatomic bow of the femur. Proximal locking is achieved with two oblique screws in a cephalad-caudad orientation, while distal locking uses two or three transverse screws placed through the nail using a targeting guide.',
        'The proximal end features a trapezoidal cross-section that transitions to a circular cross-section distally, optimizing the strength-to-diameter ratio. Screw holes are arranged to minimize stress concentration. The Herzog curve design distributes load more evenly along the nail length. All screws are titanium alloy with self-tapping threads and fully threaded shafts to prevent backing out.',
        'Surgical technique involves reaming the intramedullary canal 1-1.5mm larger than the selected nail diameter to ensure optimal fit. Entry point is through the piriformis fossa or greater trochanteric tip depending on nail design. Fracture reduction is achieved using traction and manual manipulation before nail insertion. Proximal and distal locking is performed under fluoroscopic guidance. Weight-bearing status depends on fracture pattern and stability, ranging from toe-touch to full weight-bearing immediately post-operatively.',
      ],
    },
  },

  // ========== NEUROLOGY (4 products) ==========
  {
    name: 'NeuroScan 32-Channel EEG System',
    category: 'Neurology',
    manufacturer: 'BrainTech Diagnostics',
    price: 15600.00,
    description: 'High-resolution 32-channel EEG system with digital amplifiers for epilepsy monitoring and brain mapping.',
    document: {
      title: 'NeuroScan EEG System Manual',
      sourceUri: 'https://example.com/docs/neuroscan-manual.pdf',
      chunks: [
        'The NeuroScan 32-Channel EEG System is a comprehensive electroencephalography platform designed for clinical neurophysiology applications including epilepsy evaluation, sleep studies, intraoperative monitoring, and brain death determination. The system features 32 differential amplifier channels with 24-bit analog-to-digital conversion and sampling rates up to 2048 Hz per channel, providing exceptional temporal resolution for high-frequency oscillation detection.',
        'Each amplifier channel has an input impedance exceeding 100 megohms and a common-mode rejection ratio (CMRR) greater than 110 dB, ensuring excellent artifact rejection and signal quality even in electrically noisy environments. The frequency response is DC to 1000 Hz with selectable high-pass (0.1, 0.5, 1.0 Hz) and low-pass (35, 70, 150 Hz) filters. A 60 Hz notch filter is available for power line interference reduction.',
        'The acquisition software includes real-time impedance checking, automated artifact detection, and spike/seizure detection algorithms based on machine learning models trained on over 10,000 annotated EEG recordings. Montage configurations support referential, bipolar, and Laplacian derivations with user-customizable layouts. Video synchronization allows simultaneous recording of patient behavior for correlation with electrographic events.',
        'The system is compatible with standard 10-20 electrode placement and supports high-density arrays up to 256 channels with additional amplifier modules. Disposable Ag/AgCl cup electrodes with conductive paste or collodion attachment are used for routine recordings. For long-term monitoring, subdermal needle electrodes or adhesive electrodes can be employed. Safety isolation meets IEC 60601-1 standards with patient leakage current below 10 microamperes.',
      ],
    },
  },
  {
    name: 'StimuCare Deep Brain Stimulator',
    category: 'Neurology',
    manufacturer: 'NeuroModulation Inc',
    price: 25000.00,
    description: 'Rechargeable deep brain stimulation system for Parkinson\'s disease and essential tremor treatment.',
    document: {
      title: 'StimuCare DBS System Overview',
      sourceUri: 'https://example.com/docs/stimucare-dbs-overview.pdf',
      chunks: [
        'The StimuCare Deep Brain Stimulation (DBS) System is an implantable neurostimulation device for the treatment of Parkinson\'s disease, essential tremor, dystonia, and obsessive-compulsive disorder. The system consists of an implantable pulse generator (IPG), extension cables, and quadripolar DBS leads. The rechargeable IPG has a volume of 22 cc and weighs 28 grams, with an expected battery life of 15 years with daily recharging.',
        'The DBS lead features four cylindrical platinum-iridium contacts, each 1.5mm in height with 0.5mm spacing or 1.5mm spacing depending on lead model. Leads are available in lengths of 40cm and 50cm. The lead is inserted through a burr hole using stereotactic guidance targeting the subthalamic nucleus (STN), globus pallidus internus (GPi), or ventral intermediate nucleus (VIM) of the thalamus depending on the clinical indication.',
        'The IPG offers multiple stimulation modes including monopolar, bipolar, and multipolar configurations. Programmable parameters include voltage (0-10.5V), pulse width (30-450 microseconds), and frequency (2-250 Hz). Most patients with Parkinson\'s disease respond optimally to high-frequency stimulation (130-180 Hz) in the STN. The device includes sensing capabilities to detect local field potentials and adjust stimulation adaptively.',
        'The patient programmer is a handheld device that allows patients to turn the device on/off, adjust stimulation amplitude within physician-set limits, and check battery status. The clinician programmer is a tablet-based system with advanced programming features including electrode configuration testing, impedance measurement, and therapeutic window mapping. Patients recharge the IPG using an external charging coil placed over the implant for approximately 1 hour per week.',
      ],
    },
  },
  {
    name: 'CogniTest Cognitive Assessment Suite',
    category: 'Neurology',
    manufacturer: 'MindMetrics Corp',
    price: 890.00,
    description: 'Computerized cognitive testing platform for dementia screening and cognitive impairment evaluation.',
    document: {
      title: 'CogniTest Assessment Guide',
      sourceUri: 'https://example.com/docs/cognitest-guide.pdf',
      chunks: [
        'CogniTest is a comprehensive computerized cognitive assessment platform designed for screening and monitoring of cognitive impairment in clinical and research settings. The software includes validated tests for memory, attention, executive function, language, and visuospatial abilities. The complete battery takes approximately 45-60 minutes to administer and generates age, education, and gender-adjusted normative scores.',
        'The memory module includes tests of immediate and delayed verbal recall, visual recognition memory, and working memory span. Executive function is assessed through trail-making tests, verbal fluency tasks, and set-shifting paradigms. Attention tests measure sustained attention, divided attention, and processing speed. Language assessment includes confrontation naming and semantic fluency. Visuospatial tests evaluate constructional praxis and spatial judgment.',
        'Results are presented in a comprehensive report with standardized scores (z-scores, percentiles, T-scores) compared to age-matched normative data from over 5,000 healthy adults. The report includes domain-specific scores and a global cognitive index. Impairment classification uses cutoffs of -1.5 SD for mild cognitive impairment and -2.0 SD for dementia-level impairment. Longitudinal tracking shows rate of decline over serial assessments.',
        'The platform is web-based and compatible with touchscreen tablets, desktop computers, and laptops. Stimuli are presented visually and auditorily with response collection via touchscreen, mouse, or keyboard. The software automatically records response times, error rates, and performance patterns. Data is encrypted and stored on HIPAA-compliant cloud servers. The test has been validated against standard neuropsychological measures with correlation coefficients ranging from 0.70 to 0.85.',
      ],
    },
  },
  {
    name: 'NeuroPath Nerve Conduction Study System',
    category: 'Neurology',
    manufacturer: 'ElectroNeuro Diagnostics',
    price: 12400.00,
    description: 'Portable nerve conduction velocity and EMG system for peripheral neuropathy diagnosis.',
    document: {
      title: 'NeuroPath NCS/EMG Reference',
      sourceUri: 'https://example.com/docs/neuropath-reference.pdf',
      chunks: [
        'The NeuroPath Nerve Conduction Study System is a portable electrodiagnostic platform for evaluation of peripheral nerve and muscle disorders. The system combines nerve conduction studies (NCS) and electromyography (EMG) capabilities in a single 5 kg unit with an integrated 15-inch touchscreen display. The device operates on AC power or internal lithium-ion battery providing 4 hours of continuous use.',
        'Nerve conduction studies are performed using constant current stimulation with adjustable intensity from 0 to 100 mA and duration from 0.05 to 1.0 ms. The stimulator provides rectangular monophasic or biphasic pulses. Surface recording electrodes measure compound muscle action potentials (CMAPs) and sensory nerve action potentials (SNAPs) with amplification up to 50,000x and frequency filtering from 2 Hz to 10 kHz. Latency measurements are accurate to 0.1 ms.',
        'The EMG module utilizes a concentric needle electrode for intramuscular recordings. The amplifier displays spontaneous activity (fibrillations, positive sharp waves, fasciculations) and motor unit action potentials (MUAPs) during voluntary contraction. MUAP analysis includes automated measurements of amplitude, duration, phases, and turns. Template matching and firing rate analysis assist in detecting neurogenic and myopathic patterns.',
        'Standard NCS protocols are pre-programmed for upper extremity (median, ulnar, radial nerves), lower extremity (tibial, peroneal, sural nerves), and facial nerves. The software calculates conduction velocities, distal latencies, and amplitude comparisons automatically. Normal values are displayed based on age, height, and temperature-adjusted normative data. Reports include waveform overlays, tabular data, and interpretation suggestions. The system meets AANEM technical standards for electrodiagnostic equipment.',
      ],
    },
  },

  // ========== IMAGING (4 products) ==========
  {
    name: 'ClearView 3T MRI Knee Coil',
    category: 'Imaging',
    manufacturer: 'Imaging Solutions Pro',
    price: 8900.00,
    description: 'Dedicated 16-channel phased-array RF coil for high-resolution knee MRI at 3 Tesla field strength.',
    document: {
      title: 'ClearView Knee Coil Technical Specs',
      sourceUri: 'https://example.com/docs/clearview-coil-specs.pdf',
      chunks: [
        'The ClearView 3T MRI Knee Coil is a dedicated 16-channel phased-array radiofrequency coil optimized for high-resolution magnetic resonance imaging of the knee at 3 Tesla field strength. The coil features a dual-shell design with 8 anterior and 8 posterior elements arranged in an overlapping configuration to maximize signal-to-noise ratio (SNR) and parallel imaging performance. The coil provides up to 50% higher SNR compared to standard extremity coils.',
        'The coil housing is constructed from lightweight carbon fiber composite with an open ergonomic design that accommodates patient knee sizes from small pediatric to large adult. The internal diameter is 17 cm with a 22 cm field of view. Foam padding provides patient comfort during extended imaging sessions. The coil connects to the scanner via a single multi-pin connector and is compatible with Siemens, GE, and Philips 3T MRI systems.',
        'Parallel imaging acceleration factors up to 4x are achievable with minimal artifact and SNR penalty, enabling rapid acquisition protocols. A typical comprehensive knee protocol including sagittal PD fat-sat, coronal T1, coronal STIR, and axial T2 sequences can be completed in under 15 minutes. The high SNR enables thin slice acquisition (2mm or less) for detailed evaluation of cartilage, menisci, ligaments, and bone marrow.',
        'The coil is indicated for imaging of internal derangements including meniscal tears, ACL/PCL injuries, cartilage defects, bone contusions, and ligamentous injuries. Advanced applications include T2 mapping for early osteoarthritis detection, delayed gadolinium-enhanced MRI of cartilage (dGEMRIC), and quantitative morphometric analysis. The coil receives FDA 510(k) clearance and CE marking for clinical use. Recommended quality assurance testing should be performed quarterly.',
      ],
    },
  },
  {
    name: 'UltraSound Pro L12-3 Linear Array Transducer',
    category: 'Imaging',
    manufacturer: 'SonoMed Technologies',
    price: 3750.00,
    description: 'High-frequency linear array ultrasound probe for vascular and musculoskeletal imaging.',
    document: {
      title: 'UltraSound Pro L12-3 Specifications',
      sourceUri: 'https://example.com/docs/ultrasound-transducer-specs.pdf',
      chunks: [
        'The UltraSound Pro L12-3 is a broadband linear array transducer operating at frequencies from 3 to 12 MHz. The probe features 192 piezoelectric elements arranged in a linear configuration with a 38mm footprint and 50mm maximum imaging depth. The transducer is optimized for superficial structures including vascular imaging, musculoskeletal examinations, breast imaging, thyroid evaluation, and peripheral nerve blocks.',
        'Advanced beam-forming technology provides excellent spatial resolution with axial resolution of 0.2mm at 12 MHz and lateral resolution of 0.4mm. Compound imaging combines multiple beam steering angles to reduce speckle and enhance edge detection. Harmonic imaging improves contrast resolution and reduces artifacts. Color Doppler and power Doppler modes enable assessment of blood flow with velocity range from 1 cm/s to 100 cm/s.',
        'The transducer housing is sealed to IPX7 standard allowing full submersion for cleaning and disinfection. The cable is reinforced strain relief design with a 2.4-meter length. The probe weighs 285 grams with ergonomic contouring and soft-touch coating for comfortable extended use. Compatible with UltraSound Pro ultrasound systems and supports DICOM 3.0 for image export.',
        'Clinical applications include carotid artery stenosis evaluation, deep vein thrombosis screening, rotator cuff tear diagnosis, Achilles tendon pathology, carpal tunnel syndrome assessment, and guidance for fine-needle aspiration procedures. The high-frequency range enables detailed visualization of superficial structures with penetration depth appropriate for most superficial organ and soft tissue examinations. Transducer should be inspected regularly for cable damage and element dropouts.',
      ],
    },
  },
  {
    name: 'MammoView Digital Mammography System',
    category: 'Imaging',
    manufacturer: 'Women\'s Imaging Corp',
    price: 185000.00,
    description: 'Full-field digital mammography system with tomosynthesis capability for breast cancer screening.',
    document: {
      title: 'MammoView System Clinical Manual',
      sourceUri: 'https://example.com/docs/mammoview-manual.pdf',
      chunks: [
        'The MammoView Digital Mammography System is a full-field digital mammography (FFDM) platform with optional digital breast tomosynthesis (DBT) capability. The system features a 24cm x 30cm amorphous selenium direct-conversion detector with 70-micron pixel pitch, providing superior spatial resolution compared to indirect-conversion detectors. The detector dynamic range of 14-bit enables visualization of both dense fibroglandular tissue and fatty tissue in a single exposure.',
        'The tungsten target X-ray tube operates from 20 kVp to 49 kVp with rhodium, silver, and aluminum filtration options for optimal image quality across different breast densities. Automatic exposure control (AEC) adjusts technique factors based on breast composition and thickness. The compression paddle applies uniform pressure with a maximum force of 200 Newtons, with motorized and manual fine-adjustment controls.',
        'Tomosynthesis mode acquires 15 projection images over a 15-degree arc with reconstruction into 1mm slices through the breast volume. DBT has been shown to increase cancer detection rates by 20-40% while reducing recall rates by 15-30% compared to 2D mammography alone. Acquisition time for a single DBT view is 4 seconds with low-dose protocol delivering less than 2 mGy mean glandular dose.',
        'The workstation includes computer-aided detection (CAD) software that highlights suspicious masses and calcifications for radiologist review. The CAD algorithm is trained on over 50,000 mammographic images with sensitivity for malignancy exceeding 90% at a false-positive rate of 0.5 marks per image. DICOM integration allows seamless connectivity with PACS systems. The system meets FDA MQSA requirements and ACR accreditation standards for mammography facilities.',
      ],
    },
  },
  {
    name: 'PortaScan Mobile C-Arm Fluoroscopy System',
    category: 'Imaging',
    manufacturer: 'SurgiVision Systems',
    price: 95000.00,
    description: 'Mobile C-arm with flat-panel detector for intraoperative imaging and interventional procedures.',
    document: {
      title: 'PortaScan C-Arm Technical Reference',
      sourceUri: 'https://example.com/docs/portascan-reference.pdf',
      chunks: [
        'The PortaScan Mobile C-Arm Fluoroscopy System is a versatile intraoperative imaging platform designed for orthopedic, vascular, pain management, and general surgical procedures. The system features a 30cm x 30cm flat-panel detector with cesium iodide scintillator providing superior image quality compared to traditional image intensifiers. The C-arm has a 90cm bore diameter accommodating lateral, AP, and oblique projections without patient repositioning.',
        'The X-ray generator is a high-frequency inverter design with 15 kW maximum power output. Tube voltage is adjustable from 40 kVp to 110 kVp with automatic brightness control maintaining consistent image quality as anatomy thickness varies. Fluoroscopy modes include continuous, pulsed (1, 2, 4, 8, 15, 30 fps), and low-dose protocols. Digital subtraction angiography (DSA) capability enables vascular imaging with iodinated contrast injection.',
        'The motorized base provides effortless positioning with electromagnetic brakes for stability during imaging. The C-arm orbital rotation is ±210 degrees, horizontal rotation ±200 degrees, and vertical travel of 85cm. A 17-inch high-resolution LCD monitor is mounted on an articulating arm for optimal viewing position. Touchscreen controls and a wireless foot pedal provide intuitive operation in sterile environments.',
        'Advanced imaging features include metal artifact reduction, automatic edge enhancement, and retrospective image processing. Up to 1,000 images can be stored internally with DICOM export to PACS via wired or wireless network. Radiation dose monitoring displays cumulative dose-area product and reference air kerma. The system meets IEC 60601-2-43 safety standards with dose-rate limits and audible/visual warnings. Lead shielding and scatter radiation protection are essential for all operators and staff in the room during use.',
      ],
    },
  },

  // ========== SURGICAL (4 products) ==========
  {
    name: 'PrecisionCut Surgical Robot System',
    category: 'Surgical',
    manufacturer: 'Robotic Surgery Solutions',
    price: 1250000.00,
    description: 'Multi-port robotic surgical system for minimally invasive procedures with 3D HD visualization.',
    document: {
      title: 'PrecisionCut Robot Platform Overview',
      sourceUri: 'https://example.com/docs/precisioncut-overview.pdf',
      chunks: [
        'The PrecisionCut Surgical Robot System is a state-of-the-art robotic platform for minimally invasive surgery across multiple specialties including general surgery, urology, gynecology, and cardiothoracic surgery. The system consists of a surgeon console, patient-side cart with four robotic arms, and a vision cart with dual-console capability for training. The robotic arms provide seven degrees of freedom with EndoWrist articulation that mimics and exceeds natural human wrist movement.',
        'The 3D high-definition vision system utilizes dual 5-megapixel cameras providing stereoscopic imaging with 10x magnification and immersive depth perception. The surgeon console features hand controls (masters) with motion scaling and tremor filtration, allowing precise movements scaled down to 5:1 or 3:1 ratios. Foot pedals control camera movement, energy activation, and clutching for instrument repositioning without losing tooltip position.',
        'Compatible instruments include needle drivers, forceps, scissors, monopolar and bipolar energy devices, staplers, and vessel sealers. Each instrument has 90 degrees of articulation with 540 degrees of rotation. Instruments are single-use and feature RFID identification for automatic recognition and usage tracking. The system provides haptic feedback simulation and collision detection to prevent instrument clashes and tissue trauma.',
        'Clinical advantages over conventional laparoscopy include improved visualization, enhanced dexterity in confined spaces, reduced surgeon fatigue, and potentially shorter hospital stays and faster patient recovery. Procedures commonly performed include prostatectomy, hysterectomy, cholecystectomy, bariatric surgery, and mitral valve repair. The system requires specialized training and credentialing for surgeons and operating room staff. Installation includes structural reinforcement of the operating room floor and dedicated electrical circuits with backup power.',
      ],
    },
  },
  {
    name: 'BipoMax Electrosurgical Generator',
    category: 'Surgical',
    manufacturer: 'ElectroSurg Devices Inc',
    price: 8500.00,
    description: 'Advanced electrosurgical unit with vessel sealing, bipolar, and monopolar modes for surgical hemostasis.',
    document: {
      title: 'BipoMax Generator User Manual',
      sourceUri: 'https://example.com/docs/bipomax-manual.pdf',
      chunks: [
        'The BipoMax Electrosurgical Generator is a versatile energy platform providing monopolar, bipolar, and advanced vessel sealing modalities for surgical hemostasis and tissue dissection. The generator delivers up to 300 watts of monopolar power and 120 watts of bipolar power with microprocessor-controlled waveforms optimized for cutting, coagulation, and blended effects. The unit features a 7-inch color touchscreen interface with mode selection and power adjustment.',
        'Monopolar modes include pure cut (continuous sine wave), blend 1-3 (variable cut/coag ratios), fulguration, and soft coagulation. The system automatically adjusts voltage and current based on tissue impedance feedback, maintaining consistent tissue effects across varying tissue types. Return electrode monitoring (REM) continuously checks the integrity of the dispersive electrode to prevent patient burns from poor contact or disconnection.',
        'The bipolar vessel sealing system utilizes proprietary algorithms to deliver precise energy dosing based on real-time tissue impedance changes. The system can reliably seal blood vessels up to 7mm in diameter with minimal thermal spread (2-3mm) protecting adjacent structures. Audio and visual feedback signals indicate seal completion. Compatible with reusable and disposable vessel sealing instruments including open and laparoscopic forceps.',
        'Safety features include isolated output circuits, automatic power shutoff after activation timeout, and comprehensive alarm systems for equipment faults. The generator is compatible with smoke evacuation systems to remove surgical plume. The device meets IEC 60601-2-2 standards for electrosurgical equipment. Routine preventive maintenance should be performed annually including output power verification and electrical safety testing.',
      ],
    },
  },
  {
    name: 'SurgiCut Diamond Blade Scalpel Set',
    category: 'Surgical',
    manufacturer: 'Precision Surgical Tools',
    price: 245.00,
    description: 'Premium stainless steel scalpel handle set with diamond-coated blades for microsurgery.',
    document: {
      title: 'SurgiCut Scalpel Product Information',
      sourceUri: 'https://example.com/docs/surgicut-scalpel-info.pdf',
      chunks: [
        'The SurgiCut Diamond Blade Scalpel Set is a professional-grade surgical instrument set designed for precision cutting in general surgery, plastic surgery, and microsurgical procedures. The set includes three scalpel handles (#3, #4, and #7) manufactured from surgical-grade 440C stainless steel with a satin finish to reduce glare under operating room lights. Handles feature textured gripping surfaces for secure control in wet conditions.',
        'The diamond-coated blades are made from high-carbon stainless steel that is micro-ground and honed to a cutting edge of 0.3 microns. A nanolayer diamond coating extends blade sharpness by up to 300% compared to standard surgical blades. Blades are available in sizes #10, #11, #15, and #20 for the #3 handle, #20-#25 for the #4 handle, and #11 for the #7 handle. Each blade is individually wrapped and sterilized using gamma irradiation.',
        'The #3 handle is the most versatile, accepting small and medium blades suitable for making incisions in skin and subcutaneous tissue. The #4 handle accommodates larger blades for deeper or longer incisions. The #7 handle is a delicate instrument used in microsurgery, ophthalmology, and nerve repair procedures. Blade attachment is via a standard compatible system with secure locking to prevent intraoperative detachment.',
        'All components are autoclavable at temperatures up to 134°C for sterilization and reuse of handles. Blades are single-use and should be discarded in sharps containers immediately after use. The scalpel set includes a protective storage case with individual slots for each handle. Instruments should be inspected before each use for damage or wear. The set meets ASTM F1554 standards for surgical scalpel handles and ISO 7153 standards for surgical blades.',
      ],
    },
  },
  {
    name: 'ArthroView HD Arthroscopy Camera System',
    category: 'Surgical',
    manufacturer: 'EndoVision Technologies',
    price: 42000.00,
    description: 'High-definition arthroscopic camera system with LED light source for joint surgery.',
    document: {
      title: 'ArthroView Camera System Guide',
      sourceUri: 'https://example.com/docs/arthroview-guide.pdf',
      chunks: [
        'The ArthroView HD Arthroscopy Camera System is a comprehensive visualization platform for minimally invasive joint surgery including knee, shoulder, hip, ankle, and wrist arthroscopy. The system features a 3-chip 1080p HD camera head providing superior color reproduction and image clarity compared to single-chip cameras. The camera outputs digital video in 1920x1080 resolution at 60 frames per second for smooth motion during dynamic maneuvers.',
        'The LED light source delivers 300 watts of daylight-balanced illumination with adjustable intensity from 10% to 100%. LED technology provides consistent color temperature throughout the brightness range without the warm-up time or degradation of traditional xenon lamps. Expected LED lifetime is 50,000 hours compared to 500 hours for xenon bulbs, significantly reducing operating costs and eliminating lamp replacements.',
        'Arthroscope compatibility includes 2.7mm, 4.0mm, and 5.0mm diameter scopes with 30-degree and 70-degree viewing angles. The camera head is lightweight (120 grams) with autoclavable outer shell rated for 500 sterilization cycles. The camera control unit provides automatic white balance, gain adjustment, and image enhancement features including edge enhancement and digital zoom up to 2x magnification.',
        'The system includes integrated recording and image capture functionality with USB export and DICOM connectivity for PACS integration. Video can be streamed to multiple monitors in the operating room and to remote locations for telemedicine or education. The 27-inch surgical monitor provides wide viewing angles and anti-glare coating. Optional accessories include irrigation pumps, radiofrequency ablation generators, and motorized shaver systems for complete arthroscopic setups.',
      ],
    },
  },
];

/**
 * Simple text chunking function
 * Splits an array of chunks into smaller pieces if needed
 */
function chunkText(chunks: string[]): string[] {
  return chunks;
}

/**
 * Clear all existing data from the database
 */
async function clearDatabase() {
  console.log('\n🗑️  Clearing existing data...');

  // Delete in order due to foreign key constraints
  await prisma.documentChunk.deleteMany();
  console.log('   ✓ Deleted all document chunks');

  await prisma.document.deleteMany();
  console.log('   ✓ Deleted all documents');

  await prisma.product.deleteMany();
  console.log('   ✓ Deleted all products');

  console.log('✅ Database cleared successfully\n');
}

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Starting Medical Product Finder Seed Script\n');
  console.log('================================================\n');

  if (shouldClear) {
    await clearDatabase();
  }

  console.log('📦 Seeding products, documents, and chunks...\n');

  let totalProducts = 0;
  let totalDocuments = 0;
  let totalChunks = 0;

  // Process each product
  for (const productData of productsData) {
    console.log(`   Creating: ${productData.name}`);
    console.log(`   Category: ${productData.category}`);
    console.log(`   Price: $${productData.price.toFixed(2)}`);

    const chunks = chunkText(productData.document.chunks);

    // Create product with nested document and chunks in a single transaction
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
                // embedding is intentionally NULL - will be populated in Phase 9
              })),
            },
          },
        },
      },
    });

    totalProducts++;
    totalDocuments++;
    totalChunks += chunks.length;

    console.log(`   ✓ Created with ${chunks.length} chunks\n`);
  }

  console.log('================================================\n');
  console.log('✅ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   • Products created: ${totalProducts}`);
  console.log(`   • Documents created: ${totalDocuments}`);
  console.log(`   • Chunks created: ${totalChunks}`);
  console.log(`   • Average chunks per product: ${(totalChunks / totalProducts).toFixed(1)}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Verify data: npm run seed -- --clear (to reseed)');
  console.log('   2. Phase 9: Run npm run ingest to generate embeddings');
  console.log('   3. Query database to verify: docker exec medical-finder-db psql -U postgres -d medical_finder -c "SELECT COUNT(*) FROM \\"Product\\";"');
  console.log('\n');
}

// Execute main function
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import type {
  CompanyType,
  EducationLevel,
  EmploymentStatus,
  FieldOfInterest,
  JobType,
  OceanTraitKey,
  Polarity,
  RiasecTypeKey,
  ToolsExperience,
  WorkMode,
} from '@/types/seeker.types'

export interface OceanItem {
  trait: OceanTraitKey
  polarity: Polarity
  statement: string
}

/** BFI-10 — one positive + one reverse item per trait (design doc §7.1). */
export const OCEAN_ITEMS: OceanItem[] = [
  { trait: 'O', polarity: '+', statement: 'Saya suka mengeksplorasi ide & konsep baru' },
  { trait: 'O', polarity: '-', statement: 'Saya kurang tertarik pada hal abstrak/teoretis' },
  { trait: 'C', polarity: '+', statement: 'Saya mengerjakan tugas dengan teliti & tepat waktu' },
  { trait: 'C', polarity: '-', statement: 'Saya cenderung menunda & kurang rapi' },
  { trait: 'E', polarity: '+', statement: 'Saya berenergi saat berinteraksi dengan banyak orang' },
  { trait: 'E', polarity: '-', statement: 'Saya lebih suka menyendiri & cenderung pendiam' },
  { trait: 'A', polarity: '+', statement: 'Saya mudah berempati & mengutamakan kerja sama' },
  { trait: 'A', polarity: '-', statement: 'Saya cenderung kritis & sulit mempercayai orang' },
  { trait: 'N', polarity: '+', statement: 'Saya mudah cemas atau tertekan' },
  { trait: 'N', polarity: '-', statement: 'Saya tetap tenang & stabil di bawah tekanan' },
]

export const OCEAN_SCALE_LABELS = [
  'Sangat Tidak Setuju',
  'Tidak Setuju',
  'Agak Tidak Setuju',
  'Netral',
  'Agak Setuju',
  'Setuju',
  'Sangat Setuju',
]

export interface RiasecItem {
  item: number
  letter: RiasecTypeKey
  statement: string
}

/** 42-item RIASEC worksheet (design doc §7.2). */
export const RIASEC_ITEMS: RiasecItem[] = [
  { item: 1, letter: 'R', statement: 'Suka mengutak-atik/memperbaiki mobil' },
  { item: 2, letter: 'I', statement: 'Suka mengerjakan teka-teki' },
  { item: 3, letter: 'A', statement: 'Baik bekerja secara mandiri' },
  { item: 4, letter: 'S', statement: 'Suka bekerja dalam tim' },
  { item: 5, letter: 'E', statement: 'Ambisius, menetapkan target sendiri' },
  { item: 6, letter: 'C', statement: 'Suka mengorganisir berkas/meja' },
  { item: 7, letter: 'R', statement: 'Suka membangun/merakit sesuatu' },
  { item: 8, letter: 'A', statement: 'Suka membaca tentang seni & musik' },
  { item: 9, letter: 'C', statement: 'Suka punya instruksi jelas untuk diikuti' },
  { item: 10, letter: 'E', statement: 'Suka memengaruhi/membujuk orang' },
  { item: 11, letter: 'I', statement: 'Suka melakukan eksperimen' },
  { item: 12, letter: 'S', statement: 'Suka mengajar/melatih orang' },
  { item: 13, letter: 'S', statement: 'Suka membantu orang memecahkan masalah' },
  { item: 14, letter: 'R', statement: 'Suka merawat hewan' },
  { item: 15, letter: 'C', statement: 'Tidak keberatan kerja 8 jam di kantor' },
  { item: 16, letter: 'E', statement: 'Suka menjual sesuatu' },
  { item: 17, letter: 'A', statement: 'Menikmati menulis kreatif' },
  { item: 18, letter: 'I', statement: 'Menyukai sains' },
  { item: 19, letter: 'E', statement: 'Cepat mengambil tanggung jawab baru' },
  { item: 20, letter: 'S', statement: 'Tertarik menyembuhkan/merawat orang' },
  { item: 21, letter: 'I', statement: 'Suka mencari tahu cara kerja sesuatu' },
  { item: 22, letter: 'R', statement: 'Suka menyusun/merakit barang' },
  { item: 23, letter: 'A', statement: 'Orang yang kreatif' },
  { item: 24, letter: 'C', statement: 'Memperhatikan detail' },
  { item: 25, letter: 'C', statement: 'Suka mengarsip atau mengetik' },
  { item: 26, letter: 'I', statement: 'Suka menganalisis masalah/situasi' },
  { item: 27, letter: 'A', statement: 'Suka memainkan alat musik/bernyanyi' },
  { item: 28, letter: 'S', statement: 'Menikmati mempelajari budaya lain' },
  { item: 29, letter: 'E', statement: 'Ingin memulai bisnis sendiri' },
  { item: 30, letter: 'R', statement: 'Suka memasak' },
  { item: 31, letter: 'A', statement: 'Suka berakting dalam drama' },
  { item: 32, letter: 'R', statement: 'Orang yang praktis' },
  { item: 33, letter: 'I', statement: 'Suka bekerja dengan angka/grafik' },
  { item: 34, letter: 'S', statement: 'Suka terlibat diskusi tentang isu' },
  { item: 35, letter: 'C', statement: 'Suka menyimpan catatan pekerjaan' },
  { item: 36, letter: 'E', statement: 'Suka memimpin' },
  { item: 37, letter: 'R', statement: 'Suka bekerja di luar ruangan' },
  { item: 38, letter: 'C', statement: 'Ingin bekerja di kantor' },
  { item: 39, letter: 'I', statement: 'Pandai matematika' },
  { item: 40, letter: 'S', statement: 'Suka membantu orang' },
  { item: 41, letter: 'A', statement: 'Suka menggambar' },
  { item: 42, letter: 'E', statement: 'Suka berpidato/memberi ceramah' },
]

interface Option<T extends string> {
  value: T
  label: string
}

export const GENDER_OPTIONS: Option<'male' | 'female'>[] = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
]

export const EMPLOYMENT_STATUS_OPTIONS: Option<EmploymentStatus>[] = [
  { value: 'fresh_grad', label: 'Fresh Graduate' },
  { value: 'working', label: 'Bekerja' },
  { value: 'unemployed', label: 'Belum Bekerja' },
  { value: 'freelance', label: 'Freelance' },
]

export const EDUCATION_LEVEL_OPTIONS: Option<EducationLevel>[] = [
  { value: 'SMA', label: 'SMA/SMK' },
  { value: 'D3', label: 'D3' },
  { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' },
]

export const FIELD_OPTIONS: Option<FieldOfInterest>[] = [
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'keuangan', label: 'Keuangan' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'pendidikan', label: 'Pendidikan' },
  { value: 'manufaktur', label: 'Manufaktur' },
  { value: 'kreatif', label: 'Kreatif' },
  { value: 'lainnya', label: 'Lainnya' },
]

export const TOOL_OPTIONS: Option<string>[] = [
  { value: 'python', label: 'Python' },
  { value: 'excel', label: 'Excel' },
  { value: 'figma', label: 'Figma' },
  { value: 'autocad', label: 'AutoCAD' },
  { value: 'spss', label: 'SPSS' },
]

export const KNOWLEDGE_OPTIONS: Option<string>[] = [
  { value: 'data_analysis', label: 'Data Analysis' },
  { value: 'uiux_design', label: 'UI/UX Design' },
  { value: 'akuntansi', label: 'Akuntansi' },
  { value: 'pemasaran_digital', label: 'Pemasaran Digital' },
  { value: 'hukum_kontrak', label: 'Hukum Kontrak' },
]

export const TOOLS_EXPERIENCE_OPTIONS: Option<ToolsExperience>[] = [
  { value: '0-6m', label: '0-6 bulan' },
  { value: '6-12m', label: '6-12 bulan' },
  { value: '1-2y', label: '1-2 tahun' },
  { value: '2-3y', label: '2-3 tahun' },
  { value: '3-5y', label: '3-5 tahun' },
  { value: '>5y', label: '> 5 tahun' },
]

export const WORK_MODE_OPTIONS: Option<WorkMode>[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'flexible', label: 'Fleksibel' },
]

export const COMPANY_TYPE_OPTIONS: Option<CompanyType>[] = [
  { value: 'startup', label: 'Startup' },
  { value: 'korporasi', label: 'Korporasi' },
  { value: 'bumn', label: 'BUMN' },
  { value: 'instansi_pemerintah', label: 'Instansi Pemerintah' },
  { value: 'ngo', label: 'NGO' },
  { value: 'umkm', label: 'UMKM' },
]

export const JOB_TYPE_OPTIONS: Option<JobType>[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Kontrak' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'magang', label: 'Magang' },
]

/** 10 options; the seeker picks & ranks their best 5 (design §5 Step 02). */
export const SOFT_SKILL_OPTIONS: Option<string>[] = [
  { value: 'leadership', label: 'Leadership' },
  { value: 'communication', label: 'Communication' },
  { value: 'critical_thinking', label: 'Critical Thinking' },
  { value: 'adaptability', label: 'Adaptability' },
  { value: 'teamwork', label: 'Teamwork' },
  { value: 'problem_solving', label: 'Problem Solving' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'time_management', label: 'Time Management' },
  { value: 'emotional_intelligence', label: 'Emotional Intelligence' },
  { value: 'decision_making', label: 'Decision Making' },
]

export const MAX_SOFT_SKILLS = 5

export const OCEAN_TRAIT_LABELS: Record<OceanTraitKey, string> = {
  O: 'Openness',
  C: 'Conscientiousness',
  E: 'Extraversion',
  A: 'Agreeableness',
  N: 'Neuroticism',
}

export const RIASEC_TYPE_LABELS: Record<RiasecTypeKey, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
}

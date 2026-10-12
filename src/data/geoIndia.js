/**
 * Normalized Geographic Data Architecture for Vcreateventures
 * Covering all 28 States and 8 Union Territories of India,
 * with deep local mapping for Uttar Pradesh and Prayagraj.
 */

export const INDIAN_STATES = [
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh', code: 'AP', capital: 'Amaravati', type: 'state', majorCities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kurnool'] },
  { name: 'Arunachal Pradesh', slug: 'arunachal-pradesh', code: 'AR', capital: 'Itanagar', type: 'state', majorCities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'] },
  { name: 'Assam', slug: 'assam', code: 'AS', capital: 'Dispur', type: 'state', majorCities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tezpur'] },
  { name: 'Bihar', slug: 'bihar', code: 'BR', capital: 'Patna', type: 'state', majorCities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif'] },
  { name: 'Chhattisgarh', slug: 'chhattisgarh', code: 'CG', capital: 'Raipur', type: 'state', majorCities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'] },
  { name: 'Goa', slug: 'goa', code: 'GA', capital: 'Panaji', type: 'state', majorCities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'] },
  { name: 'Gujarat', slug: 'gujarat', code: 'GJ', capital: 'Gandhinagar', type: 'state', majorCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar'] },
  { name: 'Haryana', slug: 'haryana', code: 'HR', capital: 'Chandigarh', type: 'state', majorCities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Panchkula'] },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', code: 'HP', capital: 'Shimla', type: 'state', majorCities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Baddi', 'Kullu'] },
  { name: 'Jharkhand', slug: 'jharkhand', code: 'JH', capital: 'Ranchi', type: 'state', majorCities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'] },
  { name: 'Karnataka', slug: 'karnataka', code: 'KA', capital: 'Bengaluru', type: 'state', majorCities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Shivamogga'] },
  { name: 'Kerala', slug: 'kerala', code: 'KL', capital: 'Thiruvananthapuram', type: 'state', majorCities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'] },
  { name: 'Madhya Pradesh', slug: 'madhya-pradesh', code: 'MP', capital: 'Bhopal', type: 'state', majorCities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'] },
  { name: 'Maharashtra', slug: 'maharashtra', code: 'MH', capital: 'Mumbai', type: 'state', majorCities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Navi Mumbai'] },
  { name: 'Manipur', slug: 'manipur', code: 'MN', capital: 'Imphal', type: 'state', majorCities: ['Imphal', 'Churachandpur', 'Thoubal'] },
  { name: 'Meghalaya', slug: 'meghalaya', code: 'ML', capital: 'Shillong', type: 'state', majorCities: ['Shillong', 'Tura', 'Jowai'] },
  { name: 'Mizoram', slug: 'mizoram', code: 'MZ', capital: 'Aizawl', type: 'state', majorCities: ['Aizawl', 'Lunglei', 'Champhai'] },
  { name: 'Nagaland', slug: 'nagaland', code: 'NL', capital: 'Kohima', type: 'state', majorCities: ['Kohima', 'Dimapur', 'Mokokchung'] },
  { name: 'Odisha', slug: 'odisha', code: 'OD', capital: 'Bhubaneswar', type: 'state', majorCities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'] },
  { name: 'Punjab', slug: 'punjab', code: 'PB', capital: 'Chandigarh', type: 'state', majorCities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'] },
  { name: 'Rajasthan', slug: 'rajasthan', code: 'RJ', capital: 'Jaipur', type: 'state', majorCities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara'] },
  { name: 'Sikkim', slug: 'sikkim', code: 'SK', capital: 'Gangtok', type: 'state', majorCities: ['Gangtok', 'Namchi', 'Geyzing'] },
  { name: 'Tamil Nadu', slug: 'tamil-nadu', code: 'TN', capital: 'Chennai', type: 'state', majorCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'] },
  { name: 'Telangana', slug: 'telangana', code: 'TS', capital: 'Hyderabad', type: 'state', majorCities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'] },
  { name: 'Tripura', slug: 'tripura', code: 'TR', capital: 'Agartala', type: 'state', majorCities: ['Agartala', 'Udaipur', 'Dharmanagar'] },
  {
    name: 'Uttar Pradesh',
    slug: 'uttar-pradesh',
    code: 'UP',
    capital: 'Lucknow',
    type: 'state',
    isPriority: true,
    majorCities: [
      'Lucknow', 'Noida', 'Greater Noida', 'Ghaziabad', 'Kanpur', 'Agra',
      'Prayagraj', 'Varanasi', 'Meerut', 'Gorakhpur', 'Bareilly', 'Moradabad',
      'Aligarh', 'Mathura', 'Ayodhya', 'Jhansi', 'Saharanpur', 'Muzaffarnagar',
      'Firozabad', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Etawah', 'Sultanpur',
      'Jaunpur', 'Mirzapur', 'Basti', 'Barabanki', 'Raebareli', 'Unnao',
      'Sitapur', 'Lakhimpur', 'Hapur', 'Bulandshahr', 'Amroha', 'Bijnor',
      'Bahraich', 'Gonda', 'Azamgarh', 'Ballia', 'Mau', 'Deoria',
      'Kushinagar', 'Sonbhadra', 'Chandauli', 'Fatehpur', 'Kaushambi',
    ],
  },
  { name: 'Uttarakhand', slug: 'uttarakhand', code: 'UK', capital: 'Dehradun', type: 'state', majorCities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh', 'Nainital'] },
  { name: 'West Bengal', slug: 'west-bengal', code: 'WB', capital: 'Kolkata', type: 'state', majorCities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol', 'Kharagpur', 'Bardhaman'] },
];

export const UNION_TERRITORIES = [
  { name: 'Andaman and Nicobar Islands', slug: 'andaman-and-nicobar-islands', code: 'AN', capital: 'Port Blair', type: 'ut', majorCities: ['Port Blair'] },
  { name: 'Chandigarh', slug: 'chandigarh', code: 'CH', capital: 'Chandigarh', type: 'ut', majorCities: ['Chandigarh'] },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', slug: 'dadra-and-nagar-haveli-and-daman-and-diu', code: 'DN', capital: 'Daman', type: 'ut', majorCities: ['Daman', 'Diu', 'Silvassa'] },
  { name: 'Delhi', slug: 'delhi', code: 'DL', capital: 'New Delhi', type: 'ut', isPriority: true, majorCities: ['New Delhi', 'North Delhi', 'South Delhi', 'Dwarka', 'Rohini', 'Connaught Place'] },
  { name: 'Jammu and Kashmir', slug: 'jammu-and-kashmir', code: 'JK', capital: 'Srinagar / Jammu', type: 'ut', majorCities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'] },
  { name: 'Ladakh', slug: 'ladakh', code: 'LA', capital: 'Leh', type: 'ut', majorCities: ['Leh', 'Kargil'] },
  { name: 'Lakshadweep', slug: 'lakshadweep', code: 'LD', capital: 'Kavaratti', type: 'ut', majorCities: ['Kavaratti'] },
  { name: 'Puducherry', slug: 'puducherry', code: 'PY', capital: 'Puducherry', type: 'ut', majorCities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] },
];

export const ALL_REGIONS = [...INDIAN_STATES, ...UNION_TERRITORIES];

/**
 * Priority City Profile: Prayagraj (Highest Priority Local SEO Target)
 */
export const PRAYAGRAJ_PROFILE = {
  name: 'Prayagraj',
  slug: 'prayagraj',
  aliases: ['Allahabad', 'Prayag'],
  state: 'Uttar Pradesh',
  stateSlug: 'uttar-pradesh',
  stateCode: 'UP',
  tagline: 'Educational & Emerging IT Hub of Eastern Uttar Pradesh',
  description:
    'Prayagraj (formerly Allahabad) is one of Northern India’s foremost academic, administrative, and emerging technology centers. Home to premier institutions like IIIT Allahabad, MNNIT Allahabad, and Allahabad University, the city is rapidly attracting software development centers, fintech startups, government IT projects, and remote-first technology teams.',
  hiringHubs: [
    { name: 'Civil Lines', desc: 'Commercial banking, retail corporate offices & consultancy firms' },
    { name: 'Naini Industrial Area', desc: 'Engineering manufacturing, logistics & tech processing parks' },
    { name: 'Jhalwa / IIIT Road', desc: 'Software labs, edtech incubators & IT startups cluster' },
    { name: 'Phaphamau', desc: 'Educational institutions, public enterprise tech & research centers' },
    { name: 'Teliyarganj / MNNIT Region', desc: 'Engineering talent incubators, coding hubs & consultancy' },
  ],
  popularCategories: [
    { slug: 'software-developer', title: 'Software Developer Jobs', count: 142 },
    { slug: 'frontend-developer', title: 'Frontend Developer (React / UI)', count: 86 },
    { slug: 'backend-developer', title: 'Backend Developer (Node / Python / Java)', count: 94 },
    { slug: 'full-stack-developer', title: 'Full Stack Developer', count: 110 },
    { slug: 'react-developer', title: 'React Developer Jobs', count: 78 },
    { slug: 'nodejs-developer', title: 'Node.js Developer Jobs', count: 64 },
    { slug: 'python-developer', title: 'Python Developer & AI Roles', count: 82 },
    { slug: 'data-analyst', title: 'Data Analyst & BI Jobs', count: 58 },
    { slug: 'data-scientist', title: 'Data Scientist & ML Roles', count: 34 },
    { slug: 'ai-jobs', title: 'AI & Automation Engineers', count: 45 },
    { slug: 'qa-testing', title: 'QA & Software Testing Engineers', count: 48 },
    { slug: 'devops', title: 'DevOps & Cloud Engineers', count: 39 },
    { slug: 'cloud-engineer', title: 'Cloud Infrastructure Jobs', count: 41 },
    { slug: 'internships', title: 'College & Tech Internships', count: 180 },
    { slug: 'fresher-jobs', title: 'Fresher IT & Graduate Jobs', count: 215 },
  ],
  nearbyCities: [
    { name: 'Varanasi', slug: 'varanasi', distance: '120 km' },
    { name: 'Lucknow', slug: 'lucknow', distance: '200 km' },
    { name: 'Kanpur', slug: 'kanpur', distance: '205 km' },
    { name: 'Mirzapur', slug: 'mirzapur', distance: '90 km' },
    { name: 'Jaunpur', slug: 'jaunpur', distance: '100 km' },
    { name: 'Fatehpur', slug: 'fatehpur', distance: '120 km' },
    { name: 'Kaushambi', slug: 'kaushambi', distance: '45 km' },
  ],
  faqs: [
    {
      q: 'Are there IT and software developer jobs available in Prayagraj?',
      a: 'Yes. Prayagraj hosts multiple software development agencies, IT service firms, edtech startups, and government digitization projects. Additionally, numerous national and international technology companies hire remote software engineers residing in Prayagraj from premier institutes like IIIT Allahabad and MNNIT.',
    },
    {
      q: 'How can freshers find entry-level jobs in Prayagraj?',
      a: 'Freshers can explore Vcreateventures curated fresher jobs section (/jobs-in-prayagraj/fresher-jobs) which lists entry-level positions in software development, tech support, business analysis, digital marketing, and management internships with leading local and remote employers.',
    },
    {
      q: 'Is Prayagraj the same as Allahabad for job searches?',
      a: 'Yes. Prayagraj is the official name of the city formerly known as Allahabad. All job listings, salary guides, and employer postings on Vcreateventures for Prayagraj encompass opportunities in Allahabad, Civil Lines, Naini, Jhalwa, and surrounding districts.',
    },
    {
      q: 'What is the average salary for software engineers in Prayagraj?',
      a: 'Salaries for junior software developers and freshers in Prayagraj typically range from ₹3.5L to ₹7L per year, while mid-to-senior engineers working on full-stack, AI, or remote product roles earn between ₹12L and ₹28L+ per year.',
    },
  ],
};

/**
 * Standard Job Categories available for City Level SEO
 */
export const STANDARD_JOB_CATEGORIES = [
  { slug: 'software-developer', title: 'Software Developer Jobs', shortTitle: 'Software Developer', keywords: ['software engineer', 'developer', 'programmer'] },
  { slug: 'frontend-developer', title: 'Frontend Developer Jobs', shortTitle: 'Frontend Developer', keywords: ['frontend', 'react', 'vue', 'angular', 'ui developer'] },
  { slug: 'backend-developer', title: 'Backend Developer Jobs', shortTitle: 'Backend Developer', keywords: ['backend', 'nodejs', 'python', 'java', 'golang'] },
  { slug: 'full-stack-developer', title: 'Full Stack Developer Jobs', shortTitle: 'Full Stack Developer', keywords: ['full stack', 'mern', 'fullstack'] },
  { slug: 'react-developer', title: 'React Developer Jobs', shortTitle: 'React Developer', keywords: ['react', 'react native', 'nextjs'] },
  { slug: 'nodejs-developer', title: 'Node.js Developer Jobs', shortTitle: 'Node.js Developer', keywords: ['node', 'express', 'nestjs'] },
  { slug: 'python-developer', title: 'Python Developer Jobs', shortTitle: 'Python Developer', keywords: ['python', 'django', 'fastapi'] },
  { slug: 'data-analyst', title: 'Data Analyst Jobs', shortTitle: 'Data Analyst', keywords: ['data analyst', 'business analyst', 'sql', 'bi'] },
  { slug: 'data-scientist', title: 'Data Scientist Jobs', shortTitle: 'Data Scientist', keywords: ['data science', 'machine learning', 'analytics'] },
  { slug: 'ai-jobs', title: 'AI & Automation Jobs', shortTitle: 'AI Engineer', keywords: ['ai', 'artificial intelligence', 'automation', 'llm'] },
  { slug: 'qa-testing', title: 'QA & Testing Jobs', shortTitle: 'QA Engineer', keywords: ['qa', 'tester', 'automation testing', 'selenium'] },
  { slug: 'devops', title: 'DevOps & Cloud Jobs', shortTitle: 'DevOps Engineer', keywords: ['devops', 'kubernetes', 'docker', 'ci/cd'] },
  { slug: 'cloud-engineer', title: 'Cloud Engineer Jobs', shortTitle: 'Cloud Engineer', keywords: ['aws', 'azure', 'cloud architect'] },
  { slug: 'internships', title: 'Internship Opportunities', shortTitle: 'Internships', keywords: ['intern', 'internship', 'trainee', 'apprentice'] },
  { slug: 'fresher-jobs', title: 'Fresher Jobs', shortTitle: 'Fresher Jobs', keywords: ['fresher', 'entry level', 'graduate', '0-1 year'] },
];

/**
 * Helper: Convert any string to URL slug
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Helper: Get State or UT by slug
 */
export function getRegionBySlug(slug) {
  const cleanSlug = slug.replace(/^jobs-in-/, '');
  return ALL_REGIONS.find((r) => r.slug === cleanSlug);
}

/**
 * Helper: Find City metadata within a State
 */
export function getCityDetails(citySlug, stateSlug = null) {
  const cleanCitySlug = citySlug.replace(/^jobs-in-/, '');

  if (cleanCitySlug === 'prayagraj' || cleanCitySlug === 'allahabad') {
    return {
      ...PRAYAGRAJ_PROFILE,
      slug: 'prayagraj',
    };
  }

  // Look up city across Uttar Pradesh or other states
  for (const region of ALL_REGIONS) {
    if (stateSlug && region.slug !== stateSlug.replace(/^jobs-in-/, '')) continue;

    const matchedCity = region.majorCities.find(
      (c) => slugify(c) === cleanCitySlug || c.toLowerCase() === cleanCitySlug
    );

    if (matchedCity) {
      return {
        name: matchedCity,
        slug: slugify(matchedCity),
        state: region.name,
        stateSlug: region.slug,
        stateCode: region.code,
        tagline: `Verified Career & Technology Opportunities in ${matchedCity}`,
        description: `Explore high-growth tech, corporate, fresher, and remote job openings in ${matchedCity}, ${region.name} verified by Vcreateventures hiring partners.`,
        nearbyCities: region.majorCities
          .filter((c) => c !== matchedCity)
          .slice(0, 6)
          .map((c) => ({ name: c, slug: slugify(c) })),
        popularCategories: STANDARD_JOB_CATEGORIES.slice(0, 10).map((cat) => ({
          ...cat,
          count: Math.floor(Math.random() * 80) + 25,
        })),
        faqs: [
          {
            q: `What kinds of jobs are available in ${matchedCity}?`,
            a: `${matchedCity} offers roles spanning software development, IT services, financial operations, healthcare, sales, and remote tech positions.`,
          },
          {
            q: `How can I apply for jobs in ${matchedCity} on Vcreateventures?`,
            a: `Create your free candidate profile on Vcreateventures, upload your resume, and apply to verified job vacancies with one click.`,
          },
        ],
      };
    }
  }

  // Default fallback for any valid Indian city name
  const formattedName = cleanCitySlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    name: formattedName,
    slug: cleanCitySlug,
    state: 'India',
    stateSlug: 'india',
    stateCode: 'IN',
    tagline: `Explore Active Job Vacancies in ${formattedName}`,
    description: `Find top engineering, business, and fresher career openings in ${formattedName} verified by Vcreateventures.`,
    nearbyCities: [],
    popularCategories: STANDARD_JOB_CATEGORIES.slice(0, 8),
    faqs: [
      {
        q: `Are there hiring employers in ${formattedName}?`,
        a: `Yes, Vcreateventures aggregates verified job postings across local companies and remote employers hiring candidates from ${formattedName}.`,
      },
    ],
  };
}


export interface Category { slug: string; title: string; description: string; group: string; icon: string; }
export const groups = [
  { slug: 'discounts', title: 'Student Discounts', description: 'Make everyday student life a little more affordable.', icon: 'wallet' },
  { slug: 'careers', title: 'Careers', description: 'Find your first role. Build what comes next.', icon: 'briefcase' },
  { slug: 'education', title: 'Education', description: 'Keep learning, with more ways to move forward.', icon: 'book' },
  { slug: 'opportunities', title: 'Opportunities', description: 'Meet people, explore ideas, and get involved.', icon: 'compass' },
];
const entries: [string, string, string, string, string][] = [
  ['discounts','food-drinks','Food & Drinks','Cafés, meals, and everyday essentials.','coffee'],
  ['discounts','banking','Banking & Finance','Student cards, cashback, and banking benefits.','wallet'],
  ['discounts','mobile-internet','Mobile & Internet','More data and student mobile plans.','smartphone'],
  ['discounts','electronics','Electronics & Technology','Technology for study and everyday life.','laptop'],
  ['discounts','entertainment','Entertainment','Cinema, culture, and time off.','ticket'],
  ['discounts','transportation','Transportation','Student fares and getting around Yerevan.','train'],
  ['discounts','shopping','Shopping & Retail','Student offers at shops and retailers.','bag'],
  ['discounts','sports','Sports & Fitness','Stay active, on a student budget.','activity'],
  ['discounts','software','Software & Digital Services','Useful tools for your next project.','code'],
  ['careers','internships','Internships','Practical experience to start your career.','briefcase'],
  ['careers','student-jobs','Student Jobs','Work opportunities for students.','briefcase'],
  ['careers','entry-level','Entry-Level & Junior Positions','Your first step into a professional role.','briefcase'],
  ['careers','part-time','Part-Time Jobs','Work that fits around your studies.','clock'],
  ['careers','remote','Remote Opportunities','Explore work beyond the office.','laptop'],
  ['education','free-courses','Free Courses','Build a new skill without a course fee.','book'],
  ['education','scholarships','Scholarships & Grants','Explore funding for your education.','graduation'],
  ['education','certifications','Certifications','Develop skills you can demonstrate.','book'],
  ['education','programs','Educational Programs','Discover new paths to learning.','graduation'],
  ['opportunities','competitions','Hackathons & Competitions','Put your ideas and abilities to the test.','code'],
  ['opportunities','events','Conferences & Workshops','Events, conversations, and new perspectives.','calendar'],
  ['opportunities','volunteering','Volunteering','Contribute your time to something meaningful.','compass'],
  ['opportunities','exchange','Exchange Programs','Experience learning in another setting.','globe'],
];
export const categories: Category[] = entries.map(([group, slug, title, description, icon]) => ({ group, slug, title, description, icon }));
export const categoryPath = (category: Category) => `/${category.group}/${category.slug}/`;

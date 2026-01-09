// Translation utility functions
import { useLanguage } from '@/components/i18n/LanguageSwitcher';

// Define translation resources
const TRANSLATIONS = {
  en: {
    // Navigation
    home: "Home",
    todoApp: "Todo App",
    about: "About",
    contact: "Contact",
    
    // Todo App
    addNewTask: "Add New Task",
    yourTasks: "Your Tasks",
    manageYourTasks: "Manage your tasks efficiently",
    
    // Todo Form
    taskTitle: "Task Title",
    taskDescription: "Description",
    priority: "Priority",
    low: "Low",
    medium: "Medium",
    high: "High",
    markAsCompleted: "Mark as Completed",
    addTodo: "Add Todo",
    
    // Todo List
    noTodosFound: "No todos found",
    tryADifferentSearch: "Try a different search.",
    searchTodos: "Search todos...",
    noTodosMatchFilters: "No todos match your filters for",
    
    // Buttons
    getStarted: "Get Started",
    learnMore: "Learn More",
    
    // About Page
    aboutTodoApp: "About TodoApp",
    learnMoreAboutOurMission: "Learn more about our mission and vision",
    ourStory: "Our Story",
    ourMission: "Our Mission",
    ourVision: "Our Vision",
    features: "Features",
    ourTeam: "Our Team",
    aboutOurCompany: "About Our Company",
    
    // Contact Page
    contactUs: "Contact Us",
    haveQuestions: "Have questions or feedback? Reach out to our team",
    getInTouch: "Get in Touch",
    email: "Email",
    phone: "Phone",
    office: "Office",
    sendUsAMessage: "Send us a message",
    connectWithUs: "Connect with us on social media",
    
    // Footer
    todoAppFooter: "TodoApp",
    allRightsReserved: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    footerContact: "Contact",
    
    // Theme
    toggleTheme: "Toggle theme",
    selectLanguage: "Select language",
    
    // Common
    loading: "Loading...",
    adding: "Adding...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    search: "Search",
    filter: "Filter",
    all: "All",
    active: "Active",
    completed: "Completed",
    allPriorities: "All Priorities",
    selectPriority: "Select Priority",
    
    // Todo Status
    completedStatus: "Completed",
    activeStatus: "Active",
    
    // Priority Levels
    lowPriority: "Low Priority",
    mediumPriority: "Medium Priority",
    highPriority: "High Priority",
    
    // Date/Time
    created: "Created",
    updated: "Updated",
    
    // Placeholders
    whatNeedsToBeDone: "What needs to be done?",
    addDetailsAboutThisTask: "Add details about this task...",
    
    // Validation Messages
    titleIsRequired: "Title is required",
    titleMustBeLessThan100Chars: "Title must be less than 100 characters",
    descriptionMustBeLessThan500Chars: "Description must be less than 500 characters",
    
    // Notifications
    todoAddedSuccessfully: "Todo added successfully!",
    failedToAddTodo: "Failed to add todo. Please try again.",
    todoUpdatedSuccessfully: "Todo updated successfully!",
    failedToUpdateTodo: "Failed to update todo. Please try again.",
    todoDeletedSuccessfully: "Todo deleted successfully!",
    failedToDeleteTodo: "Failed to delete todo. Please try again.",
    
    // Empty States
    noTasksYet: "No tasks yet",
    addYourFirstTask: "Add your first task to get started",
    
    // Footer Links
    aboutUs: "About Us",
    support: "Support",
    help: "Help",
    
    // Theme Options
    light: "Light",
    dark: "Dark",
    system: "System",
    
    // Language Names
    english: "English",
    urdu: "اردو",

    // Home Page
    welcomeToTodoApp: "Welcome to TodoApp",
    newFeature: "EXCLUSIVE FEATURE",
    modernAndVibrantTodoApp: "A modern and vibrant todo application to help you organize your life, boost productivity, and achieve your goals.",
    easyTaskManagement: "Easy Task Management",
    createAndUpdateTasks: "Create, update, and manage your tasks with a simple and intuitive interface.",
    modernUI: "Modern UI",
    enjoyBeautifulDesign: "Enjoy a beautiful, responsive design with dark/light mode support.",
    multiLanguage: "Multi-Language",
    availableInEnglishAndUrdu: "Available in English and Urdu to serve a diverse community.",

    // 404 Page
    pageNotFound: "Page Not Found",
    pageNotFoundDescription: "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.",
    goBackHome: "Go Back Home",
  },
  ur: {
    // Navigation
    home: "ہوم",
    todoApp: "کام کی فہرست",
    about: "ہم",
    contact: "رابطہ",
    
    // Todo App
    addNewTask: "نیا کام شامل کریں",
    yourTasks: "آپ کے کام",
    manageYourTasks: "اپنے کاموں کا بخوبی انتظام کریں",
    
    // Todo Form
    taskTitle: "کام کا عنوان",
    taskDescription: "تفصیل",
    priority: "اہمیت",
    low: "کم",
    medium: "درمیانہ",
    high: "زیادہ",
    markAsCompleted: "مکمل شدہ کے طور پر نشان زد کریں",
    addTodo: "کام شامل کریں",
    
    // Todo List
    noTodosFound: "کوئی کام نہیں ملا",
    tryADifferentSearch: "کوئی اور تلاش کریں.",
    searchTodos: "کاموں کی تلاش کریں...",
    noTodosMatchFilters: "آپ کے فلٹرز سے کوئی کام مماثل نہیں",
    
    // Buttons
    getStarted: "شروع کریں",
    learnMore: "مزید جانیں",
    
    // About Page
    aboutTodoApp: "TodoApp کے بارے میں",
    learnMoreAboutOurMission: "ہمارے مشن اور وژن کے بارے میں مزید جانیں",
    ourStory: "ہماری کہانی",
    ourMission: "ہمارا مشن",
    ourVision: "ہمارا وژن",
    features: "خصوصیات",
    ourTeam: "ہماری ٹیم",
    aboutOurCompany: "ہماری کمپنی کے بارے میں",
    
    // Contact Page
    contactUs: "ہم سے رابطہ کریں",
    haveQuestions: "سوالات یا تاثرات ہیں؟ ہماری ٹیم سے رابطہ کریں",
    getInTouch: "رابطے میں رہیں",
    email: "ای میل",
    phone: "فون",
    office: "دفتر",
    sendUsAMessage: "ہمیں ایک پیغام بھیجیں",
    connectWithUs: "ہمارے ساتھ سوشل میڈیا پر جڑیں",
    
    // Footer
    todoAppFooter: "TodoApp",
    allRightsReserved: "تمام حقوق محفوظ ہیں۔",
    privacyPolicy: "رازداری کی پالیسی",
    termsOfService: "سروس کی شرائط",
    footerContact: "رابطہ",
    
    // Theme
    toggleTheme: "تھیم تبدیل کریں",
    selectLanguage: "زبان منتخب کریں",
    
    // Common
    loading: "لوڈ ہو رہا ہے...",
    adding: "شامل کیا جا رہا ہے...",
    error: "خرابی",
    success: "کامیابی",
    cancel: "منسوخ کریں",
    save: "محفوظ کریں",
    delete: "حذف کریں",
    edit: "ترمیم",
    close: "بند کریں",
    search: "تلاش",
    filter: "فلٹر",
    all: "تمام",
    active: "فعال",
    completed: "مکمل",
    allPriorities: "تمام اہمیتیں",
    selectPriority: "اہمیت منتخب کریں",
    
    // Todo Status
    completedStatus: "مکمل",
    activeStatus: "فعال",
    
    // Priority Levels
    lowPriority: "کم اہمیت",
    mediumPriority: "درمیانہ اہمیت",
    highPriority: "زیادہ اہمیت",
    
    // Date/Time
    created: "تخلیق کردہ",
    updated: "تازہ کردہ",
    
    // Placeholders
    whatNeedsToBeDone: "کیا کرنا ہے؟",
    addDetailsAboutThisTask: "اس کام کے بارے میں تفصیلات شامل کریں...",
    
    // Validation Messages
    titleIsRequired: "عنوان درکار ہے",
    titleMustBeLessThan100Chars: "عنوان 100 حروف سے کم کا ہونا چاہیے",
    descriptionMustBeLessThan500Chars: "تفصیل 500 حروف سے کم کی ہونی چاہیے",
    
    // Notifications
    todoAddedSuccessfully: "کام کامیابی سے شامل ہو گیا!",
    failedToAddTodo: "کام شامل کرنے میں ناکامی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔",
    todoUpdatedSuccessfully: "کام کامیابی سے تازہ کر دیا گیا!",
    failedToUpdateTodo: "کام تازہ کرنے میں ناکامی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔",
    todoDeletedSuccessfully: "کام کامیابی سے حذف کر دیا گیا!",
    failedToDeleteTodo: "کام حذف کرنے میں ناکامی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔",
    
    // Empty States
    noTasksYet: "ابھی تک کوئی کام نہیں ہے",
    addYourFirstTask: "شروع کرنے کے لیے اپنا پہلا کام شامل کریں",
    
    // Footer Links
    aboutUs: "ہمارے بارے میں",
    support: "سپورٹ",
    help: "مدد",
    
    // Theme Options
    light: "ہلکا",
    dark: "تاریک",
    system: "سسٹم",
    
    // Language Names
    english: "انگریزی",
    urdu: "اردو",

    // Home Page
    welcomeToTodoApp: "TodoApp میں خوش آمدید",
    newFeature: "خصوصی فیچر",
    modernAndVibrantTodoApp: "آپ کی زندگی کو منظم کرنے، پیداواریت بڑھانے اور اپنے مقاصد حاصل کرنے میں مدد کے لیے ایک جدید اور زبردست کام کی فہرست کا اطلاقیہ۔",
    easyTaskManagement: "آسان کام کا انتظام",
    createAndUpdateTasks: "آسان اور سمجھدار انٹرفیس کے ساتھ اپنے کاموں کو بنائیں، اپ ڈیٹ کریں اور منظم کریں۔",
    modernUI: "جدید صارف انٹرفیس",
    enjoyBeautifulDesign: "خوبصورت، جواب دہ انداز اور ڈارک/ہلکے موڈ کی حمایت کے ساتھ ڈیزائن کا لطف اٹھائیں۔",
    multiLanguage: "کثیر زبانی",
    availableInEnglishAndUrdu: "متنوع برادری کی خدمت کے لیے انگریزی اور اردو میں دستیاب ہے۔",

    // 404 Page
    pageNotFound: "صفحہ نہیں ملا",
    pageNotFoundDescription: "معذرت، ہم وہ صفحہ نہیں ڈھونڈ سکے جسے آپ تلاش کر رہے تھے۔ یہ منتقل یا حذف کیا گیا ہو سکتا ہے۔",
    goBackHome: "واپس ہوم جائیں",
  }
};

// Translation hook
export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    const translations = TRANSLATIONS[currentLanguage as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
    return translations[key] || TRANSLATIONS.en[key] || key;
  };

  return { t, currentLanguage };
};
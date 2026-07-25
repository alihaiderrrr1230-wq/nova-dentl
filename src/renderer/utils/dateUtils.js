// أدوات التاريخ — هجري وميلادي
import moment from 'moment-hijri';

export const formatDate = (date, lang = 'ar') => {
  if (!date) return '';
  const d = new Date(date);
  if (lang === 'ar') {
    return d.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('ar-IQ', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getHijriDate = () => {
  return moment().format('iYYYY/iM/iD');
};

export const getMiladiDate = () => {
  return moment().format('YYYY/M/D');
};

export const getHijriDateAr = () => {
  const m = moment();
  const months = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  const day = m.iDate();
  const month = months[m.iMonth()];
  const year = m.iYear();
  return `${day} ${month} ${year}`;
};

export const getMiladiDateAr = () => {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const isAdult = (age) => {
  return age >= 10;
};

export const getAgeGroup = (age) => {
  return age >= 10 ? 'adult' : 'child';
};

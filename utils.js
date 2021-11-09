const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;

function parseDate(dateISOString) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const currentDate = new Date();
  const date = new Date(dateISOString);
  const difference = date - currentDate;
  const absDifference = Math.abs(difference);

  if (DAY > absDifference) {
    return rtf.format(Math.floor(difference / HOUR), 'hour');
  }

  if (WEEK > absDifference) {
    return rtf.format(Math.ceil(difference / DAY), 'day');
  }

  if (MONTH > absDifference) {
    return rtf.format(Math.ceil(difference / WEEK), 'week');
  }

  if (YEAR > absDifference) {
    return rtf.format(Math.ceil(difference / MONTH), 'month');
  }

  return rtf.format(Math.ceil(difference / YEAR), 'year');
}

// https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
function getContrastYIQ(hexColor) {
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? '#000000' : '#ffffff';
}

export { parseDate, getContrastYIQ };

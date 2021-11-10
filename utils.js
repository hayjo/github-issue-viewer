// @flow

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;

function formatHelper(time: number, timeUnit: string): number {
  const absTime = Math.abs(time);

  if (absTime > 1) {
    return `${absTime} ${timeUnit}s ago`;
  }

  switch (timeUnit) {
    case 'hour':
      return `${absTime} ${timeUnit} ago`;
    case 'day':
      return 'yesterday';
    case 'week':
      return 'last week';
    case 'month':
      return 'last month';
    case 'year':
      return 'year';
  }
}

function parseDate(dateISOString: string): string {
  let formatTime: function;

  if (typeof Intl === 'object' && Intl?.hasOwnProperty('RelativeTimeFormat')) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    formatTime = rtf.format.bind(rtf);
  } else {
    formatTime = formatHelper;
  }

  const currentDate = new Date();
  const date = new Date(dateISOString);
  const difference = date - currentDate;
  const absDifference = Math.abs(difference);

  if (DAY > absDifference) {
    return formatTime(Math.floor(difference / HOUR), 'hour');
  }

  if (WEEK > absDifference) {
    return formatTime(Math.ceil(difference / DAY), 'day');
  }

  if (MONTH > absDifference) {
    return formatTime(Math.ceil(difference / WEEK), 'week');
  }

  if (YEAR > absDifference) {
    return formatTime(Math.ceil(difference / MONTH), 'month');
  }

  return formatTime(Math.ceil(difference / YEAR), 'year');
}

// https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
function getContrastYIQ(hexColor: string): string {
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? '#000000' : '#ffffff';
}

export { parseDate, getContrastYIQ };

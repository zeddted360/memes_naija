export const timeAgo = (currDate:any, createdDate:any) => {
    let postedAt;
    let timeDiff = currDate - createdDate;
    
  let sec = Math.floor(timeDiff / 1000);
  let min = Math.floor(sec / 60);
  let hrs = Math.floor(min / 60);
  let days = Math.floor(hrs / 24);
  let months = Math.floor(days / 30);
  let yrs = Math.floor(months / 12);

  switch (true) {
    case sec < 60:
      postedAt = sec <= 0 ? `now` : `${sec}s ago`;
      break;
    case min < 60:
      postedAt = min == 1 ? `${min}min ago` : `${min}mins ago`;
      break;
    case hrs < 24:
      postedAt = hrs == 1 ? `${hrs}hr ago` : `${hrs}hrs ago`;
      break;
    case days < 30:
      postedAt = days == 1 ? `${days}day ago` : `${days}days ago`;
      break;
    case months < 12:
      postedAt = months == 1 ? `${months}month ago` : `${months}months ago`;
      break;
    default:
      postedAt = yrs == 1 ? `${yrs}yr ago` : `${yrs}yrs ago`;
  }

  return postedAt;
};

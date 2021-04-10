export enum Icon {
  Inbox,
  Reveal,
  Scheduled,
  Someday,
  Today,
  Stakeholder,
}

export const RenderIcon = (icon: Icon, title = '', description = ''): HTMLElement => {
  const svg = svgForIcon(icon)(title, description);
  return parser.parseFromString(svg, 'text/xml').documentElement;
};

const parser = new DOMParser();

const svgForIcon = (icon: Icon): ((arg0: string, arg1: string) => string) => {
  switch (icon) {
    case Icon.Inbox:
      return inboxIcon;
    case Icon.Reveal:
      return revealIcon;
    case Icon.Scheduled:
      return scheduledIcon;
    case Icon.Someday:
      return somedayIcon;
    case Icon.Today:
      return todayIcon;
    case Icon.Stakeholder:
      return stakeholderIcon;
  }
};

const inboxIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19v3zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14v9z"/>
</svg>
`;

const revealIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" role="img" aria-label="${
  title + description
}">
  <title>${title}</title>
  <description>${description}</description>
  <rect fill="none" height="24" width="24"/><path d="M9,5v2h6.59L4,18.59L5.41,20L17,8.41V15h2V5H9z"/>
</svg>
`;

const scheduledIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zm0-13H4V5h16v3z"/>
</svg>
`;

const somedayIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" aria-label="${
  title + description
}">
  <title>${title}</title>
  <description>${description}</description>
  <g><rect fill="none" height="24" width="24"/></g>
  <g><g><path d="M20,2H4C3,2,2,2.9,2,4v3.01C2,7.73,2.43,8.35,3,8.7V20c0,1.1,1.1,2,2,2h14c0.9,0,2-0.9,2-2V8.7c0.57-0.35,1-0.97,1-1.69V4 C22,2.9,21,2,20,2z M19,20H5V9h14V20z M20,7H4V4h16V7z"/><rect height="2" width="6" x="9" y="12"/></g></g>
</svg>
`;

const todayIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
</svg>
`;

const stakeholderIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 16 24" width="16" height="24" viewBox="0 0 16 24" aria-label="${title + description}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v16H0V0z" fill="none"/>
  <path  d="M 12.041617 0.379395 C 14.783072 -0.385254 17.844596 0.648438 20.335563 2.021973 C 22.826529 3.395508 25.707145 5.746094 26.973502 8.606445 C 28.23986 11.480957 28.921744 16.182129 27.933707 19.226562 C 26.94567 22.270996 23.744986 25.471191 21.059195 26.901367 C 18.359488 28.345703 14.68566 28.628906 11.777213 27.864258 C 8.868766 27.099609 5.584586 24.635742 3.566764 22.299316 C 1.562858 19.962891 -0.246224 16.960938 -0.301889 13.874023 C -0.357553 10.787109 0.811393 6.128418 3.204947 3.806152 C 5.598502 1.483887 11.888541 0.379395 14.087272 -0.0737305 C 16.299918 -0.526855 16.480826 0.761719 16.439078 1.059082 M 18.902213 -0.201172 C 21.629752 0.308594 25.484488 3.62207 26.94567 6.397461 C 28.420768 9.172852 28.532096 13.52002 27.697135 16.422852 C 26.87609 19.325684 24.245963 22.101074 21.963736 23.814453 C 19.68151 25.513672 17.134879 26.349121 14.031608 26.660645 C 10.942252 26.958008 5.821158 27.524414 3.385856 25.655273 C 0.950553 23.800293 -0.580209 18.476074 -0.594125 15.488281 C -0.608041 12.500488 1.72985 10.022461 3.30236 7.728516 C 4.874869 5.43457 6.113395 2.970703 8.840934 1.724609 C 11.568473 0.478516 18.053336 0.237793 19.639762 0.237793 C 21.226188 0.223633 18.526481 1.512207 18.38732 1.696289 " transform="matrix(0.280702,0,0,0.275862,3.237084,2.758621)"/>
  <path  d="M -0.260884 -17.497731 C -0.664449 -21.207692 -3.405904 -34.730641 -2.779683 -39.941578 C -2.153463 -45.152516 0.114848 -46.894215 3.482524 -48.749196 C 6.8502 -50.590016 13.098491 -51.467946 17.440287 -51.028981 C 21.782084 -50.590016 27.042338 -51.694508 29.519389 -46.129567 C 31.99644 -40.564625 37.242778 -22.595387 32.27476 -17.639332 C 27.320659 -12.683278 5.124614 -16.50652 -0.246968 -16.393238 M -1.513326 -18.729664 C -1.555074 -22.708668 -1.193257 -36.727223 -0.469625 -41.499196 C 0.254008 -46.257008 -0.107808 -45.888844 2.814555 -47.290699 C 5.736918 -48.692555 12.305278 -50.09441 17.092387 -49.938649 C 21.86558 -49.768727 29.268901 -51.538746 31.523295 -46.313649 C 33.77769 -41.088551 35.753764 -23.430836 30.590922 -18.602223 C 25.441996 -13.77361 5.820414 -17.582692 0.601909 -17.356129 " transform="matrix(0.280702,0,0,0.275862,3.612293,25.350398)"/>
</svg>
`;

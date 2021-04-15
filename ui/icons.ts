export enum Icon {
  Inbox,
  Reveal,
  Scheduled,
  Someday,
  Today,
  Stakeholder,
  Aging,
}

export const RenderIcon = (
  icon: Icon,
  title = '',
  description = '',
): HTMLElement => {
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
    case Icon.Aging:
      return agingIcon;
  }
};

const inboxIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${
  title + description
}">
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
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${
  title + description
}">
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
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${
  title + description
}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
</svg>
`;

const stakeholderIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 16 24" width="16" height="24" viewBox="0 0 16 24" aria-label="${
  title + description
}">
  <title>${title}</title>
  <description>${description}</description>
  <path d="M0 0h24v16H0V0z" fill="none"/>
  <path  d="M 12.041617 0.379395 C 14.783072 -0.385254 17.844596 0.648438 20.335563 2.021973 C 22.826529 3.395508 25.707145 5.746094 26.973502 8.606445 C 28.23986 11.480957 28.921744 16.182129 27.933707 19.226562 C 26.94567 22.270996 23.744986 25.471191 21.059195 26.901367 C 18.359488 28.345703 14.68566 28.628906 11.777213 27.864258 C 8.868766 27.099609 5.584586 24.635742 3.566764 22.299316 C 1.562858 19.962891 -0.246224 16.960938 -0.301889 13.874023 C -0.357553 10.787109 0.811393 6.128418 3.204947 3.806152 C 5.598502 1.483887 11.888541 0.379395 14.087272 -0.0737305 C 16.299918 -0.526855 16.480826 0.761719 16.439078 1.059082 M 18.902213 -0.201172 C 21.629752 0.308594 25.484488 3.62207 26.94567 6.397461 C 28.420768 9.172852 28.532096 13.52002 27.697135 16.422852 C 26.87609 19.325684 24.245963 22.101074 21.963736 23.814453 C 19.68151 25.513672 17.134879 26.349121 14.031608 26.660645 C 10.942252 26.958008 5.821158 27.524414 3.385856 25.655273 C 0.950553 23.800293 -0.580209 18.476074 -0.594125 15.488281 C -0.608041 12.500488 1.72985 10.022461 3.30236 7.728516 C 4.874869 5.43457 6.113395 2.970703 8.840934 1.724609 C 11.568473 0.478516 18.053336 0.237793 19.639762 0.237793 C 21.226188 0.223633 18.526481 1.512207 18.38732 1.696289 " transform="matrix(0.280702,0,0,0.275862,3.237084,2.758621)"/>
  <path  d="M -0.260884 -17.497731 C -0.664449 -21.207692 -3.405904 -34.730641 -2.779683 -39.941578 C -2.153463 -45.152516 0.114848 -46.894215 3.482524 -48.749196 C 6.8502 -50.590016 13.098491 -51.467946 17.440287 -51.028981 C 21.782084 -50.590016 27.042338 -51.694508 29.519389 -46.129567 C 31.99644 -40.564625 37.242778 -22.595387 32.27476 -17.639332 C 27.320659 -12.683278 5.124614 -16.50652 -0.246968 -16.393238 M -1.513326 -18.729664 C -1.555074 -22.708668 -1.193257 -36.727223 -0.469625 -41.499196 C 0.254008 -46.257008 -0.107808 -45.888844 2.814555 -47.290699 C 5.736918 -48.692555 12.305278 -50.09441 17.092387 -49.938649 C 21.86558 -49.768727 29.268901 -51.538746 31.523295 -46.313649 C 33.77769 -41.088551 35.753764 -23.430836 30.590922 -18.602223 C 25.441996 -13.77361 5.820414 -17.582692 0.601909 -17.356129 " transform="matrix(0.280702,0,0,0.275862,3.612293,25.350398)"/>
</svg>
`;

const agingIcon = (title: string, description: string): string => `
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-label="${
  title + description
}">
  <title>${title}</title>
  <description>${description}</description>
  <g id="surface1">
  <path style="fill-rule:evenodd;fill-opacity:1;stroke-width:16;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 254.333333 461.166667 C 125 283.833333 172.833333 22.333333 518.5 18.333333 C 864.666667 17.666667 924.666667 295.833333 792.833333 449.666667 C 801.333333 531.5 801.5 600.333333 738.5 618.333333 C 712.833333 726.333333 722.5 794.5 707.166667 829.666667 C 635.333333 956.666667 410.833333 962.5 340 831.166667 C 323.666667 790 337.5 722.5 305.666667 612.166667 C 261.833333 595.166667 248.833333 542.666667 254.333333 461.166667 Z M 254.333333 238.333333 C 236.666667 279 245.166667 305 261.666667 348.5 C 272 375.333333 259.5 429.166667 254.333333 461.166667 M 797.166667 238.333333 C 809.5 264 807.166667 289.833333 790.166667 342.333333 C 778.5 372.833333 790.166667 419.166667 792.833333 449.666667 M 394.5 693.833333 C 384 658.666667 342 623.5 305.666667 612.166667 M 655.333333 692 C 672 650 694.5 620 738.5 618.333333 " transform="matrix(0.0234375,0,0,0.0234375,0,0)"/>
  <path style="fill:none;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 340 626 C 361 674 372.333333 725.833333 380 779 C 428.166667 840 594.166667 858 665 776 C 669.833333 725.166667 687.666667 675.666667 704 626 L 655.333333 692 C 649.666667 733.166667 402 730.5 394.5 693.833333 Z M 403.5 798 L 403.5 706 M 432 815 L 433 714 M 462.5 822 L 463 719 M 492.5 827.5 C 492.5 825.5 493 721.5 493 721.5 M 523.5 831 L 523 722.5 M 554.5 827 L 554 722 M 583 822.5 L 582 719 M 615.5 810.5 L 614 715 M 644 794 L 643 705.5 M 642 750.5 C 560.5 786 487.833333 788.5 404 750.5 " transform="matrix(0.0234375,0,0,0.0234375,0,0)"/>
  <path style=" stroke:none;fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 7.25 9.789062 C 7.113281 10.28125 7.207031 10.910156 7.382812 11.460938 C 7.605469 12.152344 8.105469 12.566406 8.953125 12.632812 C 9.929688 12.65625 10.554688 12.089844 10.96875 11.179688 C 11.082031 10.90625 11.15625 10.445312 11.039062 9.9375 C 10.96875 9.679688 10.644531 9.296875 10.328125 9.101562 C 9.753906 8.753906 7.472656 8.949219 7.25 9.789062 Z M 17.339844 9.726562 C 17.472656 10.21875 17.378906 10.847656 17.203125 11.398438 C 16.984375 12.089844 16.480469 12.503906 15.632812 12.570312 C 14.65625 12.59375 14.035156 12.027344 13.617188 11.117188 C 13.503906 10.84375 13.429688 10.382812 13.546875 9.875 C 13.617188 9.617188 13.941406 9.234375 14.257812 9.035156 C 14.835938 8.691406 17.113281 8.886719 17.339844 9.726562 Z M 12.035156 12 L 12.035156 14.765625 C 11.625 15.386719 11.484375 15.433594 11.25 15.421875 C 10.941406 15.421875 10.734375 14.964844 10.792969 14.4375 C 10.945312 12.769531 11.449219 12.425781 12.035156 12 Z M 12.453125 12.011719 L 12.453125 14.777344 C 12.863281 15.398438 13.003906 15.445312 13.238281 15.433594 C 13.542969 15.433594 13.75 14.976562 13.695312 14.449219 C 13.542969 12.78125 13.039062 12.4375 12.453125 12.011719 Z M 12.453125 12.011719 "/>
  </g>
</svg>
`;

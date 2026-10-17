import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const P = (d, k) => <Path key={k} d={d} />;
const ICONS = {
  home: [P('M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z')],
  calendar: [<Rect key="a" x="3" y="5" width="18" height="16" rx="3" />, P('M3 10h18M8 3v4M16 3v4', 'b')],
  users: [<Circle key="a" cx="9" cy="8" r="3.5" />, P('M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6', 'b'), P('M15.5 4.8a3.3 3.3 0 0 1 0 6.4M17.5 14.2c2.4.6 4 2.6 4 5.8', 'c')],
  user: [<Circle key="a" cx="12" cy="8" r="4" />, P('M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7', 'b')],
  plus: [P('M12 5v14M5 12h14')],
  x: [P('M6 6l12 12M18 6 6 18')],
  camera: [P('M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z'), <Circle key="b" cx="12" cy="13.5" r="3.5" />],
  mic: [<Rect key="a" x="9" y="3" width="6" height="11" rx="3" />, P('M5 11a7 7 0 0 0 14 0M12 18v3', 'b')],
  trash: [P('M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3')],
  edit: [P('M4 20h4L19 9l-4-4L4 16zM13 7l4 4')],
  search: [<Circle key="a" cx="11" cy="11" r="7" />, P('M20 20l-4-4', 'b')],
  scissors: [<Circle key="a" cx="6" cy="6" r="2.5" />, <Circle key="b" cx="6" cy="18" r="2.5" />, P('M8 8l12 12M8 16 20 4', 'c')],
  clock: [<Circle key="a" cx="12" cy="12" r="9" />, P('M12 7v5l3 2', 'b')],
  logout: [P('M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9')],
  lock: [<Rect key="a" x="5" y="11" width="14" height="10" rx="2" />, P('M8 11V8a4 4 0 0 1 8 0v3', 'b')],
  mail: [<Rect key="a" x="3" y="5" width="18" height="14" rx="2" />, P('M3 7l9 6 9-6', 'b')],
  phone: [P('M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z')],
  eye: [P('M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z'), <Circle key="b" cx="12" cy="12" r="3" />],
  back: [P('M15 5l-7 7 7 7')],
  next: [P('M9 5l7 7-7 7')],
  grid: [<Rect key="a" x="4" y="4" width="7" height="7" rx="1.5" />, <Rect key="b" x="13" y="4" width="7" height="4" rx="1.5" />, <Rect key="c" x="4" y="13" width="7" height="4" rx="1.5" />, <Rect key="d" x="13" y="11" width="7" height="9" rx="1.5" />],
  check: [P('M5 12.5l4.5 4.5L19 7')],
  flip: [P('M20 8a8 8 0 0 0-14-2M4 4v4h4M4 16a8 8 0 0 0 14 2M20 20v-4h-4')],
};
const FILLED = {
  play: <Path d="M7 4l13 8-13 8z" />,
  stop: <Rect x="6" y="6" width="12" height="12" rx="2.5" />,
  pause: <><Rect x="6" y="5" width="4" height="14" rx="1" /><Rect x="14" y="5" width="4" height="14" rx="1" /></>,
};

export default function Icon({ name, size = 22, color = '#14161A', stroke = 1.8 }) {
  if (FILLED[name]) {
    return <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>{FILLED[name]}</Svg>;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {React.Children.toArray(ICONS[name])}
    </Svg>
  );
}

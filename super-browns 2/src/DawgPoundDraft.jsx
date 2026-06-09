import { useState, useCallback } from "react";
import { supabase } from "./supabaseClient.js";

// ─── COMPLETE BROWNS DATA 1999-2025 ───────────────────────────────────────────
// Each year has all pickable options across every position slot
const BROWNS_DATA = {
  1999: {
    QB: [
      { name: "Tim Couch", stats: "2,447 yds, 15 TD, 13 INT, 73.0 passer rating. Led expansion Browns to 2-14 record. Promising flashes but overwhelmed." },
    ],
    RB: [
      { name: "Terry Kirby", stats: "452 rush yds, 3.5 ypc, 4 TD. Primary back on expansion roster." },
      { name: "Travis Prentice", stats: "379 rush yds, 3.8 ypc, 3 TD. Shared backfield duties." },
    ],
    WR: [
      { name: "Kevin Johnson", stats: "48 rec, 756 yds (15.8 avg), 4 TD. Emerged as a legitimate weapon." },
      { name: "Leslie Shepherd", stats: "30 rec, 414 yds, 2 TD. Reliable underneath option." },
      { name: "David Patten", stats: "21 rec, 285 yds, 2 TD. Speed threat." },
    ],
    TE: [
      { name: "Irv Smith", stats: "15 rec, 141 yds, 1 TD. Veteran presence on expansion team." },
    ],
    OL: [
      { name: "1999 Browns OL", stats: "Ranked 28th in pass protection, 24th run blocking. Allowed 53 sacks. Expansion-level unit with no identity." },
    ],
    DEF: [
      { name: "1999 Browns Defense", stats: "Pass D: 31st · Run D: 30th. League-worst expansion defense. Pass rush: Orpheus Roye (4 sacks). INTs: Corey Fuller (3), Antonio Langham (2). Top tacklers: Pedro Sauer (LB, 108 tackles), Wali Rainer (LB, 94)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "16/20 FG (80%), long 51. Steady rookie who would become franchise legend." },
    ],
    HC: [
      { name: "Chris Palmer", stats: "Career HC record: 5-27 (.156 win%). One of worst in NFL history." },
    ],
  },
  2000: {
    QB: [
      { name: "Tim Couch", stats: "1,483 yds, 8 TD, 9 INT, 73.1 rating. Missed 9 games with injury. Team went 3-13." },
    ],
    RB: [
      { name: "Travis Prentice", stats: "783 rush yds, 3.9 ypc, 2 TD. Best rusher on the team." },
      { name: "James Jackson", stats: "354 rush yds, 3.9 ypc, 3 TD. Promising backup." },
    ],
    WR: [
      { name: "Kevin Johnson", stats: "56 rec, 986 yds (17.6 avg), 4 TD. Pro Bowl-caliber output; best receiver on early Browns." },
      { name: "Dennis Northcutt", stats: "51 rec, 557 yds, 3 TD. Quick slot receiver." },
      { name: "Darrin Chiaverini", stats: "16 rec, 200 yds. Role player." },
    ],
    TE: [
      { name: "Irv Smith", stats: "20 rec, 165 yds. Veteran role player." },
      { name: "Aaron Shea", stats: "14 rec, 145 yds, 1 TD. Rookie with potential." },
    ],
    OL: [
      { name: "2000 Browns OL", stats: "Ranked 29th pass protection, 22nd run blocking. Allowed 48 sacks. Still very poor." },
    ],
    DEF: [
      { name: "2000 Browns Defense", stats: "Pass D: 29th · Run D: 28th. Still dreadful. Pass rush: Courtney Brown (4 sacks). INTs: Antoine Winfield (3), Corey Fuller (2). Top tacklers: Barry Gardner (LB, 119 tackles), Dwayne Rudd (LB, 102)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "19/24 FG (79.2%), long 52. Consistent kicker in an otherwise bleak season." },
    ],
    HC: [
      { name: "Chris Palmer", stats: "Career HC record: 5-27 (.156 win%). Only two seasons." },
    ],
  },
  2001: {
    QB: [
      { name: "Tim Couch", stats: "3,040 yds, 17 TD, 21 INT, 72.2 rating. High volume, high turnovers." },
      { name: "Kelly Holcomb", stats: "Backup QB. Limited regular season action in 2001. Later famously led 2002 wild card game." },
    ],
    RB: [
      { name: "James Jackson", stats: "554 rush yds, 3.9 ypc, 3 TD. Led team in rushing." },
      { name: "Jamel White", stats: "480 rush yds, 4.4 ypc, 3 TD. Efficient when used." },
    ],
    WR: [
      { name: "Kevin Johnson", stats: "73 rec, 1,097 yds (15.0 avg), 9 TD. Best season; underappreciated star, one of the best WRs in Browns history." },
      { name: "Dennis Northcutt", stats: "67 rec, 793 yds, 4 TD. Reliable underneath threat." },
      { name: "Quincy Morgan", stats: "33 rec, 544 yds, 4 TD. Deep threat." },
    ],
    TE: [
      { name: "Aaron Shea", stats: "30 rec, 264 yds, 2 TD. Steadily improving." },
    ],
    OL: [
      { name: "2001 Browns OL", stats: "Ranked 25th pass protection, 20th run blocking. Allowed 44 sacks. Below average." },
    ],
    DEF: [
      { name: "2001 Browns Defense", stats: "Pass D: 23rd · Run D: 20th. Modest improvement. Pass rush: Orpheus Roye (5 sacks), Courtney Brown (4). INTs: Corey Fuller (3). Top tacklers: Dwayne Rudd (LB, 115 tackles), Barry Gardner (LB, 103)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "22/28 FG (78.6%), long 56. Kept team competitive." },
    ],
    HC: [
      { name: "Butch Davis", stats: "Career HC record: 48-53 (.475 win%), including strong Miami (FL) college success." },
    ],
  },
  2002: {
    QB: [
      { name: "Tim Couch", stats: "2,842 yds, 18 TD, 16 INT, 79.7 rating. Career-best passer rating. Led team to playoffs (9-7)." },
      { name: "Kelly Holcomb", stats: "Backup regular season; started AFC Wild Card vs Pittsburgh: 431 yds, 3 TD, 4 INT, 86.4 passer rating. Led 24-point comeback before 36-33 heartbreak. One of the greatest individual performances in Browns history." },
    ],
    RB: [
      { name: "William Green", stats: "887 rush yds, 4.3 ypc, 6 TD. Promising 1st-round rookie." },
      { name: "James Jackson", stats: "291 rush yds, 3.5 ypc, 2 TD. Backup role." },
    ],
    WR: [
      { name: "Dennis Northcutt", stats: "71 rec, 808 yds, 4 TD. Consistent slot threat." },
      { name: "Quincy Morgan", stats: "54 rec, 699 yds, 4 TD. Downfield threat." },
      { name: "Kevin Johnson", stats: "48 rec, 646 yds, 4 TD. Still producing despite injury." },
    ],
    TE: [
      { name: "Aaron Shea", stats: "37 rec, 343 yds, 2 TD. Reliable safety valve." },
    ],
    OL: [
      { name: "2002 Browns OL", stats: "Ranked 18th pass protection, 16th run blocking. League average. Improved dramatically from expansion years." },
    ],
    DEF: [
      { name: "2002 Browns Defense", stats: "Pass D: 15th · Run D: 12th. Carried team to playoffs. Pass rush: Courtney Brown (6 sacks), Kenard Lang (5.5). INTs: Anthony Henry (3). Top tacklers: Ben Taylor (LB, 127 tackles), Dwayne Rudd (LB, 108)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "16/20 FG (80%), clutch kicks helped secure playoff berth." },
    ],
    HC: [
      { name: "Butch Davis", stats: "Career HC record: 48-53 (.475 win%)." },
    ],
  },
  2003: {
    QB: [
      { name: "Jeff Garcia", stats: "2,067 yds, 16 TD, 10 INT, 80.0 rating. Efficient stopgap veteran." },
      { name: "Kelly Holcomb", stats: "1,797 yds, 10 TD, 12 INT, 72.3 rating in 9 starts. Competed with Garcia for the starting job all season." },
      { name: "Tim Couch", stats: "1,269 yds, 9 TD, 11 INT, 70.1 passer rating. Limited starts, last season with team." },
    ],
    RB: [
      { name: "William Green", stats: "559 rush yds, 3.6 ypc, 5 TD. Disappointing sophomore." },
      { name: "Lee Suggs", stats: "219 rush yds, 4.1 ypc. Change-of-pace back." },
    ],
    WR: [
      { name: "Dennis Northcutt", stats: "55 rec, 722 yds, 5 TD. Reliable slot." },
      { name: "Andre Davis", stats: "40 rec, 729 yds (18.2 avg!), 4 TD. Explosive big-play threat." },
      { name: "Quincy Morgan", stats: "22 rec, 260 yds. Declining role." },
    ],
    TE: [
      { name: "Aaron Shea", stats: "40 rec, 370 yds, 3 TD. Career year." },
    ],
    OL: [
      { name: "2003 Browns OL", stats: "Ranked 21st pass protection, 19th run blocking. Mediocre unit." },
    ],
    DEF: [
      { name: "2003 Browns Defense", stats: "Pass D: 18th · Run D: 16th. Around league average. Pass rush: Courtney Brown (5 sacks), Kenard Lang (4.5). INTs: Chris Crocker (3). Top tacklers: Ben Taylor (LB, 131 tackles), Kevin Bentley (LB, 104)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "20/24 FG (83.3%), long 54. Excellent." },
    ],
    HC: [
      { name: "Butch Davis", stats: "Career HC record: 48-53 (.475 win%)." },
    ],
  },
  2004: {
    QB: [
      { name: "Jeff Garcia", stats: "1,731 yds, 10 TD, 9 INT, 76.7 rating. Team fell apart mid-season." },
      { name: "Luke McCown", stats: "776 yds, 4 TD, 9 INT, 58.1 passer rating. Struggled badly as emergency starter." },
    ],
    RB: [
      { name: "Lee Suggs", stats: "745 rush yds, 4.0 ypc, 9 TD. Best Browns RB season of early era." },
    ],
    WR: [
      { name: "Dennis Northcutt", stats: "55 rec, 747 yds, 5 TD." },
      { name: "Quincy Morgan", stats: "32 rec, 431 yds, 2 TD." },
      { name: "Antonio Bryant", stats: "27 rec, 400 yds, 1 TD. Talented but troubled." },
    ],
    TE: [
      { name: "Aaron Shea", stats: "27 rec, 249 yds, 2 TD." },
    ],
    OL: [
      { name: "2004 Browns OL", stats: "Ranked 20th pass protection, 17th run blocking. Average." },
    ],
    DEF: [
      { name: "2004 Browns Defense", stats: "Pass D: 24th · Run D: 28th. Collapsed after Butch Davis resigned. Pass rush: Courtney Brown (4 sacks). INTs: Chris Crocker (3). Top tacklers: Ben Taylor (LB, 128 tackles), Kevin Bentley (LB, 106)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "18/22 FG (81.8%), long 55." },
    ],
    HC: [
      { name: "Terry Robiskie", stats: "Career HC record: 1-7 (.125 win%). Interim only after Butch Davis quit." },
    ],
  },
  2005: {
    QB: [
      { name: "Trent Dilfer", stats: "2,321 yds, 11 TD, 12 INT, 74.7 rating. Steady veteran." },
      { name: "Charlie Frye", stats: "1,913 yds, 10 TD, 13 INT, 69.3 passer rating. Turnover-prone in spot starts." },
    ],
    RB: [
      { name: "Reuben Droughns", stats: "1,232 rush yds, 4.0 ypc, 2 TD. Workhorse back, team's offensive catalyst." },
    ],
    WR: [
      { name: "Dennis Northcutt", stats: "50 rec, 567 yds, 4 TD." },
      { name: "Antonio Bryant", stats: "45 rec, 622 yds, 4 TD." },
      { name: "Braylon Edwards", stats: "32 rec, 512 yds, 3 TD. Electrifying rookie." },
    ],
    TE: [
      { name: "Steve Heiden", stats: "44 rec, 449 yds, 3 TD. Career year." },
    ],
    OL: [
      { name: "2005 Browns OL", stats: "Ranked 22nd pass protection, 14th run blocking. Solid run blocking." },
    ],
    DEF: [
      { name: "2005 Browns Defense", stats: "Pass D: 20th · Run D: 12th. Solid, above average. Pass rush: Willie McGinest (5.5 sacks), Kenard Lang (4). INTs: Daven Holly (3). Top tacklers: Ben Taylor (LB, 119 tackles), Willie McGinest (LB, 81)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "22/26 FG (84.6%). Strong season." },
    ],
    HC: [
      { name: "Romeo Crennel", stats: "Career HC record: 24-40 (.375 win%)." },
    ],
  },
  2006: {
    QB: [
      { name: "Charlie Frye", stats: "1,983 yds, 10 TD, 17 INT, 65.3 rating. Benched week 1 following year." },
      { name: "Derek Anderson", stats: "783 yds, 5 TD, 4 INT, 81.0 passer rating in relief. Hinted at 2007 explosion." },
    ],
    RB: [
      { name: "Reuben Droughns", stats: "527 rush yds, 3.5 ypc. Declined from 2005." },
      { name: "Jason Wright", stats: "308 rush yds, 3.8 ypc. Role player." },
    ],
    WR: [
      { name: "Braylon Edwards", stats: "61 rec, 884 yds, 6 TD. Breakout year." },
      { name: "Dennis Northcutt", stats: "44 rec, 509 yds, 3 TD." },
      { name: "Joe Jurevicius", stats: "40 rec, 495 yds, 4 TD. Reliable vet." },
    ],
    TE: [
      { name: "Kellen Winslow Jr.", stats: "89 rec, 875 yds (9.8 avg), 6 TD. Pro Bowl-caliber. Best Browns TE season to that point." },
    ],
    OL: [
      { name: "2006 Browns OL", stats: "Ranked 24th pass protection, 21st run blocking. Below average." },
    ],
    DEF: [
      { name: "2006 Browns Defense", stats: "Pass D: 26th · Run D: 29th. Very poor. Pass rush: Kamerion Wimbley (11 sacks, Pro Bowl rookie). INTs: Leigh Bodden (3). Top tacklers: D'Qwell Jackson (LB, 126 tackles), Andra Davis (LB, 102)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "20/23 FG (87%), long 56. Excellent." },
    ],
    HC: [
      { name: "Romeo Crennel", stats: "Career HC record: 24-40 (.375 win%)." },
    ],
  },
  2007: {
    QB: [
      { name: "Derek Anderson", stats: "3,787 yds, 29 TD, 19 INT, 82.5 rating. Career year — Pro Bowl. Team went 10-6." },
      { name: "Brady Quinn", stats: "Minimal action as rookie backup." },
    ],
    RB: [
      { name: "Jamal Lewis", stats: "1,304 rush yds, 4.0 ypc, 9 TD. Veteran workhorse." },
      { name: "Jason Wright", stats: "293 rush yds. Backup role player." },
    ],
    WR: [
      { name: "Braylon Edwards", stats: "80 rec, 1,289 yds (16.1 avg), 16 TD. Best WR season in Browns history. Historic production." },
      { name: "Joe Jurevicius", stats: "50 rec, 614 yds, 5 TD." },
      { name: "Donte Stallworth", stats: "46 rec, 697 yds, 7 TD. Devastating complement to Edwards." },
    ],
    TE: [
      { name: "Kellen Winslow Jr.", stats: "82 rec, 1,106 yds (13.5 avg), 5 TD. Pro Bowl. Dominant TE in prime." },
    ],
    OL: [
      { name: "2007 Browns OL", stats: "Ranked 10th pass protection, 8th run blocking. Best Browns OL of modern era. Joe Thomas' transcendent rookie year at LT." },
    ],
    DEF: [
      { name: "2007 Browns Defense", stats: "Pass D: 14th · Run D: 10th. Solid unit. Fueled 10-6 season. Pass rush: Kamerion Wimbley (8 sacks), Simon Fraser (5). INTs: Eric Wright (4). Top tacklers: D'Qwell Jackson (LB, 141 tackles), Andra Davis (LB, 99)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "26/30 FG (86.7%), long 56. Outstanding." },
    ],
    HC: [
      { name: "Romeo Crennel", stats: "Career HC record: 24-40 (.375 win%)." },
    ],
  },
  2008: {
    QB: [
      { name: "Derek Anderson", stats: "2,583 yds, 9 TD, 15 INT, 58.0 rating. Complete collapse from 2007 Pro Bowl season." },
      { name: "Brady Quinn", stats: "1,090 yds, 4 TD, 6 INT, 65.4 passer rating in 7 starts." },
    ],
    RB: [
      { name: "Jamal Lewis", stats: "1,002 rush yds, 4.0 ypc, 4 TD. Carried offense." },
      { name: "Jerome Harrison", stats: "561 rush yds, 4.4 ypc, 4 TD. Efficient back." },
    ],
    WR: [
      { name: "Braylon Edwards", stats: "55 rec, 873 yds, 3 TD. Inconsistent." },
      { name: "Mohamed Massaquoi", stats: "Rookie minimal role." },
    ],
    TE: [
      { name: "Kellen Winslow Jr.", stats: "43 rec, 417 yds, 2 TD. Injuries limited him." },
    ],
    OL: [
      { name: "2008 Browns OL", stats: "Ranked 14th pass protection, 15th run blocking. Joe Thomas elite; rest average." },
    ],
    DEF: [
      { name: "2008 Browns Defense", stats: "Pass D: 21st · Run D: 25th. Underperformed. Pass rush: Kamerion Wimbley (5 sacks), Shaun Rogers (3). INTs: Brandon McDonald (3). Top tacklers: D'Qwell Jackson (LB, 138 tackles), Eric Barton (LB, 103)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "20/25 FG (80%), long 57." },
    ],
    HC: [
      { name: "Romeo Crennel", stats: "Career HC record: 24-40 (.375 win%)." },
    ],
  },
  2009: {
    QB: [
      { name: "Brady Quinn", stats: "1,335 yds, 4 TD, 7 INT, 66.7 passer rating. Never lived up to hype." },
      { name: "Derek Anderson", stats: "778 yds, 3 TD, 6 INT, 57.9 passer rating. Career in freefall." },
      { name: "Jake Delhomme", stats: "2 starts, 390 yds, 3 TD, 4 INT, 67.6 passer rating. Signed as veteran stopgap, never got traction." },
    ],
    RB: [
      { name: "Jerome Harrison", stats: "561 rush yds including a stunning 286-yard game. 3.8 ypc overall." },
      { name: "Jamal Lewis", stats: "373 rush yds in final season." },
    ],
    WR: [
      { name: "Mohamed Massaquoi", stats: "35 rec, 624 yds, 4 TD. Breakout." },
      { name: "Brian Robiskie", stats: "28 rec, 301 yds. Disappointing 2nd-round pick." },
    ],
    TE: [
      { name: "Steve Heiden", stats: "21 rec, 181 yds, 1 TD." },
    ],
    OL: [
      { name: "2009 Browns OL", stats: "Ranked 19th pass protection, 17th run blocking. Below average; Joe Thomas excellent as ever." },
    ],
    DEF: [
      { name: "2009 Browns Defense", stats: "Pass D: 28th · Run D: 30th. Terrible. Pass rush: David Bowens (5 sacks), Robaire Smith (3). INTs: Mike Adams (2). Top tacklers: D'Qwell Jackson (LB, 144 tackles), Eric Barton (LB, 109)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "20/23 FG (87%), long 53." },
    ],
    HC: [
      { name: "Eric Mangini", stats: "Career HC record: 23-41 (.359 win%)." },
    ],
  },
  2010: {
    QB: [
      { name: "Colt McCoy", stats: "2,732 yds, 14 TD, 11 INT, 74.5 rating. Solid rookie year." },
    ],
    RB: [
      { name: "Peyton Hillis", stats: "1,177 rush yds, 4.4 ypc, 11 TD. Madden cover winner. Fan favorite." },
      { name: "Chris Ogbonnaya", stats: "Limited role." },
    ],
    WR: [
      { name: "Mohamed Massaquoi", stats: "36 rec, 483 yds, 2 TD." },
      { name: "Brian Robiskie", stats: "34 rec, 310 yds." },
      { name: "Carlton Mitchell", stats: "25 rec, 307 yds." },
      { name: "Joshua Cribbs", stats: "41 rec, 485 yds, 3 TD. Primarily a return specialist but was a legitimate passing-game weapon when lined up at WR." },
    ],
    TE: [
      { name: "Benjamin Watson", stats: "68 rec, 763 yds, 3 TD. Best tight end on team by far." },
    ],
    OL: [
      { name: "2010 Browns OL", stats: "Ranked 16th pass protection, 9th run blocking. Strong run blocking powered Hillis' big year." },
    ],
    DEF: [
      { name: "2010 Browns Defense", stats: "Pass D: 16th · Run D: 11th. Above average. Pass rush: Jayme Mitchell (4.5 sacks), Marcus Benard (4). INTs: Eric Wright (4), Brodney Pool (3). Top tacklers: D'Qwell Jackson (LB, 156 tackles — led NFL), T.J. Ward (S, 106)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "21/27 FG (77.8%), long 55." },
    ],
    HC: [
      { name: "Eric Mangini", stats: "Career HC record: 23-41 (.359 win%)." },
    ],
  },
  2011: {
    QB: [
      { name: "Colt McCoy", stats: "2,733 yds, 14 TD, 11 INT, 74.6 rating. Concussion controversy." },
      { name: "Seneca Wallace", stats: "585 yds, 3 TD, 4 INT, 75.2 passer rating in 5 starts. Emergency starter after McCoy's concussion injury." },
    ],
    RB: [
      { name: "Peyton Hillis", stats: "587 rush yds, 3.4 ypc, 2 TD. Madden curse in full effect." },
      { name: "Montario Hardesty", stats: "420 rush yds, 4.4 ypc. Showed flashes." },
    ],
    WR: [
      { name: "Greg Little", stats: "61 rec, 709 yds, 2 TD. Promising rookie." },
      { name: "Mohamed Massaquoi", stats: "43 rec, 607 yds, 4 TD." },
      { name: "Chansi Stuckey", stats: "29 rec, 347 yds. Role player." },
    ],
    TE: [
      { name: "Benjamin Watson", stats: "43 rec, 501 yds, 4 TD." },
    ],
    OL: [
      { name: "2011 Browns OL", stats: "Ranked 21st pass protection, 22nd run blocking. Declined significantly." },
    ],
    DEF: [
      { name: "2011 Browns Defense", stats: "Pass D: 17th · Run D: 14th. Serviceable. Pass rush: Jabaal Sheard (7 sacks). INTs: Joe Haden (4), Sheldon Brown (3). Top tacklers: D'Qwell Jackson (LB, 129 tackles), T.J. Ward (S, 110)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "25/29 FG (86.2%), long 54." },
    ],
    HC: [
      { name: "Pat Shurmur", stats: "Career HC record: 11-36 (.234 win%)." },
    ],
  },
  2012: {
    QB: [
      { name: "Brandon Weeden", stats: "3,385 yds, 14 TD, 17 INT, 72.6 rating. Oldest ever first overall pick — 29 years old. Turnover issues." },
    ],
    RB: [
      { name: "Trent Richardson", stats: "950 rush yds, 3.6 ypc, 11 TD. #3 overall pick. Padded by TDs but below average efficiency." },
    ],
    WR: [
      { name: "Josh Gordon", stats: "50 rec, 805 yds (16.1 avg), 5 TD. Electric rookie on a bad team." },
      { name: "Greg Little", stats: "53 rec, 531 yds, 3 TD." },
      { name: "Travis Benjamin", stats: "23 rec, 399 yds, 2 TD. Special teams ace." },
    ],
    TE: [
      { name: "Benjamin Watson", stats: "46 rec, 557 yds, 3 TD." },
    ],
    OL: [
      { name: "2012 Browns OL", stats: "Ranked 19th pass protection, 18th run blocking. Average." },
    ],
    DEF: [
      { name: "2012 Browns Defense", stats: "Pass D: 14th · Run D: 8th. Best unit on the team. Pass rush: Jabaal Sheard (8.5 sacks). INTs: T.J. Ward (3), Joe Haden (3). Top tacklers: D'Qwell Jackson (LB, 152 tackles), T.J. Ward (S, 108)." },
    ],
    K: [
      { name: "Phil Dawson", stats: "26/32 FG (81.3%). Final season with Browns." },
    ],
    HC: [
      { name: "Pat Shurmur", stats: "Career HC record: 11-36 (.234 win%)." },
    ],
  },
  2013: {
    QB: [
      { name: "Brian Hoyer", stats: "1,100 yds, 5 TD, 3 INT before injury. 85.7 rating. Highly efficient." },
      { name: "Jason Campbell", stats: "1,633 yds, 9 TD, 4 INT, 85.6 passer rating as fill-in. Steady." },
      { name: "Thad Lewis", stats: "337 yds, 3 TD, 0 INT, 97.1 passer rating in 2 starts. Hot but barely played." },
    ],
    RB: [
      { name: "Willis McGahee", stats: "377 rush yds, 3.7 ypc, 4 TD. Thin backfield after Trent Richardson trade." },
    ],
    WR: [
      { name: "Josh Gordon", stats: "87 rec, 1,646 yds (18.9 avg), 9 TD. ALL-PRO. Historic: 5 straight 200-yd games. One of NFL's greatest WR seasons ever." },
      { name: "Greg Little", stats: "48 rec, 465 yds, 2 TD." },
      { name: "Andrew Hawkins", stats: "51 rec, 567 yds. Reliable slot receiver." },
      { name: "Davone Bess", stats: "51 rec, 507 yds. Consistent slot receiver before personal issues derailed his season." },
    ],
    TE: [
      { name: "Jordan Cameron", stats: "80 rec, 917 yds (11.5 avg), 7 TD. Pro Bowl. Elite season from undrafted player." },
    ],
    OL: [
      { name: "2013 Browns OL", stats: "Ranked 15th pass protection, 16th run blocking. Joe Thomas elite, rest improving." },
    ],
    DEF: [
      { name: "2013 Browns Defense", stats: "Pass D: 12th · Run D: 9th. Solid. Pass rush: Paul Kruger (11 sacks). INTs: Joe Haden (3), T.J. Ward (2). Top tacklers: Craig Robertson (LB, 109 tackles), Karlos Dansby (LB, 97)." },
    ],
    K: [
      { name: "Billy Cundiff", stats: "22/27 FG (81.5%)." },
    ],
    HC: [
      { name: "Rob Chudzinski", stats: "Career HC record: 4-12 (.250 win%). Fired after one season." },
    ],
  },
  2014: {
    QB: [
      { name: "Brian Hoyer", stats: "3,326 yds, 19 TD, 13 INT, 91.4 passer rating. Led Browns to 7-6 before being benched." },
      { name: "Johnny Manziel", stats: "1,675 yds, 7 TD, 5 INT, 74.4 passer rating in 8 starts." },
    ],
    RB: [
      { name: "Isaiah Crowell", stats: "607 rush yds, 3.8 ypc, 8 TD. Undrafted gem." },
      { name: "Ben Tate", stats: "390 rush yds, 3.5 ypc, 2 TD." },
      { name: "Duke Johnson", stats: "Versatile rookie, pass-catching specialist." },
    ],
    WR: [
      { name: "Andrew Hawkins", stats: "63 rec, 824 yds, 2 TD. Career year." },
      { name: "Miles Austin", stats: "47 rec, 568 yds, 3 TD." },
      { name: "Travis Benjamin", stats: "37 rec, 578 yds, 4 TD." },
    ],
    TE: [
      { name: "Jordan Cameron", stats: "24 rec, 424 yds, 3 TD. Injuries wrecked season." },
    ],
    OL: [
      { name: "2014 Browns OL", stats: "Ranked 10th pass protection, 12th run blocking. Joe Thomas Pro Bowl again. Above average unit." },
    ],
    DEF: [
      { name: "2014 Browns Defense", stats: "Pass D: 11th · Run D: 7th. Best defense of era. Pass rush: Paul Kruger (8 sacks), Desmond Bryant (5). INTs: Tashaun Gipson (6). Top tacklers: Karlos Dansby (LB, 127 tackles), Craig Robertson (LB, 104)." },
    ],
    K: [
      { name: "Travis Coons", stats: "17/20 FG (85%). Solid season." },
    ],
    HC: [
      { name: "Mike Pettine", stats: "Career HC record: 10-22 (.313 win%)." },
    ],
  },
  2015: {
    QB: [
      { name: "Josh McCown", stats: "2,109 yds, 12 TD, 4 INT, 93.3 rating before injury. Best career passer rating." },
      { name: "Johnny Manziel", stats: "1,500 yds, 7 TD, 5 INT, 71.9 passer rating. Inconsistent starter." },
    ],
    RB: [
      { name: "Isaiah Crowell", stats: "706 rush yds, 4.0 ypc, 4 TD." },
      { name: "Duke Johnson", stats: "617 scrimmage yds, 4.5 ypc, elite pass-catcher from backfield." },
    ],
    WR: [
      { name: "Travis Benjamin", stats: "68 rec, 966 yds (14.2 avg), 5 TD. Breakout year." },
      { name: "Brian Hartline", stats: "41 rec, 362 yds." },
      { name: "Andrew Hawkins", stats: "33 rec, 384 yds." },
    ],
    TE: [
      { name: "Gary Barnidge", stats: "79 rec, 1,043 yds (13.2 avg), 9 TD. Pro Bowl. Statistically best Browns TE ever." },
    ],
    OL: [
      { name: "2015 Browns OL", stats: "Ranked 17th pass protection, 20th run blocking. Average unit." },
    ],
    DEF: [
      { name: "2015 Browns Defense", stats: "Pass D: 22nd · Run D: 28th. Regressed badly. Pass rush: Nate Orchard (5 sacks). INTs: Donte Whitner (2), Tramon Williams (2). Top tacklers: Karlos Dansby (LB, 103 tackles), Donte Whitner (S, 88)." },
    ],
    K: [
      { name: "Travis Coons", stats: "27/33 FG (81.8%), long 53." },
    ],
    HC: [
      { name: "Mike Pettine", stats: "Career HC record: 10-22 (.313 win%)." },
    ],
  },
  2016: {
    QB: [
      { name: "Robert Griffin III", stats: "886 yds, 2 TD, 3 INT, 72.0 passer rating before season-ending injury." },
      { name: "Josh McCown", stats: "1,937 yds, 6 TD, 9 INT. Steady backup-level." },
      { name: "Cody Kessler", stats: "1,380 yds, 6 TD, 2 INT, 83.7 passer rating in 8 starts. Efficient but limited." },
    ],
    RB: [
      { name: "Isaiah Crowell", stats: "952 rush yds, 4.2 ypc, 7 TD. Best season." },
      { name: "Duke Johnson", stats: "714 receiving yds from backfield. Elite pass catcher." },
    ],
    WR: [
      { name: "Terrelle Pryor", stats: "77 rec, 1,007 yds (13.1 avg), 4 TD. Stunning WR conversion from QB." },
      { name: "Corey Coleman", stats: "33 rec, 413 yds, 3 TD. Rookie 1st-rounder." },
      { name: "Andrew Hawkins", stats: "33 rec, 324 yds." },
    ],
    TE: [
      { name: "Gary Barnidge", stats: "55 rec, 612 yds, 3 TD. Declined from 2015." },
    ],
    OL: [
      { name: "2016 Browns OL", stats: "Ranked 28th pass protection, 23rd run blocking. Poor. Joe Thomas only bright spot on 1-15 team." },
    ],
    DEF: [
      { name: "2016 Browns Defense", stats: "Pass D: 30th · Run D: 32nd. 1-15 defense. Pass rush: Emmanuel Ogbah (5.5 sacks). INTs: Ibraheim Campbell (2). Top tacklers: Christian Kirksey (LB, 138 tackles), Joe Schobert (LB, 101)." },
    ],
    K: [
      { name: "Cody Parkey", stats: "18/24 FG (75%). Inconsistent." },
    ],
    HC: [
      { name: "Hue Jackson", stats: "Career HC record: 11-53 (.172 win%). One of worst HC runs in NFL history." },
    ],
  },
  2017: {
    QB: [
      { name: "DeShone Kizer", stats: "2,894 yds, 11 TD, 22 INT, 60.5 rating. Started all 16 games of 0-16 season." },
    ],
    RB: [
      { name: "Isaiah Crowell", stats: "853 rush yds, 3.9 ypc, 3 TD." },
      { name: "Duke Johnson", stats: "693 receiving yds from backfield. The only bright spot on 0-16 team." },
    ],
    WR: [
      { name: "Josh Gordon", stats: "18 rec, 335 yds (18.6 avg!), 1 TD in limited action returning from suspension." },
      { name: "Corey Coleman", stats: "23 rec, 305 yds." },
      { name: "Ricardo Louis", stats: "27 rec, 357 yds, 2 TD." },
      { name: "Rashard Higgins", stats: "24 rec, 369 yds, 4 TD. Efficient under-the-radar option." },
    ],
    TE: [
      { name: "Seth DeValve", stats: "33 rec, 395 yds, 4 TD." },
      { name: "David Njoku", stats: "32 rec, 386 yds, 4 TD. Promising rookie." },
    ],
    OL: [
      { name: "2017 Browns OL", stats: "Ranked 30th pass protection, 26th run blocking. Terrible. Joe Thomas injured his triceps in what became his final play." },
    ],
    DEF: [
      { name: "2017 Browns Defense", stats: "Pass D: 29th · Run D: 31st. Historic 0-16 defense. Pass rush: Myles Garrett (7 sacks, 11 games — rookie). INTs: Jason McCourty (2). Top tacklers: Joe Schobert (LB, 144 tackles — led NFL), Christian Kirksey (LB, 131)." },
    ],
    K: [
      { name: "Zane Gonzalez", stats: "15/22 FG (68%). Rough rookie season." },
    ],
    HC: [
      { name: "Hue Jackson", stats: "Career HC record: 11-53 (.172 win%)." },
    ],
  },
  2018: {
    QB: [
      { name: "Baker Mayfield", stats: "3,725 yds, 27 TD, 14 INT, 93.7 rating. Record-setting rookie (most TD passes by a rookie at the time). 7-8-1 team." },
    ],
    RB: [
      { name: "Nick Chubb", stats: "996 rush yds, 5.2 ypc, 8 TD. Electric rookie. One of best rookie RB seasons in recent memory." },
      { name: "Duke Johnson", stats: "429 receiving yds from backfield." },
    ],
    WR: [
      { name: "Jarvis Landry", stats: "81 rec, 976 yds, 4 TD. Pro Bowl in first Browns season." },
      { name: "Antonio Callaway", stats: "43 rec, 586 yds, 5 TD. Promising rookie." },
      { name: "Breshad Perriman", stats: "16 rec, 340 yds, 3 TD. Big play threat." },
    ],
    TE: [
      { name: "David Njoku", stats: "56 rec, 639 yds, 4 TD. Breakout sophomore." },
    ],
    OL: [
      { name: "2018 Browns OL", stats: "Ranked 16th pass protection, 11th run blocking. Average to above average." },
    ],
    DEF: [
      { name: "2018 Browns Defense", stats: "Pass D: 19th · Run D: 17th. Average. Myles Garrett (13.5 sacks) emerging. Pass rush: Myles Garrett (13.5 sacks). INTs: Damarious Randall (4), T.J. Carrie (2). Top tacklers: Joe Schobert (LB, 137 tackles), Christian Kirksey (LB, 108)." },
    ],
    K: [
      { name: "Greg Joseph", stats: "19/23 FG (82.6%). Solid fill-in." },
    ],
    HC: [
      { name: "Gregg Williams", stats: "Interim HC record: 5-3 (.625 win%). Defensive coordinator who stabilized the team after Hue Jackson's mid-season dismissal." },
    ],
  },
  2019: {
    QB: [
      { name: "Baker Mayfield", stats: "3,827 yds, 22 TD, 21 INT, 78.8 rating. Regressed under Kitchens." },
    ],
    RB: [
      { name: "Nick Chubb", stats: "1,494 rush yds, 5.0 ypc, 8 TD. Top-3 RB in NFL. True workhorse." },
      { name: "Kareem Hunt", stats: "179 rush yds in limited action returning from suspension." },
    ],
    WR: [
      { name: "Jarvis Landry", stats: "83 rec, 1,174 yds (14.1 avg), 6 TD. Pro Bowl." },
      { name: "Odell Beckham Jr.", stats: "74 rec, 1,035 yds, 4 TD. Debut Browns season after blockbuster trade." },
      { name: "Rashard Higgins", stats: "29 rec, 599 yds, 4 TD. Efficient secondary option." },
    ],
    TE: [
      { name: "David Njoku", stats: "5 rec, 41 yds. Season-ending injury in Week 2." },
      { name: "Demetrius Harris", stats: "16 rec, 189 yds. TE2 depth." },
    ],
    OL: [
      { name: "2019 Browns OL", stats: "Ranked 13th pass protection, 7th run blocking. Excellent run blocking for Chubb." },
    ],
    DEF: [
      { name: "2019 Browns Defense", stats: "Pass D: 20th · Run D: 25th. Below average. Pass rush: Myles Garrett (10 sacks, suspended wk 11), Olivier Vernon (7.5). INTs: Denzel Ward (3). Top tacklers: Mack Wilson (LB, 121 tackles), Joe Schobert (LB, 117)." },
    ],
    K: [
      { name: "Austin Seibert", stats: "20/23 FG (87%). Decent rookie." },
    ],
    HC: [
      { name: "Freddie Kitchens", stats: "Career HC record: 6-10 (.375 win%). One tumultuous season." },
    ],
  },
  2020: {
    QB: [
      { name: "Baker Mayfield", stats: "3,563 yds, 26 TD, 8 INT, 95.9 rating. Bounce-back year. Led team to playoffs (11-5)." },
    ],
    RB: [
      { name: "Nick Chubb", stats: "1,067 rush yds, 5.6 ypc, 12 TD. Missed 4 games with injury but still elite." },
      { name: "Kareem Hunt", stats: "841 scrimmage yds, 11 TD. Elite 1-2 punch with Chubb." },
    ],
    WR: [
      { name: "Jarvis Landry", stats: "72 rec, 840 yds, 3 TD." },
      { name: "Rashard Higgins", stats: "37 rec, 599 yds, 4 TD." },
      { name: "Odell Beckham Jr.", stats: "23 rec, 319 yds before torn ACL in Week 7." },
    ],
    TE: [
      { name: "Austin Hooper", stats: "46 rec, 435 yds, 4 TD." },
      { name: "Harrison Bryant", stats: "24 rec, 238 yds, 3 TD. Promising rookie." },
    ],
    OL: [
      { name: "2020 Browns OL", stats: "Ranked 1st pass protection AND 1st run blocking per PFF. Best OL in NFL. PFF grade 86.4 pass, 81.4 run. Jedrick Wills rookie season." },
    ],
    DEF: [
      { name: "2020 Browns Defense", stats: "Pass D: 15th · Run D: 12th. Solid playoff team defense. Pass rush: Myles Garrett (12 sacks). INTs: Karl Joseph (3), Denzel Ward (2). Top tacklers: B.J. Goodson (LB, 126 tackles), Sione Takitaki (LB, 98)." },
    ],
    K: [
      { name: "Cody Parkey", stats: "24/29 FG (82.8%). Reliable after rocky 2016." },
    ],
    HC: [
      { name: "Kevin Stefanski", stats: "Career HC record: 45-56 (.445 win%). Won Coach of the Year 2020, 2023. Two playoff appearances." },
    ],
  },
  2021: {
    QB: [
      { name: "Baker Mayfield", stats: "3,010 yds, 17 TD, 13 INT, 83.1 rating. Played through torn labrum in shoulder all season." },
    ],
    RB: [
      { name: "Nick Chubb", stats: "1,259 rush yds, 4.9 ypc, 8 TD. Elite back even behind an aging line." },
      { name: "Kareem Hunt", stats: "386 rush yds, versatile role player." },
    ],
    WR: [
      { name: "Jarvis Landry", stats: "52 rec, 570 yds, 2 TD. Declining year." },
      { name: "Donovan Peoples-Jones", stats: "34 rec, 597 yds, 3 TD. Promising." },
      { name: "Odell Beckham Jr.", stats: "17 rec, 232 yds before departure mid-season." },
    ],
    TE: [
      { name: "Austin Hooper", stats: "38 rec, 418 yds." },
      { name: "Harrison Bryant", stats: "15 rec, 141 yds, 2 TD. Reliable TE2 behind Hooper and Njoku." },
      { name: "David Njoku", stats: "36 rec, 475 yds, 4 TD. Emerging." },
    ],
    OL: [
      { name: "2021 Browns OL", stats: "Ranked 8th pass protection, 5th run blocking per PFF. Still elite. One of best units in NFL." },
    ],
    DEF: [
      { name: "2021 Browns Defense", stats: "Pass D: 17th · Run D: 15th. Average. Pass rush: Myles Garrett (16 sacks), Jadeveon Clowney (9). INTs: Denzel Ward (3). Top tacklers: Anthony Walker Jr. (LB, 111 tackles), Jeremiah Owusu-Koramoah (LB, 104)." },
    ],
    K: [
      { name: "Chase McLaughlin", stats: "22/27 FG (81.5%)." },
    ],
    HC: [
      { name: "Kevin Stefanski", stats: "Career HC record: 45-56 (.445 win%)." },
    ],
  },
  2022: {
    QB: [
      { name: "Deshaun Watson", stats: "1,102 yds, 7 TD, 5 INT in 6 games after 11-game suspension. 72.8 rating." },
      { name: "Jacoby Brissett", stats: "2,608 yds, 14 TD, 8 INT in 11 starts. Efficient. 89.6 rating." },
    ],
    RB: [
      { name: "Nick Chubb", stats: "1,525 rush yds, 4.9 ypc, 12 TD. Pro Bowl. Top-3 RB in NFL." },
      { name: "Kareem Hunt", stats: "280 rush yds, 3 TD. Rotational role." },
    ],
    WR: [
      { name: "Amari Cooper", stats: "78 rec, 1,160 yds (14.9 avg), 9 TD. Pro Bowl. Stole the show after trade from Dallas." },
      { name: "Donovan Peoples-Jones", stats: "61 rec, 839 yds, 3 TD." },
      { name: "David Bell", stats: "23 rec, 214 yds. Rookie depth." },
    ],
    TE: [
      { name: "David Njoku", stats: "54 rec, 628 yds, 4 TD. Career year to that point." },
    ],
    OL: [
      { name: "2022 Browns OL", stats: "Ranked 7th pass protection, 6th run blocking per PFF. Excellent. Joel Bitonio dominant at guard. Powered Chubb's huge year." },
    ],
    DEF: [
      { name: "2022 Browns Defense", stats: "Pass D: 7th · Run D: 10th. Excellent. Myles Garrett 16 sacks. Pass rush: Myles Garrett (16 sacks), Jadeveon Clowney (5). INTs: Greg Newsome II (3), Denzel Ward (2). Top tacklers: Jeremiah Owusu-Koramoah (LB, 118 tackles), Grant Delpit (S, 96)." },
    ],
    K: [
      { name: "Cade York", stats: "24/31 FG (77.4%). Up-and-down rookie." },
    ],
    HC: [
      { name: "Kevin Stefanski", stats: "Career HC record: 45-56 (.445 win%)." },
    ],
  },
  2023: {
    QB: [
      { name: "Deshaun Watson", stats: "2,952 yds, 14 TD, 9 INT, 83.5 rating. Injury-shortened but showed flashes." },
      { name: "Joe Flacco", stats: "1,616 yds, 13 TD, 8 INT, 97.7 rating in 5 starts. NFL Comeback Player of the Year. Saved the season (11-6)." },
      { name: "P.J. Walker", stats: "1,242 yds, 4 TD, 7 INT, 67.3 passer rating filling in." },
    ],
    RB: [
      { name: "Nick Chubb", stats: "302 rush yds before season-ending ACL injury in Week 2." },
      { name: "Jerome Ford", stats: "813 rush yds, 4.8 ypc, 7 TD after Chubb went down. Stepped up huge." },
    ],
    WR: [
      { name: "Amari Cooper", stats: "72 rec, 1,250 yds (17.4 avg!), 5 TD. Pro Bowl. Best of his Browns career." },
      { name: "Donovan Peoples-Jones", stats: "53 rec, 719 yds, 4 TD." },
      { name: "Elijah Moore", stats: "52 rec, 640 yds, 2 TD." },
      { name: "Cedric Tillman", stats: "27 rec, 334 yds, 2 TD. Showed promise as a late-season contributor." },
    ],
    TE: [
      { name: "David Njoku", stats: "81 rec, 882 yds (10.9 avg), 6 TD. Pro Bowl. Best season of career." },
    ],
    OL: [
      { name: "2023 Browns OL", stats: "Ranked 11th pass protection, 8th run blocking. Good unit despite heavy injury attrition." },
    ],
    DEF: [
      { name: "2023 Browns Defense", stats: "Pass D: 2nd · Run D: 5th. Elite. Myles Garrett DPOY. Pass rush: Myles Garrett (14 sacks, DPOY), Za'Darius Smith (5). INTs: Denzel Ward (4), Juan Thornhill (3). Top tacklers: Jeremiah Owusu-Koramoah (LB, 122 tackles), Sione Takitaki (LB, 98), Grant Delpit (S, 91)." },
    ],
    K: [
      { name: "Dustin Hopkins", stats: "27/31 FG (87.1%), long 57. Excellent." },
    ],
    HC: [
      { name: "Kevin Stefanski", stats: "Career HC record: 45-56 (.445 win%). Won second Coach of the Year award in 2023." },
    ],
  },
  2024: {
    QB: [
      { name: "Deshaun Watson", stats: "Tore Achilles early. Barely played. Season lost." },
      { name: "Jameis Winston", stats: "1,564 yds, 10 TD, 12 INT, 72.8 passer rating in 8 starts as first replacement." },
      { name: "Dorian Thompson-Robinson", stats: "875 yds, 5 TD, 7 INT, 66.1 passer rating filling in." },
      { name: "Joe Flacco", stats: "Limited action before being traded away. 71.3 passer rating in appearances." },
    ],
    RB: [
      { name: "Nick Chubb", stats: "656 rush yds, 3.9 ypc, 4 TD. Returned from ACL but team imploded. 3-14 record." },
      { name: "Jerome Ford", stats: "421 rush yds, 4.2 ypc, 3 TD." },
    ],
    WR: [
      { name: "Amari Cooper", stats: "44 rec, 667 yds, 3 TD before mid-season trade to Bills." },
      { name: "Jerry Jeudy", stats: "90 rec, 1,229 yds (13.7 avg), 4 TD. Career year after trade from Denver." },
      { name: "Cedric Tillman", stats: "38 rec, 412 yds, 2 TD." },
    ],
    TE: [
      { name: "David Njoku", stats: "55 rec, 609 yds, 4 TD. Declining role." },
    ],
    OL: [
      { name: "2024 Browns OL", stats: "Ranked 20th pass protection, 18th run blocking. Average; injuries hurt depth all year. Allowed 66 sacks." },
    ],
    DEF: [
      { name: "2024 Browns Defense", stats: "Pass D: 26th · Run D: 28th. Regressed badly despite Myles Garrett. Pass rush: Myles Garrett (14 sacks), Ogbo Okoronkwo (4.5). INTs: Denzel Ward (3), Martin Emerson Jr. (2). Top tacklers: Jeremiah Owusu-Koramoah (LB, 132 tackles), Mohamoud Diabate (LB, 112)." },
    ],
    K: [
      { name: "Dustin Hopkins", stats: "28/34 FG (82.4%)." },
    ],
    HC: [
      { name: "Kevin Stefanski", stats: "Career HC record: 45-56 (.445 win%)." },
    ],
  },
  2025: {
    QB: [
      { name: "Dillon Gabriel", stats: "937 pass yds, 7 TD, 2 INT, 71.2 passer rating. 59% completion rate, 5.1 ypa. 1-9 as starter — ranked 37th among all NFL starters." },
      { name: "Shedeur Sanders", stats: "1,400 pass yds, 7 starts (3-4 record). 68.1 passer rating, 4.7% INT rate, 9.8% sack rate. Led team in final weeks." },
      { name: "Joe Flacco", stats: "2 TD, 6 INT, 59.8 passer rating in 4 starts before being traded to Bengals." },
    ],
    RB: [
      { name: "Quinshon Judkins", stats: "827 rush yds, 3.6 ypc, 7 TD (14 games before season-ending broken leg). 3rd among all NFL rookies in rush TDs." },
      { name: "Dylan Sampson", stats: "175 rush yds, 271 rec yds, 2 TD. Complementary rookie." },
    ],
    WR: [
      { name: "Jerry Jeudy", stats: "50 rec, 602 yds (12.0 avg), 2 TD. Fell back after huge 2024." },
      { name: "Cedric Tillman", stats: "30 rec, 395 yds, 2 TD." },
      { name: "Malachi Corley", stats: "30 rec, 288 yds, 3 TD. Shifty slot." },
      { name: "Isaiah Bond", stats: "32 rec, 338 yds, 1 TD. Emerging rookie." },
    ],
    TE: [
      { name: "Harold Fannin Jr.", stats: "72 rec, 731 yds (10.2 avg), 6 TD. FRANCHISE RECORD for rookie TE receptions (72). 9th most rec yds ever by a rookie TE in NFL history." },
      { name: "David Njoku", stats: "48 rec, 462 yds, 3 TD. Still solid." },
    ],
    OL: [
      { name: "2025 Browns OL", stats: "Ranked 25th pass protection, 22nd run blocking. Aging veterans declining; six starters became free agents after season." },
    ],
    DEF: [
      { name: "2025 Browns Defense", stats: "Pass D: 3rd · Run D: 7th. Elite defensive line. Pass rush: Myles Garrett (23 sacks — NFL all-time sack record), Za'Darius Smith (8). INTs: Denzel Ward (4), Rodney McLeod (3). Top tacklers: Jeremiah Owusu-Koramoah (LB, 128 tackles), Mohamoud Diabate (LB, 111), Grant Delpit (S, 97)." },
    ],
    K: [
      { name: "Andre Szmyt", stats: "24/27 FG (88.9%), 6/7 from 50+, long 55. Rookie who rebounded from shaky debut to become reliable. 25/26 XP." },
    ],
    HC: [
      { name: "Kevin Stefanski", stats: "Career HC record: 45-56 (.445 win%). Fired after season (5-12). Two Coach of Year awards, two playoffs." },
    ],
  },
};

const YEARS = Object.keys(BROWNS_DATA).map(Number).sort((a, b) => a - b);

const SLOTS = [
  { id: "QB",  label: "QB",  icon: "🏈", desc: "Quarterback" },
  { id: "RB",  label: "RB",  icon: "💨", desc: "Running Back" },
  { id: "WR1", label: "WR",  icon: "⚡", desc: "Wide Receiver 1" },
  { id: "WR2", label: "WR",  icon: "⚡", desc: "Wide Receiver 2" },
  { id: "TE",  label: "TE",  icon: "🔒", desc: "Tight End" },
  { id: "OL",  label: "OL",  icon: "🛡️", desc: "Offensive Line" },
  { id: "DEF",  label: "DEF",  icon: "🦅", desc: "Defense" },
  { id: "HC",  label: "HC",  icon: "📋", desc: "Head Coach" },
];

function getBaseId(slotId) {
  return slotId.replace(/\d+$/, "");
}

function getOptionsForSlot(slotId, year) {
  const data = BROWNS_DATA[year];
  if (!data) return [];
  return data[getBaseId(slotId)] || [];
}

function isPositionFilled(roster, slotId) {
  return !!roster[slotId];
}

// All unfilled slots
function getUnfilledSlots(roster) {
  return SLOTS.filter(s => !roster[s.id]);
}


// ─── ALGORITHMIC SIMULATION ───────────────────────────────────────────────────

function scorePlayer(slotId, player) {
  const stats = (player?.stats || "").toLowerCase();
  const baseId = slotId.replace(/\d+$/, "");
  let s = 5;

  if (baseId === "QB") {
    // ── Efficiency ─────────────────────────────────────────────────────────
    const ratingM = stats.match(/(\d+\.\d+)\s*(?:passer\s*)?rating/);
    if (ratingM) {
      const r = parseFloat(ratingM[1]);
      if (r >= 100) s += 3; else if (r >= 95) s += 2; else if (r >= 88) s += 1; else if (r >= 80) { /* neutral */ }
      else if (r >= 70) s -= 1; else if (r >= 65) s -= 2; else s -= 3.5;
      const tdR = stats.match(/(\d+)\s*td/), intR = stats.match(/(\d+)\s*int/);
      if (tdR && intR) {
        const ratio = parseInt(tdR[1]) / (parseInt(intR[1]) || 1);
        if (ratio >= 3) s += 0.25; else if (ratio < 1) s -= 0.75;
      }
    } else {
      const tdM = stats.match(/(\d+)\s*td/), intM = stats.match(/(\d+)\s*int/);
      if (tdM && intM) {
        const tds = parseInt(tdM[1]), ints = parseInt(intM[1]);
        const ratio = tds / (ints || 1);
        const vf = tds >= 20 ? 1.0 : tds >= 12 ? 0.7 : tds >= 7 ? 0.4 : 0.2;
        if (ratio >= 3) s += 0.5 * vf; else if (ratio < 1) s -= 1.5 * Math.min(1, vf + 0.3);
      }
    }
    if (stats.includes("27 td") || stats.includes("29 td") || stats.includes("26 td")) s += 0.5;
    const ypaM = stats.match(/([\d.]+)\s*ypa/);
    if (ypaM) { const ypa = parseFloat(ypaM[1]); if (ypa < 5.5) s -= 2; else if (ypa < 6.5) s -= 0.5; }
    const cpM = stats.match(/(\d+)%\s*completion/);
    if (cpM && parseFloat(cpM[1]) < 60) s -= 0.5;
    // ── Volume: applied to every QB ────────────────────────────────────────
    const volM = stats.match(/(\d+[,\d]*)\s*(?:pass\s*)?yds/);
    if (volM) {
      const v = parseInt(volM[1].replace(",", ""));
      if      (v < 500)  s -= 2.5;
      else if (v < 1000) s -= 2.0;
      else if (v < 1500) s -= 0.75;
      else if (v < 2000) s -= 0.5;
      else if (v < 3000) s -= 0.25;
    }
    return Math.max(1, Math.min(8, s));
  }

  if (baseId === "RB") {
    const ypcM = stats.match(/(\d+\.\d+)\s*ypc/);
    if (ypcM) {
      const v = parseFloat(ypcM[1]);
      if (v >= 5.0) s += 2; else if (v >= 4.5) s += 1; else if (v >= 4.0) s += 0.5; else if (v < 3.5) s -= 1;
    }
    const ydsM = stats.match(/(\d+[,\d]*)\s*(?:rush\s*)?yds/);
    if (ydsM) {
      const v = parseInt(ydsM[1].replace(",",""));
      if (v >= 1400) s += 2; else if (v >= 1000) s += 1;
      else if (v >= 600) s -= 0.5; else if (v >= 400) s -= 1; else if (v >= 200) s -= 1.5; else s -= 2;
    }
    const tdM = stats.match(/(\d+)\s*td/);
    if (tdM) { const v = parseInt(tdM[1]); if (v >= 10) s += 1; else if (v >= 9) s += 0.5; }
    if (!ypcM && !ydsM && !tdM) s -= 3.5;
  }

  if (baseId === "WR") {
    const ydsM = stats.match(/(\d+[,\d]*)\s*yds/);
    if (ydsM) {
      const v = parseInt(ydsM[1].replace(",",""));
      if (v >= 1500) s += 3; else if (v >= 1200) s += 2; else if (v >= 900) s += 1;
      else if (v >= 600) s -= 0.25; else if (v >= 400) s -= 0.75; else if (v >= 200) s -= 1.5; else s -= 2.5;
    }
    const recM = stats.match(/(\d+)\s*rec/);
    if (recM) {
      const v = parseInt(recM[1]);
      if (v >= 80) s += 0.5; else if (v < 30) s -= 0.5;
    }
    const tdM = stats.match(/(\d+)\s*td/);
    if (tdM) { const v = parseInt(tdM[1]); if (v >= 12) s += 1; else if (v >= 8) s += 0.5; }
    if (!ydsM && !recM && !tdM) s -= 3.5;
  }

  if (baseId === "TE") {
    const ydsM = stats.match(/(\d+[,\d]*)\s*yds/);
    if (ydsM) {
      const v = parseInt(ydsM[1].replace(",",""));
      if (v >= 1000) s += 3; else if (v >= 700) s += 2; else if (v >= 500) s += 1;
      else if (v < 150) s -= 1.5; else if (v < 300) s -= 0.5;
    }
    const recM = stats.match(/(\d+)\s*rec/);
    if (recM) { const v = parseInt(recM[1]); if (v >= 70) s += 1; else if (v >= 50) s += 0.5; else if (v < 20) s -= 0.5; }
    if (!ydsM && !recM) s -= 3.5;
  }

  if (baseId === "OL") {
    s = 5; // pure rankings only — ignore all keyword signals
    const rScoreOL = (r) => r <= 3 ? 4.5 : r <= 7 ? 3 : r <= 12 ? 1.5 : r <= 18 ? 0 : r <= 24 ? -1.5 : r <= 28 ? -2.5 : -4;
    const ranks = [...stats.matchAll(/(\d+)(?:st|nd|rd|th)/g)].map(m => parseInt(m[1])).filter(v => v >= 1 && v <= 32);
    if (ranks.length >= 1) s += rScoreOL(ranks[0]) * 0.55;
    if (ranks.length >= 2) s += rScoreOL(ranks[1]) * 0.45;
  }

  if (baseId === "DEF") {
    s = 5; // pure rankings only — ignore all keyword signals
    const rScoreDEF = (r) => r <= 3 ? 4.5 : r <= 7 ? 3 : r <= 12 ? 1.5 : r <= 18 ? 0 : r <= 24 ? -1.5 : r <= 28 ? -2.5 : -4;
    const passM = stats.match(/pass\s*d[:\s·]+(\d+)/i);
    if (passM) s += rScoreDEF(parseInt(passM[1])) * 0.55;
    const runM = stats.match(/run\s*d[:\s·]+(\d+)/i);
    if (runM) s += rScoreDEF(parseInt(runM[1])) * 0.45;
  }

  if (baseId === "K") {
    const fgM = stats.match(/(\d+)\/(\d+)\s*fg/i);
    if (fgM) { const pct = parseInt(fgM[1]) / parseInt(fgM[2]); if (pct >= 0.90) s += 2; else if (pct >= 0.85) s += 1; else if (pct < 0.75) s -= 1.5; }
  }

  if (baseId === "HC") {
    const coachName = (player?.name || "").toLowerCase();
    // Explicit coach ratings (override win% formula)
    if (coachName.includes("stefanski"))       return 6;
    if (coachName.includes("gregg williams"))  return 5.5;
    if (coachName.includes("crennel"))         return 5;
    if (coachName.includes("mangini"))         return 4;
    if (coachName.includes("kitchens"))        return 3.5;
    if (coachName.includes("hue jackson"))     return 1.5;
    // Win% formula for everyone else
    const wpM = stats.match(/\((\.\d+)\s*win%\)/);
    if (wpM) { const v = parseFloat(wpM[1]); if (v >= 0.55) s += 2; else if (v >= 0.45) s += 0.5; else if (v >= 0.35) s -= 0.5; else if (v >= 0.25) s -= 1.5; else s -= 2.5; }
  }

  return Math.max(1, Math.min(10, s));
}

function gradeLabel(score) {
  if (score >= 8.5) return "Elite";
  if (score >= 6.5) return "Good";
  if (score >= 5.0) return "Average";
  if (score >= 3.0) return "Below Average";
  return "Terrible";
}

function runSimulation(roster) {
  const weights = { QB: 21, RB: 12, WR1: 7, WR2: 7, TE: 5, OL: 15, DEF: 18, HC: 15 };
  const scores = {};
  for (const slot of SLOTS) scores[slot.id] = scorePlayer(slot.id, roster[slot.id]);

  let totalW = 0, totalScore = 0;
  for (const slot of SLOTS) {
    const w = weights[slot.id] || 5;
    totalScore += scores[slot.id] * w;
    totalW += w;
  }
  const avg = totalScore / totalW;

  // Map avg score (1-10) to wins (1-16)
  // Calibrated so avg=5 → ~7 wins, avg=7 → ~11 wins, avg=8.5 → ~14 wins
  const rawWins = (avg - 1) * 2 - 1;
  const wins = Math.max(0, Math.min(17, Math.round(rawWins)));
  const losses = 17 - wins;

  // Unit scores
  const offSlots = ["QB","RB","WR1","WR2","TE"];
  const offSimW = { QB: 21, RB: 12, WR1: 8, WR2: 7, TE: 5 };
  const offWSum = offSlots.reduce((a, id) => a + offSimW[id], 0);
  const offWScore = offSlots.reduce((a, id) => a + scores[id] * offSimW[id], 0);
  const offAvg = offWScore / offWSum;
  const offWithOL = (offWScore + scores.OL * 15) / (offWSum + 15);

  const grades = {
    Offense: gradeLabel(offWithOL),
    Defense: gradeLabel(scores.DEF),
    Coaching: gradeLabel(scores.HC),
  };

  // MVP: highest impact (score × weight)
  let mvpId = "QB", mvpImpact = 0;
  for (const slot of SLOTS) {
    const impact = scores[slot.id] * (weights[slot.id] || 5);
    if (impact > mvpImpact) { mvpImpact = impact; mvpId = slot.id; }
  }

  // Liability: lowest score among positions with weight >= 5
  let liabilityId = "QB", liabilityScore = 99;
  for (const slot of SLOTS) {
    if ((weights[slot.id] || 5) >= 5 && scores[slot.id] < liabilityScore) {
      liabilityScore = scores[slot.id]; liabilityId = slot.id;
    }
  }

  const mvpPlayer = roster[mvpId];
  const mvpSlot = SLOTS.find(s => s.id === mvpId);
  const liabilityPlayer = roster[liabilityId];
  const liabilitySlot = SLOTS.find(s => s.id === liabilityId);

  const tier = wins >= 13 ? "super" : wins >= 11 ? "great" : wins >= 9 ? "good" : wins >= 7 ? "avg" : wins >= 5 ? "bad" : "awful";

  // ── Playoff simulation ──────────────────────────────────────────────────
  // Win prob per round — scales with team quality
  const baseProb = Math.min(0.72, Math.max(0.30, (avg - 1) / 9 * 0.42 + 0.30));
  // Hard quality gates — late-round success requires genuinely elite teams
  const roundProb = (round) => {
    if (round === "Super Bowl") {
      if (avg >= 8.0) return baseProb;             // Elite: full odds
      if (avg >= 7.0) return baseProb * 0.55;      // Good: difficult
      if (avg >= 6.0) return baseProb * 0.28;      // Average: very hard
      return 0.08;                                  // Below average: nearly impossible
    }
    if (round === "AFC Championship") {
      if (avg >= 7.5) return baseProb;             // Great: full odds
      if (avg >= 6.5) return baseProb * 0.68;      // Good: somewhat penalized
      if (avg >= 5.5) return baseProb * 0.45;      // Average: hard
      return baseProb * 0.25;                       // Bad: rare
    }
    return baseProb;
  };
  let playoffResult, playoffNarrative, isChampion = false;

  if (wins <= 8) {
    playoffResult = "MISSED PLAYOFFS";
    playoffNarrative = `At ${wins}-${losses}, this team misses the playoffs. You need nine wins in today's NFL — eight just doesn't get it done. The Dawg Pound watches January football from their couches, again.`;
  } else if (wins === 9) {
    playoffResult = "WILD CARD · ELIMINATED";
    playoffNarrative = `They make the playoffs at ${wins}-${losses} and exit in the Wild Card round. It counts as a moral victory. Cleveland celebrates accordingly.`;
  } else if (wins === 10) {
    playoffResult = "DIVISIONAL ROUND · ELIMINATED";
    playoffNarrative = `A real playoff run — Divisional Round elimination hurts, but this is real, tangible playoff football. The Dawg Pound is louder than it's been in a generation. Progress, technically.`;
  } else if (wins === 11) {
    playoffResult = "AFC CHAMPIONSHIP · ELIMINATED";
    playoffNarrative = `One win from the Super Bowl. They fall in the AFC Championship Game and the entire city of Cleveland simultaneously exhales a sound that has no name. "So Browns of them," someone tweets. It gets 400k likes.`;
  } else if (wins === 12) {
    playoffResult = "SUPER BOWL · LOSS";
    playoffNarrative = `They reach the Super Bowl — an event Cleveland has never witnessed — only to fall in the final act. The city is equal parts devastated and grateful. A thousand "We Were So Close" shirts are printed overnight.`;
  } else {
    isChampion = true;
    playoffResult = "SUPER BOWL CHAMPIONS 🏆";
    playoffNarrative = `They run the table. Wild card, divisional, AFC Championship — all conquered. Then, in the most improbable moment in Cleveland sports history, they win the Super Bowl. The Lombardi Trophy finally comes to Cleveland. A city weeps. A city erupts. Dog masks everywhere.`;
  }

  // ── Narrative helpers ────────────────────────────────────────────────────
  // What position actually drives this team (highest weighted impact)
  const anchorDesc = () => {
    if (mvpId === "QB")  return `${mvpPlayer?.name}'s arm`;
    if (mvpId === "OL")  return `the offensive line`;
    if (mvpId === "DEF") return `a dominant defense`;
    if (mvpId === "RB")  return `the running game`;
    if (mvpId === "WR1") return `the receiving corps`;
    if (mvpId === "HC")  return `coaching`;
    return mvpPlayer?.name;
  };

  // Describe the QB honestly
  const qbDesc = () => {
    const s = scores.QB;
    if (s >= 8) return `${roster.QB?.name} is an elite QB who elevates everyone around him`;
    if (s >= 6.5) return `${roster.QB?.name} is a legitimate starter who won't hurt this team`;
    if (s >= 5) return `${roster.QB?.name} is adequate — won't win games on his own, but won't lose them either`;
    if (s >= 3.5) return `${roster.QB?.name} is a below-average QB the rest of the roster has to carry`;
    return `${roster.QB?.name} is a genuine liability at QB — teams will scheme to force him into mistakes`;
  };

  // Describe the defense honestly (no "anchors" for average units)
  const defDesc = () => {
    const s = scores.DEF;
    if (s >= 8.5) return `a dominant defense that actively wins games`;
    if (s >= 7)   return `a good defense that keeps the team in every game`;
    if (s >= 5.5) return `a serviceable defense that won't be the reason they lose`;
    if (s >= 4)   return `a below-average defense that will give up points when it matters`;
    return `a defense that will actively cost them wins`;
  };

  const defGrade = gradeLabel(scores.DEF);
  const olGrade = gradeLabel(scores.OL);
  const qbScore = scores.QB;

  // Narrative best = highest RAW score (most talented player, for storytelling)
  let narrativeBestId = "QB", narrativeBestScore = 0;
  for (const slot of SLOTS) {
    if (scores[slot.id] > narrativeBestScore) {
      narrativeBestScore = scores[slot.id];
      narrativeBestId = slot.id;
    }
  }
  const narrativeBestPlayer = roster[narrativeBestId];
  const narrativeBestSlot = SLOTS.find(s => s.id === narrativeBestId);

  // Liability reference — avoid "2003 Browns OL (OL)" redundancy
  const liabilityRef = () => {
    const name = liabilityPlayer?.name || "";
    const label = liabilitySlot?.label || "";
    const alreadyInName = name.toLowerCase().includes(label.toLowerCase());
    return alreadyInName ? name : `${name} (${label})`;
  };

  // OL description for narrative
  const olNarrative = (rbName) => {
    if (scores.OL >= 7) return `A ${olGrade.toLowerCase()} OL gives ${rbName} room to operate and keeps the QB clean.`;
    if (scores.OL >= 5.5) return `An average OL does its job without standing out, letting ${rbName} find what he can.`;
    if (scores.OL >= 4) return `A below average OL limits what ${rbName} can do and leaves the QB under pressure.`;
    return `A bottom-third OL holds back ${rbName} and the entire offense — opponents will load the box knowing it.`;
  };

  // Extract a notable player name from OL stats (Joe Thomas, Joel Bitonio, etc.)
  const extractOLStar = () => {
    const s = roster.OL?.stats || "";
    const m = s.match(/\b([A-Z][a-z]+ [A-Z][a-z]+)(?:'s?\s+|\s+)(?:All-Pro|Pro Bowl|elite|transcendent|anchor)/i)
           || s.match(/([A-Z][a-z]+ [A-Z][a-z]+)\s+(?:All-Pro|rookie year at LT|excellent)/i);
    return m ? m[1].trim() : null;
  };

  // Extract the primary pass rusher from DEF stats
  const extractDefStar = () => {
    const s = roster.DEF?.stats || "";
    const m = s.match(/Pass rush:\s*([A-Z][a-z]+(?: [A-Z][a-z']+)+)\s*\(/);
    return m ? m[1].trim() : null;
  };

  // ── Fully dynamic narrative builder ─────────────────────────────────────
  const buildNarrative = () => {
    const parts = [];
    const olStar  = extractOLStar();
    const defStar = extractDefStar();

    // Opening tone
    const openings = {
      super: "This is a legitimately elite roster.",
      great: "A legitimate 11-12 win team — a real playoff contender.",
      good:  "A winning team that should make the playoffs.",
      avg:   "A team that finishes around .500 and watches the playoffs from home.",
      bad:   "A tough roster to watch.",
      awful: "One of the more painful rosters in this exercise.",
    };
    parts.push(openings[tier]);

    // QB — always addressed
    parts.push(qbDesc() + ".");

    // Non-QB elite positions (score ≥ 8), sorted best-first
    const nonQBElites = SLOTS
      .filter(s => s.id !== "QB" && scores[s.id] >= 8)
      .map(s => ({ ...s, score: scores[s.id], player: roster[s.id] }))
      .sort((a, b) => b.score - a.score);

    if (nonQBElites.length >= 2) {
      const [a, b] = nonQBElites;
      parts.push(`${a.player?.name} (${a.label}) and ${b.player?.name} (${b.label}) are genuinely elite — as good as the Browns have had at those spots.`);
    } else if (nonQBElites.length === 1) {
      const e = nonQBElites[0];
      parts.push(`${e.player?.name} at ${e.label} is the standout talent — elite by any measure.`);
    }

    // OL + running game — include star player name when warranted
    const olBase = olNarrative(roster.RB?.name);
    if (scores.OL >= 7 && olStar) {
      parts.push(`${olBase} ${olStar} is the anchor up front.`);
    } else if (scores.OL >= 8.5 && olStar) {
      parts.push(`${olStar} leads one of the better offensive lines this franchise has fielded — ${roster.RB?.name} has lanes and the QB has time.`);
    } else {
      parts.push(olBase);
    }

    // Defense — explicitly honest, include star name when it adds context
    const ds = scores.DEF;
    const defPlayer = roster.DEF?.name || "The defense";
    if (ds >= 8.5) {
      parts.push(`${defPlayer} is dominant.${defStar ? ` ${defStar} is a genuine game-wrecker and the rest of the unit plays to that level.` : " It actively wins games and bails out the offense."}`);
    } else if (ds >= 7) {
      parts.push(`${defPlayer} is a genuine asset — keeps opponents in check.${defStar ? ` ${defStar} leads the pass rush and makes life difficult for opposing QBs.` : ""}`);
    } else if (ds >= 5.5) {
      parts.push(`${defPlayer} is league-average — it won't lose games by itself, but it won't win them either.${defStar ? ` ${defStar} can make plays, but the supporting cast is inconsistent.` : ""}`);
    } else if (ds >= 4) {
      parts.push(`${defPlayer} is a problem. Opponents will move the ball and score, putting constant pressure on an offense that has to keep pace.`);
    } else if (ds >= 2.5) {
      parts.push(`${defPlayer} is a serious liability. Teams will put up 30+ routinely, turning every game into a shootout this offense isn't equipped to win consistently.`);
    } else {
      parts.push(`${defPlayer} is historically bad — one of the worst units in Browns franchise history. It will actively cost this team games.`);
    }

    // Receiving corps — call out if notably strong or weak
    const wr1Score = scores.WR1;
    const wr2Score = scores.WR2;
    const wrAvg = (wr1Score + wr2Score) / 2;
    if (wrAvg >= 7.5) {
      parts.push(`${roster.WR1?.name} and ${roster.WR2?.name} give the QB legitimate weapons on the outside.`);
    } else if (wr1Score >= 8 && wr2Score < 5) {
      parts.push(`${roster.WR1?.name} is an elite target but ${roster.WR2?.name} at WR2 is a mismatch waiting to be exploited.`);
    } else if (wrAvg < 4) {
      parts.push(`The receiver corps is thin — opposing secondaries won't lose sleep over this group.`);
    }

    // Bad coaching callout — only when it's genuinely holding the team back
    const hcs = scores.HC;
    if (hcs <= 1.5) {
      parts.push(`${roster.HC?.name}'s track record is historically bad — close games will disappear in the fourth quarter through poor decisions.`);
    } else if (hcs <= 2.5) {
      parts.push(`${roster.HC?.name} has one of the worst win percentages in the coaching pool — this team will leave wins on the field due to game management.`);
    } else if (hcs <= 3.5 && wins >= 8) {
      parts.push(`${roster.HC?.name}'s coaching résumé raises real concerns — in a competitive roster this is a ceiling-capper.`);
    }

    // Ceiling-capper or remaining liability (skip if already addressed)
    const alreadyAddressed = new Set(["DEF", "WR1", "WR2", "HC"]);
    if (!alreadyAddressed.has(liabilityId) && liabilityScore <= 4) {
      parts.push(`${liabilityRef()} remains the biggest exploitable weakness and will be schemed against every week.`);
    } else if (!alreadyAddressed.has(liabilityId) && liabilityScore <= 5.5 && wins >= 9) {
      parts.push(`${liabilityRef()} is the one spot keeping this roster from being a true contender.`);
    }

    return parts.join(" ");
  };

  const moments = {
    super: `A nationally televised Sunday night game where ${roster.QB?.name} orchestrates a 98-yard game-winning drive in the final two minutes. ${roster.WR1?.name} catches the walk-off TD. The Dawg Pound erupts so loud the broadcast can't even call the play. Dog masks. Chaos. Tears. Cleveland actually deserves this one.`,
    great: `Trailing by 4 in the fourth quarter of a playoff game, ${roster.QB?.name} finds ${roster.WR1?.name} on a crossing route for 32 yards as the Browns kick the walk-off field goal as time expires. The Dawg Pound hadn't been this loud since 2002. Camera cuts to ${roster.HC?.name} storming the field, headset dangling, arms in the air.`,
    good: `A crisp November Sunday where ${roster.RB?.name} breaks a 67-yard TD run, ${roster.QB?.name} adds two more scores, and the defense suffocates Pittsburgh's offense in a 27-10 statement win. Totally unremarkable to anyone outside Cleveland. Life-defining to everyone inside it.`,
    avg: `Up 17-3 in the 4th quarter with a playoff spot on the line, the offense goes three-and-out four straight times. The defense wilts. They lose in overtime, 20-17. ${roster.HC?.name} uses all three timeouts in the final two minutes for no discernible reason. The subreddit crashes.`,
    bad: `After a surprising 3-game win streak raises hopes, a home prime-time game ends in a 41-10 beatdown with ${roster.QB?.name} pulled at halftime. A fan in a dog mask outside the stadium holds a handmade sign: "At Least Phil Dawson Is Still Alive." It gets 200k impressions.`,
    awful: `Week 8, down 45-3, the PA system starts playing "Closing Time." The last 6,000 fans still in the building start singing along unironically. The cameras find ${roster.QB?.name} on the sideline staring into the middle distance. Nobody in the booth can think of anything to say. A dog barks in the distance.`,
  };

  const liabilityReason = (id, score) => {
    const baseId = id.replace(/\d+$/, '');
    if (baseId === 'QB') {
      if (score <= 1.5) return 'historically poor play actively cost this team wins.';
      if (score <= 2.5) return 'inconsistent and mistake-prone — a drag on the whole offense.';
      return 'not good enough to elevate this offense when it counted.';
    }
    if (baseId === 'RB') {
      if (score <= 1.5) return 'barely touched the ball — a non-factor in the run game.';
      if (score <= 3) return "couldn't generate yards consistently.";
      return 'limited production left the offense without a reliable ground game.';
    }
    if (baseId === 'WR') {
      if (score <= 1.5) return 'barely saw the field — contributed almost nothing to the passing game.';
      if (score <= 3) return 'minimal production — opposing corners felt comfortable all game.';
      return 'not a threat defenses needed to game plan for.';
    }
    if (baseId === 'TE') {
      if (score <= 1.5) return 'a non-factor — added nothing as a receiving threat.';
      if (score <= 3) return "couldn't create mismatches or move the chains.";
      return 'below average at a position that demands more.';
    }
    if (baseId === 'OL') {
      if (score <= 2.5) return "a sieve — left the QB under constant pressure and couldn't open holes in the run game.";
      if (score <= 4) return 'gave up too much pressure and struggled to generate push up front.';
      return 'inconsistent — created problems the rest of the offense had to overcome.';
    }
    if (baseId === 'DEF') {
      if (score <= 2) return 'historically bad — gave up points in bunches every week.';
      if (score <= 3.5) return "couldn't stop anyone — put the offense in constant catch-up mode.";
      return 'below average — opponents moved the ball at will.';
    }
    if (baseId === 'HC') {
      if (score <= 1.5) return 'one of the worst coaching decisions in franchise history — cost this team multiple wins.';
      if (score <= 2.5) return 'poor game management left wins on the field week after week.';
      return 'questionable decisions in critical moments undermined a capable roster.';
    }
    return "a drag on this roster's ceiling.";
  };

  return {
    record: `${wins}-${losses}`,
    wins,
    losses,
    teamScore: Math.round(avg * 10),
    narrative: buildNarrative(),
    grades,
    mvp: `${mvpPlayer?.name} (${mvpSlot?.label}, ${mvpPlayer?.year}) — scored ${scores[mvpId].toFixed(1)}/10, the highest-impact player on this roster.`,
    weakness: liabilityScore <= 5
      ? `${(()=>{ const n=liabilityPlayer?.name||''; const l=liabilitySlot?.label||''; return n.toLowerCase().includes(l.toLowerCase()) ? n : n+' ('+l+')'; })()} — scored ${liabilityScore.toFixed(1)}/10, ${liabilityReason(liabilityId, liabilityScore)}`
      : `No glaring weakness. ${liabilityPlayer?.name} at ${liabilitySlot?.label} is the relative weak link at ${liabilityScore.toFixed(1)}/10.`,
    dawgPoundMoment: moments[tier],
    playoffResult,
    playoffNarrative,
    isChampion,
  };
}

export default function DawgPoundDraft() {
  const [phase, setPhase] = useState("intro");
  const [roster, setRoster] = useState({});
  const [rolledYear, setRolledYear] = useState(null);
  const [rollDisplay, setRollDisplay] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [usedYears, setUsedYears] = useState([]);
  const [result, setResult] = useState(null);

  // Leaderboard state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [rosterPopup, setRosterPopup] = useState(null);

  const handleSubmit = async () => {
    if (!playerName.trim() || !result) return;
    setSubmitting(true);
    const rosterSnapshot = {};
    SLOTS.forEach(slot => {
      if (roster[slot.id]) {
        rosterSnapshot[slot.id] = { name: roster[slot.id].name, year: roster[slot.id].year };
      }
    });
    const { error } = await supabase.from("leaderboard").insert({
      name: playerName.trim(),
      record: result.record,
      wins: result.wins,
      score: result.teamScore,
      roster: rosterSnapshot,
    });
    setSubmitting(false);
    if (error) {
      alert("Couldn't save to leaderboard: " + error.message);
      return;
    }
    setSubmitted(true);
    setShowNamePrompt(false);
    // Auto-open leaderboard after submit
    handleViewLeaderboard();
  };

  const handleViewLeaderboard = async () => {
    setShowLeaderboard(true);
    setLeaderboardLoading(true);
    const { data } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .order("wins", { ascending: false })
      .limit(50);
    setLeaderboardData(data || []);
    setLeaderboardLoading(false);
  };

  const filledSlots = SLOTS.filter(s => roster[s.id]);
  const unfilledSlots = getUnfilledSlots(roster);
  const allFilled = unfilledSlots.length === 0;


  function rollDice() {
    if (isRolling) return;
    setIsRolling(true);
    setRolledYear(null);
    let ticks = 0;
    const availableYears = YEARS.filter(y => !usedYears.includes(y));
    const pool = availableYears.length > 0 ? availableYears : YEARS;
    const total = 18 + Math.floor(Math.random() * 12);
    const iv = setInterval(() => {
      setRollDisplay(pool[Math.floor(Math.random() * pool.length)]);
      ticks++;
      if (ticks >= total) {
        clearInterval(iv);
        const year = pool[Math.floor(Math.random() * pool.length)];
        setRolledYear(year);
        setRollDisplay(year);
        setIsRolling(false);
      }
    }, 55);
  }

  function pickPlayer(slotId, player, year) {
    const newRoster = { ...roster, [slotId]: { ...player, year } };
    setRoster(newRoster);
    setUsedYears(prev => prev.includes(year) ? prev : [...prev, year]);
    setRolledYear(null);
    setRollDisplay(null);
  }

  function swapRoster(slotA, slotB) {
    setRoster(prev => ({
      ...prev,
      [slotA]: prev[slotB],
      [slotB]: prev[slotA],
    }));
  }

  function simulateSeason() {
    setPhase("simulate");

    // Algorithmic simulation — no API needed
    setTimeout(() => {
      const result = runSimulation(roster);
      setResult(result);
      setPhase("result");
    }, 1600);
  }

  const gradeColor = (g) => {
    if (!g) return "#8a7060";
    if (g.includes("Elite")) return "#4ade80";
    if (g.includes("Good")) return "#fbbf24";
    if (g.includes("Average")) return "#f0e6d3";
    if (g.includes("Below")) return "#f97316";
    if (g.includes("Terrible")) return "#f43f5e";
    return "#f0e6d3";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0905", color: "#f0e6d3", fontFamily: "'Georgia', serif", position: "relative" }}>
      {/* grain */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.035, zIndex: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "100px" }} />
      <div style={{ height: 3, background: "linear-gradient(90deg, #c0300a, #ff5500, #ff8800, #ff5500, #c0300a)", position: "relative", zIndex: 2 }} />

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 18px 80px", position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <header style={{ padding: "0 0 10px" }}>
          <div style={{ position: "relative", width: "100%", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
            <img
              src="data:image/jpeg;base64,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"
              alt="Super Browns"
              style={{ width: "100%", display: "block", objectFit: "cover" }}
            />
          </div>
          {phase === "intro" && (
          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#c4a882", textTransform: "uppercase", lineHeight: 1.7 }}>
              Can the factory of sadness produce a winner by pooling together 27 years of questionable decisions? Roll the dice to find out. (Presumably how Sashi Brown landed on Corey Coleman)
            </div>
          </div>
          )}
        </header>

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div style={{ textAlign: "center", marginTop: 32 }}>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 36 }}>
              {SLOTS.map(s => (
                <div key={s.id} style={{ background: "#180f08", border: "1px solid #2a1a0d", borderRadius: 3,
                  padding: "5px 11px", fontSize: 11, color: "#5a3820", letterSpacing: 2 }}>
                  {s.icon} {s.label}
                </div>
              ))}
            </div>
            <button onClick={() => setPhase("draft")} style={btn("#ff5500")}>START DRAFTING</button>
          </div>
        )}

        {/* ── DRAFT ── */}
        {phase === "draft" && (
          <div style={{ marginTop: 16 }}>


            {/* 9-slot tracker */}
            <div style={{ background: "#110a04", border: "1px solid #1e1006", borderRadius: 6, marginBottom: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "6px 12px", borderBottom: "1px solid #1e1006" }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#5a3820", textTransform: "uppercase" }}>Roster</div>
                <div style={{ fontSize: 10, color: "#3a2010", letterSpacing: 2 }}>{filledSlots.length}/{SLOTS.length} filled</div>
              </div>
              {SLOTS.map((slot, i) => {
                const pick = roster[slot.id];
                const filled = !!pick;
                return (
                  <div key={slot.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "6px 12px",
                    borderBottom: i < SLOTS.length - 1 ? "1px solid #160d06" : "none",
                    background: filled ? "#140c05" : "transparent",
                  }}>
                    <div style={{ width: 32, fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                      color: filled ? "#ff5500" : "#7a5030", flexShrink: 0 }}>
                      {slot.label}
                    </div>
                    {filled ? (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#c4a882", flex: 1, minWidth: 0,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {pick.name}
                        </div>
                        <div style={{ fontSize: 10, color: "#5a3820", flexShrink: 0 }}>'{String(pick.year).slice(2)}</div>

                        <div style={{ fontSize: 11, color: "#ff5500", flexShrink: 0 }}>✓</div>
                      </>
                    ) : (
                      <div style={{ fontSize: 13, color: "#5a3820" }}>—</div>
                    )}
                  </div>
                );
              })}
              {/* Progress bar at bottom */}
              <div style={{ height: 2, background: "#1a0e06" }}>
                <div style={{ height: "100%", width: `${(filledSlots.length / SLOTS.length) * 100}%`,
                  background: "linear-gradient(90deg, #ff5500, #ff9900)", transition: "width 0.4s ease" }} />
              </div>
            </div>
            {/* Dice */}
            {!allFilled && (
              <div style={{ border: "1px solid #2a1506", borderRadius: 6, padding: "14px 16px", background: "#110a04", marginBottom: 16 }}>
                <div style={{ textAlign: "center", marginBottom: rolledYear ? 20 : 0 }}>
                  <div style={{ marginBottom: 12 }}>
                    {!rolledYear ? (
                      <button onClick={rollDice} disabled={isRolling} style={btn(isRolling ? "#4a2a10" : "#ff5500", isRolling)}>
                        {isRolling ? "ROLLING..." : "🎲  ROLL YEAR"}
                      </button>
                    ) : (
                      <div style={{ fontSize: 13, color: "#8a6040" }}>
                        Showing <span style={{ color: "#ff9900", fontWeight: 700 }}>{rolledYear}</span>
                        {" · "}
                        <span style={{ color: "#5a3820", fontSize: 12 }}>open slots only</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 96, height: 96, background: "#180e06",
                    border: `2px solid ${rolledYear ? "#ff5500" : "#6a3a18"}`,
                    borderRadius: 10, fontSize: 30, fontWeight: 900,
                    color: rolledYear ? "#ff9900" : "#8a5030",
                    transition: "border-color 0.2s, color 0.2s",
                    letterSpacing: -1, userSelect: "none" }}>
                    {rollDisplay ?? "?"}
                  </div>
                </div>

                {/* All positions from rolled year — show everyone, gray out already-drafted names */}
                {rolledYear && (() => {
                  const yearData = BROWNS_DATA[rolledYear];
                  // Names already on the roster (across any year/slot)
                  const draftedNames = new Set(Object.values(roster).map(p => p.name));
                  // All position groups present in this year's data
                  const allBases = ["QB","RB","WR","TE","OL","DEF","HC"];

                  const posGroups = allBases.map(baseId => {
                    const players = yearData[baseId] || [];
                    if (players.length === 0) return null;
                    const openSlots = unfilledSlots.filter(s => getBaseId(s.id) === baseId);
                    const slotMeta = SLOTS.find(s => getBaseId(s.id) === baseId);
                    return { baseId, players, openSlots, icon: slotMeta?.icon, label: slotMeta?.label };
                  }).filter(Boolean);

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 4 }}>
                      {posGroups.map(({ baseId, players, openSlots, icon, label }) => {
                        const positionFull = openSlots.length === 0;
                        return (
                          <div key={baseId}>
                            <div style={{ fontSize: 10, letterSpacing: 4, color: positionFull ? "#3a2010" : "#ff5500", textTransform: "uppercase", marginBottom: 10 }}>
                              {icon} {label}
                              {positionFull && <span style={{ color: "#2a1508", marginLeft: 8, fontStyle: "italic" }}>· position filled</span>}
                              {!positionFull && openSlots.length > 1 && <span style={{ color: "#5a3820", marginLeft: 8 }}>({openSlots.length} slots open)</span>}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                              {players.map((player, i) => {
                                const alreadyDrafted = draftedNames.has(player.name);
                                const canPick = !positionFull && !alreadyDrafted;
                                return (
                                  <div key={i} style={{ background: alreadyDrafted ? "#130c05" : positionFull ? "#130c05" : "#1c1008",
                                    border: `1px solid ${alreadyDrafted ? "#1e1006" : positionFull ? "#1e1006" : "#3a1e08"}`,
                                    borderRadius: 5, padding: "13px 15px", opacity: (alreadyDrafted || positionFull) ? 0.5 : 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                      <div style={{ fontWeight: 700, fontSize: 14, color: alreadyDrafted ? "#5a3820" : "#f0e6d3" }}>{player.name}</div>
                                      {alreadyDrafted && <div style={{ fontSize: 10, color: "#5a3820", letterSpacing: 2, textTransform: "uppercase", marginLeft: 10, whiteSpace: "nowrap" }}>Already on team</div>}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#6a4020", lineHeight: 1.55, marginBottom: canPick ? 10 : 0 }}>{player.stats}</div>
                                    {canPick && (
                                      <button onClick={() => pickPlayer(openSlots[0].id, player, rolledYear)}
                                        style={{ background: "#ff5500", border: "none", borderRadius: 3,
                                          padding: "5px 12px", fontSize: 10, fontWeight: 700, letterSpacing: 2,
                                          color: "#f0e6d3", cursor: "pointer", textTransform: "uppercase",
                                          fontFamily: "inherit" }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                                        + Draft
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {allFilled && (
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <button onClick={simulateSeason} style={btn("#ff5500")}>
                  🏟️  SIMULATE SEASON
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── SIMULATING ── */}
        {phase === "simulate" && (
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <div style={{ fontSize: 44, marginBottom: 20, display: "inline-block",
              animation: "spin 1.2s linear infinite" }}>🎲</div>
            <div style={{ fontSize: 14, color: "#c4a882", letterSpacing: 3, textTransform: "uppercase" }}>Simulating Season…</div>
            <div style={{ fontSize: 11, color: "#3a2010", marginTop: 8 }}>The Dog Pound awaits its destiny</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && result && (
          <div style={{ marginTop: 28 }}>

            {/* Playoff verdict hero */}
            {result.isChampion ? (
              <div style={{ textAlign: "center", background: "linear-gradient(180deg, #0a1a06 0%, #0c0905 100%)",
                border: "1px solid #2a5010", borderRadius: 8, padding: "36px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 54, lineHeight: 1, marginBottom: 8 }}>🏆</div>
                <div style={{ fontSize: "clamp(32px, 9vw, 52px)", fontWeight: 900, letterSpacing: -1, lineHeight: 1,
                  background: "linear-gradient(135deg, #4ade80, #86efac, #4ade80)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  SUPER BOWL<br />CHAMPIONS
                </div>
                <div style={{ fontSize: 13, color: "#4ade80", marginTop: 10, letterSpacing: 3, textTransform: "uppercase" }}>
                  {result.record} · Cleveland Finally Gets Its Parade
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", background: "#110a04",
                border: `1px solid ${result.playoffResult === "MISSED PLAYOFFS" ? "#2a1506" : "#3a2a10"}`,
                borderRadius: 8, padding: "36px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 10, letterSpacing: 6, color: "#5a3820", textTransform: "uppercase", marginBottom: 10 }}>
                  Regular Season
                </div>
                <div style={{ fontSize: "clamp(52px, 14vw, 80px)", fontWeight: 900, letterSpacing: -3, lineHeight: 1,
                  color: result.wins >= 10 ? "#fbbf24" : result.wins >= 7 ? "#f97316" : "#f43f5e" }}>
                  {result.record}
                </div>
                <div style={{ marginTop: 12, display: "inline-block", background: "#1a1006",
                  border: "1px solid #3a2510", borderRadius: 3, padding: "5px 14px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color:
                    result.playoffResult === "MISSED PLAYOFFS" ? "#f43f5e" :
                    result.playoffResult.includes("SUPER BOWL") ? "#fbbf24" : "#f97316" }}>
                    {result.playoffResult}
                  </span>
                </div>
              </div>
            )}

            {/* Team Score */}
            <div style={{ textAlign: "center", background: "#110a04", border: "1px solid #2a1a0d",
              borderRadius: 8, padding: "12px 20px", marginBottom: 8 }}>
              <div style={{ fontSize: 10, letterSpacing: 6, color: "#5a3820", textTransform: "uppercase", marginBottom: 4 }}>
                Team Score
              </div>
              <div style={{ fontSize: "clamp(24px, 7vw, 36px)", fontWeight: 900, letterSpacing: -1, lineHeight: 1,
                background: "linear-gradient(135deg, #ff5500, #ff9900)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {result.teamScore}
                <span style={{ fontSize: "clamp(12px, 3vw, 16px)", fontWeight: 400, WebkitTextFillColor: "#5a3820" }}>/100</span>
              </div>
            </div>

            {/* Leaderboard buttons */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "10px 0 18px" }}>
              {!submitted ? (
                !showNamePrompt ? (
                  <button onClick={() => setShowNamePrompt(true)} style={{
                    background: "transparent", border: "1px solid #3a2a18", color: "#a07040",
                    fontSize: 11, padding: "5px 12px", borderRadius: 4, cursor: "pointer",
                    fontFamily: "inherit", letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>+ Add to Leaderboard</button>
                ) : (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value.slice(0, 24))}
                      placeholder="Your name"
                      onKeyDown={async e => { if (e.key === "Enter") await handleSubmit(); }}
                      style={{
                        background: "#1a120a", border: "1px solid #3a2a18", color: "#e0c090",
                        fontSize: 12, padding: "5px 10px", borderRadius: 4, outline: "none",
                        fontFamily: "inherit", width: 130,
                      }}
                    />
                    <button onClick={handleSubmit} disabled={submitting || !playerName.trim()} style={{
                      background: submitting ? "#1a120a" : "#ff5500", border: "none", color: "#fff",
                      fontSize: 11, padding: "5px 12px", borderRadius: 4, cursor: "pointer",
                      fontFamily: "inherit", letterSpacing: "0.08em", textTransform: "uppercase",
                      opacity: (!playerName.trim() || submitting) ? 0.5 : 1,
                    }}>{submitting ? "..." : "Submit"}</button>
                    <button onClick={() => setShowNamePrompt(false)} style={{
                      background: "transparent", border: "none", color: "#4a3828", fontSize: 14,
                      cursor: "pointer", padding: "4px 6px",
                    }}>✕</button>
                  </div>
                )
              ) : (
                <span style={{ fontSize: 11, color: "#6a8a4a", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  ✓ Added to Leaderboard
                </span>
              )}
              <button onClick={handleViewLeaderboard} style={{
                background: "transparent", border: "1px solid #3a2a18", color: "#a07040",
                fontSize: 11, padding: "5px 12px", borderRadius: 4, cursor: "pointer",
                fontFamily: "inherit", letterSpacing: "0.08em", textTransform: "uppercase",
              }}>↗ View Leaderboard</button>
            </div>

            {/* Leaderboard Modal */}
            {showLeaderboard && (
              <div onClick={() => { setShowLeaderboard(false); setRosterPopup(null); }} style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100,
                display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
              }}>
                <div onClick={e => e.stopPropagation()} style={{
                  background: "#130e08", border: "1px solid #2a1e10", borderRadius: 10,
                  width: "100%", maxWidth: 500, maxHeight: "80vh", display: "flex",
                  flexDirection: "column", overflow: "hidden",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 16px", borderBottom: "1px solid #1e1508" }}>
                    <span style={{ fontSize: 12, letterSpacing: "0.15em", color: "#ff9900",
                      fontFamily: "inherit", textTransform: "uppercase" }}>🏆 Leaderboard</span>
                    <button onClick={() => { setShowLeaderboard(false); setRosterPopup(null); }} style={{
                      background: "none", border: "none", color: "#5a4030", fontSize: 18,
                      cursor: "pointer", lineHeight: 1,
                    }}>✕</button>
                  </div>
                  <div style={{ overflowY: "auto", flex: 1 }}>
                    {leaderboardLoading ? (
                      <p style={{ color: "#5a4030", textAlign: "center", padding: 24, fontSize: 13 }}>Loading...</p>
                    ) : leaderboardData.length === 0 ? (
                      <p style={{ color: "#5a4030", textAlign: "center", padding: 24, fontSize: 13 }}>No entries yet. Be the first!</p>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1e1508" }}>
                            {["#", "Name", "Record", "Score", "Roster"].map(h => (
                              <th key={h} style={{ padding: "8px 12px", textAlign: "left",
                                color: "#5a4030", fontWeight: 500, fontSize: 11,
                                letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboardData.map((entry, i) => (
                            <tr key={entry.id} style={{ borderBottom: "1px solid #1a1208",
                              background: i % 2 === 0 ? "transparent" : "#0d0a06" }}>
                              <td style={{ padding: "9px 12px", color: "#3a2a18", fontSize: 11 }}>{i + 1}</td>
                              <td style={{ padding: "9px 12px", color: "#e0c090", fontWeight: 500 }}>{entry.name}</td>
                              <td style={{ padding: "9px 12px", color: "#c09060" }}>{entry.record}</td>
                              <td style={{ padding: "9px 12px", color: "#ff9900", fontWeight: 600 }}>{entry.score}</td>
                              <td style={{ padding: "9px 12px" }}>
                                <button onClick={() => setRosterPopup(rosterPopup?.id === entry.id ? null : { ...entry.roster, id: entry.id })}
                                  style={{ background: "#1e1508", border: "1px solid #2a1e10",
                                    color: "#a07040", fontSize: 10, padding: "3px 8px", borderRadius: 3,
                                    cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                  {rosterPopup?.id === entry.id ? "Hide" : "View"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {/* Inline roster popup */}
                    {rosterPopup && (
                      <div style={{ margin: "0 12px 12px", background: "#0d0a06",
                        border: "1px solid #2a1e10", borderRadius: 6, padding: "12px 14px" }}>
                        <p style={{ fontSize: 10, color: "#5a4030", textTransform: "uppercase",
                          letterSpacing: "0.1em", marginBottom: 8 }}>Roster</p>
                        {SLOTS.map(slot => {
                          const p = rosterPopup[slot.id];
                          if (!p) return null;
                          return (
                            <div key={slot.id} style={{ display: "flex", gap: 8, alignItems: "baseline",
                              padding: "3px 0", borderBottom: "1px solid #1a1208" }}>
                              <span style={{ fontSize: 10, color: "#3a2a18", width: 30,
                                textTransform: "uppercase", flexShrink: 0 }}>{slot.label}</span>
                              <span style={{ fontSize: 12, color: "#c09060" }}>{p.name}</span>
                              <span style={{ fontSize: 11, color: "#3a2a18", marginLeft: "auto" }}>{p.year}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Regular season analysis */}
            <div style={{ background: "#110a04", border: "1px solid #1e1006", borderRadius: 5, padding: "18px", marginBottom: 8 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#ff5500", textTransform: "uppercase", marginBottom: 9 }}>Season Analysis</div>
              <p style={{ color: "#c4a882", lineHeight: 1.85, margin: 0, fontSize: 13 }}>{result.narrative}</p>
            </div>

            {/* Playoff story */}
            <div style={{ background: result.isChampion ? "#0a1a06" : "#110a04",
              border: `1px solid ${result.isChampion ? "#2a5010" : "#1e1006"}`,
              borderRadius: 5, padding: "18px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: result.isChampion ? "#4ade80" : "#ff5500", textTransform: "uppercase", marginBottom: 9 }}>
                {result.isChampion ? "🏆 Playoff Run" : result.playoffResult === "MISSED PLAYOFFS" ? "📺 Watching From Home" : "🏈 Playoff Run"}
              </div>
              <p style={{ color: "#c4a882", lineHeight: 1.85, margin: 0, fontSize: 13 }}>{result.playoffNarrative}</p>
            </div>

            {/* Grades */}
            <div style={{ background: "#110a04", border: "1px solid #1e1006", borderRadius: 5, padding: "18px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#ff5500", textTransform: "uppercase", marginBottom: 12 }}>Unit Grades</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
                {["Offense","Defense","Coaching"].map(g => (
                  <div key={g} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    background: "#160d06", borderRadius: 3, padding: "8px 10px" }}>
                    <span style={{ fontSize: 9, color: "#7a5030", textTransform: "uppercase", letterSpacing: 1 }}>{g}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: gradeColor(result.grades[g]) }}>{result.grades[g]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div style={{ background: "#110a04", border: "1px solid #1e2a10", borderRadius: 5, padding: "16px" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#4ade80", textTransform: "uppercase", marginBottom: 8 }}>⭐ MVP</div>
                <p style={{ color: "#c4a882", lineHeight: 1.65, margin: 0, fontSize: 12 }}>{result.mvp}</p>
              </div>
              <div style={{ background: "#110a04", border: "1px solid #2a1006", borderRadius: 5, padding: "16px" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#f43f5e", textTransform: "uppercase", marginBottom: 8 }}>💀 Liability</div>
                <p style={{ color: "#c4a882", lineHeight: 1.65, margin: 0, fontSize: 12 }}>{result.weakness}</p>
              </div>
            </div>

            {/* Dawg Pound Moment */}
            <div style={{ background: "#180a04", border: "1px solid #4a2010", borderRadius: 5, padding: "18px", marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#ff5500", textTransform: "uppercase", marginBottom: 9 }}>🐶 Dawg Pound Moment</div>
              <p style={{ color: "#c4a882", lineHeight: 1.8, margin: 0, fontStyle: "italic", fontSize: 13 }}>{result.dawgPoundMoment}</p>
            </div>

            {/* Roster recap */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#3a2010", textTransform: "uppercase", marginBottom: 10 }}>Your Roster</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SLOTS.map(s => {
                  const p = roster[s.id];
                  return (
                    <div key={s.id} style={{ background: "#110a04", border: "1px solid #1e1006",
                      borderRadius: 3, padding: "4px 9px", fontSize: 11 }}>
                      <span style={{ color: "#ff5500", marginRight: 5 }}>{s.label}</span>
                      <span style={{ color: "#c4a882" }}>{p?.name}</span>
                      <span style={{ color: "#2a1508", marginLeft: 5 }}>'{String(p?.year).slice(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={() => {
                setRoster({}); setRolledYear(null); setRollDisplay(null);
                setUsedYears([]); setResult(null); setPhase("intro");
                setSubmitted(false); setShowNamePrompt(false); setPlayerName("");
              }} style={btn("#2a1506", false, "#ff5500")}>
                DRAFT AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{ height: 3, background: "linear-gradient(90deg, #c0300a, #ff5500, #ff8800, #ff5500, #c0300a)", position: "relative", zIndex: 2 }} />

      {/* Legal Disclaimer */}
      <div style={{
        padding: "24px 20px",
        borderTop: "1px solid #1e1a14",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: 11,
          lineHeight: 1.7,
          color: "#4a4035",
          maxWidth: 560,
          margin: "0 auto",
          fontFamily: "Georgia, serif",
          letterSpacing: "0.01em",
        }}>
          <span style={{ color: "#6a5a45", fontStyle: "italic" }}>Super Browns</span> is an unofficial fan project created for entertainment purposes only.
          It is not affiliated with, endorsed by, or connected to the Cleveland Browns, the National Football League (NFL),
          or any of the players, coaches, or personnel referenced within. All player and coach names are used in a
          historical, informational context and remain the property of their respective individuals.
          No intellectual property of the Cleveland Browns organization or the NFL is claimed or implied.
          This project is a work of fan creativity and carries no commercial intent.
        </p>
      </div>

    </div>
  );
}

function btn(bg, disabled = false, border = null) {
  return {
    background: bg,
    color: "#f0e6d3",
    border: border ? `1px solid ${border}` : "none",
    borderRadius: 3,
    padding: "13px 30px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    fontFamily: "inherit",
    transition: "opacity 0.2s",
  };
}

function arrowBtn(disabled) {
  return {
    width: 28, height: 28,
    background: disabled ? "#110a04" : "#1e1008",
    border: `1px solid ${disabled ? "#1a0e06" : "#3a1e08"}`,
    borderRadius: 3,
    color: disabled ? "#2a1508" : "#ff5500",
    fontSize: 11,
    cursor: disabled ? "default" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "inherit",
    padding: 0,
  };
}

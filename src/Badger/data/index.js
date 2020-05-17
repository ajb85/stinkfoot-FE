import accolade from './accolade.json';
import accomplishment from './accomplishment.json';
import achievement from './achievement.json';
import dayJob from './dayJob.json';
import defeat from './defeat.json';
import exploration from './exploration.json';
import history from './history.json';

const badges = {
  accolade,
  accomplishment,
  achievement,
  dayJob,
  defeat,
  exploration,
  history,
};

for (let key in badges) {
  badges[key].forEach((b, i) => {
    b.completed = false;
    b.badgeIndex = i;
    b.badgeSection = key;
  });
}

export default badges;

export const badgeTypes = [
  { display: 'Accolade', code: 'accolade' },
  { display: 'Accomplishment', code: 'accomplishment' },
  { display: 'Achievement', code: 'achievement' },
  { display: 'Day Job', code: 'dayJob' },
  { display: 'Defeat', code: 'defeat' },
  { display: 'Exploration', code: 'exploration' },
  { display: 'History', code: 'history' },
];

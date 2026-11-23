export const categories = {
  rackets: { label: 'Rackets', number: '01', title: 'Find your\nperfect frame.', description: 'From pinpoint control to easy power. Discover the racket that feels like an extension of your game.', tiny: 'CONTROL · POWER · SPIN' },
  shoes: { label: 'Shoes', number: '02', title: 'Move with\nintention.', description: 'Explosive first steps, dependable grip and support that stands up to every rally.', tiny: 'TRACTION · STABILITY · SPEED' },
  bags: { label: 'Bags', number: '03', title: 'Everything in\nits place.', description: 'Pack smart for practice, tournaments and every court session in between.', tiny: 'CAPACITY · STORAGE · STYLE' },
  accessories: { label: 'Accessories', number: '04', title: 'The little things.\nBig difference.', description: 'Strings, grips, balls and the finishing touches that help your setup feel complete.', tiny: 'STRINGS · GRIPS · BALLS' }
};
export const categoryPaths = Object.keys(categories).map(x => `/${x}`);

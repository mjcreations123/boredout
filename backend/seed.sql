-- BoredOut — demo seed data for D1.
-- Idempotent: explicit ids + INSERT OR IGNORE. Safe to re-run.
-- Demo people are bots (is_bot = 1, no password) so they can't be logged into.

INSERT OR IGNORE INTO users (id, email, name, initials, color, mood, interests, bio, is_bot, last_seen) VALUES
 ('demo-maya',  'maya@demo.boredout',  'Maya Chen',     'MC', '#5C7152', 'Down for anything',          '["Coffee","Hiking","Gaming"]',        'Weekend hiker, weekday barista hopper. Always up for a spontaneous adventure.', 1, unixepoch()),
 ('demo-jordan','jordan@demo.boredout','Jordan Park',   'JP', '#B07D3C', 'Looking for a workout buddy', '["Sports","Fitness","Food"]',         'Training for a half marathon. Will trade running tips for taco recommendations.', 1, unixepoch() - 86400),
 ('demo-aisha', 'aisha@demo.boredout', 'Aisha Williams','AW', '#8A5A6A', 'Want to explore the city',    '["Art","Food","Photography"]',        'Gallery wanderer and amateur street photographer. Show me your favorite hidden spot.', 1, unixepoch() - 86400),
 ('demo-tyler', 'tyler@demo.boredout', 'Tyler Brooks',  'TB', '#AF553D', 'Up for games or movies',      '["Gaming","Movies","Reading"]',       'Board game hoarder and movie buff. My couch has a 200-game library.', 1, unixepoch()),
 ('demo-sam',   'sam@demo.boredout',   'Sam Rivera',    'SR', '#5B6485', 'Bored, looking for something', '["Music","Travel","Coffee"]',         'Live music chaser. If there is a show, I am probably there.', 1, unixepoch() - 86400),
 ('demo-priya', 'priya@demo.boredout', 'Priya Nair',    'PN', '#3F7672', 'Looking for brunch plans',    '["Food","Reading","Fitness"]',        'Brunch enthusiast and yoga regular. Bonus points if there are bottomless mimosas.', 1, unixepoch() - 86400),
 ('demo-chris', 'chris@demo.boredout', 'Chris Lee',     'CL', '#8C6A43', 'Down for outdoor stuff',      '["Hiking","Sports","Photography"]',   'Cyclist and nature nerd. I know every greenway in the city.', 1, unixepoch()),
 ('demo-zoe',   'zoe@demo.boredout',   'Zoe Thomas',    'ZT', '#6B774F', 'Want to try something new',    '["Art","Food","Music"]',              'Serial hobbyist — currently into pottery and trying every ramen spot in town.', 1, unixepoch() - 86400);

INSERT OR IGNORE INTO activities (id, cat, emoji, title, location, dist, time, cost, going, badge, description) VALUES
 (1,  'outdoor', '🏞️', 'Riverside Park Nature Walk',     'Riverside Park',          '0.4 mi', 'Anytime',  'Free',  12, 'free', 'A peaceful loop along the water. Great for clearing your head, people-watching, or a slow stroll with someone new.'),
 (2,  'food',    '☕', 'Specialty Coffee Crawl',          'Brooklyn Heights',        '1.2 mi', 'Flexible', '~$15',  7,  NULL,   'Hit three of the best indie cafés in the neighborhood. Compare pours, argue about oat milk, make a friend.'),
 (3,  'arts',    '🎨', 'Open Studio Art Night',           'Bushwick Collective',     '2.1 mi', '7 PM',     '$10',   23, 'hot',  'Local artists open their studios. Paint, sketch, or just wander with a drink. Zero skill required.'),
 (4,  'sports',  '🏀', 'Pickup Basketball',               'West 4th Courts',         '0.8 mi', '4 PM',     'Free',  18, 'free', 'Casual 3v3 runs at the famous Cage. All levels welcome — call next and you are in.'),
 (5,  'games',   '🎳', 'Retro Arcade Night',              'Barcade Williamsburg',    '3.0 mi', '6 PM',     '$20',   31, 'hot',  'Pinball, Street Fighter, skee-ball, and craft beer. The best kind of nostalgia overload.'),
 (6,  'music',   '🎵', 'Free Jazz in the Park',           'Central Park Bandshell',  '1.5 mi', '3 PM',     'Free',  45, 'free', 'Live quartet under the trees. Bring a blanket and snacks; stay for the golden-hour set.'),
 (7,  'movies',  '🎬', 'Outdoor Cinema Night',            'Bryant Park Lawn',        '0.9 mi', '8 PM',     'Free',  62, 'free', 'Classic film on the big lawn screen. Arrive early for a good blanket spot — it fills up fast.'),
 (8,  'social',  '🧩', 'Board Game Café Meetup',          'Hex & Co.',               '1.1 mi', '2 PM',     '$12',   9,  NULL,   'Hundreds of games on shelves and friendly strangers at every table. Catan? Codenames? Dealer''s choice.'),
 (9,  'outdoor', '🚴', 'Group Bike Ride Along Hudson',    'Pier 84 Entrance',        '0.6 mi', '10 AM',    'Free',  14, 'free', 'An easy 8-mile cruise down the greenway. Rentals available at the pier if you do not have wheels.'),
 (10, 'food',    '🍜', 'Ramen Tasting Tour',              'East Village',            '1.8 mi', 'Flexible', '~$40',  5,  NULL,   'Three legendary ramen spots, one evening. Come hungry, leave transcendent.'),
 (11, 'arts',    '🖼️', 'MoMA Late Night Hours',           'Midtown West',            '2.4 mi', 'Until 9 PM','$25',   11, NULL,   'The museum after dark — smaller crowds, moody lighting, and the good gift shop still open.'),
 (12, 'sports',  '🧗', 'Bouldering Drop-In Session',      'The Cliffs LIC',          '3.5 mi', 'All day',  '$22',   8,  NULL,   'No ropes, no experience needed. Shoes for rent, problems for every level, instant arm pump.');

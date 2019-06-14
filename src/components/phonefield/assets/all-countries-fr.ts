// Array of country objects for the flag dropdown.

// Here is the criteria for the plugin to support a given country/territory
// - It has an iso2 code: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
// - It has it's own country calling code (it is not a sub-region of another country): https://en.wikipedia.org/wiki/List_of_country_calling_codes
// - It has a flag in the region-flags project: https://github.com/behdad/region-flags/tree/gh-pages/png
// - It is supported by libphonenumber (it must be listed on this page): https://github.com/googlei18n/libphonenumber/blob/master/resources/ShortNumberMetadata.xml

// Each country array has the following information:
// [
//    Country name,
//    iso2 code,
//    International dial code,
//    Order (if >1 country with same dial code),
//    Area codes
// ]
const allCountriesFr: any = [
    [
        'Afghanistan (‫افغانستان‬‎)',
        'af',
        '93'
    ],
    [
        'Albanie (Shqipëri)',
        'al',
        '355'
    ],
    [
        'Algérie (‫الجزائر‬‎)',
        'dz',
        '213'
    ],
    [
        'Samoa américaines',
        'as',
        '1684'
    ],
    [
        'Andorre',
        'ad',
        '376'
    ],
    [
        'Angola',
        'ao',
        '244'
    ],
    [
        'Anguilla',
        'ai',
        '1264'
    ],
    [
        'Antigua-et-Barbuda',
        'ag',
        ''
    ],
    [
        'Argentine',
        'ar',
        '54'
    ],
    [
        'Arménie (Հայաստան)',
        'am',
        '374'
    ],
    [
        'Aruba',
        'aw',
        '297'
    ],
    [
        'Australie',
        'au',
        '61',
        0
    ],
    [
        'Autriche (Österreich)',
        'at',
        '43'
    ],
    [
        'Azerbaïjan (Azərbaycan)',
        'az',
        '994'
    ],
    [
        'Bahamas',
        'bs',
        '1242'
    ],
    [
        'Bahreïn (‫البحرين‬‎)',
        'bh',
        '973'
    ],
    [
        'Bangladesh (বাংলাদেশ)',
        'bd',
        '880'
    ],
    [
        'Barbade',
        'bb',
        '1246'
    ],
    [
        'Biélorussie (Беларусь)',
        'by',
        '375'
    ],
    [
        'Belgique (België)',
        'be',
        '32'
    ],
    [
        'Belize',
        'bz',
        '501'
    ],
    [
        'Bénin (Bénin)',
        'bj',
        '229'
    ],
    [
        'Bermudes',
        'bm',
        '1441'
    ],
    [
        'Bhoutan (འབྲུག)',
        'bt',
        '975'
    ],
    [
        'Bolivie',
        'bo',
        '591'
    ],
    [
        'Bosnie-Herzégovine (Босна и Херцеговина)',
        'ba',
        '387'
    ],
    [
        'Botswana',
        'bw',
        '267'
    ],
    [
        'Brésil (Brasil)',
        'br',
        '55'
    ],
    [
        'Territoire britannique de l\'océan Indien',
        'io',
        '246'
    ],
    [
        'Îles Vierges britanniques',
        'vg',
        '1284'
    ],
    [
        'Brunei',
        'bn',
        '673'
    ],
    [
        'Bulgarie (България)',
        'bg',
        '359'
    ],
    [
        'Burkina Faso',
        'bf',
        '226'
    ],
    [
        'Burundi (Uburundi)',
        'bi',
        '257'
    ],
    [
        'Cambodge (កម្ពុជា)',
        'kh',
        '855'
    ],
    [
        'Cameroun',
        'cm',
        '237'
    ],
    [
        'Canada',
        'ca',
        '1',
        1,
        ['204', '226', '236', '249', '250', '289', '306', '343', '365', '387', '403', '416', '418', '431', '437', '438', '450', '506', '514', '519', '548', '579', '581', '587', '604', '613', '639', '647', '672', '705', '709', '742', '778', '780', '782', '807', '819', '825', '867', '873', '902', '905']
    ],
    [
        'Cap-Vert (Kabu Verdi)',
        'cv',
        '238'
    ],
    [
        'Pays-Bas caribéens',
        'bq',
        '599',
        1
    ],
    [
        'Îles Caïmans',
        'ky',
        '1345'
    ],
    [
        'République centrafricaine',
        'cf',
        '236'
    ],
    [
        'Tchad',
        'td',
        '235'
    ],
    [
        'Chili (Chile)',
        'cl',
        '56'
    ],
    [
        'Chine (中国)',
        'cn',
        '86'
    ],
    [
        'Île Christmas',
        'cx',
        '61',
        2
    ],
    [
        'Îles Cocos (Keeling)',
        'cc',
        '61',
        1
    ],
    [
        'Colombie',
        'co',
        '57'
    ],
    [
        'Comores (‫جزر القمر‬‎)',
        'km',
        '269'
    ],
    [
        'République démocratique du Congo (Jamhuri ya Kidemokrasia ya Kongo)',
        'cd',
        '243'
    ],
    [
        'République du Congo (Congo-Brazzaville)',
        'cg',
        '242'
    ],
    [
        'Îles Cook',
        'ck',
        '682'
    ],
    [
        'Costa Rica',
        'cr',
        '506'
    ],
    [
        'Côte d’Ivoire',
        'ci',
        '225'
    ],
    [
        'Croatie (Hrvatska)',
        'hr',
        '385'
    ],
    [
        'Cuba',
        'cu',
        '53'
    ],
    [
        'Curaçao',
        'cw',
        '599',
        0
    ],
    [
        'Chypre (Κύπρος)',
        'cy',
        '357'
    ],
    [
        'République tchèque (Česká republika)',
        'cz',
        '420'
    ],
    [
        'Danemark (Danmark)',
        'dk',
        '45'
    ],
    [
        'Djibouti',
        'dj',
        '253'
    ],
    [
        'Dominique',
        'dm',
        '1767'
    ],
    [
        'République dominicaine (República Dominicana)',
        'do',
        '1',
        2,
        ['809', '829', '849']
    ],
    [
        'Équateur',
        'ec',
        '593'
    ],
    [
        'Égypte (‫مصر‬‎)',
        'eg',
        '20'
    ],
    [
        'Salvador (El Salvador)',
        'sv',
        '503'
    ],
    [
        'Guinée équatoriale (Guinea Ecuatorial)',
        'gq',
        '240'
    ],
    [
        'Érythrée (ኤርትራ)',
        'er',
        '291'
    ],
    [
        'Estonie (Eesti)',
        'ee',
        '372'
    ],
    [
        'Éthiopie',
        'et',
        '251'
    ],
    [
        'Géorgie du Sud-et-les îles Sandwich du Sud (Islas Malvinas)',
        'fk',
        '500'
    ],
    [
        'Îles Féroé (Føroyar)',
        'fo',
        '298'
    ],
    [
        'Fiji',
        'fj',
        '679'
    ],
    [
        'Finlande (Suomi)',
        'fi',
        '358',
        0
    ],
    [
        'France',
        'fr',
        '33'
    ],
    [
        'Guyane française',
        'gf',
        '594'
    ],
    [
        'Polynésie française',
        'pf',
        '689'
    ],
    [
        'Gabon',
        'ga',
        '241'
    ],
    [
        'Gambie (Gambia)',
        'gm',
        '220'
    ],
    [
        'Géorgie (საქართველო)',
        'ge',
        '995'
    ],
    [
        'Allemagne (Deutschland)',
        'de',
        '49'
    ],
    [
        'Ghana',
        'gh',
        '233'
    ],
    [
        'Gibraltar',
        'gi',
        '350'
    ],
    [
        'Grèce (Ελλάδα)',
        'gr',
        '30'
    ],
    [
        'Groenland (Kalaallit Nunaat)',
        'gl',
        '299'
    ],
    [
        'Grenade',
        'gd',
        '1473'
    ],
    [
        'Guadeloupe',
        'gp',
        '590',
        0
    ],
    [
        'Guam',
        'gu',
        '1671'
    ],
    [
        'Guatémala (Guatemala)',
        'gt',
        '502'
    ],
    [
        'Guernesey (Guernsey)',
        'gg',
        '44',
        1
    ],
    [
        'Guinée',
        'gn',
        '224'
    ],
    [
        'Guiné Bissau',
        'gw',
        '245'
    ],
    [
        'Guyana',
        'gy',
        '592'
    ],
    [
        'Haïti',
        'ht',
        '509'
    ],
    [
        'Honduras',
        'hn',
        '504'
    ],
    [
        'Hong Kong (香港)',
        'hk',
        '852'
    ],
    [
        'Hongrie (Magyarország)',
        'hu',
        '36'
    ],
    [
        'Islande (Ísland)',
        'is',
        '354'
    ],
    [
        'Inde (भारत)',
        'in',
        '91'
    ],
    [
        'Indonésie (Indonesia)',
        'id',
        '62'
    ],
    [
        'Iran (‫ایران‬‎)',
        'ir',
        '98'
    ],
    [
        'Iraq (‫العراق‬‎)',
        'iq',
        '964'
    ],
    [
        'Ireland (Irlande)',
        'ie',
        '353'
    ],
    [
        'Île de Man (Isle of Man)',
        'im',
        '44',
        2
    ],
    [
        'Israël (‫ישראל‬‎)',
        'il',
        '972'
    ],
    [
        'Italie (Italia)',
        'it',
        '39',
        0
    ],
    [
        'Jamaïque (Jamaica)',
        'jm',
        '1876'
    ],
    [
        'Japon (日本)',
        'jp',
        '81'
    ],
    [
        'Jersey',
        'je',
        '44',
        3
    ],
    [
        'Jordanie (‫الأردن‬‎)',
        'jo',
        '962'
    ],
    [
        'Kazakhstan (Казахстан)',
        'kz',
        '7',
        1
    ],
    [
        'Kenya',
        'ke',
        '254'
    ],
    [
        'Kiribati',
        'ki',
        '686'
    ],
    [
        'Kosovo',
        'xk',
        '383'
    ],
    [
        'Koweït (‫الكويت‬‎)',
        'kw',
        '965'
    ],
    [
        'Kirghizistan (Кыргызстан)',
        'kg',
        '996'
    ],
    [
        'Laos (ລາວ)',
        'la',
        '856'
    ],
    [
        'Lettonie (Latvija)',
        'lv',
        '371'
    ],
    [
        'Liban (‫لبنان‬‎)',
        'lb',
        '961'
    ],
    [
        'Lesotho',
        'ls',
        '266'
    ],
    [
        'Liberia',
        'lr',
        '231'
    ],
    [
        'Libye (‫ليبيا‬‎)',
        'ly',
        '218'
    ],
    [
        'Liechtenstein',
        'li',
        '423'
    ],
    [
        'Lituanie (Lietuva)',
        'lt',
        '370'
    ],
    [
        'Luxembourg',
        'lu',
        '352'
    ],
    [
        'Macao (澳門)',
        'mo',
        '853'
    ],
    [
        'Macédoine du Nord (FYROM) (Македонија)',
        'mk',
        '389'
    ],
    [
        'Madagascar (Madagasikara)',
        'mg',
        '261'
    ],
    [
        'Malawi',
        'mw',
        '265'
    ],
    [
        'Malaisie (Malaysia)',
        'my',
        '60'
    ],
    [
        'Maldives',
        'mv',
        '960'
    ],
    [
        'Mali',
        'ml',
        '223'
    ],
    [
        'Malte (Malta)',
        'mt',
        '356'
    ],
    [
        'Îles Marshall (Marshall Islands)',
        'mh',
        '692'
    ],
    [
        'Martinique',
        'mq',
        '596'
    ],
    [
        'Mauritanie (‫موريتانيا‬‎)',
        'mr',
        '222'
    ],
    [
        'Maurice (Moris)',
        'mu',
        '230'
    ],
    [
        'Mayotte',
        'yt',
        '262',
        1
    ],
    [
        'Mexique (México)',
        'mx',
        '52'
    ],
    [
        'Micronésie (Micronesia)',
        'fm',
        '691'
    ],
    [
        'Moldavie (Republica Moldova)',
        'md',
        '373'
    ],
    [
        'Monaco',
        'mc',
        '377'
    ],
    [
        'Mongolie (Монгол)',
        'mn',
        '976'
    ],
    [
        'Monténégro (Crna Gora)',
        'me',
        '382'
    ],
    [
        'Montserrat',
        'ms',
        '1664'
    ],
    [
        'Maroc (‫المغرب‬‎)',
        'ma',
        '212',
        0
    ],
    [
        'Mozambique (Moçambique)',
        'mz',
        '258'
    ],
    [
        'Birmanie (Burma) (မြန်မာ)',
        'mm',
        '95'
    ],
    [
        'Namibie (Namibië)',
        'na',
        '264'
    ],
    [
        'Nauru',
        'nr',
        '674'
    ],
    [
        'Népal (नेपाल)',
        'np',
        '977'
    ],
    [
        'Pays-Bas (Nederland)',
        'nl',
        '31'
    ],
    [
        'Nouvelle-Calédonie (Nouvelle-Calédonie)',
        'nc',
        '687'
    ],
    [
        'Nouvelle-Zélande',
        'nz',
        '64'
    ],
    [
        'Nicaragua',
        'ni',
        '505'
    ],
    [
        'Niger (Nijar)',
        'ne',
        '227'
    ],
    [
        'Nigeria',
        'ng',
        '234'
    ],
    [
        'Niue',
        'nu',
        '683'
    ],
    [
        'Île Norfolk (Norfolk Island)',
        'nf',
        '672'
    ],
    [
        'Corée du Nord (조선 민주주의 인민 공화국)',
        'kp',
        '850'
    ],
    [
        'Îles Mariannes du Nord (Northern Mariana Islands)',
        'mp',
        '1670'
    ],
    [
        'Norvège (Norge)',
        'no',
        '47',
        0
    ],
    [
        'Oman (‫عُمان‬‎)',
        'om',
        '968'
    ],
    [
        'Pakistan (‫پاکستان‬‎)',
        'pk',
        '92'
    ],
    [
        'Palaos (Belau)',
        'pw',
        '680'
    ],
    [
        'Palestine (‫فلسطين‬‎)',
        'ps',
        '970'
    ],
    [
        'Panama (Panamá)',
        'pa',
        '507'
    ],
    [
        'Papouasie-Nouvelle-Guinée',
        'pg',
        '675'
    ],
    [
        'Paraguay',
        'py',
        '595'
    ],
    [
        'Pérou (Perú)',
        'pe',
        '51'
    ],
    [
        'Philippines',
        'ph',
        '63'
    ],
    [
        'Pologne (Polska)',
        'pl',
        '48'
    ],
    [
        'Portugal',
        'pt',
        '351'
    ],
    [
        'Porto Rico',
        'pr',
        '1',
        3,
        ['787', '939']
    ],
    [
        'Qatar (‫قطر‬‎)',
        'qa',
        '974'
    ],
    [
        'La Réunion',
        're',
        '262',
        0
    ],
    [
        'Roumanie (România)',
        'ro',
        '40'
    ],
    [
        'Russie (Россия)',
        'ru',
        '7',
        0
    ],
    [
        'Rwanda',
        'rw',
        '250'
    ],
    [
        'Saint Barthélemy',
        'bl',
        '590',
        1
    ],
    [
        'Saint-Helène (Saint Helena)',
        'sh',
        '290'
    ],
    [
        'Saint-Christophe-et-Niévès (Saint Kitts and Nevis)',
        'kn',
        '1869'
    ],
    [
        'Sainte-Lucie (Saint Lucia)',
        'lc',
        '1758'
    ],
    [
        'Saint-Martin (partie française)',
        'mf',
        '590',
        2
    ],
    [
        'Saint-Pierre-et-Miquelon',
        'pm',
        '508'
    ],
    [
        'Saint-Vincent-et-les-Grenadines (Saint Vincent and the Grenadines)',
        'vc',
        '1784'
    ],
    [
        'Samoa',
        'ws',
        '685'
    ],
    [
        'Saint-Marin (San Marino)',
        'sm',
        '378'
    ],
    [
        'Sao Tomé-et-Principe (São Tomé e Príncipe)',
        'st',
        '239'
    ],
    [
        'Arabie saoudite (‫المملكة العربية السعودية‬‎)',
        'sa',
        '966'
    ],
    [
        'Sénégal',
        'sn',
        '221'
    ],
    [
        'Serbie (Србија)',
        'rs',
        '381'
    ],
    [
        'Seychelles',
        'sc',
        '248'
    ],
    [
        'Sierra Leone',
        'sl',
        '232'
    ],
    [
        'Singapour (Singapore)',
        'sg',
        '65'
    ],
    [
        'Saint-Martin (Sint Maarten)',
        'sx',
        '1721'
    ],
    [
        'Slovaquie (Slovensko)',
        'sk',
        '421'
    ],
    [
        'Slovénie (Slovenija)',
        'si',
        '386'
    ],
    [
        'Îles Salomon (Solomon Islands)',
        'sb',
        '677'
    ],
    [
        'Somalie (Soomaaliya)',
        'so',
        '252'
    ],
    [
        'Afrique du Sud (South Africa)',
        'za',
        '27'
    ],
    [
        'Corée du Sud (대한민국)',
        'kr',
        '82'
    ],
    [
        'Soudan du Sud (‫جنوب السودان‬‎)',
        'ss',
        '211'
    ],
    [
        'Espagne (España)',
        'es',
        '34'
    ],
    [
        'Sri Lanka (ශ්‍රී ලංකාව)',
        'lk',
        '94'
    ],
    [
        'Soudan (‫السودان‬‎)',
        'sd',
        '249'
    ],
    [
        'Suriname',
        'sr',
        '597'
    ],
    [
        'Île Jan Mayen (Svalbard and Jan Mayen)',
        'sj',
        '47',
        1
    ],
    [
        'Eswatini',
        'sz',
        '268'
    ],
    [
        'Suède (Sverige)',
        'se',
        '46'
    ],
    [
        'Suisse (Schweiz)',
        'ch',
        '41'
    ],
    [
        'Syrie (‫سوريا‬‎)',
        'sy',
        '963'
    ],
    [
        'Taiwan (台灣)',
        'tw',
        '886'
    ],
    [
        'Tadjikistan (Tojikiston)',
        'tj',
        '992'
    ],
    [
        'Tanzanie (Tanzania)',
        'tz',
        '255'
    ],
    [
        'Thaïlande (ไทย)',
        'th',
        '66'
    ],
    [
        'Timor oriental (Timor-Leste)',
        'tl',
        '670'
    ],
    [
        'Togo',
        'tg',
        '228'
    ],
    [
        'Tokelau',
        'tk',
        '690'
    ],
    [
        'Tonga',
        'to',
        '676'
    ],
    [
        'Trinité-et-Tobago (Trinidad and Tobago)',
        'tt',
        '1868'
    ],
    [
        'Tunisie (‫تونس‬‎)',
        'tn',
        '216'
    ],
    [
        'Turquie (Türkiye)',
        'tr',
        '90'
    ],
    [
        'Turkménistan (Türkmenistan)',
        'tm',
        '993'
    ],
    [
        'Îles Turques-et-Caïques (Turks and Caicos Islands)',
        'tc',
        '1649'
    ],
    [
        'Tuvalu',
        'tv',
        '688'
    ],
    [
        'Îles Vierges des États-Unis (U.S. Virgin Islands)',
        'vi',
        '1340'
    ],
    [
        'Ouganda (Uganda)',
        'ug',
        '256'
    ],
    [
        'Ukraine (Україна)',
        'ua',
        '380'
    ],
    [
        'Émirats arabes unis (‫الإمارات العربية المتحدة‬‎)',
        'ae',
        '971'
    ],
    [
        'Royaume-Uni (United Kingdom)',
        'gb',
        '44',
        0
    ],
    [
        'États-Unis (United States)',
        'us',
        '1',
        0
    ],
    [
        'Uruguay',
        'uy',
        '598'
    ],
    [
        'Ouzbékistan (Oʻzbekiston)',
        'uz',
        '998'
    ],
    [
        'Vanuatu',
        'vu',
        '678'
    ],
    [
        'Vatican City (Città del Vaticano)',
        'va',
        '379'
    ],
    [
        'Venezuela',
        've',
        '58'
    ],
    [
        'Việt Nam',
        'vn',
        '84'
    ],
    [
        'Wallis-et-Futuna',
        'wf',
        '681'
    ],
    [
        'Sahara occidental (‫الصحراء الغربية‬‎)',
        'eh',
        '212',
        1
    ],
    [
        'Yémen (‫اليمن‬‎)',
        'ye',
        '967'
    ],
    [
        'Zambie',
        'zm',
        '260'
    ],
    [
        'Zimbabwe',
        'zw',
        '263'
    ],
    [
        'Îles Åland (Ahvenanmaa)',
        'ax',
        '358',
        1
    ]
];

export default allCountriesFr.map(country => ({
    name: country[0],
    iso2: country[1],
    dialCode: country[2],
    priority: country[3] || 0,
    areaCodes: country[4] || undefined
}));

// Hardcoded flashcard data for TOEIC vocabulary

export const PRACTICE_MODES = [
  { key: 'study', label: 'Flashcards', icon: '🔄', prefix: 'Từ vựng' },
  { key: 'quiz', label: 'Trắc nghiệm từ vựng', icon: '✏️', prefix: 'Luyện tập' },
  { key: 'match', label: 'Tìm cặp', icon: '🔗', prefix: 'Luyện tập' },
  { key: 'fill', label: 'Dịch nghĩa / Điền từ', icon: '📝', prefix: 'Luyện tập' },
  { key: 'dictation', label: 'Nghe chính tả', icon: '🔊', prefix: 'Luyện tập' },
];

export const FLASHCARD_LISTS = [
  {
    id: 1,
    name: 'List 1',
    words: [
      { id: 1, word: 'subway', phonetic: '/ˈsʌbweɪ/', pos: '(n)', meaningVi: 'đường hầm, tàu điện ngầm', meaningEn: 'a tunnel under the road for people to walk through', examples: ['He ran through the pedestrian [subway].', 'The majority of us feel worried if we walk through a [subway].', "I don't like to travel through the [subway] after dark."] },
      { id: 2, word: 'airport', phonetic: '/ˈeəpɔːrt/', pos: '(n)', meaningVi: 'sân bay', meaningEn: 'the place where you go to get on a plane', examples: ['We arrived at the [airport] two hours early.', 'The [airport] was crowded with travelers.'] },
      { id: 3, word: 'brochure', phonetic: '/broʊˈʃʊr/', pos: '(n)', meaningVi: 'ấn phẩm quảng cáo dưới dạng quyển sách nhỏ', meaningEn: 'a small paper book that gives information about a product or service', examples: ['Pick up a [brochure] at the front desk.', 'The travel [brochure] showed beautiful beaches.'] },
      { id: 4, word: 'rental', phonetic: '/ˈrentl/', pos: '(n)', meaningVi: 'sự cho thuê', meaningEn: 'the act of paying for the use of something (as an apartment or house or car)', examples: ['The [rental] car was waiting at the airport.', 'Monthly [rental] costs have increased.'] },
      { id: 5, word: 'luggage', phonetic: '/ˈlʌɡɪdʒ/', pos: '(n)', meaningVi: 'hành lý', meaningEn: 'bags and cases that you carry your clothes in when you go on a journey', examples: ['Please collect your [luggage] from the carousel.', 'She packed her [luggage] the night before.'] },
      { id: 6, word: 'shipment', phonetic: '/ˈʃɪpmənt/', pos: '(n)', meaningVi: 'sự giao hàng', meaningEn: 'delivery of goods, e.g. carried by a large vehicle', examples: ['The [shipment] will arrive next Monday.', 'We received a large [shipment] of supplies.'] },
      { id: 7, word: 'traveler', phonetic: '/ˈtrævələr/', pos: '(n)', meaningVi: 'khách du lịch', meaningEn: 'a tourist or adventurer who visits many countries', examples: ['The [traveler] explored ancient ruins.', 'Every [traveler] should carry a passport.'] },
      { id: 8, word: 'website', phonetic: '/ˈwebsaɪt/', pos: '(n)', meaningVi: 'trang web', meaningEn: 'a set of internet pages that give information about a particular person or organization', examples: ['Visit our [website] for more details.', 'The company launched a new [website].'] },
      { id: 9, word: 'itinerary', phonetic: '/aɪˈtɪnəreri/', pos: '(n)', meaningVi: 'lịch trình', meaningEn: 'a plan of a journey including the route and the places that you visit', examples: ['Check the [itinerary] before departure.', 'Our [itinerary] includes three cities.'] },
      { id: 10, word: 'departure', phonetic: '/dɪˈpɑːrtʃər/', pos: '(n)', meaningVi: 'sự khởi hành', meaningEn: 'the act of leaving a place', examples: ['The [departure] time is 8 AM.', 'Delays affected all [departure] flights.'] },
    ],
  },
  {
    id: 2,
    name: 'List 2',
    words: [
      { id: 11, word: 'contract', phonetic: '/ˈkɒntrækt/', pos: '(n)', meaningVi: 'hợp đồng', meaningEn: 'a written legal agreement between two people or businesses', examples: ['Please sign the [contract] before Friday.', 'The [contract] expires next month.'] },
      { id: 12, word: 'invoice', phonetic: '/ˈɪnvɔɪs/', pos: '(n)', meaningVi: 'hóa đơn', meaningEn: 'a list of goods sent or services provided, with a statement of the sum due', examples: ['Send the [invoice] to the accounting department.', 'The [invoice] was paid on time.'] },
      { id: 13, word: 'budget', phonetic: '/ˈbʌdʒɪt/', pos: '(n)', meaningVi: 'ngân sách', meaningEn: 'the amount of money available to spend on something', examples: ['We need to stay within [budget].', 'The project [budget] was approved.'] },
      { id: 14, word: 'deadline', phonetic: '/ˈdedlaɪn/', pos: '(n)', meaningVi: 'hạn chót', meaningEn: 'a time or day by which something must be done', examples: ['The [deadline] is next Friday.', "Don't miss the [deadline] for submission."] },
      { id: 15, word: 'profit', phonetic: '/ˈprɒfɪt/', pos: '(n)', meaningVi: 'lợi nhuận', meaningEn: 'money that is earned in trade or business after paying costs', examples: ['The company made a huge [profit].', 'Net [profit] increased by 20%.'] },
      { id: 16, word: 'revenue', phonetic: '/ˈrevənjuː/', pos: '(n)', meaningVi: 'doanh thu', meaningEn: 'the money that a government or company receives regularly', examples: ['Annual [revenue] exceeded expectations.', 'The [revenue] report is due tomorrow.'] },
      { id: 17, word: 'warehouse', phonetic: '/ˈweəhaʊs/', pos: '(n)', meaningVi: 'nhà kho', meaningEn: 'a large building for storing goods', examples: ['Goods are stored in the [warehouse].', 'The new [warehouse] is fully automated.'] },
      { id: 18, word: 'inventory', phonetic: '/ˈɪnvəntɔːri/', pos: '(n)', meaningVi: 'hàng tồn kho', meaningEn: 'a complete list of items such as goods in stock', examples: ['Check the [inventory] levels weekly.', 'The [inventory] system needs updating.'] },
      { id: 19, word: 'negotiate', phonetic: '/nɪˈɡoʊʃieɪt/', pos: '(v)', meaningVi: 'đàm phán', meaningEn: 'to discuss something in order to reach an agreement', examples: ['We need to [negotiate] a better price.', 'They [negotiate]d the terms of the deal.'] },
      { id: 20, word: 'merchandise', phonetic: '/ˈmɜːrtʃəndaɪz/', pos: '(n)', meaningVi: 'hàng hóa', meaningEn: 'goods that are bought and sold', examples: ['The store displays [merchandise] attractively.', 'New [merchandise] arrives every week.'] },
    ],
  },
  {
    id: 3,
    name: 'List 3',
    words: [
      { id: 21, word: 'colleague', phonetic: '/ˈkɒliːɡ/', pos: '(n)', meaningVi: 'đồng nghiệp', meaningEn: 'a person that you work with', examples: ['My [colleague] helped with the report.', 'She invited her [colleague]s to the party.'] },
      { id: 22, word: 'supervisor', phonetic: '/ˈsuːpərvaɪzər/', pos: '(n)', meaningVi: 'người giám sát', meaningEn: 'a person who manages and directs workers', examples: ['Report to your [supervisor] immediately.', 'The [supervisor] approved the leave request.'] },
      { id: 23, word: 'department', phonetic: '/dɪˈpɑːrtmənt/', pos: '(n)', meaningVi: 'phòng ban', meaningEn: 'a division of a large organization', examples: ['She works in the marketing [department].', 'Each [department] has its own budget.'] },
      { id: 24, word: 'conference', phonetic: '/ˈkɒnfərəns/', pos: '(n)', meaningVi: 'hội nghị', meaningEn: 'a large official meeting usually lasting several days', examples: ['The annual [conference] is in June.', 'She presented at the [conference].'] },
      { id: 25, word: 'schedule', phonetic: '/ˈʃedjuːl/', pos: '(n)', meaningVi: 'lịch trình, kế hoạch', meaningEn: 'a plan that lists all the work to be done and when', examples: ['Check the meeting [schedule].', 'The project is behind [schedule].'] },
      { id: 26, word: 'agenda', phonetic: '/əˈdʒendə/', pos: '(n)', meaningVi: 'chương trình nghị sự', meaningEn: 'a list of items to be discussed at a meeting', examples: ['The first item on the [agenda] is budget.', 'Please review the meeting [agenda].'] },
      { id: 27, word: 'appointment', phonetic: '/əˈpɔɪntmənt/', pos: '(n)', meaningVi: 'cuộc hẹn', meaningEn: 'a formal arrangement to meet someone at a particular time', examples: ['I have an [appointment] at 3 PM.', 'Please schedule an [appointment].'] },
      { id: 28, word: 'promotion', phonetic: '/prəˈmoʊʃn/', pos: '(n)', meaningVi: 'sự thăng chức', meaningEn: 'a move to a higher position or rank', examples: ['She received a [promotion] last month.', 'Hard work leads to [promotion].'] },
      { id: 29, word: 'resign', phonetic: '/rɪˈzaɪn/', pos: '(v)', meaningVi: 'từ chức', meaningEn: 'to give up a job or position by telling your employer', examples: ['He decided to [resign] from the company.', 'She [resign]ed due to health issues.'] },
      { id: 30, word: 'candidate', phonetic: '/ˈkændɪdət/', pos: '(n)', meaningVi: 'ứng cử viên', meaningEn: 'a person who applies for a job or is nominated for election', examples: ['The [candidate] had impressive qualifications.', 'We interviewed five [candidate]s.'] },
    ],
  },
  {
    id: 4,
    name: 'List 4',
    words: [
      { id: 31, word: 'purchase', phonetic: '/ˈpɜːrtʃəs/', pos: '(v)', meaningVi: 'mua', meaningEn: 'to buy something', examples: ['You can [purchase] tickets online.', 'She [purchase]d a new laptop.'] },
      { id: 32, word: 'receipt', phonetic: '/rɪˈsiːt/', pos: '(n)', meaningVi: 'biên lai', meaningEn: 'a written statement that you have paid for something', examples: ['Keep the [receipt] for your records.', 'The [receipt] shows the total amount.'] },
      { id: 33, word: 'discount', phonetic: '/ˈdɪskaʊnt/', pos: '(n)', meaningVi: 'giảm giá', meaningEn: 'a reduction in the usual price', examples: ['We offer a 20% [discount] for members.', 'The [discount] applies to all items.'] },
      { id: 34, word: 'refund', phonetic: '/ˈriːfʌnd/', pos: '(n)', meaningVi: 'hoàn tiền', meaningEn: 'money that is paid back to you', examples: ['You can request a full [refund].', 'The [refund] was processed within 5 days.'] },
      { id: 35, word: 'exchange', phonetic: '/ɪksˈtʃeɪndʒ/', pos: '(v)', meaningVi: 'trao đổi', meaningEn: 'to give something and receive something of the same kind in return', examples: ['Can I [exchange] this for a larger size?', 'They [exchange]d business cards.'] },
      { id: 36, word: 'warranty', phonetic: '/ˈwɒrənti/', pos: '(n)', meaningVi: 'bảo hành', meaningEn: 'a written promise to repair or replace a product if necessary', examples: ['The [warranty] covers two years.', 'Is this product still under [warranty]?'] },
      { id: 37, word: 'coupon', phonetic: '/ˈkuːpɒn/', pos: '(n)', meaningVi: 'phiếu giảm giá', meaningEn: 'a small piece of paper that gives you a discount', examples: ['Use this [coupon] for 10% off.', 'The [coupon] expires next week.'] },
      { id: 38, word: 'cashier', phonetic: '/kæˈʃɪər/', pos: '(n)', meaningVi: 'thu ngân', meaningEn: 'a person whose job is to receive and pay out money', examples: ['Pay at the [cashier] counter.', 'The [cashier] scanned each item.'] },
      { id: 39, word: 'aisle', phonetic: '/aɪl/', pos: '(n)', meaningVi: 'lối đi', meaningEn: 'a passage between rows of seats or shelves', examples: ['The cereal is in [aisle] three.', 'Please keep the [aisle] clear.'] },
      { id: 40, word: 'checkout', phonetic: '/ˈtʃekaʊt/', pos: '(n)', meaningVi: 'quầy thanh toán', meaningEn: 'the place where you pay for things in a store', examples: ['There was a long line at the [checkout].', 'Self-service [checkout] is available.'] },
    ],
  },
  {
    id: 5,
    name: 'List 5',
    words: [
      { id: 41, word: 'reservation', phonetic: '/ˌrezərˈveɪʃn/', pos: '(n)', meaningVi: 'sự đặt trước', meaningEn: 'an arrangement to have something kept for you', examples: ['I made a [reservation] for two.', 'Do you have a [reservation]?'] },
      { id: 42, word: 'appetizer', phonetic: '/ˈæpɪtaɪzər/', pos: '(n)', meaningVi: 'món khai vị', meaningEn: 'a small dish served before the main course', examples: ['We ordered shrimp as an [appetizer].', 'The [appetizer] was delicious.'] },
      { id: 43, word: 'beverage', phonetic: '/ˈbevərɪdʒ/', pos: '(n)', meaningVi: 'đồ uống', meaningEn: 'any type of drink except water', examples: ['What [beverage] would you like?', 'Hot [beverage]s are served all day.'] },
      { id: 44, word: 'entrée', phonetic: '/ˈɒntreɪ/', pos: '(n)', meaningVi: 'món chính', meaningEn: 'the main dish of a meal', examples: ['The [entrée] comes with a side salad.', 'Choose your [entrée] from the menu.'] },
      { id: 45, word: 'dessert', phonetic: '/dɪˈzɜːrt/', pos: '(n)', meaningVi: 'món tráng miệng', meaningEn: 'sweet food served after the main course', examples: ['Would you like [dessert]?', 'The chocolate cake is our best [dessert].'] },
      { id: 46, word: 'gratuity', phonetic: '/ɡrəˈtjuːɪti/', pos: '(n)', meaningVi: 'tiền boa', meaningEn: 'money given to someone for their services; a tip', examples: ['A 15% [gratuity] is included.', 'Leave a [gratuity] for good service.'] },
      { id: 47, word: 'cuisine', phonetic: '/kwɪˈziːn/', pos: '(n)', meaningVi: 'ẩm thực', meaningEn: 'a style of cooking', examples: ['Italian [cuisine] is popular worldwide.', 'The restaurant serves Asian [cuisine].'] },
      { id: 48, word: 'banquet', phonetic: '/ˈbæŋkwɪt/', pos: '(n)', meaningVi: 'tiệc lớn', meaningEn: 'a large formal meal for many people', examples: ['The [banquet] was held in the grand hall.', 'They organized a farewell [banquet].'] },
      { id: 49, word: 'catering', phonetic: '/ˈkeɪtərɪŋ/', pos: '(n)', meaningVi: 'dịch vụ ăn uống', meaningEn: 'the business of providing food and drinks for events', examples: ['We hired a [catering] company.', 'The [catering] service was excellent.'] },
      { id: 50, word: 'menu', phonetic: '/ˈmenjuː/', pos: '(n)', meaningVi: 'thực đơn', meaningEn: 'a list of food available in a restaurant', examples: ['May I see the [menu] please?', 'The [menu] changes seasonally.'] },
    ],
  },
];

// Helper: get a list by ID
export const getListById = (id) => FLASHCARD_LISTS.find((l) => l.id === Number(id));

// Helper: generate quiz options (3 wrong + 1 correct)
export const generateQuizOptions = (correctWord, allWords) => {
  const others = allWords.filter((w) => w.id !== correctWord.id);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...shuffled, correctWord].sort(() => Math.random() - 0.5);
  return options.map((w) => ({ id: w.id, label: w.meaningVi, word: w.word, isCorrect: w.id === correctWord.id }));
};

// Helper: generate match pairs (pick 6 words, produce 12 cards)
export const generateMatchCards = (words) => {
  const picked = words.sort(() => Math.random() - 0.5).slice(0, 6);
  const cards = [];
  picked.forEach((w) => {
    cards.push({ pairId: w.id, type: 'word', text: w.word, sub: '' });
    cards.push({ pairId: w.id, type: 'meaning', text: w.meaningVi, sub: w.meaningEn });
  });
  return cards.sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, uid: i }));
};

/**
 * Mock data for eco-news articles
 * This file contains 6 mock news items for testing and development purposes
 */

import { tagsListEcoNewsData } from './NewsConstants';

/**
 * Array of mock eco-news articles
 * @type {import('./EcoNewsModel').EcoNewsModel[]}
 */
export const mockNewsData = [
  {
    id: 1,
    title: "Sustainable Urban Gardening: Growing Food in Small Spaces",
    content: "<p>Urban gardening is becoming increasingly popular as people look for ways to grow their own food in limited spaces. This article explores various techniques for sustainable urban gardening, including container gardening, vertical gardening, and community garden initiatives.</p><p>Container gardening is perfect for balconies and small patios. You can grow a variety of vegetables, herbs, and even small fruit trees in containers. Vertical gardening makes use of wall space and is ideal for growing climbing plants like beans, peas, and certain varieties of squash. Community gardens provide shared spaces where people can grow food together, fostering a sense of community and sharing knowledge.</p><p>By growing your own food, you reduce your carbon footprint, ensure access to fresh produce, and create green spaces in urban environments. Urban gardening also provides mental health benefits, connecting people with nature and providing a rewarding hobby.</p>",
    shortInfo: "Discover innovative techniques for growing your own food in urban environments with limited space.",
    tags: ["Education", "Initiatives"],
    tagsEn: ["Education", "Initiatives"],
    tagsUa: ["Освіта", "Ініціативи"],
    author: {
      id: 101,
      name: "Maria Green"
    },
    creationDate: "2023-06-15T10:30:00Z",
    imagePath: "assets/img/news/urban-gardening.jpg",
    source: "Green City Blog",
    likes: 128,
    countComments: 24,
    favorite: false
  },
  {
    id: 2,
    title: "Upcoming Beach Cleanup Event: Join Us to Protect Marine Life",
    content: "<p>We're organizing a beach cleanup event this weekend to help protect our local marine ecosystem. Plastic pollution is one of the biggest threats to ocean health, with millions of tons of plastic entering our oceans every year.</p><p>During our previous cleanup events, we've collected thousands of pounds of trash, preventing it from harming marine animals and degrading water quality. This event will focus on the north shore beaches, which have been particularly affected by recent storms.</p><p>All volunteers will receive cleanup supplies, refreshments, and a free t-shirt. This is a family-friendly event, and children are welcome when accompanied by an adult. Educational stations will be set up along the beach to learn about marine conservation and the impact of pollution on ocean ecosystems.</p><p>Join us in making a difference for our oceans and community!</p>",
    shortInfo: "Join our community beach cleanup event this weekend to help protect marine life from plastic pollution.",
    tags: ["Events", "Initiatives"],
    tagsEn: ["Events", "Initiatives"],
    tagsUa: ["Події", "Ініціативи"],
    author: {
      id: 102,
      name: "Ocean Defenders"
    },
    creationDate: "2023-07-02T14:45:00Z",
    imagePath: "assets/img/news/beach-cleanup.jpg",
    source: "Ocean Defenders Alliance",
    likes: 215,
    countComments: 42,
    favorite: false
  },
  {
    id: 3,
    title: "New Study Shows Dramatic Reduction in Carbon Emissions from Remote Work",
    content: "<p>A groundbreaking study published in the Environmental Science Journal has found that the shift to remote work during the pandemic led to a significant reduction in carbon emissions. The research analyzed data from 15 major cities worldwide and found an average reduction of 34% in transportation-related emissions during periods of widespread remote work.</p><p>The study suggests that maintaining even partial remote work policies could have substantial environmental benefits. Companies that allowed employees to work from home just three days per week saw a 20% reduction in their carbon footprint compared to pre-pandemic levels.</p><p>\"This research demonstrates that flexible work arrangements aren't just good for employee satisfaction—they're also a powerful tool for addressing climate change,\" said Dr. Eliza Chen, the study's lead author.</p><p>The findings have implications for urban planning, corporate sustainability strategies, and climate policy. Many companies are now incorporating remote work options into their environmental sustainability plans.</p>",
    shortInfo: "Research shows remote work significantly reduces carbon emissions, offering a sustainable workplace model.",
    tags: ["News", "Education"],
    tagsEn: ["News", "Education"],
    tagsUa: ["Новини", "Освіта"],
    author: {
      id: 103,
      name: "Climate Research Team"
    },
    creationDate: "2023-05-20T09:15:00Z",
    imagePath: "assets/img/news/remote-work.jpg",
    source: "Environmental Science Journal",
    likes: 342,
    countComments: 57,
    favorite: false
  },
  {
    id: 4,
    title: "Eco-Friendly Home Products That Actually Work",
    content: "<p>As consumers become more environmentally conscious, the market for eco-friendly home products has exploded. However, not all \"green\" products deliver on their promises. This article reviews sustainable home products that are both effective and genuinely environmentally friendly.</p><p>We tested dozens of products across categories including cleaning supplies, kitchen items, and personal care. Standouts include bamboo paper towels that can be washed and reused up to 100 times, laundry detergent sheets that eliminate plastic packaging, and beeswax wraps that replace single-use plastic wrap.</p><p>Many of these products not only reduce waste but also save money in the long run. For example, reusable silicone food storage bags cost more upfront but can replace hundreds of disposable plastic bags over their lifetime.</p><p>When shopping for eco-friendly products, look for third-party certifications like EcoLogo, Green Seal, or USDA Organic to ensure environmental claims are legitimate.</p>",
    shortInfo: "Discover eco-friendly home products that effectively replace conventional options while reducing environmental impact.",
    tags: ["News", "Ads"],
    tagsEn: ["News", "Ads"],
    tagsUa: ["Новини", "Реклама"],
    author: {
      id: 104,
      name: "Sustainable Living Guide"
    },
    creationDate: "2023-07-10T16:20:00Z",
    imagePath: "assets/img/news/eco-products.jpg",
    source: "Green Home Magazine",
    likes: 189,
    countComments: 31,
    favorite: false
  },
  {
    id: 5,
    title: "Local School Implements Innovative Recycling Program",
    content: "<p>Oakridge Elementary School has launched an innovative recycling program that's already diverting 90% of the school's waste from landfills. The program, developed in collaboration with environmental educators and waste management experts, integrates recycling into the curriculum and daily school operations.</p><p>Students participate in sorting waste, composting food scraps for the school garden, and tracking the amount of material diverted from landfills. The school has implemented a \"zero-waste lunch\" initiative, encouraging reusable containers and composting food waste.</p><p>\"The students have embraced the program with incredible enthusiasm,\" says Principal Janet Rodriguez. \"They're not only practicing recycling at school but taking these habits home and educating their families.\"</p><p>The program has reduced the school's waste management costs by 40% and produced compost for the school's vegetable garden, which supplies fresh produce for the cafeteria. Several other schools in the district are now planning to implement similar programs based on Oakridge's success.</p>",
    shortInfo: "Local elementary school's innovative recycling program diverts 90% of waste from landfills while educating students.",
    tags: ["News", "Education", "Initiatives"],
    tagsEn: ["News", "Education", "Initiatives"],
    tagsUa: ["Новини", "Освіта", "Ініціативи"],
    author: {
      id: 105,
      name: "Education Today"
    },
    creationDate: "2023-06-28T11:05:00Z",
    imagePath: "assets/img/news/school-recycling.jpg",
    source: "Community News Network",
    likes: 156,
    countComments: 19,
    favorite: false
  },
  {
    id: 6,
    title: "Annual Eco-Innovation Conference Announces Keynote Speakers",
    content: "<p>The organizing committee for the annual Eco-Innovation Conference has announced an impressive lineup of keynote speakers for this year's event. The conference, now in its 10th year, brings together entrepreneurs, researchers, investors, and policymakers focused on environmental innovation.</p><p>This year's keynote speakers include Dr. Maya Patel, whose work on biodegradable plastics has revolutionized packaging; James Wong, founder of SolarFlow, a breakthrough solar energy storage company; and Minister Elena Gonzalez, who has spearheaded one of Europe's most ambitious climate policies.</p><p>The three-day conference will feature panel discussions, workshops, and an innovation showcase where startups can present their solutions to environmental challenges. Special sessions will focus on renewable energy, sustainable agriculture, circular economy business models, and climate finance.</p><p>\"This year's conference comes at a critical time as we face escalating climate challenges,\" said conference chair Dr. Thomas Lee. \"We're bringing together the brightest minds and most innovative solutions to accelerate the transition to a sustainable future.\"</p>",
    shortInfo: "The annual Eco-Innovation Conference announces impressive keynote speakers for this year's event focused on environmental solutions.",
    tags: ["Events", "News"],
    tagsEn: ["Events", "News"],
    tagsUa: ["Події", "Новини"],
    author: {
      id: 106,
      name: "Eco-Innovation Network"
    },
    creationDate: "2023-07-15T13:40:00Z",
    imagePath: "assets/img/news/eco-conference.jpg",
    source: "Eco-Innovation Network",
    likes: 98,
    countComments: 12,
    favorite: false
  }
];

/**
 * Get mock news data
 * @param {number} [count=6] - Number of news items to return
 * @returns {import('./EcoNewsModel').EcoNewsModel[]} Array of mock news items
 */
export const getMockNews = (count = 6) => {
  return mockNewsData.slice(0, count);
};

/**
 * Get a single mock news item by ID
 * @param {number} id - ID of the news item to retrieve
 * @returns {import('./EcoNewsModel').EcoNewsModel|undefined} Mock news item or undefined if not found
 */
export const getMockNewsById = (id) => {
  return mockNewsData.find(news => news.id === id);
};

export default mockNewsData;
const STOP_WORDS = new Set([
  "그리고",
  "그러나",
  "그래서",
  "또한",
  "대한",
  "통해",
  "위해",
  "경우",
  "관련",
  "부분",
  "정도",
  "저는",
  "제가",
  "해당",
  "이러한",
  "이렇게",
  "그렇게",
  "것을",
  "것이",
  "수행",
  "진행",
  "있다",
  "있습니다",
  "없습니다",
]);

const PARTICLES = [
  "으로부터",
  "에게서",
  "에서는",
  "으로는",
  "까지는",
  "부터는",
  "처럼",
  "보다",
  "에게",
  "에서",
  "으로",
  "까지",
  "부터",
  "하고",
  "이며",
  "에는",
  "이나",
  "라도",
  "만큼",
  "의",
  "을",
  "를",
  "이",
  "가",
  "은",
  "는",
  "에",
  "도",
  "와",
  "과",
  "로",
  "만",
];

const VERB_ENDINGS = [
  "하겠습니다",
  "하였습니다",
  "했습니다",
  "되었습니다",
  "합니다",
  "됩니다",
  "하면서",
  "하며",
  "하여",
  "하는",
  "했던",
  "했다",
];

const normalizeKeyword = (rawToken: string) => {
  let token = rawToken.replace(/^[·/+.-]+|[·/+.-]+$/g, "");

  for (const ending of VERB_ENDINGS) {
    if (token.endsWith(ending) && token.length > ending.length + 1) {
      token = token.slice(0, -ending.length);
      break;
    }
  }

  for (const particle of PARTICLES) {
    if (token.endsWith(particle) && token.length > particle.length + 1) {
      token = token.slice(0, -particle.length);
      break;
    }
  }

  return token;
};

export const extractKeywords = (text: string, limit = 6) => {
  if (limit <= 0 || !text.trim()) return [];

  const tokens = text
    .normalize("NFKC")
    .match(/[가-힣A-Za-z0-9]+(?:[·/+.-][가-힣A-Za-z0-9]+)*/g) ?? [];

  const keywordScores = new Map<string, { keyword: string; count: number; firstIndex: number }>();

  tokens.forEach((rawToken, index) => {
    const keyword = normalizeKeyword(rawToken);
    const normalized = keyword.toLocaleLowerCase("ko-KR");
    const isUsefulNumber = /\d/.test(keyword) && keyword.length >= 2;

    if (
      (!isUsefulNumber && keyword.length < 2) ||
      STOP_WORDS.has(keyword) ||
      STOP_WORDS.has(normalized)
    ) {
      return;
    }

    const current = keywordScores.get(normalized);
    if (current) {
      current.count += 1;
      return;
    }

    keywordScores.set(normalized, {
      keyword,
      count: 1,
      firstIndex: index,
    });
  });

  return [...keywordScores.values()]
    .sort((a, b) => b.count - a.count || a.firstIndex - b.firstIndex)
    .slice(0, limit)
    .map(({ keyword }) => keyword);
};

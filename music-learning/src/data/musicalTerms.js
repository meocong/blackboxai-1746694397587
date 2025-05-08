export const musicalTerms = {
  staff: {
    name: "Khuông nhạc",
    description: "Năm dòng kẻ ngang song song với nhau, tạo thành bốn khe để ghi nốt nhạc",
  },
  clefs: {
    treble: {
      name: "Khóa Sol",
      description: "Ký hiệu nhạc xác định vị trí nốt Sol trên khuông nhạc",
    },
    bass: {
      name: "Khóa Fa",
      description: "Ký hiệu nhạc xác định vị trí nốt Fa trên khuông nhạc",
    },
  },
  notes: {
    whole: {
      name: "Nốt tròn",
      description: "Nốt nhạc kéo dài 4 phách",
    },
    half: {
      name: "Nốt trắng",
      description: "Nốt nhạc kéo dài 2 phách",
    },
    quarter: {
      name: "Nốt đen",
      description: "Nốt nhạc kéo dài 1 phách",
    },
    eighth: {
      name: "Nốt móc đơn",
      description: "Nốt nhạc kéo dài 1/2 phách",
    },
    sixteenth: {
      name: "Nốt móc kép",
      description: "Nốt nhạc kéo dài 1/4 phách",
    },
  },
  timeSignatures: {
    common: {
      name: "Nhịp 4/4",
      description: "Chỉ định có 4 phách trong một ô nhịp, mỗi phách là một nốt đen",
    },
    threeQuarter: {
      name: "Nhịp 3/4",
      description: "Chỉ định có 3 phách trong một ô nhịp, mỗi phách là một nốt đen",
    },
  },
  keySignatures: {
    CMajor: {
      name: "Giọng Đô trưởng",
      description: "Không có dấu hóa, tất cả các nốt đều là nốt tự nhiên",
    },
    GMajor: {
      name: "Giọng Sol trưởng",
      description: "Có một dấu thăng ở nốt Fa",
    },
  },
  dynamics: {
    forte: {
      name: "Forte (f)",
      description: "Chơi to",
    },
    piano: {
      name: "Piano (p)",
      description: "Chơi nhẹ",
    },
    crescendo: {
      name: "Crescendo",
      description: "Chơi to dần",
    },
  },
  articulations: {
    staccato: {
      name: "Staccato",
      description: "Chơi ngắt quãng, tách biệt",
    },
    legato: {
      name: "Legato",
      description: "Chơi liền tiếng",
    },
  },
  tempo: {
    allegro: {
      name: "Allegro",
      description: "Nhanh, vui vẻ",
    },
    andante: {
      name: "Andante",
      description: "Vừa phải, như đi bộ",
    },
  },
  rests: {
    wholeRest: {
      name: "Dấu lặng tròn",
      description: "Im lặng 4 phách",
    },
    halfRest: {
      name: "Dấu lặng trắng",
      description: "Im lặng 2 phách",
    },
  },
  chords: {
    major: {
      name: "Hợp âm trưởng",
      description: "Gồm 3 nốt: nốt gốc, quãng 3 trưởng và quãng 5 đúng",
    },
    minor: {
      name: "Hợp âm thứ",
      description: "Gồm 3 nốt: nốt gốc, quãng 3 thứ và quãng 5 đúng",
    },
  },
  repeats: {
    repeatStart: {
      name: "Dấu lặp đầu",
      description: "Đánh dấu điểm bắt đầu của đoạn nhạc cần lặp lại",
    },
    repeatEnd: {
      name: "Dấu lặp cuối",
      description: "Đánh dấu điểm kết thúc của đoạn nhạc cần lặp lại",
    },
  },
  symbols: {
    sharp: {
      name: "Dấu thăng (#)",
      description: "Nâng cao nốt nhạc lên nửa cung",
    },
    flat: {
      name: "Dấu giáng (b)",
      description: "Hạ thấp nốt nhạc xuống nửa cung",
    },
    natural: {
      name: "Dấu bình (♮)",
      description: "Khôi phục nốt nhạc về âm tự nhiên",
    },
  },
};

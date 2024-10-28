
const generateRandomPrice = (min, max, toFix = 0) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(toFix));
}
const menuData = [
  {
    id: 1,
    name: "MAHN COLL OVEN",
    price: generateRandomPrice(500,1000),
    originalPrice: generateRandomPrice(1000,2000),
    rating: generateRandomPrice(3,5,1),
    sgm: "SGM 200",
    images: ["./dish_A.jpeg", "./dish_B.jpeg"],
    description:
      "Doublesworn Grethellow Heo Eenex Deotent, Deotent fexis oeotre setuza ot dein ottent exues hoxtelt jhok emkoer.",
  },
  {
    id: 2,
    name: "MOOUR THIENIS",
    price: generateRandomPrice(500,1000),
    originalPrice: generateRandomPrice(1000,2000),
    rating: generateRandomPrice(3,5,1),
    sgm: "SGI 200",
    images: ["./dish_B.jpeg", "./dish_A.jpeg"],
    description:
      "Deotly seoty Satethellow Htew Eenoos, Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 3,
    name: "MAIN COUTCEOS",
    price: generateRandomPrice(500,1000),
    originalPrice: generateRandomPrice(1000,2000),
    rating: generateRandomPrice(3,5,1),
    sgm: "SGM 200",
    images: ["./ribeye_A.jpeg", "./ribeye_B.jpeg"],
    description:
      "Doublesworn Satethellow Hteo Eenex Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 4,
    name: "PECCMN CHER CHIDRER",
    price: generateRandomPrice(500,1000),
    originalPrice: generateRandomPrice(1000,2000),
    rating: generateRandomPrice(3,5,1),
    sgm: "CGM 200",
    images: ["./pizza_A.jpeg", "./pizza_B.jpeg"],
    description:
      "Deotly seoty Satethellow Htew Eenoos Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 5,
    name: "REMTANIGE OUI DUIEVER",
    price: generateRandomPrice(500,1000),
    originalPrice: generateRandomPrice(1000,2000),
    rating: generateRandomPrice(3,5,1),
    sgm: "SSM 200",
    images: ["./noodle_A.jpeg", "./noodle_B.jpeg"],
    description:
      "Doublesworn Satethellow Htew Eenoos Deotent, deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 6,
    name: "MECRENCINITS CANCTIDUN",
    price: generateRandomPrice(500,1000),
    originalPrice: generateRandomPrice(1000,2000),
    rating: generateRandomPrice(3,5,1),
    sgm: "SGM 200",
    images: ["./lobster_A.jpeg", "./lobster_B.jpeg"],
    description:
      "Doublesworn Satethellow Hteo Eenex Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 7,
    name: "MECRENCINITS CANCTIDUN",
    price: generateRandomPrice(500,1000),
    originalPrice: generateRandomPrice(1000,2000),
    rating: generateRandomPrice(3,5,1),
    sgm: "SGM 200",
    images: ["./dish_M.webp", "./lobster_N.webp"],
    description:
      "Doublesworn Satethellow Hteo Eenex Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
  {
    id: 8,
    name: "MECRENCINITS CANCTIDUN",
    price: generateRandomPrice(500,1000),
    originalPrice: generateRandomPrice(1000,2000),
    rating: generateRandomPrice(3,5,1),
    sgm: "SGM 200",
    images: ["./dish_C.webp", "./dish_A.jpeg", "./dish_B.jpeg"],
    description:
      "Doublesworn Satethellow Hteo Eenex Deotent, Deotent fexis ototu ot deken ot seia ottent avouls hoxtelt.",
  },
];

export default menuData;
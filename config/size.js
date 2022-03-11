//字体大小
const fontSize = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 50, 60
];


function genPerSize()
{
  const perSizes = [];
  for(let i = 1; i <= 24; i++ ) perSizes.push(100/i);
  return perSizes;
}

module.exports = {
  perSize:  genPerSize(),
  fontSize
} 


//hw3.1
function calcFr(celsius) {
  let fr = (celsius * 9 / 5) + 32;
  console.log(`Температура ${celsius}\u00B0C в градусах Фаренгейта: ${fr.toFixed(2)} \u00B0F`);
}

calcFr(5);
calcFr(73.5555);
calcFr('1');
calcFr(6456.87789);


function calcC(fr) {
  let celsius = (fr - 32) * 5 / 9;
  console.log(`Температура ${fr}\u00B0F в градусах Цельсия: ${celsius.toFixed(2)} \u00B0C`);
}
calcC(34);
calcC(43.7);
calcC(84.867);



 let temperature=7; // is global scope
function calcC(fr) {
  let celsius = (fr - 32) * 5 / 9; // is function scope
  console.log(`Температура ${fr}\u00B0F в градусах Цельсия: ${celsius.toFixed(2)} \u00B0C`);
  if (true) {
    let x = 10; // is block scope
    console.log(x); // will work only in block 
  }
}
console.log(temperature); // will work
console.log(celsius); // would not, because it was created in function 


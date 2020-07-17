let und = undefined;
let number = 0;
let array = ["A", 1, true];
let string = "Bob";
let boolean = true;
let boolean2 = false;
let object = {};
let object2 = {
    key: "value",
    key2: 2
}
let und1 = "";
let und2;
und2 = null;

function isUndefined(shit){
  //console.log("typeof: " + typeof shit);
  if(typeof shit == "undefined"){
    console.log("undefined!");
  }
}

if(typeof und2 == "undefined"){
  console.log("undefined!");
}

if(typeof number == "undefined"){
  console.log("undefined!");
}

console.log(isUndefined(number));
console.log(isUndefined(object2));
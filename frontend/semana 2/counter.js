const add = document.getElementById("add");
const sub = document.getElementById("sub");
const count = document.getElementById("count");
const change = (amount) => () =>
  (count.innerText = Math.max(0, Number(count.innerText) + amount));

add.onclick = change(+1);
sub.onclick = change(-1);

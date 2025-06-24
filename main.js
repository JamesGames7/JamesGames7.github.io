function buttonClick(id) {
  var x = parseInt(document.getElementById(id).innerHTML.value);
  x++;
  document.getElementById(id).innerHTML.value = x;
}

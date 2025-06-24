function buttonClick(id) {
  var x = parseInt(document.getElementById(id).value);
  x++;
  document.getElementById(id).value = x;
}

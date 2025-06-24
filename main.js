function buttonClick(id) {
  var x = parseInt(document.getElementById(id).innerHTML);
  x++;
  document.getElementById(id).innerHTML = x;
}
